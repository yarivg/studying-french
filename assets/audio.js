/* ============================================================
   audio.js — spoken French, straight from the browser.

   Uses the Web Speech API (speechSynthesis), so there are no
   sound files to ship and nothing to download. Every French
   example in a lesson becomes clickable: click it and a French
   voice reads it. Phonetic transcriptions get a play button of
   their own, wired to the word they transcribe — /pwasɔ̃/ is
   only useful if you can hear what it means.

   Preferences (on/off, slow, chosen voice) live in localStorage
   next to the rest of the app's state.
   ============================================================ */

window.Say = (function () {
  'use strict';

  var KEY = 'lecarnet.audio';
  var synth = window.speechSynthesis || null;

  var prefs = load();
  var voices = [];
  var current = null;      // the SpeechSynthesisVoice we speak with
  var speakingEl = null;

  function load() {
    var p = { on: true, slow: false, voice: '' };
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        if (typeof saved.on === 'boolean') p.on = saved.on;
        if (typeof saved.slow === 'boolean') p.slow = saved.slow;
        if (typeof saved.voice === 'string') p.voice = saved.voice;
      }
    } catch (e) { /* corrupt or unavailable storage: defaults are fine */ }
    return p;
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) { /* private mode */ }
  }

  /* ---------------------------------------------------------- voices */

  // Voices arrive asynchronously in most browsers, and Chrome only
  // populates the list after the first getVoices() call.
  function refreshVoices() {
    if (!synth) return;
    voices = (synth.getVoices() || []).filter(function (v) {
      return /^fr/i.test(v.lang);
    });
    current = pickVoice();
    paintMenu();
  }

  // The system voices macOS and Windows ship for French, in the order a
  // learner wants them: the plain ones first, the novelty ones last.
  var GOOD = ['thomas', 'amélie', 'amelie', 'audrey', 'aurélie', 'aurelie',
              'jacques', 'marie', 'hortense', 'julie', 'paul', 'denise', 'chantal'];

  // Prefer the saved choice, then a natural-sounding voice from France that
  // is installed locally (those work offline and sound the least robotic).
  function pickVoice() {
    if (!voices.length) return null;
    var saved = voices.filter(function (v) { return v.voiceURI === prefs.voice; })[0];
    if (saved) return saved;

    var best = null, bestScore = -1;
    voices.forEach(function (v) {
      var name = v.name.toLowerCase();
      var score = 0;
      var rank = GOOD.indexOf(name.split(/[ (]/)[0]);
      if (rank !== -1) score += 100 - rank;
      if (/^fr[-_]?FR/i.test(v.lang)) score += 20;
      if (v.localService) score += 10;
      // Apple's "Eddy", "Grandma", "Rocko" and friends are jokes, not models.
      if (/\(/.test(v.name) && rank === -1) score -= 5;
      if (score > bestScore) { bestScore = score; best = v; }
    });
    return best;
  }

  function supported() { return !!synth; }
  function available() { return !!synth && voices.length > 0; }
  function enabled() { return prefs.on && available(); }

  /* ---------------------------------------------------------- speaking */

  /* The word list writes an adjective as one entry with its endings hung off
     the back: "fort/e", "bon/ne", "ancien/ne", "noir/e/s". That is a spelling
     convention, not a list of words, so reading it out needs the endings put
     back onto the stem — otherwise the voice says "fort ou e".

     Only these endings expand. Anything else after a slash is two separate
     words ("le/la", "mon/ton/son", "du/au") and keeps the spoken "ou". */
  var ENDINGS = /^(e|es|s|ne|nes|le|les|te|tes|se|ses|sse|ce|ve|che)$/;

  function inflect(stem, suf) {
    if (suf === 's' || suf === 'es') {
      // amical becomes amicaux, not amicals.
      if (/al$/.test(stem)) return stem.slice(0, -1) + 'ux';
      // gris already ends in the s; saying it twice gives "griss".
      if (suf === 's' && /s$/.test(stem)) return stem;
      return stem + suf;
    }
    // courageux + se is courageuse, doux + ce is douce: the x goes.
    if (/x$/.test(stem) && /^[sc]/.test(suf)) return stem.slice(0, -1) + suf;
    // serveur + se is serveuse, menteur + se is menteuse.
    if (/eur$/.test(stem) && suf === 'se') return stem.slice(0, -1) + suf;
    // Any stem in -er takes the grave: chère, fière, régulière, étrangère.
    if (/er$/.test(stem) && suf === 'e') return stem.slice(0, -2) + 'ère';
    // -ne doubles after -on and -en (bonne, ancienne) but not after -un or
    // -in (brune, radine), so the doubling depends on the vowel before it.
    if (suf === 'ne' && /n$/.test(stem)) {
      return /[oe]n$/.test(stem) ? stem + 'ne' : stem.slice(0, -1) + 'ne';
    }
    return stem + suf;
  }

  function expandForms(text) {
    // The lookahead matters: without it "lequel/lesquels" matches as far as
    // "/les" and leaves the rest of the word stranded.
    return text.replace(/([a-zà-ÿœæ]{3,})((?:\/[a-zà-ÿœæ]{1,3})+)(?![a-zà-ÿœæ])/gi,
      function (m, stem, tail) {
        var sufs = tail.split('/').filter(Boolean);
        if (!sufs.every(function (s) { return ENDINGS.test(s.toLowerCase()); })) return m;
        var forms = [stem];
        sufs.forEach(function (s) {
          var form = inflect(stem, s.toLowerCase());
          // Two spellings can land on one form; saying it twice is noise.
          if (forms.indexOf(form) === -1) forms.push(form);
        });
        return forms.join(', ');
      });
  }

  // Strip the things that surround an example in the source text but
  // should not be read out: glosses in brackets, phonetics, markers.
  function clean(text) {
    var s = String(text || '')
      // Drop IPA transcriptions, but only real ones: "précédent/e/s" also
      // has something between two slashes, and it is not a transcription.
      .replace(/\/[^/]*\//g, function (m) {
        return /[ɑɛœøəɔɥʁʃʒɲŋɡʎæ̃ːˈ]/.test(m) ? ' ' : m;
      })
      .replace(/\([^)]*\)/g, ' ')
      .replace(/\[[^\]]*\]/g, ' ')
      .replace(/[*_`«»"]/g, ' ');

    // Endings first: "fort/e" is one word, while "le/la" really is two and
    // falls through to the rule below.
    return expandForms(s)
      // A slash between two forms is read out as "barre oblique" by every
      // voice, which is not what "délicieux/délicieuse" means. Say it.
      // A lookahead, not a second group: "précédent/e/s" has two slashes
      // sharing a letter, and a consuming match would skip the second.
      .replace(/([^\s/])\s*\/\s*(?=[^\s/])/g, '$1 ou ')
      .replace(/\//g, ' ')
      // An arrow means "becomes": the tables are full of "cruel → cruelle".
      // Left in, a French voice announces it as "flèche". A comma gives the
      // pause that makes the pair audible as two forms of one word.
      .replace(/\s*(→|⟶|⇒|->|←)\s*/g, ', ')
      .replace(/\s*[·—–]\s*/g, ', ')
      .replace(/‑/g, '-')
      .replace(/…/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Bumped by every speak() and every stop(), so an utterance that is
  // cancelled can tell it was cancelled: browsers are inconsistent about
  // whether cancel() arrives as `end` or as an `interrupted` error.
  var epoch = 0;

  function speak(text, opts) {
    opts = opts || {};
    if (!synth || !prefs.on) return false;
    var say = clean(text);
    if (!say) return false;

    synth.cancel();
    var mine = ++epoch;
    var u = new SpeechSynthesisUtterance(say);
    u.lang = current ? current.lang : 'fr-FR';
    if (current) u.voice = current;
    u.rate = (opts.slow || prefs.slow) ? 0.6 : 0.95;
    u.pitch = 1;

    var el = opts.el || null;
    if (el) {
      speakingEl = el;
      el.classList.add('is-speaking');
    }

    // `finished` is false when something cancelled us — a new utterance, a
    // route change — which is how a caller reading a passage line by line
    // knows to stop rather than plough on.
    var settled = false;
    function done(finished) {
      if (settled) return;
      settled = true;
      if (el) {
        el.classList.remove('is-speaking');
        if (speakingEl === el) speakingEl = null;
      }
      if (opts.onEnd) opts.onEnd(finished && mine === epoch);
    }
    u.onend = function () { done(true); };
    u.onerror = function (e) { done(!e || e.error !== 'interrupted'); };

    synth.speak(u);
    return true;
  }

  function stop() {
    epoch++;
    if (synth) synth.cancel();
    if (speakingEl) { speakingEl.classList.remove('is-speaking'); speakingEl = null; }
  }

  /* ---------------------------------------------------------- hydration */

  var SPEAKER =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M4 9.5h3.2L12 5.5v13L7.2 14.5H4z"/>' +
    '<path d="M15.6 9a4 4 0 0 1 0 6M18.3 6.5a7.6 7.6 0 0 1 0 11"/></svg>';

  // Italic text in a lesson is, by the convention of these notes, a French
  // example. Turn each one into something you can click and hear.
  function markExample(el) {
    if (el.dataset.say != null) return;
    if (el.closest('.ex-en, .v-en, .callout-label, .say-btn')) return;
    var text = clean(el.textContent);
    // Short italics are French examples; a long one is almost always an
    // English phrase being emphasised, and a French voice would mangle it.
    if (!text || text.length > 60 || text.split(/\s+/).length > 6) return;
    if (!/[a-zà-ÿœæ]/i.test(text)) return;
    el.dataset.say = text;
    el.classList.add('say');
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('title', 'Hear “' + text + '”');
  }

  // A phonetic transcription cannot be spoken as written, so its play
  // button reads the French it belongs to: the example in the same table
  // row, the question above the answer, or the nearest italic before it.
  // The italic inside `scope` that this transcription belongs to: the last one
  // before it, so a cell holding two pairs gives each its own word, falling
  // back to the first when the transcription comes before every italic.
  function nearestEm(scope, el) {
    var best = '';
    scope.querySelectorAll('em').forEach(function (candidate) {
      if (el.compareDocumentPosition(candidate) & Node.DOCUMENT_POSITION_PRECEDING) {
        best = clean(candidate.textContent);
      }
    });
    if (best) return best;
    var first = scope.querySelector('em');
    return first ? clean(first.textContent) : '';
  }

  function ipaSource(el) {
    var td = el.closest('td, th');
    if (td) {
      // The word a transcription belongs to is nearly always beside it in the
      // same cell: "*grand* /gʁɑ̃/". That has to win, or a row built as
      // "*grand* /gʁɑ̃/ | *grande* /gʁɑ̃d/" makes the first button say
      // "grande", which is the opposite of the point being made.
      var own = nearestEm(td, el);
      if (own) return own;

      var row = td.closest('tr');
      var cells = row ? [].slice.call(row.cells) : [];
      // Examples live in the last column, so search the row right to left:
      // a stray italic in a Notes column should not win over them.
      for (var i = cells.length - 1; i >= 0; i--) {
        var em = cells[i].querySelector('em');
        if (em) return clean(em.textContent);
      }
      // No italics anywhere in the row: some tables (the numbers, for one)
      // simply put the French word in the first column.
      if (cells.length && cells[0] !== td) {
        var first = clean(cells[0].textContent);
        if (first && first.length <= 30 && first.split(/\s+/).length <= 3) return first;
      }
    }

    var answer = el.closest('.exercise-a');
    if (answer) {
      var item = answer.closest('.exercise-item');
      var q = item && item.querySelector('.exercise-q');
      if (q) {
        var qEm = q.querySelector('em');
        return clean(qEm ? qEm.textContent : q.textContent.split(/[—?]/)[0]);
      }
    }

    var box = el.closest('li, p, .example, .callout, .exercise-item, td') || el.parentNode;
    return nearestEm(box, el);
  }

  function markIpa(el) {
    if (el.dataset.wired) return;
    el.dataset.wired = '1';
    var src = ipaSource(el);
    if (!src) return;
    // One button per word per row. A note like "the s now sounds, as /z/"
    // holds a single phoneme, so it resolves to the word already wired beside
    // it, and two identical buttons in one row read as two different sounds.
    var row = el.closest('tr');
    if (row && [].some.call(row.querySelectorAll('.say-btn'), function (b) {
      return b.dataset.say === src;
    })) return;
    var btn = document.createElement('button');
    btn.className = 'say-btn';
    btn.type = 'button';
    btn.dataset.say = src;
    btn.setAttribute('aria-label', 'Hear “' + src + '”');
    btn.setAttribute('title', 'Hear “' + src + '”');
    btn.innerHTML = SPEAKER;
    el.insertAdjacentElement('afterend', btn);
  }

  // The French side of an examples block is the same kind of thing as an
  // italic in prose, but it is not italicised, so nothing above catches it.
  // These are the lines a learner most wants to hear, so they get a button.
  function markPhrase(el) {
    if (el.dataset.wired) return;
    el.dataset.wired = '1';
    // An italic inside it was already wired by markExample; a second
    // control for the same words would be noise.
    if (el.querySelector('em.say')) return;
    var text = clean(el.textContent);
    if (!text || text.length > 80) return;
    if (!/[a-zà-ÿœæ]/i.test(text)) return;
    var btn = document.createElement('button');
    btn.className = 'say-btn';
    btn.type = 'button';
    btn.dataset.say = text;
    btn.setAttribute('aria-label', 'Hear “' + text + '”');
    btn.setAttribute('title', 'Hear “' + text + '”');
    btn.innerHTML = SPEAKER;
    el.appendChild(btn);
  }

  // Give a vocabulary row its own play button next to the French column.
  function markVocab(el) {
    if (el.dataset.wired) return;
    el.dataset.wired = '1';
    var text = clean(el.textContent);
    if (!text) return;
    var btn = document.createElement('button');
    btn.className = 'say-btn';
    btn.type = 'button';
    btn.dataset.say = text;
    btn.setAttribute('aria-label', 'Hear “' + text + '”');
    btn.setAttribute('title', 'Hear “' + text + '”');
    btn.innerHTML = SPEAKER;
    // Inside the cell, not after it: the row is a fixed grid.
    el.appendChild(btn);
  }

  // Called after anything is rendered into the page.
  function hydrate(root) {
    if (!root || !supported()) return;
    root.querySelectorAll('em').forEach(markExample);
    root.querySelectorAll('.ipa').forEach(markIpa);
    root.querySelectorAll('.ex-fr').forEach(markPhrase);
    root.querySelectorAll('.v-fr').forEach(markVocab);
  }

  /* ---------------------------------------------------------- controls */

  var btn = null, menu = null;

  function setup() {
    btn = document.getElementById('audioBtn');
    menu = document.getElementById('audioMenu');
    if (!btn || !menu) return;

    document.body.classList.toggle('audio-off', !prefs.on);

    if (!supported()) {
      btn.hidden = true;
      return;
    }

    refreshVoices();
    if (synth.addEventListener) synth.addEventListener('voiceschanged', refreshVoices);
    else synth.onvoiceschanged = refreshVoices;
    // Safari sometimes reports an empty list on the first tick.
    setTimeout(refreshVoices, 400);

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.hidden;
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      if (open) paintMenu();
    });

    menu.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMenu(); stop(); }
    });

    menu.addEventListener('change', function (e) {
      var t = e.target;
      if (t.id === 'audioOn') {
        prefs.on = t.checked;
        document.body.classList.toggle('audio-off', !prefs.on);
        if (!prefs.on) stop();
      } else if (t.id === 'audioSlow') {
        prefs.slow = t.checked;
      } else if (t.id === 'audioVoice') {
        prefs.voice = t.value;
        current = pickVoice();
      }
      save();
      paintMenu();
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('[data-act="test"]')) speak('Bonjour, je parle français.');
    });
  }

  function closeMenu() {
    if (menu && !menu.hidden) {
      menu.hidden = true;
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  }

  function paintMenu() {
    if (!menu || menu.hidden) return;
    var opts = voices.map(function (v) {
      var sel = current && v.voiceURI === current.voiceURI ? ' selected' : '';
      return '<option value="' + escapeAttr(v.voiceURI) + '"' + sel + '>' +
        escapeHtml(v.name) + ' (' + escapeHtml(v.lang) + ')</option>';
    }).join('');

    menu.innerHTML =
      '<div class="audio-menu-title">Audio</div>' +
      '<label class="audio-row"><input type="checkbox" id="audioOn"' + (prefs.on ? ' checked' : '') + '>' +
        '<span>Read examples aloud</span></label>' +
      '<label class="audio-row"><input type="checkbox" id="audioSlow"' + (prefs.slow ? ' checked' : '') + '>' +
        '<span>Speak slowly</span></label>' +
      (voices.length
        ? '<label class="audio-row audio-voice"><span>Voice</span>' +
            '<select id="audioVoice">' + opts + '</select></label>' +
          '<button class="btn" type="button" data-act="test">Test the voice</button>'
        : '<p class="audio-note">No French voice is installed in this browser. ' +
          'On macOS add one in System Settings → Accessibility → Spoken Content → System Voice → Manage Voices.</p>') +
      '<p class="audio-note">Click any French example to hear it. Shift-click reads it slowly.</p>';
  }

  /* ---------------------------------------------------------- events */

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-say]');
    if (!t || !prefs.on) return;
    e.preventDefault();
    speak(t.dataset.say, { slow: e.shiftKey, el: t });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var t = document.activeElement;
    if (!t || !t.matches || !t.matches('em.say')) return;
    e.preventDefault();
    speak(t.dataset.say, { slow: e.shiftKey, el: t });
  });

  // A page navigation should not leave a voice talking over the next lesson.
  window.addEventListener('hashchange', stop);
  window.addEventListener('beforeunload', function () { if (synth) synth.cancel(); });

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function escapeAttr(s) { return escapeHtml(s).replace(/"/g, '&quot;'); }

  return {
    setup: setup, hydrate: hydrate, speak: speak, stop: stop,
    supported: supported, available: available, enabled: enabled
  };
})();
