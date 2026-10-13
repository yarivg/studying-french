/* ============================================================
   roleplay.js — talk to a model that plays a character.

   There is no answer key here, on purpose. A key can only list the
   French its author thought of, and a conversation has no such list.
   The model plays the character, follows wherever you take the talk,
   and marks only French that is actually wrong or unnatural.

   This is the one place the course talks to anyone but GitHub. Your
   messages go straight from this browser to the provider you pick,
   Anthropic or Google (Gemini), with your own API key. Each key is kept
   in this browser under its own storage name, so it is never part of the
   progress snapshot and never reaches the sync gist.
   ============================================================ */

window.Roleplay = (function () {
  'use strict';

  var PROVIDER_STORE = 'lecarnet.talk.provider';
  var GEMINI_MODELS_STORE = 'lecarnet.talk.geminiModels';
  var SESSION_STORE = 'lecarnet.talk.sessions';
  var MAX_SESSIONS = 30;
  var MAX_SENT = 24;                       // messages of history sent per call
  var ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
  var GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/';

  var PROVIDERS = {
    anthropic: {
      label: 'Anthropic (Claude)', host: 'api.anthropic.com', short: 'Anthropic',
      keyStore: 'lecarnet.talk.key', modelStore: 'lecarnet.talk.model',
      keyName: 'Anthropic API key', where: 'console.anthropic.com',
      models: [
        { id: 'claude-haiku-5-5', label: 'Haiku 5.5: fast and cheap' },
        { id: 'claude-sonnet-5-5', label: 'Sonnet 5.5: slower, a closer ear' }
      ]
    },
    gemini: {
      label: 'Google (Gemini)', host: 'generativelanguage.googleapis.com', short: 'Google',
      keyStore: 'lecarnet.talk.key.gemini', modelStore: 'lecarnet.talk.model.gemini',
      keyName: 'Gemini API key', where: 'aistudio.google.com/apikey',
      // Only a starting point. The live list from the key replaces it, so a
      // renamed or retired model never needs a code change.
      models: [
        { id: 'gemini-flash-latest', label: 'gemini-flash-latest: tracks the current Flash' },
        { id: 'gemini-pro-latest', label: 'gemini-pro-latest: slower, a closer ear' }
      ]
    }
  };

  var index = null;
  var live = null;                          // the session on screen

  /* ---------------------------------------------------------- storage */

  function read(k, fallback) {
    try {
      var raw = localStorage.getItem(k);
      return raw === null ? fallback : raw;
    } catch (e) { return fallback; }
  }
  function write(k, v) {
    try { localStorage.setItem(k, v); return true; } catch (e) { return false; }
  }
  function drop(k) { try { localStorage.removeItem(k); } catch (e) { /* private mode */ } }

  function provider() {
    var p = read(PROVIDER_STORE, 'anthropic');
    return PROVIDERS[p] ? p : 'anthropic';
  }
  function P() { return PROVIDERS[provider()]; }

  function apiKey() { return read(P().keyStore, ''); }

  function models() {
    if (provider() === 'gemini') {
      try {
        var cached = JSON.parse(read(GEMINI_MODELS_STORE, 'null'));
        if (Array.isArray(cached) && cached.length) return cached;
      } catch (e) { /* fall through to the starting list */ }
    }
    return P().models;
  }
  function model() {
    var list = models();
    var m = read(P().modelStore, list[0].id);
    return list.some(function (x) { return x.id === m; }) ? m : list[0].id;
  }

  function sessions() {
    try { return JSON.parse(read(SESSION_STORE, '[]')) || []; } catch (e) { return []; }
  }
  function saveSession(s) {
    var all = sessions().filter(function (x) { return x.id !== s.id; });
    all.unshift(s);
    write(SESSION_STORE, JSON.stringify(all.slice(0, MAX_SESSIONS)));
  }
  function findSession(id) {
    return sessions().filter(function (x) { return x.id === id; })[0] || null;
  }
  function removeSession(id) {
    write(SESSION_STORE, JSON.stringify(sessions().filter(function (x) { return x.id !== id; })));
  }

  /* ---------------------------------------------------------- content */

  function load() {
    if (index) return Promise.resolve(index);
    return Data.json('content/roleplay/index.json').then(function (j) { index = j; return j; });
  }
  function scenario(id) {
    return ((index && index.scenarios) || []).filter(function (s) { return s.id === id; })[0] || null;
  }

  /* ---------------------------------------------------------- the prompt */

  var THEMES = 'frame-preposition, calque, negation, agreement, spelling-ending, conjugation, tense, pronoun, word-order, other';

  function systemPrompt(sc) {
    var focus = (index.focus || []).map(function (f) { return '- ' + f; }).join('\n');
    var targets = (sc.targets || []).length ? sc.targets.join('; ') : 'none, follow the learner';
    return [
      'You are running a French role play for a learner. The learner is an adult native English speaker who understands at about B1 but still makes A2 errors when producing French. You play ' + sc.ai + '. The learner plays ' + sc.you + '.',
      'Scene: ' + sc.setting,
      'The learner\'s goal in the scene: ' + sc.goal,
      '',
      'HOW TO PLAY THE CHARACTER',
      '- Reply in natural French, one to three short sentences, at a level the learner can follow. Then react or ask something so the talk keeps moving. Never reply in English inside "reply".',
      '- Be a real person. Have opinions, make small problems, change the subject if it would be natural. Do not interrogate.',
      '- The learner may answer in any way at all: any grammatical French, any register, any vocabulary, a joke, a refusal, a question back, or a complete change of direction. Follow where they go. There is no expected answer and nothing they must say. Never steer them back to a script.',
      '- Nudge, do not quiz. If you can, let the scene create a reason for these structures to come up: ' + targets + '. Never name them or ask for them.',
      '',
      'HOW TO MARK THE LEARNER\'S FRENCH',
      '- Read their last message as a native teacher would. Flag only what is actually wrong or clearly unnatural. If it is correct, even if you would have said it differently, it is correct.',
      '- NEVER flag: missing accents, cedillas, apostrophes or hyphens, capital letters, or punctuation. They type on a keyboard without accents. Spoken-style French, colloquial contractions and informal register are fine. Using on for nous is fine (but on takes the third person singular verb: on sommes is an error). Alternatives that are correct are fine.',
      '- Accept answers that differ from what you expected. If the French is good and means something different from what you were steering toward, just respond to what they said.',
      '- For each real error give: "said" (the exact words they wrote), "fix" (the corrected words), "why" (one plain English sentence naming the rule or frame, in terms they can reuse), "theme" (one of: ' + THEMES + '). At most three errors, most important first. If there are more, pick the ones that will matter most again.',
      '- Add "better" only when their French is correct but there is a clearly more idiomatic way, one short phrase. Otherwise leave it empty. Do not nitpick.',
      '- If they write in English, or ask how to say something, put the French in "help" (with a one-line note on the frame) and still answer in character as best you can. That is not an error.',
      '- Judge only what they wrote, never what the key might say. Be right, not strict.',
      '',
      'THE LEARNER\'S KNOWN WEAK SPOTS. Flag these every time they occur, even in an otherwise good message, and put them first among the errors. Do not mention this list.',
      focus,
      '',
      'OUTPUT FORMAT. Return only one JSON object, no prose around it, no code fence:',
      '{"reply": "your line in French", "ok": true or false, "feedback": [{"said": "", "fix": "", "why": "", "theme": ""}], "better": "", "help": ""}',
      '"ok" is true when their last message had no real errors. On the very first call there is no learner message yet: set ok true and feedback [].'
    ].join('\n');
  }

  function stuckPrompt() {
    return '[The learner is stuck. Do not continue the role play and do not mark anything. Return only this JSON: {"reply": "", "ok": true, "feedback": [], "better": "", "help": "two or three different natural things they could say next, in French, each with a short English gloss in brackets, then one line naming the frame to use"}]';
  }

  function debriefPrompt(sc, transcript, errors) {
    return [
      'You are a French teacher closing a role play session with an adult learner (B1 going on B2). Scene: ' + sc.title + '.',
      'Here is the whole conversation, with the corrections already given:',
      transcript,
      '',
      'Errors flagged: ' + (errors.length ? JSON.stringify(errors) : 'none'),
      '',
      'Return only one JSON object, no code fence:',
      '{"summary": "two or three plain sentences: how it went, what was good", "working_on": ["up to three short items: the patterns that repeated, as rules he can reuse"], "redo": [{"en": "an English sentence", "fr": "the French model answer"}]}',
      'Give three "redo" sentences. Each is an English sentence built from one of his real mistakes or a structure he avoided, so he can translate it again from memory. Direct and brief. No praise padding.'
    ].join('\n');
  }

  /* ---------------------------------------------------------- the call */

  function callApi(system, messages, maxTokens) {
    var key = apiKey();
    if (!key) return Promise.reject(new Error('No API key saved.'));
    return (provider() === 'gemini' ? callGemini : callAnthropic)(key, system, messages, maxTokens);
  }

  function unreachable() {
    return new Error('Could not reach ' + P().host + '. Check the connection. ' +
      'This section does not work from the offline single file.');
  }

  // A request that never answers would leave the page waiting forever, so
  // every call gives up after TIMEOUT_MS and says so.
  var TIMEOUT_MS = 30000;
  function timedFetch(url, opts) {
    if (!window.AbortController) return fetch(url, opts);
    var ctl = new AbortController();
    var timer = setTimeout(function () { ctl.abort(); }, TIMEOUT_MS);
    opts.signal = ctl.signal;
    return fetch(url, opts).then(function (res) { clearTimeout(timer); return res; }, function (err) {
      clearTimeout(timer);
      if (ctl.signal.aborted) {
        var e = new Error('No answer from ' + model() + ' after ' + TIMEOUT_MS / 1000 + ' s. ' +
          'The service may be slow right now: pick another model in the list and test again.');
        e.timedOut = true;
        throw e;
      }
      throw err;
    });
  }

  function callAnthropic(key, system, messages, maxTokens) {
    return timedFetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: model(),
        max_tokens: maxTokens || 700,
        system: system,
        messages: messages
      })
    }).then(function (res) {
      if (res.ok) return res.json();
      return res.json().catch(function () { return {}; }).then(function (b) {
        var detail = (b && b.error && b.error.message) ? ' ' + b.error.message : '';
        if (res.status === 401) throw new Error('The API key was rejected. Check it, or save a new one.');
        if (res.status === 429) throw new Error('Rate limited. Wait a moment and send again.');
        if (res.status === 529 || res.status >= 500) throw new Error('The service is busy. Send again in a moment.');
        throw new Error('The request failed (' + res.status + ').' + detail);
      });
    }, function (err) { throw err.timedOut ? err : unreachable(); }).then(function (j) {
      return (j.content || []).map(function (b) { return b.text || ''; }).join('');
    });
  }

  // Gemini sends the key in a header, never in the URL, so it cannot land in
  // a history entry or a log. Roles are user / model, and the system prompt
  // is its own field. JSON mode keeps the reply parseable.
  //
  // A Flash model thinks before it writes, which costs seconds on a line of
  // role play that needs none. Thinking is switched off for Flash. A model
  // that refuses the setting answers 400, and is asked again without it.
  var noThinking = {};

  function callGemini(key, system, messages, maxTokens) {
    var m = model();
    var quiet = /flash/.test(m) && !noThinking[m];
    return geminiRequest(key, system, messages, maxTokens, quiet).catch(function (err) {
      if (quiet && err.status === 400 && !err.keyBad) {
        noThinking[m] = true;
        return geminiRequest(key, system, messages, maxTokens, false);
      }
      throw err;
    });
  }

  function geminiRequest(key, system, messages, maxTokens, quiet) {
    var cfg = {
      maxOutputTokens: Math.max(maxTokens || 700, 4096),
      responseMimeType: 'application/json',
      temperature: 0.8
    };
    if (quiet) cfg.thinkingConfig = { thinkingBudget: 0 };

    return timedFetch(GEMINI_BASE + 'models/' + encodeURIComponent(model()) + ':generateContent', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: messages.map(function (m) {
          return { role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] };
        }),
        generationConfig: cfg
      })
    }).then(function (res) {
      if (res.ok) return res.json();
      return res.json().catch(function () { return {}; }).then(function (b) {
        var msg = (b && b.error && b.error.message) || '';
        var e;
        if (res.status === 400 && /api key/i.test(msg)) {
          e = new Error('The API key was rejected. Check it, or save a new one.');
          e.keyBad = true;
        } else if (res.status === 401 || res.status === 403) {
          e = new Error('The key was rejected, or it is not allowed to use this model.');
          e.keyBad = true;
        } else if (res.status === 404) {
          e = new Error('Model ' + model() + ' was not found for this key. It may be retired: pick another one in the model list, such as gemini-flash-latest.');
        } else if (res.status === 429) {
          e = new Error('Rate limited. Wait a moment and send again.');
        } else if (res.status >= 500) {
          e = new Error('The service is busy. Send again in a moment.');
        } else {
          e = new Error('The request failed (' + res.status + ').' + (msg ? ' ' + msg : ''));
        }
        e.status = res.status;
        throw e;
      });
    }, function (err) { throw err.timedOut ? err : unreachable(); }).then(function (j) {
      var c = j.candidates && j.candidates[0];
      if (!c || !c.content || !c.content.parts) {
        var why = j.promptFeedback && j.promptFeedback.blockReason;
        throw new Error(why ? 'The model declined that message (' + why + '). Rephrase and send again.'
                            : 'The model returned nothing. Send again.');
      }
      return c.content.parts.map(function (p) { return p.text || ''; }).join('');
    });
  }

  // The first one is the default, so it must be one that works: the moving
  // alias first, then stable Flash newest first, then Pro, then lite, and
  // previews last. An old model can be listed and still 404 for a new key.
  function geminiOrder(a, b) {
    var ra = geminiRank(a.id), rb = geminiRank(b.id);
    if (ra !== rb) return ra - rb;
    return geminiVersion(b.id) - geminiVersion(a.id);
  }
  function geminiRank(id) {
    if (id === 'gemini-flash-latest') return 0;
    if (/preview|exp/.test(id)) return 5;
    if (/lite/.test(id)) return 4;
    if (/latest/.test(id)) return 2;
    if (/flash/.test(id)) return 1;
    if (/pro/.test(id)) return 3;
    return 3;
  }
  function geminiVersion(id) {
    var m = id.match(/(\d+(?:\.\d+)?)/);
    return m ? parseFloat(m[1]) : 0;
  }

  // The models this key can actually call, so nothing here goes stale.
  function loadGeminiModels() {
    var key = read(PROVIDERS.gemini.keyStore, '');
    if (!key) return Promise.resolve(null);
    return fetch(GEMINI_BASE + 'models?pageSize=200', { headers: { 'x-goog-api-key': key } })
      .then(function (res) { return res.ok ? res.json() : null; }, function () { return null; })
      .then(function (j) {
        if (!j || !Array.isArray(j.models)) return null;
        var out = j.models.filter(function (m) {
          return /^models\/gemini/.test(m.name) &&
            (m.supportedGenerationMethods || []).indexOf('generateContent') >= 0 &&
            !/(tts|image|embedding|live|audio|robotics|computer-use|learnlm|nano|banana|transcribe|omni|customtools)/.test(m.name);
        }).map(function (m) {
          var id = m.name.replace(/^models\//, '');
          return { id: id, label: id + (m.displayName ? ': ' + m.displayName : '') };
        }).sort(geminiOrder);
        if (!out.length) return null;
        write(GEMINI_MODELS_STORE, JSON.stringify(out));
        return out;
      });
  }

  // The model is told to return bare JSON. Believe it, but survive a fence
  // or a line of prose, and never lose the French if it slips completely.
  function parseTurn(text) {
    var t = String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    var obj = null;
    try { obj = JSON.parse(t); } catch (e) {
      var a = t.indexOf('{'), b = t.lastIndexOf('}');
      if (a >= 0 && b > a) { try { obj = JSON.parse(t.slice(a, b + 1)); } catch (e2) { obj = null; } }
    }
    if (!obj || typeof obj !== 'object') return { reply: t, ok: true, feedback: [], better: '', help: '' };
    var fb = Array.isArray(obj.feedback) ? obj.feedback : [];
    return {
      reply: String(obj.reply || ''),
      ok: obj.ok !== false && !fb.length,
      feedback: fb.slice(0, 3).map(function (f) {
        return {
          said: String((f && f.said) || ''), fix: String((f && f.fix) || ''),
          why: String((f && f.why) || ''), theme: String((f && f.theme) || 'other')
        };
      }),
      better: String(obj.better || ''),
      help: String(obj.help || '')
    };
  }

  function wire(session) {
    // Anthropic wants the first message from the user. The opener is the
    // character speaking first, so a stage direction stands in for it.
    var out = [{ role: 'user', content: '[Begin the role play. Say your first line.]' }];
    session.turns.forEach(function (t) {
      if (t.role === 'ai') {
        out.push({ role: 'assistant', content: JSON.stringify(
          { reply: t.text, ok: true, feedback: [], better: '', help: '' }) });
      } else {
        out.push({ role: 'user', content: t.text });
      }
    });
    return out.length > MAX_SENT ? out.slice(out.length - MAX_SENT) : out;
  }

  /* ---------------------------------------------------------- helpers */

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function attr(s) { return escapeHtml(s).replace(/"/g, '&quot;'); }

  function emo(sc) { return sc && sc.emoji ? sc.emoji + ' ' : ''; }

  function uid() { return 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  function when(ts) {
    var d = new Date(ts);
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  function errorsOf(session) {
    var out = [];
    session.turns.forEach(function (t) {
      (t.fb && t.fb.feedback || []).forEach(function (f) { out.push(f); });
    });
    return out;
  }

  function transcriptOf(session) {
    return session.turns.map(function (t) {
      return (t.role === 'ai' ? 'Character: ' : 'Learner: ') + t.text;
    }).join('\n');
  }

  /* ---------------------------------------------------------- list page */

  function renderList(view) {
    var embedded = Data.isEmbedded();
    view.innerHTML = '<div class="loading">Loading…</div>';
    return load().then(function () {
      var html = '<h1>Talk</h1>' +
        '<p class="lead">A role play in French with a model that plays the character. ' +
        'There is no answer to match: say what you would really say, and it follows you. ' +
        'It marks only French that is actually wrong, and never your accents.</p>';

      if (embedded) {
        html += '<div class="callout callout-warn"><p>This section needs the hosted site and a connection. ' +
          'It does not work from the offline single file.</p></div>';
      }

      html += keyCard();

      html += '<h2>Scenes</h2><div class="cards">';
      index.scenarios.forEach(function (sc) {
        html += '<button class="card talk-card" type="button" data-start="' + attr(sc.id) + '">' +
          '<span class="pill pill-' + sc.level.toLowerCase() + '">' + escapeHtml(sc.level) + '</span>' +
          '<h3>' + emo(sc) + escapeHtml(sc.title) + '</h3><p>' + escapeHtml(sc.blurb) + '</p></button>';
      });
      html += '</div>';

      var past = sessions();
      if (past.length) {
        html += '<h2>Earlier talks</h2><ul class="talk-past">';
        past.forEach(function (s) {
          var errs = errorsOf(s).length;
          html += '<li><a href="#/talk/s/' + attr(s.id) + '">' + emo(scenario(s.scenario)) + escapeHtml(s.title) + '</a>' +
            '<span class="talk-past-meta">' + escapeHtml(when(s.started)) + ' · ' +
            s.turns.filter(function (t) { return t.role === 'you'; }).length + ' lines · ' +
            errs + ' correction' + (errs === 1 ? '' : 's') + (s.debrief ? ' · reviewed' : '') + '</span>' +
            '<button class="btn btn-sm" type="button" data-del="' + attr(s.id) + '">Delete</button></li>';
        });
        html += '</ul>';
      }

      html += '<p class="talk-note">Your lines go from this browser to ' + escapeHtml(P().short) +
        ', using your key, and nowhere else. The key stays in this browser and is never synced.</p>';

      // A fresh root each time, so a re-render never leaves a second
      // listener behind to start two talks from one click.
      view.innerHTML = '<div class="talk-list">' + html + '</div>';
      bindList(view.querySelector('.talk-list'), view);
      refreshModels(view);
    }).catch(function (err) {
      view.innerHTML = '<div class="empty"><div class="empty-icon">⚠️</div><p>' +
        escapeHtml(err.message) + '</p></div>';
    });
  }

  function modelOptions() {
    return models().map(function (m) {
      return '<option value="' + attr(m.id) + '"' + (m.id === model() ? ' selected' : '') + '>' +
        escapeHtml(m.label) + '</option>';
    }).join('');
  }

  function keyCard() {
    var pv = provider();
    var provSel = '<label>Provider <select id="talkProvider">' +
      Object.keys(PROVIDERS).map(function (k) {
        return '<option value="' + k + '"' + (k === pv ? ' selected' : '') + '>' +
          escapeHtml(PROVIDERS[k].label) + '</option>';
      }).join('') + '</select></label>';

    if (apiKey()) {
      return '<div class="talk-key">' + provSel +
        '<span>' + escapeHtml(P().keyName) + ' saved in this browser.</span>' +
        '<label>Model <select id="talkModel">' + modelOptions() + '</select></label>' +
        '<button class="btn btn-sm" type="button" id="talkTest">Test the key</button>' +
        '<button class="btn btn-sm" type="button" id="talkForget">Forget the key</button>' +
        '<span class="talk-test-out" id="talkTestOut" role="status"></span></div>';
    }
    return '<div class="talk-key talk-key-empty">' + provSel +
      '<p><strong>One-time setup.</strong> Paste a ' + escapeHtml(P().keyName) + ' (from ' +
      escapeHtml(P().where) + '). It is stored only in this browser, sent only to ' +
      escapeHtml(P().host) + ', and never synced.</p>' +
      '<form id="talkKeyForm" autocomplete="off">' +
      '<input type="password" id="talkKey" placeholder="API key" autocomplete="off" spellcheck="false" ' +
      'aria-label="' + attr(P().keyName) + '">' +
      '<button class="btn btn-primary" type="submit">Save</button></form></div>';
  }

  // Gemini's model names change; ask the key what it can call and swap the
  // list in without redrawing the page under the reader.
  function refreshModels(view) {
    if (provider() !== 'gemini' || !apiKey()) return;
    loadGeminiModels().then(function (list) {
      var sel = view.querySelector('#talkModel');
      if (!list || !sel) return;
      sel.innerHTML = modelOptions();
    });
  }

  function bindList(root, view) {
    root.addEventListener('click', function (e) {
      var go = e.target.closest('[data-start]');
      if (go) {
        if (!apiKey()) {
          var k = root.querySelector('#talkKey');
          if (k) { k.focus(); k.classList.add('is-needed'); }
          return;
        }
        var sc = scenario(go.dataset.start);
        var s = {
          id: uid(), scenario: sc.id, title: sc.title, started: Date.now(),
          provider: provider(), model: model(),
          turns: [{ role: 'ai', text: sc.opener }], debrief: null
        };
        saveSession(s);
        location.hash = '#/talk/s/' + s.id;
        return;
      }
      var del = e.target.closest('[data-del]');
      if (del) {
        if (window.confirm('Delete this talk?')) {
          removeSession(del.dataset.del);
          renderList(view);
        }
        return;
      }
      if (e.target.id === 'talkForget') {
        drop(P().keyStore);
        renderList(view);
      }
    });
    var form = root.querySelector('#talkKeyForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var inp = root.querySelector('#talkKey');
        var v = (inp.value || '').trim();
        if (!v) return;
        write(P().keyStore, v);
        inp.value = '';
        renderList(view);
      });
    }
    var prov = root.querySelector('#talkProvider');
    if (prov) prov.addEventListener('change', function () {
      write(PROVIDER_STORE, prov.value);
      renderList(view);
    });
    var sel = root.querySelector('#talkModel');
    if (sel) sel.addEventListener('change', function () {
      write(P().modelStore, sel.value);
      var out = root.querySelector('#talkTestOut');
      if (out) { out.textContent = ''; out.className = 'talk-test-out'; }
    });
    var test = root.querySelector('#talkTest');
    if (test) test.addEventListener('click', function () {
      var out = root.querySelector('#talkTestOut');
      var started = Date.now();
      var name = model();
      test.disabled = true;
      out.className = 'talk-test-out';
      out.textContent = 'Testing ' + name + '…';
      callApi('Reply with exactly this JSON and nothing else: {"reply": "ok"}',
              [{ role: 'user', content: 'ping' }], 50)
        .then(function (raw) {
          if (!String(raw).trim()) throw new Error('The model answered with nothing.');
          out.className = 'talk-test-out is-ok';
          out.textContent = '✓ Works. ' + name + ' answered in ' + (Date.now() - started) + ' ms.';
        })
        .catch(function (err) {
          out.className = 'talk-test-out is-bad';
          out.textContent = '✗ ' + err.message;
        })
        .then(function () { test.disabled = false; });
    });
  }

  /* ---------------------------------------------------------- session page */

  var ACCENTS = ['é', 'è', 'ê', 'à', 'â', 'ù', 'û', 'î', 'ô', 'ç', 'œ'];
  var CYCLE = {
    a: 'àâ', e: 'éèêë', i: 'îï', o: 'ôö', u: 'ùûü', c: 'ç',
    'à': 'â', 'â': 'a', 'é': 'è', 'è': 'ê', 'ê': 'ë', 'ë': 'e',
    'î': 'ï', 'ï': 'i', 'ô': 'ö', 'ö': 'o', 'ù': 'û', 'û': 'ü', 'ü': 'u', 'ç': 'c'
  };

  function renderSession(view, id) {
    view.innerHTML = '<div class="loading">Loading…</div>';
    return load().then(function () {
      var s = findSession(id);
      if (!s) {
        view.innerHTML = '<div class="empty"><div class="empty-icon">🤷</div>' +
          '<p>No talk with that id. It may have been deleted.</p>' +
          '<p><a href="#/talk">All scenes</a></p></div>';
        return;
      }
      var sc = scenario(s.scenario);
      if (!sc) {
        view.innerHTML = '<div class="empty"><p>That scene no longer exists.</p>' +
          '<p><a href="#/talk">All scenes</a></p></div>';
        return;
      }
      live = s;
      draw(view, s, sc);
    });
  }

  function draw(view, s, sc) {
    var chips = (sc.targets || []).map(function (t) {
      return '<span class="talk-chip">' + escapeHtml(t) + '</span>';
    }).join('');

    view.innerHTML =
      '<p class="talk-back"><a href="#/talk">← All scenes</a></p>' +
      '<h1>' + emo(sc) + escapeHtml(sc.title) + '</h1>' +
      '<div class="talk-scene"><p>' + escapeHtml(sc.setting) + '</p>' +
      '<p><strong>Goal.</strong> ' + escapeHtml(sc.goal) + '</p>' +
      (chips ? '<details class="talk-targets"><summary>Frames this scene may bring up</summary>' + chips + '</details>' : '') +
      '</div>' +
      '<div class="talk-log" id="talkLog" aria-live="polite"></div>' +
      '<div class="talk-error" id="talkError" hidden></div>' +
      '<div class="talk-compose" id="talkCompose">' +
      accentBar() +
      '<textarea id="talkIn" rows="2" spellcheck="false" autocomplete="off" ' +
      'placeholder="Your answer, in French. Say anything you would really say."></textarea>' +
      '<div class="talk-actions">' +
      '<button class="btn btn-primary" type="button" id="talkSend">Send</button>' +
      (Speech.supported() ? '<button class="btn" type="button" id="talkMic">🎤 Speak</button>' : '') +
      '<button class="btn" type="button" id="talkStuck">I am stuck</button>' +
      '<button class="btn" type="button" id="talkEnd">End and review</button>' +
      '</div></div>' +
      '<div id="talkReview"></div>';

    var log = view.querySelector('#talkLog');
    s.turns.forEach(function (t) { log.appendChild(bubble(t)); });
    if (s.debrief) showReview(view, s, sc);
    log.scrollIntoView({ block: 'end' });

    bindSession(view, s, sc);
  }

  function bubble(t) {
    var el = document.createElement('div');
    el.className = 'talk-msg talk-' + t.role;
    var html = '<div class="talk-bubble">' + escapeHtml(t.text) + '</div>';
    if (t.role === 'ai') {
      html += '<button class="talk-play" type="button" aria-label="Hear this line" data-say="' + attr(t.text) + '">▶</button>';
    }
    if (t.fb) html += feedbackHtml(t.fb);
    el.innerHTML = html;
    return el;
  }

  function feedbackHtml(fb) {
    var h = '<div class="talk-fb">';
    if (fb.ok && !(fb.feedback || []).length) {
      h += '<span class="talk-ok">✓ Natural</span>';
    } else {
      (fb.feedback || []).forEach(function (f) {
        h += '<div class="talk-fix">' +
          '<span class="talk-theme">' + escapeHtml(f.theme) + '</span> ' +
          '<s>' + escapeHtml(f.said) + '</s> → <strong>' + escapeHtml(f.fix) + '</strong>' +
          '<span class="talk-why">' + escapeHtml(f.why) + '</span></div>';
      });
    }
    if (fb.better) h += '<div class="talk-better">More natural: <em>' + escapeHtml(fb.better) + '</em></div>';
    if (fb.help) h += '<div class="talk-help">' + escapeHtml(fb.help) + '</div>';
    return h + '</div>';
  }

  function accentBar() {
    return '<div class="accent-bar" role="group" aria-label="Insert an accented letter">' +
      ACCENTS.map(function (c) {
        return '<button class="accent-key" type="button" tabindex="-1" data-ch="' + c + '">' + c + '</button>';
      }).join('') + '</div>';
  }

  function bindSession(view, s, sc) {
    var input = view.querySelector('#talkIn');
    var log = view.querySelector('#talkLog');
    var errBox = view.querySelector('#talkError');
    var busy = false;

    function setBusy(on) {
      busy = on;
      ['#talkSend', '#talkStuck', '#talkEnd', '#talkMic'].forEach(function (q) {
        var b = view.querySelector(q);
        if (b) b.disabled = on;
      });
      input.disabled = on;
      var t = log.querySelector('.talk-typing');
      if (on && !t) {
        var d = document.createElement('div');
        d.className = 'talk-msg talk-ai talk-typing';
        d.innerHTML = '<div class="talk-bubble">…</div>';
        log.appendChild(d);
        d.scrollIntoView({ block: 'end' });
      }
      if (!on && t) t.remove();
    }

    function fail(err) {
      errBox.hidden = false;
      errBox.textContent = err.message;
    }

    function send() {
      var text = input.value.trim();
      if (!text || busy) return;
      errBox.hidden = true;
      var mine = { role: 'you', text: text, fb: null };
      s.turns.push(mine);
      var node = bubble(mine);
      log.appendChild(node);
      input.value = '';
      setBusy(true);
      callApi(systemPrompt(sc), wire(s), 700).then(function (raw) {
        var r = parseTurn(raw);
        mine.fb = { ok: r.ok, feedback: r.feedback, better: r.better, help: r.help };
        var fresh = bubble(mine);
        log.replaceChild(fresh, node);
        var ai = { role: 'ai', text: r.reply || '…', fb: null };
        s.turns.push(ai);
        setBusy(false);
        log.appendChild(bubble(ai));
        saveSession(s);
        input.focus();
        log.lastChild.scrollIntoView({ block: 'end' });
      }).catch(function (err) {
        // The line was never answered, so take it back and give it to you.
        s.turns.pop();
        node.remove();
        input.value = text;
        setBusy(false);
        fail(err);
      });
    }

    view.querySelector('#talkSend').addEventListener('click', send);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(); return; }
      if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
      var at = input.selectionStart;
      if (at === null || at !== input.selectionEnd || at === 0) return;
      var prev = input.value.charAt(at - 1);
      var next = CYCLE[prev];
      var base = prev.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
      if (!next || e.key.toLowerCase() !== base) return;
      e.preventDefault();
      input.setRangeText(next.charAt(0), at - 1, at, 'end');
    });

    view.querySelector('.accent-bar').addEventListener('mousedown', function (e) {
      var b = e.target.closest('[data-ch]');
      if (!b) return;
      e.preventDefault();
      input.setRangeText(b.dataset.ch, input.selectionStart, input.selectionEnd, 'end');
      input.focus();
    });

    var mic = view.querySelector('#talkMic');
    if (mic) {
      mic.addEventListener('click', function () {
        errBox.hidden = true;
        mic.textContent = '🎤 Listening…';
        Speech.listen({ timeout: 12000 }).then(function (alts) {
          var said = alts[0] || '';
          input.value = (input.value ? input.value + ' ' : '') + said;
          input.focus();
        }).catch(fail).then(function () { mic.textContent = '🎤 Speak'; });
      });
    }

    view.querySelector('#talkStuck').addEventListener('click', function () {
      if (busy) return;
      errBox.hidden = true;
      setBusy(true);
      var msgs = wire(s).concat([{ role: 'user', content: stuckPrompt() }]);
      callApi(systemPrompt(sc), msgs, 500).then(function (raw) {
        var r = parseTurn(raw);
        setBusy(false);
        var d = document.createElement('div');
        d.className = 'talk-msg talk-hint';
        d.innerHTML = '<div class="talk-help">' + escapeHtml(r.help || r.reply || 'No suggestion this time.') + '</div>';
        log.appendChild(d);
        d.scrollIntoView({ block: 'end' });
      }).catch(function (err) { setBusy(false); fail(err); });
    });

    view.querySelector('#talkEnd').addEventListener('click', function () {
      if (busy) return;
      var said = s.turns.filter(function (t) { return t.role === 'you'; }).length;
      if (!said) { fail(new Error('Say something first, then end it.')); return; }
      errBox.hidden = true;
      setBusy(true);
      callApi(debriefPrompt(sc, transcriptOf(s), errorsOf(s)), [{ role: 'user', content: 'Close the session.' }], 900)
        .then(function (raw) {
          var t = String(raw).trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
          var obj = null;
          try { obj = JSON.parse(t); } catch (e) {
            var a = t.indexOf('{'), b = t.lastIndexOf('}');
            if (a >= 0 && b > a) { try { obj = JSON.parse(t.slice(a, b + 1)); } catch (e2) { obj = null; } }
          }
          s.debrief = {
            summary: String((obj && obj.summary) || ''),
            working_on: Array.isArray(obj && obj.working_on) ? obj.working_on.map(String) : [],
            redo: Array.isArray(obj && obj.redo) ? obj.redo.map(function (r) {
              return { en: String(r.en || ''), fr: String(r.fr || '') };
            }) : []
          };
          saveSession(s);
          setBusy(false);
          showReview(view, s, sc);
        }).catch(function (err) { setBusy(false); fail(err); });
    });

    log.addEventListener('click', function (e) {
      var p = e.target.closest('[data-say]');
      if (p && window.Say && Say.supported()) Say.speak(p.dataset.say, { el: p });
    });
  }

  /* ---------------------------------------------------------- review */

  function showReview(view, s, sc) {
    var box = view.querySelector('#talkReview');
    var errs = errorsOf(s);
    var d = s.debrief;

    var byTheme = {};
    errs.forEach(function (f) { byTheme[f.theme] = (byTheme[f.theme] || 0) + 1; });
    var themes = Object.keys(byTheme).sort(function (a, b) { return byTheme[b] - byTheme[a]; });

    var h = '<h2>Review</h2>';
    if (d.summary) h += '<p>' + escapeHtml(d.summary) + '</p>';
    if (themes.length) {
      h += '<p class="talk-themes">' + themes.map(function (t) {
        return '<span class="talk-theme">' + escapeHtml(t) + ' ×' + byTheme[t] + '</span>';
      }).join(' ') + '</p>';
    }
    if (d.working_on && d.working_on.length) {
      h += '<h3>Work on</h3><ul>' + d.working_on.map(function (w) { return '<li>' + escapeHtml(w) + '</li>'; }).join('') + '</ul>';
    }
    if (errs.length) {
      h += '<h3>Every correction</h3><ul class="talk-errors">' + errs.map(function (f) {
        return '<li><s>' + escapeHtml(f.said) + '</s> → <strong>' + escapeHtml(f.fix) + '</strong>' +
          '<span class="talk-why">' + escapeHtml(f.why) + '</span></li>';
      }).join('') + '</ul>';
    }
    if (d.redo && d.redo.length) {
      h += '<h3>Say these again from English</h3><ol class="talk-redo">' + d.redo.map(function (r) {
        return '<li>' + escapeHtml(r.en) + '<details><summary>Show</summary>' + escapeHtml(r.fr) + '</details></li>';
      }).join('') + '</ol>';
    }
    h += '<p><button class="btn" type="button" id="talkCopy">Copy report</button> ' +
      '<a class="btn" href="#/talk">New talk</a></p>' +
      '<p class="talk-note">Paste the copied report into the chat and it goes into the study log.</p>';
    box.innerHTML = h;

    box.querySelector('#talkCopy').addEventListener('click', function (e) {
      var text = reportText(s, sc, errs, d);
      var b = e.target;
      var done = function () { b.textContent = 'Copied'; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { window.prompt('Copy this:', text); });
      } else {
        window.prompt('Copy this:', text);
      }
    });
    box.scrollIntoView({ block: 'start' });
  }

  function reportText(s, sc, errs, d) {
    var lines = ['# Role play: ' + sc.title, '',
      when(s.started) + ', ' + s.turns.filter(function (t) { return t.role === 'you'; }).length +
      ' lines, ' + errs.length + ' corrections, ' + (s.provider ? s.provider + ' ' : '') + s.model, ''];
    if (d.summary) lines.push(d.summary, '');
    if (d.working_on.length) {
      lines.push('## Work on', '');
      d.working_on.forEach(function (w) { lines.push('- ' + w); });
      lines.push('');
    }
    if (errs.length) {
      lines.push('## Corrections', '', '| wrote | should be | theme | why |', '|---|---|---|---|');
      errs.forEach(function (f) {
        lines.push('| ' + f.said + ' | ' + f.fix + ' | ' + f.theme + ' | ' + f.why + ' |');
      });
      lines.push('');
    }
    if (d.redo.length) {
      lines.push('## Redo from English', '');
      d.redo.forEach(function (r) { lines.push('- ' + r.en + ' / ' + r.fr); });
      lines.push('');
    }
    lines.push('## Transcript', '');
    s.turns.forEach(function (t) { lines.push((t.role === 'ai' ? '- Character: ' : '- Me: ') + t.text); });
    return lines.join('\n');
  }

  function stop() { live = null; }

  return { renderList: renderList, renderSession: renderSession, stop: stop };
})();
