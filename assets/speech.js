/* ============================================================
   speech.js — checking that what you said is recognisable as
   the French you were asked to say.

   The browser's speech recogniser transcribes you, and we compare
   its transcript to the target. That measures intelligibility, not
   accent: the recogniser has a language model, so it will forgive a
   sloppy vowel in a word it can guess from context. Short targets
   keep it honest, which is why the test bank caps `say` items at a
   few words.

   Where recognition is missing (Firefox, older Safari) the caller
   falls back to hearing the model and marking yourself.
   ============================================================ */

window.Speech = (function () {
  'use strict';

  var Rec = window.SpeechRecognition || window.webkitSpeechRecognition || null;

  function supported() { return !!Rec; }

  /* ---------------------------------------------------------- listening */

  var active = null;

  // Resolves with the best transcript, or rejects with a message worth
  // showing. Only one recogniser may run at a time.
  function listen(opts) {
    opts = opts || {};
    if (!Rec) return Promise.reject(new Error('This browser cannot listen.'));
    stop();

    return new Promise(function (resolve, reject) {
      var rec = new Rec();
      rec.lang = opts.lang || 'fr-FR';
      rec.interimResults = true;
      rec.maxAlternatives = 5;
      rec.continuous = false;

      var settled = false;
      var alternatives = [];

      // Some platforms end the session without ever firing `result`.
      var guard = setTimeout(function () { try { rec.stop(); } catch (e) {} }, opts.timeout || 8000);

      rec.onresult = function (e) {
        for (var i = e.resultIndex; i < e.results.length; i++) {
          var r = e.results[i];
          if (!r.isFinal) {
            if (opts.onPartial) opts.onPartial(r[0].transcript);
            continue;
          }
          for (var j = 0; j < r.length; j++) alternatives.push(r[j].transcript);
        }
      };

      rec.onerror = function (e) {
        if (settled) return;
        settled = true;
        clearTimeout(guard);
        reject(new Error(errorMessage(e.error)));
      };

      rec.onend = function () {
        clearTimeout(guard);
        active = null;
        if (settled) return;
        settled = true;
        if (!alternatives.length) {
          reject(new Error('I did not catch anything. Try again, a little louder.'));
        } else {
          resolve(alternatives);
        }
      };

      try {
        rec.start();
        active = rec;
        if (opts.onStart) opts.onStart();
      } catch (e) {
        settled = true;
        clearTimeout(guard);
        reject(new Error('Could not start the microphone.'));
      }
    });
  }

  function stop() {
    if (!active) return;
    try { active.stop(); } catch (e) { /* already stopping */ }
    active = null;
  }

  function errorMessage(code) {
    switch (code) {
      case 'not-allowed':
      case 'service-not-allowed':
        return 'The microphone is blocked. Allow it for this site and try again.';
      case 'no-speech':
        return 'I did not hear anything.';
      case 'audio-capture':
        return 'No microphone found.';
      case 'network':
        return 'Speech recognition needs a connection, and it could not reach the service.';
      case 'aborted':
        return 'Stopped.';
      default:
        return 'The recogniser failed (' + code + ').';
    }
  }

  /* ---------------------------------------------------------- comparing */

  function normalise(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[’']/g, ' ')                      // l'eau and l eau compare alike
      .replace(/[^a-z0-9à-ÿ ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Recognisers write numbers as digits; the course writes them as words.
  var NUMBERS = {
    '0': 'zero', '1': 'un', '2': 'deux', '3': 'trois', '4': 'quatre', '5': 'cinq',
    '6': 'six', '7': 'sept', '8': 'huit', '9': 'neuf', '10': 'dix', '11': 'onze',
    '12': 'douze', '13': 'treize', '14': 'quatorze', '15': 'quinze', '16': 'seize',
    '20': 'vingt', '30': 'trente', '40': 'quarante', '50': 'cinquante',
    '60': 'soixante', '100': 'cent', '1000': 'mille'
  };

  function tokens(s) {
    return normalise(s).split(' ').filter(Boolean).map(function (t) {
      return NUMBERS[t] || t;
    });
  }

  // A rough spelling-to-sound key, so a word the recogniser heard right but
  // spelled as another form of itself still counts. "parle", "parles" and
  // "parlent" are one sound; so are "et" and "es". This is deliberately
  // crude — it only has to stop false failures, not transcribe French.
  function sounds(word) {
    var w = word;
    w = w.replace(/eaux?$/, 'o').replace(/eau/g, 'o');
    w = w.replace(/qu/g, 'k').replace(/ph/g, 'f').replace(/ch/g, 'S').replace(/gn/g, 'N');
    w = w.replace(/ai|ei/g, 'e').replace(/au/g, 'o').replace(/ou/g, 'u').replace(/oi/g, 'wa');
    w = w.replace(/c([eiy])/g, 's$1').replace(/c/g, 'k').replace(/ç/g, 's');
    w = w.replace(/g([eiy])/g, 'j$1');
    w = w.replace(/(^|[^s])s([aeiouy])/g, '$1z$2');   // intervocalic s
    w = w.replace(/ss/g, 's');
    // Endings that are written but not said. They stack — the s of
    // "petits" hides a t that is also silent — so peel until nothing
    // matches, stopping before the word disappears.
    for (var k = 0; k < 3 && w.length > 2; k++) {
      var shorter = w.replace(/(ent|es|s|t|d|x|z|p|e)$/, '');
      if (shorter === w) break;
      w = shorter;
    }
    w = w.replace(/h/g, '');
    w = w.replace(/(.)\1+/g, '$1');
    return w || word;
  }

  /* Score one attempt against the target.

     Returns { pct, words: [{ word, state }], heard } where state is
     'ok' (heard as written), 'close' (right sound, other spelling) or
     'miss'. Alignment is a plain edit-distance table over the two word
     lists, so a dropped or inserted word shifts nothing after it. */
  function compare(target, heard) {
    var t = tokens(target), h = tokens(heard);
    var ts = t.map(sounds), hs = h.map(sounds);

    var n = t.length, m = h.length;
    var d = [], i, j;
    for (i = 0; i <= n; i++) { d[i] = [i]; }
    for (j = 0; j <= m; j++) { d[0][j] = j; }
    for (i = 1; i <= n; i++) {
      for (j = 1; j <= m; j++) {
        var cost = t[i - 1] === h[j - 1] ? 0 : (ts[i - 1] === hs[j - 1] ? 0.25 : 1);
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      }
    }

    // Walk the table back to find what happened to each target word.
    var states = new Array(n);
    i = n; j = m;
    while (i > 0) {
      if (j > 0) {
        var sub = t[i - 1] === h[j - 1] ? 0 : (ts[i - 1] === hs[j - 1] ? 0.25 : 1);
        if (d[i][j] === d[i - 1][j - 1] + sub) {
          states[i - 1] = sub === 0 ? 'ok' : sub === 0.25 ? 'close' : 'miss';
          i--; j--;
          continue;
        }
      }
      if (d[i][j] === d[i - 1][j] + 1) { states[i - 1] = 'miss'; i--; continue; }
      j--;   // an extra word in the transcript; nothing to blame on the target
    }

    var got = 0;
    states.forEach(function (s) { if (s === 'ok') got += 1; else if (s === 'close') got += 0.9; });
    var extra = Math.max(0, m - n);
    // Words you said that were not asked for still cost something, or
    // reading the whole page aloud would score full marks.
    var pct = n ? Math.round(Math.max(0, (got - extra * 0.5) / n) * 100) : 0;

    return {
      pct: pct,
      heard: h.join(' '),
      words: t.map(function (w, k) { return { word: target.split(/\s+/)[k] || w, state: states[k] || 'miss' }; })
    };
  }

  // Recognisers return several guesses; the kindest one is the fairest,
  // since a lower-ranked alternative matching means the sounds were there.
  function best(target, alternatives) {
    var top = null;
    (alternatives || []).forEach(function (alt) {
      var r = compare(target, alt);
      if (!top || r.pct > top.pct) top = r;
    });
    return top || { pct: 0, heard: '', words: [] };
  }

  var PASS = 80;

  /* A transcript can fail in two different ways, and they deserve different
     answers. Either the recogniser understood you and you said the wrong
     thing, or it did not produce anything usable — most often by collapsing
     a short phrase into one real word that happens to fit the sounds ("la
     rue" coming back as "garou"). The second is not evidence about your
     pronunciation, so it must not be reported as a failed attempt. */
  function unusable(target, r) {
    var want = tokens(target).length, got = r.heard ? r.heard.split(' ').length : 0;
    if (!got) return true;
    // Fewer words than asked for, and nothing matched: it guessed a word
    // rather than transcribing what it heard.
    if (got < want && r.pct < 50) return true;
    // Every single word missed on a short phrase is far likelier to be a
    // bad transcript than a person who got every sound wrong.
    if (want <= 3 && r.pct === 0) return true;
    return false;
  }

  function check(target, opts) {
    return listen(opts).then(function (alternatives) {
      var r = best(target, alternatives);
      r.pass = r.pct >= PASS;
      r.unclear = !r.pass && unusable(target, r);
      return r;
    });
  }

  return {
    supported: supported, listen: listen, stop: stop, check: check,
    compare: compare, best: best, normalise: normalise, sounds: sounds,
    PASS: PASS
  };
})();
