/* ============================================================
   quiz.js — exercise cards inside lessons, and the flashcard
   review session driven by the Leitner boxes in progress.js.
   ============================================================ */

window.Quiz = (function () {
  'use strict';

  /* ---------------------------------------------------------- exercises */

  // Wire up every ::: exercise block inside `root` for the given chapter.
  function bindExercises(root, slug) {
    root.querySelectorAll('.exercise').forEach(function (ex) {
      var exId = ex.dataset.ex;

      ex.querySelectorAll('.exercise-item').forEach(function (item) {
        var i = item.dataset.i;
        var saved = Progress.getEx(slug, exId, i);
        if (saved) {
          item.classList.add('is-open', 'graded-' + saved);
        }
      });

      ex.addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-act]');
        if (!btn) return;
        var item = btn.closest('.exercise-item');
        var i = item.dataset.i;
        var act = btn.dataset.act;

        if (act === 'reveal') {
          item.classList.add('is-open');
          return;
        }
        item.classList.remove('graded-ok', 'graded-again');
        item.classList.add('graded-' + act);
        Progress.setEx(slug, exId, i, act);
        updateScore(ex, slug, exId);

        var next = item.nextElementSibling;
        if (next) next.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });

      updateScore(ex, slug, exId);
    });
  }

  function updateScore(ex, slug, exId) {
    var items = ex.querySelectorAll('.exercise-item');
    var ok = 0, done = 0;
    items.forEach(function (item) {
      var v = Progress.getEx(slug, exId, item.dataset.i);
      if (!v) return;
      done++;
      if (v === 'ok') ok++;
    });
    var el = ex.querySelector('[data-role="score"]');
    if (el) el.textContent = done ? ok + ' / ' + items.length + ' correct' : items.length + ' questions';
  }

  /* ---------------------------------------------------------- flashcards */

  var session = null;

  // cards: [{ id, front, back, tag }]
  function startSession(container, cards, opts) {
    opts = opts || {};
    var allIds = cards.map(function (c) { return c.id; });
    var byId = {};
    cards.forEach(function (c) { byId[c.id] = c; });

    // "Cram" ignores the schedule and puts the whole deck back in play.
    var queue = opts.all ? allIds.slice() : Progress.dueQueue(allIds);

    if (!queue.length) {
      container.innerHTML =
        '<div class="empty"><div class="empty-icon">✓</div>' +
        '<p><strong>Nothing due right now.</strong></p>' +
        '<p>Every card in this deck is scheduled for a later day. ' +
        'Come back tomorrow, or <button class="btn" data-act="cram">review anyway</button>.</p></div>';
      container.querySelector('[data-act="cram"]').addEventListener('click', function () {
        startSession(container, cards, { limit: opts.limit, cram: true, all: true });
      });
      return;
    }

    if (opts.shuffle !== false) queue = shuffle(queue);
    if (opts.limit) queue = queue.slice(0, opts.limit);

    session = {
      container: container, byId: byId, queue: queue,
      index: 0, total: queue.length, right: 0, wrong: 0,
      flipped: false, cram: !!opts.cram, onDone: opts.onDone
    };
    renderCard();
  }

  function renderCard() {
    var s = session;
    if (!s) return;

    if (s.index >= s.queue.length) return renderSummary();

    var card = s.byId[s.queue[s.index]];
    var box = Progress.card(card.id).box;
    var boxLabel = Progress.card(card.id).seen ? 'box ' + box + ' / ' + Progress.MAX_BOX : 'new';

    s.container.innerHTML =
      '<div class="flash-stage">' +
        '<div class="flash-card" tabindex="0" role="button" aria-label="Reveal answer">' +
          (card.tag ? '<span class="pill flash-tag">' + escapeHtml(card.tag) + '</span>' : '') +
          '<span class="flash-box">' + boxLabel + '</span>' +
          '<div>' +
            '<div class="flash-front">' + escapeHtml(card.front) + '</div>' +
            '<div class="flash-back" hidden>' + escapeHtml(card.back) + '</div>' +
          '</div>' +
          '<span class="flash-hint">click, or press space, to flip' +
            (card.fr && window.Say && Say.supported() ? ' · H to hear it' : '') + '</span>' +
        '</div>' +
        (card.fr && window.Say && Say.supported()
          ? '<button class="btn flash-say" type="button" data-say="' + escapeAttr(card.fr) + '"' +
            (card.frOnFront ? '' : ' hidden') + '>🔊 Hear it</button>'
          : '') +
        '<div class="flash-actions" hidden>' +
          '<button class="btn btn-lg btn-again" data-grade="0">Again</button>' +
          '<button class="btn btn-lg btn-ok" data-grade="1">Got it</button>' +
        '</div>' +
        '<div class="flash-progress">' +
          '<span>' + (s.index + 1) + ' of ' + s.total + '</span>' +
          '<span>' + s.right + ' right · ' + s.wrong + ' to review</span>' +
        '</div>' +
      '</div>';

    var cardEl = s.container.querySelector('.flash-card');
    var actions = s.container.querySelector('.flash-actions');
    var hint = s.container.querySelector('.flash-hint');

    var sayBtn = s.container.querySelector('.flash-say');

    function flip() {
      if (s.flipped) return;
      s.flipped = true;
      cardEl.querySelector('.flash-back').hidden = false;
      actions.hidden = false;
      if (sayBtn) sayBtn.hidden = false;
      hint.textContent = 'press 1 to review again, 2 if you got it' +
        (sayBtn ? ', H to hear it' : '');
    }

    cardEl.addEventListener('click', flip);
    cardEl.focus();

    actions.addEventListener('click', function (e) {
      var b = e.target.closest('[data-grade]');
      if (b) grade(b.dataset.grade === '1');
    });

    s.flip = flip;
    s.flipped = false;
  }

  function grade(correct) {
    var s = session;
    if (!s) return;
    Progress.gradeCard(s.queue[s.index], correct);
    if (correct) s.right++; else s.wrong++;
    s.index++;
    renderCard();
  }

  function renderSummary() {
    var s = session;
    var pct = s.total ? Math.round((s.right / s.total) * 100) : 0;
    s.container.innerHTML =
      '<div class="empty">' +
        '<div class="empty-icon">' + (pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪') + '</div>' +
        '<p style="font-size:1.3rem;color:var(--ink)"><strong>' + s.right + ' / ' + s.total + '</strong> — ' + pct + '%</p>' +
        '<p>Cards you missed come back tomorrow; the rest move up a box.</p>' +
        '<p style="margin-top:1.2rem"><button class="btn btn-primary btn-lg" data-act="again">Review again</button></p>' +
      '</div>';
    var again = s.container.querySelector('[data-act="again"]');
    var cards = Object.keys(s.byId).map(function (k) { return s.byId[k]; });
    again.addEventListener('click', function () { startSession(s.container, cards, {}); });
    if (s.onDone) s.onDone({ right: s.right, total: s.total });
    session = null;
  }

  function handleKey(e) {
    if (!session) return;
    // The target is not always an element — a key pressed with nothing
    // focused arrives on the document itself.
    if (e.target && e.target.matches && e.target.matches('input, textarea, select')) return;
    if (e.target.closest && e.target.closest('.flash-say')) return;
    if (e.key === 'h' || e.key === 'H') {
      // Hear the French. Before the flip that only makes sense on a
      // FR → EN card, where the French is already the side you can see.
      var say = session.container.querySelector('.flash-say');
      if (say && !say.hidden) { e.preventDefault(); Say.speak(say.dataset.say, { slow: e.shiftKey }); }
      return;
    }
    if (e.key === ' ' || e.key === 'Enter') {
      if (!session.flipped) { e.preventDefault(); session.flip(); }
    } else if (session.flipped && (e.key === '1' || e.key === '2')) {
      e.preventDefault();
      grade(e.key === '2');
    }
  }

  function endSession() { session = null; }

  document.addEventListener('keydown', handleKey);

  /* ---------------------------------------------------------- helpers */

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function escapeAttr(s) { return escapeHtml(s).replace(/"/g, '&quot;'); }

  return { bindExercises: bindExercises, startSession: startSession, endSession: endSession };
})();
