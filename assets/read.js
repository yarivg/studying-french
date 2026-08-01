/* ============================================================
   read.js — reading practice.

   A passage is one JSON file (see content/reading/SCHEMA.md). The
   reader does four things with it: play any line, gloss any word,
   ask comprehension questions, and listen to you read a line back.

   Questions reuse the test engine rather than growing a second one,
   so a passage marks its own mastery the same way a chapter test does.
   ============================================================ */

window.Read = (function () {
  'use strict';

  var index = null;
  var cache = {};

  function loadIndex() {
    if (index) return Promise.resolve(index);
    return fetch('content/reading/index.json')
      .then(function (r) {
        if (!r.ok) throw new Error('No reading index (' + r.status + ')');
        return r.json();
      })
      .then(function (json) {
        // A passage listed but not yet written must not break the list.
        index = json.passages.filter(function (p) { return p && p.id && p.file; });
        return index;
      });
  }

  function loadPassage(entry) {
    if (cache[entry.id]) return Promise.resolve(cache[entry.id]);
    return fetch('content/reading/' + entry.file)
      .then(function (r) {
        if (!r.ok) throw new Error(entry.file + ' — ' + r.status);
        return r.json();
      })
      .then(function (p) { cache[entry.id] = p; return p; });
  }

  function byId(id) {
    return (index || []).filter(function (p) { return p.id === id; })[0] || null;
  }

  /* ---------------------------------------------------------- glossing */

  // Longest first, so "avoir hâte" wins over "avoir".
  function glossIndex(passage) {
    var pairs = [];
    for (var k in passage.gloss) {
      if (Object.prototype.hasOwnProperty.call(passage.gloss, k)) {
        pairs.push([k.toLowerCase(), passage.gloss[k]]);
      }
    }
    return pairs.sort(function (a, b) { return b[0].length - a[0].length; });
  }

  function strip(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  // What a word means: the passage's own gloss first, then the course
  // vocabulary, trying the word bare and behind each article.
  function lookup(word, pairs) {
    var w = word.toLowerCase().replace(/^[«»"'(\[]+|[.,;:!?…»«"'\)\]]+$/g, '');
    if (!w) return null;

    for (var i = 0; i < pairs.length; i++) {
      if (pairs[i][0] === w || pairs[i][0].indexOf(w) === 0) return pairs[i][1];
    }

    var bare = strip(w);
    var words = Vocab.all();
    var best = null;
    for (var j = 0; j < words.length; j++) {
      var fr = strip(words[j].fr);
      if (fr === bare) return words[j].en;
      // "la fenêtre" should answer for "fenêtre".
      if (!best && fr.replace(/^(le|la|les|l'|un|une|des)\s*/, '') === bare) best = words[j].en;
    }
    return best;
  }

  /* ---------------------------------------------------------- rendering */

  function textHtml(passage) {
    return passage.text.split(/\n\s*\n/).map(function (para) {
      var lines = para.split('\n').filter(function (l) { return l.trim(); });
      return '<p class="rd-para">' + lines.map(function (line, i) {
        return '<span class="rd-line" data-say="' + escapeAttr(line.trim()) + '" tabindex="0" ' +
          'role="button">' + line.trim().split(/(\s+)/).map(function (tok) {
            return /\S/.test(tok)
              ? '<span class="rd-w">' + escapeHtml(tok) + '</span>'
              : escapeHtml(tok);
          }).join('') + '</span>' + (i < lines.length - 1 ? ' ' : '');
      }).join('') + '</p>';
    }).join('');
  }

  function render(host, entry, opts) {
    opts = opts || {};
    return loadPassage(entry).then(function (passage) {
      var m = Progress.mastery('read:' + passage.id);
      var pairs = glossIndex(passage);

      host.innerHTML =
        '<div class="eyebrow">' +
          '<a href="#/read" style="color:inherit;text-decoration:none">← All passages</a>' +
          '<span class="dot"></span>' +
          '<span class="pill pill-' + passage.level.toLowerCase() + '">' + escapeHtml(passage.level) + '</span>' +
        '</div>' +
        '<h1>' + escapeHtml(passage.title) + '</h1>' +
        '<p class="lead">' + escapeHtml(passage.blurb || '') + '</p>' +
        (passage.grammar && passage.grammar.length
          ? '<p class="rd-grammar">Uses: ' + passage.grammar.map(function (g) {
              return '<a href="#/' + g + '">' + escapeHtml(g.replace(/-/g, ' ')) + '</a>';
            }).join(' · ') + '</p>'
          : '') +
        '<div class="rd-toolbar">' +
          (window.Say && Say.supported()
            ? '<button class="btn" data-act="playall">🔊 Read it to me</button>' +
              '<button class="btn" data-act="stop">Stop</button>' : '') +
          '<span class="rd-hint">Tap a line to hear it. Tap a word for the meaning.</span>' +
        '</div>' +
        '<div class="rd-text" id="rdText">' + textHtml(passage) + '</div>' +
        '<div class="rd-gloss" id="rdGloss" hidden></div>' +
        (passage.aloud && passage.aloud.length ? aloudHtml(passage) : '') +
        '<h2>Did you follow it?</h2>' +
        '<div id="rdQuiz"></div>' +
        (m.level ? '<p class="rd-mark">You marked this <strong>' +
          ['', 'shaky', 'confident'][m.level] + '</strong>.</p>' : '');

      bindText(host, passage, pairs);
      if (passage.aloud && passage.aloud.length) bindAloud(host, passage);

      Test.start(host.querySelector('#rdQuiz'), {
        id: 'read:' + passage.id,
        title: passage.title,
        masteryKey: 'read:' + passage.id,
        questions: passage.questions || [],
        onDone: function (r) {
          if (r.retry && opts.onRetry) opts.onRetry();
        }
      });

      return passage;
    });
  }

  function bindText(host, passage, pairs) {
    var text = host.querySelector('#rdText');
    var gloss = host.querySelector('#rdGloss');

    text.addEventListener('click', function (e) {
      var word = e.target.closest('.rd-w');
      if (word) {
        var meaning = lookup(word.textContent, pairs);
        gloss.hidden = false;
        gloss.innerHTML = '<strong>' + escapeHtml(word.textContent) + '</strong>' +
          (meaning ? '<span>' + escapeHtml(meaning) + '</span>'
                   : '<span class="rd-nogloss">not in the word list</span>') +
          (window.Say && Say.supported()
            ? '<button class="btn btn-sm" data-say="' + escapeAttr(word.textContent) + '">🔊</button>' : '');
        text.querySelectorAll('.rd-w.is-looked').forEach(function (el) { el.classList.remove('is-looked'); });
        word.classList.add('is-looked');
        return;
      }
      var line = e.target.closest('.rd-line');
      if (line && window.Say && Say.supported()) Say.speak(line.dataset.say, {});
    });

    text.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var line = e.target.closest('.rd-line');
      if (!line) return;
      e.preventDefault();
      if (window.Say && Say.supported()) Say.speak(line.dataset.say, {});
    });

    // Play the lines in order, each one starting when the last has finished.
    host.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]');
      if (!b) return;
      if (b.dataset.act === 'stop') return Say.stop();
      if (b.dataset.act !== 'playall') return;
      var lines = [].slice.call(text.querySelectorAll('.rd-line'));
      (function next(i) {
        if (i >= lines.length) return;
        lines.forEach(function (l) { l.classList.remove('is-playing'); });
        lines[i].classList.add('is-playing');
        Say.speak(lines[i].dataset.say, {
          onEnd: function (finished) {
            lines[i].classList.remove('is-playing');
            if (finished) next(i + 1);
          }
        });
      })(0);
    });
  }

  /* ---------------------------------------------------------- read aloud */

  function aloudHtml(passage) {
    return '<h2>Read it back</h2>' +
      '<p class="rd-aloud-note">' + (window.Speech && Speech.supported()
        ? 'Say the line out loud. The browser transcribes you and marks the words it did not hear ' +
          'as you meant them. It is checking that you are understandable, not that you sound French.'
        : 'This browser cannot listen. Play the line, say it back, and judge it yourself.') + '</p>' +
      '<div class="rd-aloud">' + passage.aloud.map(function (line, i) {
        return '<div class="rd-aloud-item" data-i="' + i + '">' +
          '<p class="rd-aloud-line">' + escapeHtml(line) + '</p>' +
          '<div class="rd-aloud-actions">' +
            (window.Say && Say.supported()
              ? '<button class="btn" data-act="model" data-say="' + escapeAttr(line) + '">🔊 Hear it</button>' : '') +
            (window.Speech && Speech.supported()
              ? '<button class="btn btn-primary" data-act="rec">🎤 Say it</button>' : '') +
          '</div>' +
          '<div class="rd-aloud-result"></div>' +
          '</div>';
      }).join('') + '</div>';
  }

  function bindAloud(host, passage) {
    var wrap = host.querySelector('.rd-aloud');
    if (!wrap) return;
    wrap.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act="rec"]');
      if (!b) return;
      var item = b.closest('.rd-aloud-item');
      var line = passage.aloud[Number(item.dataset.i)];
      var out = item.querySelector('.rd-aloud-result');

      b.disabled = true;
      b.textContent = '🎤 Listening…';
      Say.stop();

      Speech.check(line, {
        onPartial: function (t) { b.textContent = '🎤 ' + t; }
      }).then(function (r) {
        b.disabled = false;
        b.textContent = '🎤 Again';
        out.innerHTML =
          '<p class="test-heard">' + r.words.map(function (w) {
            return '<span class="hw hw-' + w.state + '">' + escapeHtml(w.word) + '</span>';
          }).join(' ') + '<span class="test-heard-pct">' + r.pct + '%</span></p>' +
          '<p class="test-note">' + (r.pass
            ? 'Understandable.'
            : 'The underlined words did not come through. Hear the model, then try those again.') +
          ' Heard: ' + escapeHtml(r.heard || '—') + '</p>';
      }).catch(function (err) {
        b.disabled = false;
        b.textContent = '🎤 Try again';
        out.innerHTML = '<p class="test-note is-bad">' + escapeHtml(err.message) + '</p>';
      });
    });
  }

  /* ---------------------------------------------------------- list */

  function listHtml(passages) {
    var byLevel = {};
    passages.forEach(function (p) { (byLevel[p.level] = byLevel[p.level] || []).push(p); });
    return ['A1', 'A2', 'B1', 'B2'].filter(function (l) { return byLevel[l]; }).map(function (level) {
      return '<h2>' + level + '</h2><div class="rd-grid">' + byLevel[level].map(function (p) {
        var m = Progress.mastery('read:' + p.id);
        var s = Progress.testScore('read:' + p.id);
        return '<a class="rd-card lv' + m.level + '" href="#/read/' + p.id + '">' +
          '<span class="rd-card-title">' + escapeHtml(p.title) + '</span>' +
          '<span class="rd-card-blurb">' + escapeHtml(p.blurb || '') + '</span>' +
          '<span class="rd-card-meta">' + (s.runs ? 'best ' + s.best + '%' : 'not read yet') + '</span>' +
          '</a>';
      }).join('') + '</div>';
    }).join('');
  }

  /* ---------------------------------------------------------- helpers */

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  var escapeAttr = escapeHtml;

  return {
    loadIndex: loadIndex, loadPassage: loadPassage, byId: byId,
    render: render, listHtml: listHtml, lookup: lookup, glossIndex: glossIndex
  };
})();
