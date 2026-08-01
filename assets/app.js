/* ============================================================
   app.js — routing, navigation, search and the non-lesson pages.

   Routes
     #/                  home
     #/dashboard         progress overview
     #/vocab             vocabulary browser
     #/cards             deck list
     #/cards/<deckId>    review session
     #/<slug>            a lesson from content/
   ============================================================ */

(function () {
  'use strict';

  var manifest = null;
  var chapters = [];          // flat list, in reading order
  var bySlug = {};
  var cache = {};             // slug -> raw markdown
  var searchIndex = null;

  var view = document.getElementById('view');
  var pager = document.getElementById('pager');
  var navEl = document.getElementById('nav');

  /* ---------------------------------------------------------- boot */

  function boot() {
    setupTheme();
    setupNav();
    setupSearch();

    fetch('content/manifest.json')
      .then(function (r) {
        if (!r.ok) throw new Error('manifest.json ' + r.status);
        return r.json();
      })
      .then(function (json) {
        manifest = json;
        chapters = [];
        json.parts.forEach(function (part) {
          part.chapters.forEach(function (ch) {
            ch.part = part;
            chapters.push(ch);
            bySlug[ch.slug] = ch;
          });
        });
        renderNav();
        window.addEventListener('hashchange', route);
        window.addEventListener('progress:change', function () {
          updateProgressCard();
          markNavRead();
        });
        route();
      })
      .catch(function (err) {
        view.innerHTML =
          '<div class="empty"><div class="empty-icon">⚠️</div>' +
          '<p><strong>Could not load the course.</strong></p>' +
          '<p>' + escapeHtml(err.message) + '</p>' +
          '<p>If you opened this file directly from disk, the browser blocks the requests ' +
          'this page makes. Serve the folder instead:</p>' +
          '<pre><code>python3 -m http.server 8000</code></pre>' +
          '<p>then open <code>http://localhost:8000</code>.</p></div>';
      });
  }

  /* ---------------------------------------------------------- theme */

  function setupTheme() {
    var saved = localStorage.getItem('lecarnet.theme');
    if (saved) document.documentElement.dataset.theme = saved;
    document.getElementById('themeBtn').addEventListener('click', function () {
      var cur = document.documentElement.dataset.theme;
      if (!cur) {
        cur = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      var next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('lecarnet.theme', next);
    });
  }

  /* ---------------------------------------------------------- nav */

  function setupNav() {
    var btn = document.getElementById('menuBtn');
    var scrim = document.getElementById('scrim');
    function close() {
      document.body.classList.remove('nav-open');
      btn.setAttribute('aria-expanded', 'false');
    }
    btn.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded', String(open));
    });
    scrim.addEventListener('click', close);
    navEl.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  function renderNav() {
    var html =
      '<a class="nav-link nav-meta" href="#/"><span>Start here</span></a>' +
      '<a class="nav-link nav-meta" href="#/dashboard"><span>Progress</span></a>' +
      '<a class="nav-link nav-meta" href="#/vocab"><span>Vocabulary</span></a>' +
      '<a class="nav-link nav-meta" href="#/cards"><span>Flashcards</span></a>';

    manifest.parts.forEach(function (part) {
      html += '<div class="nav-part"><span class="nav-part-n">' + escapeHtml(part.numeral) + '</span>' +
              escapeHtml(part.title) + '</div>';
      part.chapters.forEach(function (ch, i) {
        html += '<a class="nav-link" href="#/' + ch.slug + '" data-slug="' + ch.slug + '">' +
                '<span class="tick" aria-hidden="true"></span>' +
                '<span class="nav-num">' + (i + 1) + '</span>' +
                '<span>' + escapeHtml(ch.title) + '</span></a>';
      });
    });
    navEl.innerHTML = html;
    markNavRead();
    updateProgressCard();
  }

  function markNavRead() {
    navEl.querySelectorAll('a[data-slug]').forEach(function (a) {
      a.classList.toggle('is-read', Progress.isRead(a.dataset.slug));
    });
  }

  function setCurrentNav(slug) {
    navEl.querySelectorAll('a').forEach(function (a) {
      a.classList.toggle('is-current', a.getAttribute('href') === '#/' + slug);
    });
  }

  function updateProgressCard() {
    var total = chapters.length || 1;
    var read = chapters.filter(function (c) { return Progress.isRead(c.slug); }).length;
    var pct = Math.round((read / total) * 100);
    var ring = document.getElementById('progressRing');
    var circ = 2 * Math.PI * 19;
    ring.style.strokeDasharray = circ;
    ring.style.strokeDashoffset = circ * (1 - pct / 100);
    document.getElementById('progressPct').textContent = pct + '%';
    document.getElementById('progressText').textContent =
      read + ' of ' + total + ' lessons read';
  }

  /* ---------------------------------------------------------- routing */

  function route() {
    var hash = location.hash.replace(/^#\/?/, '');
    closeSearch();
    Quiz.endSession();
    window.scrollTo(0, 0);
    document.getElementById('main').focus({ preventScroll: true });

    if (!hash) return renderHome();
    if (hash === 'dashboard') return renderDashboard();
    if (hash === 'vocab') return renderVocabPage();
    if (hash === 'cards') return renderDeckList();
    if (hash.indexOf('cards/') === 0) return renderDeck(hash.slice(6));
    return renderChapter(hash);
  }

  /* ---------------------------------------------------------- chapter */

  function fetchChapter(ch) {
    if (cache[ch.slug]) return Promise.resolve(cache[ch.slug]);
    return fetch('content/' + ch.file)
      .then(function (r) {
        if (!r.ok) throw new Error(ch.file + ' — ' + r.status);
        return r.text();
      })
      .then(function (text) { cache[ch.slug] = text; return text; });
  }

  function renderChapter(slug) {
    var ch = bySlug[slug];
    if (!ch) {
      view.innerHTML = '<div class="empty"><div class="empty-icon">🤷</div>' +
        '<p>No lesson called <code>' + escapeHtml(slug) + '</code>.</p>' +
        '<p><a href="#/">Back to the start</a></p></div>';
      pager.innerHTML = '';
      return;
    }

    setCurrentNav(slug);
    view.innerHTML = '<div class="loading">Loading…</div>';

    fetchChapter(ch).then(function (md) {
      var doc = MD.frontMatter(md);
      var idx = chapters.indexOf(ch);

      var head = '<div class="eyebrow">' +
        '<span>' + escapeHtml(ch.part.numeral) + ' · ' + escapeHtml(ch.part.title) + '</span>' +
        (ch.level ? '<span class="dot"></span><span class="pill pill-' + ch.level.toLowerCase() + '">' +
          escapeHtml(ch.level) + '</span>' : '') +
        '</div>';

      view.innerHTML = head + MD.render(doc.body);

      Quiz.bindExercises(view, slug);
      Vocab.hydrateEmbeds(view);
      renderDoneBar(ch);
      renderPager(idx);
    }).catch(function (err) {
      view.innerHTML = '<div class="empty"><div class="empty-icon">⚠️</div><p>' +
        escapeHtml(err.message) + '</p></div>';
    });
  }

  function renderDoneBar(ch) {
    var bar = document.createElement('div');
    bar.className = 'chapter-done';
    function paint() {
      var done = Progress.isRead(ch.slug);
      bar.classList.toggle('is-done', done);
      bar.innerHTML = '<p>' + (done ? 'Marked as read.' : 'Finished this lesson?') + '</p>' +
        '<button class="btn ' + (done ? '' : 'btn-primary') + '">' +
        (done ? 'Mark as unread' : 'Mark as read') + '</button>';
      bar.querySelector('button').addEventListener('click', function () {
        Progress.toggleRead(ch.slug);
        paint();
      });
    }
    paint();
    view.appendChild(bar);
  }

  function renderPager(idx) {
    var prev = chapters[idx - 1], next = chapters[idx + 1];
    var html = '';
    if (prev) {
      html += '<a class="prev" href="#/' + prev.slug + '">' +
        '<span class="pager-dir">← Previous</span>' +
        '<span class="pager-title">' + escapeHtml(prev.title) + '</span></a>';
    }
    if (next) {
      html += '<a class="next" href="#/' + next.slug + '">' +
        '<span class="pager-dir">Next →</span>' +
        '<span class="pager-title">' + escapeHtml(next.title) + '</span></a>';
    }
    pager.innerHTML = html;
  }

  /* ---------------------------------------------------------- home */

  function renderHome() {
    setCurrentNav('');
    pager.innerHTML = '';
    var read = chapters.filter(function (c) { return Progress.isRead(c.slug); }).length;
    var nextCh = chapters.find(function (c) { return !Progress.isRead(c.slug); }) || chapters[0];

    var html =
      '<div class="eyebrow"><span>A course I built for myself</span></div>' +
      '<h1>' + escapeHtml(manifest.title) + '</h1>' +
      '<p class="lead">' + escapeHtml(manifest.subtitle) + '</p>' +
      '<div class="cards">' +
        card('#/' + nextCh.slug, '▶', read ? 'Continue' : 'Start reading', nextCh.title) +
        card('#/vocab', '📖', 'Vocabulary', '1,493 words, searchable and filterable by theme') +
        card('#/cards', '🗂', 'Flashcards', 'Spaced repetition across every theme') +
        card('#/dashboard', '📊', 'Progress', 'What you have read, learned and still owe') +
      '</div>';

    manifest.parts.forEach(function (part) {
      html += '<h2>' + escapeHtml(part.numeral) + ' — ' + escapeHtml(part.title) + '</h2>' +
              '<p>' + escapeHtml(part.blurb) + '</p><div class="toc"><ol>';
      part.chapters.forEach(function (ch) {
        html += '<li><a href="#/' + ch.slug + '">' + escapeHtml(ch.title) + '</a></li>';
      });
      html += '</ol></div>';
    });

    view.innerHTML = html;
  }

  function card(href, icon, title, body) {
    return '<a class="card" href="' + href + '">' +
      '<div class="card-icon" aria-hidden="true">' + icon + '</div>' +
      '<h3>' + escapeHtml(title) + '</h3><p>' + escapeHtml(body) + '</p></a>';
  }

  /* ---------------------------------------------------------- dashboard */

  function renderDashboard() {
    setCurrentNav('dashboard');
    pager.innerHTML = '';

    Vocab.load().then(function () {
      var total = chapters.length;
      var read = chapters.filter(function (c) { return Progress.isRead(c.slug); }).length;
      var words = Vocab.all();
      var allCards = [];
      Vocab.decks().forEach(function (d) {
        if (d.id === 'all-fr') allCards = d.cards;
      });
      var ids = allCards.map(function (c) { return c.id; });
      var stats = Progress.cardStats(ids);
      var due = Progress.dueCount(ids);

      var html =
        '<h1>Progress</h1>' +
        '<p class="lead">Everything here lives in this browser only. Nothing is uploaded.</p>' +
        '<div class="stat-grid">' +
          stat(read + '<span style="font-size:1rem;color:var(--muted)"> / ' + total + '</span>', 'Lessons read', 'accent') +
          stat(Progress.knownCount(), 'Words marked known', 'good') +
          stat(due, 'Cards due now', due ? 'warn' : '') +
          stat(Progress.streak(), 'Day streak', '') +
        '</div>';

      html += '<h2>By part</h2>';
      manifest.parts.forEach(function (part) {
        var n = part.chapters.filter(function (c) { return Progress.isRead(c.slug); }).length;
        var pct = Math.round((n / part.chapters.length) * 100);
        html += '<h3>' + escapeHtml(part.numeral) + ' — ' + escapeHtml(part.title) + '</h3>' +
          '<p style="margin-bottom:.3rem;color:var(--muted);font-size:.88rem">' +
          n + ' of ' + part.chapters.length + ' lessons · ' + pct + '%</p>' +
          '<div class="bar"><span style="width:' + pct + '%"></span></div>';
      });

      html += '<h2>Flashcards</h2>' +
        '<div class="stat-grid">' +
          stat(stats.learned, 'Learned (box 4+)', 'good') +
          stat(stats.learning, 'Still learning', '') +
          stat(stats.fresh, 'Not started yet', '') +
          stat(Progress.reviewsToday(), 'Reviews today', 'accent') +
        '</div>' +
        '<p><a class="btn btn-primary btn-lg" href="#/cards" style="display:inline-block;text-decoration:none">Go to the decks</a></p>';

      html += '<h2>Vocabulary</h2><p>' + words.length + ' words in the list. ' +
        Progress.knownCount() + ' marked as known.</p>' +
        '<div class="bar"><span style="width:' +
        Math.round((Progress.knownCount() / words.length) * 100) + '%"></span></div>';

      html += '<h2>Your data</h2>' +
        '<p>Progress is stored under the key <code>lecarnet.v1</code> in this browser. ' +
        'Export it if you want to move to another machine.</p>' +
        '<p><button class="btn" id="exportBtn">Export progress</button> ' +
        '<button class="btn" id="importBtn">Import progress</button> ' +
        '<button class="btn btn-again" id="resetBtn">Reset everything</button></p>' +
        '<input type="file" id="importFile" accept="application/json" hidden>';

      view.innerHTML = html;

      document.getElementById('exportBtn').addEventListener('click', function () {
        var blob = new Blob([Progress.exportJSON()], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'le-carnet-progress.json';
        a.click();
        URL.revokeObjectURL(a.href);
      });
      var file = document.getElementById('importFile');
      document.getElementById('importBtn').addEventListener('click', function () { file.click(); });
      file.addEventListener('change', function () {
        var f = file.files[0];
        if (!f) return;
        f.text().then(function (t) {
          try { Progress.importJSON(t); renderDashboard(); }
          catch (e) { alert('That file could not be read: ' + e.message); }
        });
      });
      document.getElementById('resetBtn').addEventListener('click', function () {
        if (confirm('Erase all progress, scores and flashcard scheduling?')) {
          Progress.reset();
          renderDashboard();
        }
      });
    });
  }

  function stat(num, label, kind) {
    return '<div class="stat ' + (kind || '') + '">' +
      '<div class="stat-num">' + num + '</div>' +
      '<div class="stat-label">' + escapeHtml(label) + '</div></div>';
  }

  /* ---------------------------------------------------------- vocabulary */

  function renderVocabPage() {
    setCurrentNav('vocab');
    pager.innerHTML = '';
    view.innerHTML = '<div class="loading">Loading vocabulary…</div>';

    Vocab.load().then(function () {
      var themeOpts = ['<option value="all">All themes</option>'].concat(
        Vocab.themes().map(function (t) {
          return '<option value="' + t + '">' + t.charAt(0).toUpperCase() + t.slice(1) + '</option>';
        })).join('');
      var posOpts = ['<option value="all">Any type</option>'].concat(
        Object.keys(Vocab.POS_LABEL).map(function (p) {
          return '<option value="' + p + '">' + Vocab.POS_LABEL[p] + '</option>';
        })).join('');

      view.innerHTML =
        '<h1>Vocabulary</h1>' +
        '<p class="lead">' + Vocab.all().length + ' words from my own list, with gender and theme. ' +
        'Tick a word once you are sure of it.</p>' +
        '<div class="vocab-toolbar">' +
          '<input type="search" id="vq" placeholder="Search French or English…" autocomplete="off">' +
          '<select id="vtheme">' + themeOpts + '</select>' +
          '<select id="vpos">' + posOpts + '</select>' +
          '<select id="vstatus">' +
            '<option value="all">All</option>' +
            '<option value="unknown">Not yet known</option>' +
            '<option value="known">Known</option>' +
          '</select>' +
          '<span class="vocab-count" id="vcount"></span>' +
        '</div>' +
        '<div id="vlist"></div>';

      var q = document.getElementById('vq');
      var theme = document.getElementById('vtheme');
      var pos = document.getElementById('vpos');
      var status = document.getElementById('vstatus');
      var list = document.getElementById('vlist');
      var count = document.getElementById('vcount');

      function refresh() {
        var words = Vocab.search(q.value, {
          theme: theme.value, pos: pos.value, status: status.value
        });
        // Long lists stay responsive if we only paint the first slice.
        var shown = words.slice(0, 400);
        list.innerHTML = Vocab.listHtml(shown) +
          (words.length > shown.length
            ? '<p style="text-align:center;color:var(--muted);font-size:.85rem;margin-top:1rem">' +
              'Showing the first ' + shown.length + ' of ' + words.length + ' — narrow the search to see the rest.</p>'
            : '');
        count.textContent = words.length + ' word' + (words.length === 1 ? '' : 's');
      }

      [q, theme, pos, status].forEach(function (el) {
        el.addEventListener('input', refresh);
      });
      Vocab.bindList(list);
      refresh();
    });
  }

  /* ---------------------------------------------------------- flashcards */

  function renderDeckList() {
    setCurrentNav('cards');
    pager.innerHTML = '';
    view.innerHTML = '<div class="loading">Loading decks…</div>';

    Vocab.load().then(function () {
      var html = '<h1>Flashcards</h1>' +
        '<p class="lead">Leitner spaced repetition: a card you get right moves up a box and comes ' +
        'back later (1, 2, 5, 10, 21, then 45 days). Get it wrong and it drops back to daily.</p>' +
        '<div class="deck-grid">';

      Vocab.decks().forEach(function (d) {
        var ids = d.cards.map(function (c) { return c.id; });
        var due = Progress.dueCount(ids);
        var s = Progress.cardStats(ids);
        html += '<button class="deck" data-deck="' + d.id + '">' +
          '<div class="deck-name">' + escapeHtml(d.name) + '</div>' +
          '<div class="deck-meta">' + d.size + ' cards · ' + s.learned + ' learned</div>' +
          '<div class="deck-meta ' + (due ? 'deck-due' : '') + '">' +
            (due ? due + ' due now' : 'nothing due') + '</div>' +
          '</button>';
      });
      view.innerHTML = html + '</div>';

      view.addEventListener('click', function (e) {
        var b = e.target.closest('[data-deck]');
        if (b) location.hash = '#/cards/' + b.dataset.deck;
      });
    });
  }

  function renderDeck(id) {
    setCurrentNav('cards');
    pager.innerHTML = '';
    view.innerHTML = '<div class="loading">Loading…</div>';

    Vocab.load().then(function () {
      var d = Vocab.deckById(id);
      if (!d) {
        view.innerHTML = '<div class="empty"><p>No deck called <code>' + escapeHtml(id) + '</code>.</p>' +
          '<p><a href="#/cards">Back to the decks</a></p></div>';
        return;
      }
      view.innerHTML =
        '<div class="eyebrow"><a href="#/cards" style="color:inherit;text-decoration:none">← All decks</a></div>' +
        '<h1>' + escapeHtml(d.name) + '</h1>' +
        '<div id="stage"></div>';
      Quiz.startSession(document.getElementById('stage'), d.cards, { limit: 25 });
    });
  }

  /* ---------------------------------------------------------- search */

  function setupSearch() {
    var input = document.getElementById('globalSearch');
    var results = document.getElementById('searchResults');
    var timer = null;

    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
        e.preventDefault();
        input.focus();
        input.select();
      }
    });

    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { runSearch(input.value, results); }, 120);
    });
    input.addEventListener('focus', function () {
      if (input.value.trim()) runSearch(input.value, results);
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.topbar-search')) closeSearch();
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { input.blur(); closeSearch(); }
      if (e.key === 'Enter') {
        var first = results.querySelector('a');
        if (first) { location.hash = first.getAttribute('href'); input.blur(); closeSearch(); }
      }
    });
  }

  function closeSearch() {
    var r = document.getElementById('searchResults');
    if (r) { r.hidden = true; r.innerHTML = ''; }
  }

  // Lessons are indexed on first use, so the initial page load stays cheap.
  function buildSearchIndex() {
    if (searchIndex) return Promise.resolve(searchIndex);
    return Promise.all(chapters.map(function (ch) {
      return fetchChapter(ch)
        .then(function (md) {
          return {
            ch: ch,
            text: MD.plain(MD.frontMatter(md).body).toLowerCase(),
            headings: MD.headings(md)
          };
        })
        .catch(function () { return { ch: ch, text: '', headings: [] }; });
    })).then(function (docs) { searchIndex = docs; return docs; });
  }

  function runSearch(query, results) {
    var q = query.trim().toLowerCase();
    if (q.length < 2) { closeSearch(); return; }
    results.hidden = false;
    results.innerHTML = '<div class="sr-empty">Searching…</div>';

    Promise.all([buildSearchIndex(), Vocab.load()]).then(function () {
      var html = '';

      var lessons = [];
      searchIndex.forEach(function (doc) {
        var at = doc.text.indexOf(q);
        var titleHit = doc.ch.title.toLowerCase().indexOf(q) !== -1;
        if (at === -1 && !titleHit) return;
        lessons.push({
          ch: doc.ch,
          score: (titleHit ? 0 : 1000) + (at === -1 ? 0 : at),
          excerpt: at === -1 ? doc.ch.summary || '' : snippet(doc.text, at, q.length)
        });
      });
      lessons.sort(function (a, b) { return a.score - b.score; });

      if (lessons.length) {
        html += '<div class="sr-group">Lessons</div>';
        lessons.slice(0, 6).forEach(function (r) {
          html += '<a href="#/' + r.ch.slug + '">' +
            '<span class="sr-title">' + escapeHtml(r.ch.title) + '</span>' +
            '<span class="sr-sub">' + highlight(r.excerpt, q) + '</span></a>';
        });
      }

      var words = Vocab.search(q, {}).slice(0, 6);
      if (words.length) {
        html += '<div class="sr-group">Vocabulary</div>';
        words.forEach(function (w) {
          html += '<a href="#/vocab">' +
            '<span class="sr-title">' + highlight(w.fr, q) +
            (w.g ? ' <span class="sr-sub">(' + Vocab.GENDER_LABEL[w.g] + ')</span>' : '') + '</span>' +
            '<span class="sr-sub">' + highlight(w.en, q) + '</span></a>';
        });
      }

      results.innerHTML = html || '<div class="sr-empty">Nothing found for “' + escapeHtml(query) + '”.</div>';
    });
  }

  function snippet(text, at, len) {
    var start = Math.max(0, at - 40);
    return (start ? '…' : '') + text.slice(start, at + len + 60).trim() + '…';
  }

  function highlight(text, q) {
    var safe = escapeHtml(String(text));
    if (!q) return safe;
    var i = safe.toLowerCase().indexOf(q);
    if (i === -1) return safe;
    return safe.slice(0, i) + '<mark>' + safe.slice(i, i + q.length) + '</mark>' + safe.slice(i + q.length);
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  boot();
})();
