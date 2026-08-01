/* ============================================================
   app.js — routing, navigation, search and the non-lesson pages.

   Routes
     #/                  home
     #/dashboard         progress overview
     #/vocab             vocabulary browser
     #/cards             deck list
     #/cards/<deckId>    review session
     #/tests             every chapter and part test
     #/test/<slug>       one chapter's test
     #/test/part-<n>     a whole-part exam
     #/read              reading passages
     #/read/<id>         one passage
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
    setupQuickAdd();
    Say.setup();

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
        // A sync can change everything the dashboard is showing.
        window.addEventListener('sync:status', function () {
          if (location.hash.replace(/^#\/?/, '') === 'dashboard') renderSyncCard();
        });
        window.addEventListener('sync:done', function () {
          if (location.hash.replace(/^#\/?/, '') === 'dashboard') renderDashboard();
        });
        route();
        Sync.setup();
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
      '<a class="nav-link nav-meta" href="#/cards"><span>Flashcards</span></a>' +
      '<a class="nav-link nav-meta" href="#/tests"><span>Tests</span></a>' +
      '<a class="nav-link nav-meta" href="#/read"><span>Reading</span></a>';

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
      // Read and understood are different things, so they get different marks.
      var level = Progress.mastery(a.dataset.slug).level;
      a.classList.toggle('is-shaky', level === 1);
      a.classList.toggle('is-solid', level === 2);
    });
  }

  function setCurrentNav(slug) {
    navEl.querySelectorAll('a').forEach(function (a) {
      a.classList.toggle('is-current', a.getAttribute('href') === '#/' + slug);
    });
  }

  var renderSidebarProgress = function () { markNavRead(); updateProgressCard(); };

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
    Test.stop();
    window.scrollTo(0, 0);
    document.getElementById('main').focus({ preventScroll: true });

    if (!hash) return renderHome();
    if (hash === 'dashboard') return renderDashboard();
    if (hash === 'vocab') return renderVocabPage();
    if (hash === 'cards') return renderDeckList();
    if (hash.indexOf('cards/') === 0) return renderDeck(hash.slice(6));
    if (hash === 'tests') return renderTestList();
    if (hash.indexOf('test/') === 0) return renderTest(hash.slice(5));
    if (hash === 'read') return renderReadList();
    if (hash.indexOf('read/') === 0) return renderPassage(hash.slice(5));
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
      Say.hydrate(view);
      Vocab.hydrateEmbeds(view).then(function () { Say.hydrate(view); });
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
    function paint(hasTest) {
      var done = Progress.isRead(ch.slug);
      var m = Progress.mastery(ch.slug);
      bar.classList.toggle('is-done', done);
      bar.innerHTML = '<p>' +
          (m.level ? 'You marked this <strong>' + LEVEL_LABEL[m.level].toLowerCase() + '</strong>.'
                   : done ? 'Marked as read.' : 'Finished this lesson?') +
        '</p>' +
        (hasTest ? '<a class="btn btn-primary" href="#/test/' + ch.slug + '">Test yourself</a>' : '') +
        '<button class="btn ' + (done || hasTest ? '' : 'btn-primary') + '">' +
        (done ? 'Mark as unread' : 'Mark as read') + '</button>';
      bar.querySelector('button').addEventListener('click', function () {
        Progress.toggleRead(ch.slug);
        paint(hasTest);
      });
    }
    paint(false);
    view.appendChild(bar);
    // Drawn without the test button first, so the lesson never waits on it.
    Test.loadChapter(ch).then(function (bank) { if (bank) paint(true); });
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
        card('#/tests', '📝', 'Tests', 'A drill per chapter, an exam per part, marked by you') +
        card('#/read', '📕', 'Reading', 'Passages to read, hear, and read back out loud') +
        card('#/vocab', '📖', 'Vocabulary', 'Searchable and filterable, and you can add your own') +
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
      // Every card id from every deck, deduplicated. Counting only the
      // FR → EN deck used to hide all of a session spent on EN → FR: the
      // two directions are separate cards with separate schedules.
      var seen = Object.create(null);
      Vocab.decks().forEach(function (d) {
        d.cards.forEach(function (c) { seen[c.id] = 1; });
      });
      var ids = Object.keys(seen);
      var stats = Progress.cardStats(ids);
      var due = Progress.dueCount(ids);

      var html =
        '<h1>Progress</h1>' +
        '<p class="lead">' + (Sync.connected()
          ? 'Kept in this browser and mirrored to your private gist.'
          : 'Everything here lives in this browser only. Nothing is uploaded.') + '</p>' +
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

      html += '<h2>What you have understood</h2>' +
        '<p>Reading a lesson and understanding it are tracked separately. ' +
        'These are the marks you gave yourself after a test.</p>' +
        '<div class="stat-grid">' +
          stat(Progress.masteryCount(2), 'Marked confident', 'good') +
          stat(Progress.masteryCount(1) - Progress.masteryCount(2), 'Marked shaky', 'warn') +
        '</div>';

      manifest.parts.forEach(function (part, pi) {
        if (part.reference) return;
        var solid = part.chapters.filter(function (c) { return Progress.mastery(c.slug).level === 2; }).length;
        var shaky = part.chapters.filter(function (c) { return Progress.mastery(c.slug).level === 1; }).length;
        var exam = Progress.testScore('part-' + (pi + 1));
        html += '<p style="margin:.7rem 0 .3rem"><strong>' + escapeHtml(part.numeral) + '</strong> — ' +
          solid + ' confident, ' + shaky + ' shaky, of ' + part.chapters.length + ' chapters' +
          (exam.runs ? ' · exam best ' + exam.best + '%' : '') + '</p>' +
          '<div class="bar"><span style="width:' +
          Math.round((solid / part.chapters.length) * 100) + '%"></span></div>';
      });
      html += '<p><a class="btn btn-primary btn-lg" href="#/tests" ' +
        'style="display:inline-block;text-decoration:none">Go to the tests</a></p>';

      html += '<h2>Flashcards</h2>' +
        '<p>Each word is two cards, French to English and back, scheduled ' +
        'separately. <strong>Got right</strong> counts every card you have ever ' +
        'answered correctly. <strong>Stuck</strong> is the stricter claim: still ' +
        'right after four reviews spread over at least a fortnight, which is what ' +
        'the boxes are for. The first number moves today; the second is the one ' +
        'that means you will still know the word next month.</p>' +
        '<div class="stat-grid">' +
          stat(stats.right, 'Got right at least once', stats.right ? 'accent' : '') +
          stat(stats.learned, 'Stuck (box 4+)', 'good') +
          stat(stats.fresh, 'Never seen', '') +
          stat(Progress.reviewsToday(), 'Reviews today', 'accent') +
        '</div>' +
        '<p><a class="btn btn-primary btn-lg" href="#/cards" style="display:inline-block;text-decoration:none">Go to the decks</a></p>';

      html += '<h2>Vocabulary</h2><p>' + words.length + ' words in the list' +
        (Vocab.mine().length ? ', ' + Vocab.mine().length + ' of them yours' : '') + '. ' +
        Progress.knownCount() + ' marked as known.</p>' +
        '<div class="bar"><span style="width:' +
        Math.round((Progress.knownCount() / words.length) * 100) + '%"></span></div>';

      html += '<h2>Sync across devices</h2><div id="syncCard"></div>';

      html += '<h2>Your data</h2>' +
        '<p>Progress is stored under the key <code>lecarnet.v1</code> in this browser. ' +
        'Export it if you want to move to another machine.</p>' +
        '<p><button class="btn" id="exportBtn">Export progress</button> ' +
        '<button class="btn" id="importBtn">Import progress</button> ' +
        '<button class="btn btn-again" id="resetBtn">Reset everything</button></p>' +
        '<input type="file" id="importFile" accept="application/json" hidden>';

      view.innerHTML = html;
      renderSyncCard();

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

  /* ---------------------------------------------------------- sync card */

  var TOKEN_URL = 'https://github.com/settings/tokens/new?scopes=gist&description=Le%20Carnet';

  function renderSyncCard() {
    var host = document.getElementById('syncCard');
    if (!host) return;
    var s = Sync.info();

    if (!s.connected) {
      host.innerHTML =
        '<p>The course keeps your progress in the browser, which is why the phone and the ' +
        'laptop each start from zero. Point both at one private GitHub gist and they stay in ' +
        'step: whichever device studied last wins, entry by entry, so neither session is lost.</p>' +
        '<ol class="sync-steps">' +
          '<li><a href="' + TOKEN_URL + '" target="_blank" rel="noopener">Create a token</a> with the ' +
            '<strong>gist</strong> scope ticked and nothing else.</li>' +
          '<li>Paste it here. It is stored in this browser and sent only to api.github.com.</li>' +
          '<li>Repeat on your other device — the same gist is found automatically.</li>' +
        '</ol>' +
        '<p class="sync-note">The gist is private, so the progress can only be read or ' +
        'changed by something holding this token. Note that a <code>gist</code>-scoped token ' +
        'covers <em>all</em> your gists, not just this one: keep the expiry short-ish, and ' +
        'revoke it on GitHub if a device goes missing.</p>' +
        '<div class="sync-form">' +
          '<input type="password" id="syncToken" placeholder="ghp_… or github_pat_…" autocomplete="off" spellcheck="false">' +
          '<button class="btn btn-primary" id="syncConnect">Connect</button>' +
        '</div>' +
        '<p class="sync-note" id="syncMsg"></p>';

      var input = document.getElementById('syncToken');
      var msg = document.getElementById('syncMsg');
      var go = function () {
        var token = input.value;
        input.value = '';
        msg.textContent = 'Connecting…';
        Sync.connect(token)
          .then(function () { renderDashboard(); })
          .catch(function (err) { msg.textContent = err.message; });
      };
      document.getElementById('syncConnect').addEventListener('click', go);
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
      return;
    }

    var label = { ok: 'In sync', idle: 'Connected', syncing: 'Syncing…', error: 'Sync failed', off: 'Off' };
    host.innerHTML =
      '<p class="sync-state sync-' + s.status.state + '">' +
        '<span class="sync-dot"></span>' + (label[s.status.state] || 'Connected') +
        (s.lastSync ? ' · last synced ' + timeAgo(s.lastSync) : '') +
      '</p>' +
      (s.status.state === 'error' ? '<p class="sync-note">' + escapeHtml(s.status.message) + '</p>' : '') +
      '<p>Progress is mirrored to the private gist ' +
        '<a href="https://gist.github.com/' + escapeHtml(s.gistId) + '" target="_blank" rel="noopener">' +
        escapeHtml(s.gistId.slice(0, 8)) + '…</a>, on load and a few seconds after anything changes.</p>' +
      '<p><button class="btn" id="syncNow">Sync now</button> ' +
      '<button class="btn" id="syncOff">Disconnect this device</button></p>' +
      '<p class="sync-note">Disconnecting forgets the token here. The gist and your progress stay.</p>';

    document.getElementById('syncNow').addEventListener('click', function () {
      Sync.syncNow().then(function () { renderDashboard(); });
    });
    document.getElementById('syncOff').addEventListener('click', function () {
      Sync.disconnect();
      renderDashboard();
    });
  }

  function timeAgo(ts) {
    var s = Math.round((Date.now() - ts) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return Math.round(s / 60) + ' min ago';
    if (s < 86400) return Math.round(s / 3600) + ' h ago';
    return Math.round(s / 86400) + ' days ago';
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
        '<p class="lead">' + Vocab.all().length + ' words, with gender and theme — ' +
        Vocab.mine().length + ' of them added by you. Tap the <span class="v-know-demo">✓</span> ' +
        'at the left of a row when you know a word; it turns green and counts on the ' +
        '<a href="#/dashboard">Progress</a> page. Use <em>Not yet known</em> to hide the ones ' +
        'you have already ticked.</p>' +
        '<div class="vocab-toolbar">' +
          '<input type="search" id="vq" placeholder="Search French or English…" autocomplete="off">' +
          '<select id="vtheme">' + themeOpts + '</select>' +
          '<select id="vpos">' + posOpts + '</select>' +
          '<select id="vstatus">' +
            '<option value="all">All</option>' +
            '<option value="unknown">Not yet known</option>' +
            '<option value="known">Known</option>' +
            '<option value="mine">My words</option>' +
          '</select>' +
          '<button class="btn btn-primary" id="vadd">+ Add word</button>' +
          '<span class="vocab-count" id="vcount"></span>' +
        '</div>' +
        '<div id="vform"></div>' +
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
        Say.hydrate(list);
      }

      [q, theme, pos, status].forEach(function (el) {
        el.addEventListener('input', refresh);
      });
      Vocab.bindList(list);

      var form = new WordForm(document.getElementById('vform'), function () {
        // A new word changes the counts and the theme list, so the whole
        // page is cheaper to redraw than to patch.
        renderVocabPage();
      });
      document.getElementById('vadd').addEventListener('click', function () { form.open(null); });
      list.addEventListener('vocab:edit', function (e) { form.open(e.detail.id); });

      refresh();
    });
  }

  /* ---------------------------------------------------------- add a word */

  // One panel, three jobs: add, edit, and paste a whole list. Kept small
  // enough to use one-handed, because words turn up away from the desk.
  function WordForm(host, onChange) {
    var editing = null;
    var dirty = false;      // words were added while the panel stayed open

    function close() {
      host.innerHTML = '';
      if (dirty) { dirty = false; onChange(); }
    }

    function open(id) {
      editing = id || null;
      var w = editing ? Progress.getWord(editing) : null;
      if (editing && !w) return;

      host.innerHTML =
        '<div class="word-form">' +
          '<div class="word-form-head">' +
            '<strong>' + (editing ? 'Edit word' : 'Add a word') + '</strong>' +
            '<button class="btn btn-sm" data-act="bulk">Paste a list</button>' +
            '<button class="btn btn-sm" data-act="close" aria-label="Close">✕</button>' +
          '</div>' +
          '<div class="word-fields">' +
            '<label>French<input id="wfr" value="' + escapeAttr(w ? w.fr : '') +
              '" placeholder="le brouillard" autocomplete="off" spellcheck="false"></label>' +
            '<label>English<input id="wen" value="' + escapeAttr(w ? w.en : '') +
              '" placeholder="fog" autocomplete="off"></label>' +
          '</div>' +
          '<details class="word-more word-help">' +
            '<summary>How to write the French side</summary>' +
            '<ul class="word-help-list">' +
              '<li><code>le brouillard</code> a noun keeps its article: that is how the ' +
                'gender gets recorded</li>' +
              '<li><code>ancien/ne</code> an adjective is masculine first, then the ' +
                '<em>feminine ending only</em></li>' +
              '<li><code>noir/e/s</code> add a third piece for the plural ending</li>' +
              '<li><code>le/la bénévole</code> one noun that takes either gender</li>' +
              '<li><code>éteindre</code> a verb is the infinitive; <code>se lever</code> if ' +
                'it is reflexive</li>' +
              '<li><code>avoir hâte de</code> a phrase, written as you would say it</li>' +
              '<li><code>vieux / vieille</code> spaces around the slash when both sides are ' +
                'whole words</li>' +
            '</ul>' +
            '<p class="word-help-note">The slash is always masculine first. Written that way, ' +
            '<code>ancien/ne</code> is read aloud as “ancien, ancienne”.</p>' +
          '</details>' +
          // Two fields are the whole job. Type, gender and theme are worked
          // out from the French, and a word with no theme lands in "mine",
          // which is a real deck you can revise from on its own.
          '<p class="word-auto" id="wauto"></p>' +
          '<details class="word-more"' + (editing ? ' open' : '') + '>' +
            '<summary>Change what it guessed</summary>' +
            '<div class="word-fields">' +
              '<label>Type<select id="wpos">' + posOptions(w ? w.pos : '', !editing) + '</select></label>' +
              '<label>Gender<select id="wg">' + genderOptions(w ? w.g : '') + '</select></label>' +
              '<label>Themes<input id="wth" value="' + escapeAttr(w ? w.themes.join(', ') : '') +
                '" placeholder="leave empty for “mine”" autocomplete="off"></label>' +
            '</div>' +
          '</details>' +
          '<p class="word-msg" id="wmsg" hidden></p>' +
          '<div class="word-actions">' +
            '<button class="btn btn-primary" data-act="save">' + (editing ? 'Save' : 'Add word') + '</button>' +
            (editing ? '<button class="btn btn-again" data-act="delete">Delete</button>' : '') +
          '</div>' +
        '</div>';

      var fr = host.querySelector('#wfr');
      var en = host.querySelector('#wen');
      var posSel = host.querySelector('#wpos');
      var gSel = host.querySelector('#wg');

      // Show the guess as it is typed, so nothing is decided behind your
      // back and there is no field to fill in when it is already right.
      if (!editing) {
        var auto = host.querySelector('#wauto');
        var show = function () {
          var g = Vocab.guess(fr.value);
          var th = host.querySelector('#wth').value.split(/[,\s]+/).filter(Boolean);
          if (!fr.value.trim()) { auto.textContent = ''; return; }
          auto.textContent = 'Filing it as ' + (Vocab.POS_LABEL[g.pos] || g.pos) +
            (g.g ? ', ' + { m: 'masculine', f: 'feminine', pl: 'plural', mf: 'either' }[g.g] : '') +
            ', theme ' + (th.length ? th.join(' · ') : 'mine') + '.';
        };
        fr.addEventListener('input', show);
        host.querySelector('#wth').addEventListener('input', show);
      }

      host.querySelector('.word-form').addEventListener('click', onClick);
      host.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); save(); }
        if (e.key === 'Escape') close();
      });
      fr.focus();
      host.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    function onClick(e) {
      var b = e.target.closest('[data-act]');
      if (!b) return;
      if (b.dataset.act === 'close') return close();
      if (b.dataset.act === 'bulk') return openBulk();
      if (b.dataset.act === 'save') return save();
      if (b.dataset.act === 'delete') return remove();
    }

    function msg(text, bad) {
      var el = host.querySelector('#wmsg');
      if (!el) return;
      el.textContent = text;
      el.hidden = !text;
      el.classList.toggle('is-bad', !!bad);
    }

    function save() {
      var input = {
        fr: host.querySelector('#wfr').value,
        en: host.querySelector('#wen').value,
        pos: host.querySelector('#wpos').value,
        g: host.querySelector('#wg').value,
        themes: host.querySelector('#wth').value.split(/[,\s]+/).filter(Boolean)
      };
      // An untouched Type or Gender means "you work it out".
      var guess = Vocab.guess(input.fr);
      if (!input.pos) input.pos = guess.pos;
      if (!input.g) input.g = guess.g;
      try {
        if (editing) {
          Progress.updateWord(editing, input);
        } else {
          var dupe = Progress.findWord(input.fr);
          if (dupe) return msg('You already added that one.', true);
          Progress.addWord(input);
        }
      } catch (err) {
        return msg(err.message, true);
      }
      close();
      onChange();
    }

    function remove() {
      if (!confirm('Delete this word? It disappears from your other devices too.')) return;
      Progress.deleteWord(editing);
      close();
      onChange();
    }

    function openBulk() {
      host.innerHTML =
        '<div class="word-form">' +
          '<div class="word-form-head">' +
            '<strong>Paste a list</strong>' +
            '<button class="btn btn-sm" data-act="close" aria-label="Close">✕</button>' +
          '</div>' +
          '<p class="sync-note">One word per line, <code>french - english</code>. A leading number is ' +
          'ignored, so a slice of <code>vocab-source.txt</code> pastes straight in. Duplicates are skipped.</p>' +
          '<textarea id="wbulk" rows="8" spellcheck="false" ' +
            'placeholder="le brouillard - fog&#10;éteindre - to switch off"></textarea>' +
          '<p class="word-msg" id="wmsg" hidden></p>' +
          '<div class="word-actions">' +
            '<button class="btn btn-primary" data-act="import">Add them</button>' +
            '<button class="btn" data-act="export">Copy my words out</button>' +
          '</div>' +
        '</div>';

      host.querySelector('.word-form').addEventListener('click', function (e) {
        var b = e.target.closest('[data-act]');
        if (!b) return;
        if (b.dataset.act === 'close') return close();
        if (b.dataset.act === 'export') {
          var text = Vocab.exportMine();
          if (!text) return msg('You have not added any words yet.', true);
          host.querySelector('#wbulk').value = text;
          return msg('Numbered from where vocab-source.txt left off. Copy, paste at the end of that ' +
            'file, then run tools/build-vocab.py to make them part of the curated list.');
        }
        var rows = Vocab.parseBulk(host.querySelector('#wbulk').value);
        if (!rows.length) return msg('Nothing there I could read as "french - english".', true);
        var added = 0, skipped = 0;
        rows.forEach(function (r) {
          if (Progress.findWord(r.fr)) { skipped++; return; }
          Progress.addWord(r);
          added++;
        });
        // Keep the panel open with the count rather than throwing up a
        // dialog: pasting several batches in a row is the normal case.
        // The page behind it redraws when the panel closes, because
        // redrawing now would tear this panel out of the document.
        dirty = true;
        host.querySelector('#wbulk').value = '';
        msg(added + ' added' + (skipped ? ', ' + skipped + ' already on your list' : '') + '.');
      });
    }

    return { open: open, close: close };
  }

  function posOptions(current, auto) {
    return (auto ? '<option value="" selected>work it out</option>' : '') +
      Object.keys(Vocab.POS_LABEL).map(function (p) {
      return '<option value="' + p + '"' + (p === current ? ' selected' : '') + '>' +
        Vocab.POS_LABEL[p] + '</option>';
    }).join('');
  }

  function genderOptions(current) {
    var opts = [['', '—'], ['m', 'masculine'], ['f', 'feminine'], ['pl', 'plural'], ['mf', 'either']];
    return opts.map(function (o) {
      return '<option value="' + o[0] + '"' + (o[0] === current ? ' selected' : '') + '>' + o[1] + '</option>';
    }).join('');
  }

  /* ---------------------------------------------------------- tests */

  var LEVEL_LABEL = ['Not yet', 'Shaky', 'Confident'];

  function renderTestList() {
    setCurrentNav('tests');
    pager.innerHTML = '';

    var html = '<h1>Tests</h1>' +
      '<p class="lead">A drill for each chapter, and a longer exam for each part. ' +
      'The score is automatic; whether you have actually got it is your call.</p>';

    manifest.parts.forEach(function (part, pi) {
      // Part IV is lookup tables. There is nothing there to be tested on.
      if (part.reference) return;
      var key = 'part-' + (pi + 1);
      var m = Progress.mastery(key);
      var score = Progress.testScore(key);
      html += '<h2>' + escapeHtml(part.numeral) + ' — ' + escapeHtml(part.title) + '</h2>' +
        '<p class="test-partline">' +
          '<a class="btn btn-primary" href="#/test/' + key + '">Take the ' + escapeHtml(part.numeral) + ' exam</a>' +
          (score.runs
            ? '<span class="test-best">best ' + score.best + '% over ' + score.runs +
              ' attempt' + (score.runs === 1 ? '' : 's') + '</span>'
            : '') +
          (m.level ? '<span class="mastery-tag lv' + m.level + '">' + LEVEL_LABEL[m.level] + '</span>' : '') +
        '</p>' +
        '<div class="test-grid">';

      part.chapters.forEach(function (ch) {
        var cm = Progress.mastery(ch.slug);
        var cs = Progress.testScore(ch.slug);
        html += '<a class="test-tile lv' + cm.level + '" href="#/test/' + ch.slug + '">' +
          '<span class="test-tile-name">' + escapeHtml(ch.title) + '</span>' +
          '<span class="test-tile-meta">' +
            (cs.runs ? 'best ' + cs.best + '%' : 'not taken') +
            (cm.level ? ' · ' + LEVEL_LABEL[cm.level] : '') +
          '</span></a>';
      });
      html += '</div>';
    });

    view.innerHTML = html;
  }

  function renderTest(key) {
    setCurrentNav('tests');
    pager.innerHTML = '';
    view.innerHTML = '<div class="loading">Loading the questions…</div>';

    var part = key.indexOf('part-') === 0 ? manifest.parts[Number(key.slice(5)) - 1] : null;
    if (part) return startPartTest(key, part);

    var ch = bySlug[key];
    if (!ch) return notFound(key);

    Test.loadChapter(ch).then(function (bank) {
      if (!bank) {
        return noBank(ch.title, 'There is no question bank for this chapter yet.');
      }
      runTest({
        id: ch.slug,
        title: ch.title,
        eyebrow: ch.part.numeral + ' · chapter test',
        back: '#/' + ch.slug,
        backLabel: 'Back to the lesson',
        questions: Test.shuffle(bank.questions),
        masteryKey: ch.slug
      });
    });
  }

  function startPartTest(key, part) {
    Test.loadPart(part).then(function (banks) {
      if (!banks.length) {
        return noBank(part.numeral, 'No chapter in this part has a question bank yet.');
      }
      // Two per chapter keeps a 22-chapter part to a sitting rather than a
      // marathon, while still touching everything.
      var questions = Test.sample(banks, 2);
      runTest({
        id: key,
        title: part.numeral + ' exam — ' + part.title,
        eyebrow: banks.length + ' chapters covered',
        back: '#/tests',
        backLabel: 'All tests',
        questions: questions,
        subtitle: 'part',
        masteryKey: key
      });
    });
  }

  function runTest(opts) {
    view.innerHTML =
      '<div class="eyebrow"><a href="' + opts.back + '" style="color:inherit;text-decoration:none">← ' +
        escapeHtml(opts.backLabel) + '</a><span class="dot"></span><span>' +
        escapeHtml(opts.eyebrow) + '</span></div>' +
      '<h1>' + escapeHtml(opts.title) + '</h1>' +
      '<div id="testHost"></div>';

    Test.start(document.getElementById('testHost'), {
      id: opts.id,
      title: opts.title,
      subtitle: opts.subtitle,
      masteryKey: opts.masteryKey,
      questions: opts.questions,
      onDone: function (r) {
        if (r.retry) return renderTest(opts.id);
        renderSidebarProgress();
      }
    });
  }

  function noBank(title, message) {
    view.innerHTML = '<h1>' + escapeHtml(title) + '</h1>' +
      '<div class="empty"><div class="empty-icon">📝</div><p>' + escapeHtml(message) + '</p>' +
      '<p><a href="#/tests">Back to the tests</a></p></div>';
  }

  function notFound(key) {
    view.innerHTML = '<div class="empty"><div class="empty-icon">🤷</div>' +
      '<p>No test called <code>' + escapeHtml(key) + '</code>.</p>' +
      '<p><a href="#/tests">All tests</a></p></div>';
  }

  /* ---------------------------------------------------------- reading */

  function renderReadList() {
    setCurrentNav('read');
    pager.innerHTML = '';
    view.innerHTML = '<div class="loading">Loading the passages…</div>';

    Promise.all([Read.loadIndex(), Vocab.load()]).then(function (r) {
      view.innerHTML =
        '<h1>Reading</h1>' +
        '<p class="lead">Passages that use only the grammar the course has covered by that level. ' +
        'Tap a line to hear it, tap a word for the meaning, then answer for what you understood ' +
        'and read a line back into the microphone.</p>' +
        Read.listHtml(r[0]);
    }).catch(function (err) {
      view.innerHTML = '<div class="empty"><div class="empty-icon">⚠️</div><p>' +
        escapeHtml(err.message) + '</p></div>';
    });
  }

  function renderPassage(id) {
    setCurrentNav('read');
    pager.innerHTML = '';
    view.innerHTML = '<div class="loading">Loading…</div>';

    Promise.all([Read.loadIndex(), Vocab.load()]).then(function () {
      var entry = Read.byId(id);
      if (!entry) {
        view.innerHTML = '<div class="empty"><div class="empty-icon">🤷</div>' +
          '<p>No passage called <code>' + escapeHtml(id) + '</code>.</p>' +
          '<p><a href="#/read">All passages</a></p></div>';
        return;
      }
      return Read.render(view, entry, { onRetry: function () { renderPassage(id); } });
    }).catch(function (err) {
      view.innerHTML = '<div class="empty"><div class="empty-icon">⚠️</div><p>' +
        escapeHtml(err.message) + '</p></div>';
    });
  }

  /* ---------------------------------------------------------- flashcards */

  function renderDeckList() {
    setCurrentNav('cards');
    pager.innerHTML = '';
    view.innerHTML = '<div class="loading">Loading decks…</div>';

    Vocab.load().then(function () {
      var known = Progress.knownCount();
      var html = '<h1>Flashcards</h1>' +
        '<p class="lead">Leitner spaced repetition: a card you get right moves up a box and comes ' +
        'back later (1, 2, 5, 10, 21, then 45 days). Get it wrong and it drops back to daily.</p>' +
        (known
          ? '<p class="deck-note">' + known + ' word' + (known === 1 ? '' : 's') +
            ' you marked as known ' + (known === 1 ? 'is' : 'are') + ' held out of every deck. ' +
            'Untick ' + (known === 1 ? 'it' : 'them') + ' in the ' +
            '<a href="#/vocab">vocabulary list</a> to bring ' +
            (known === 1 ? 'it' : 'them') + ' back — the old schedule is kept.</p>'
          : '<p class="deck-note">Marking a word known in the ' +
            '<a href="#/vocab">vocabulary list</a>, or retiring it mid-review, takes it out of ' +
            'every deck.</p>') +
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

  /* ------------------------------------------------------- quick add */

  // A word turns up mid-lesson, and the vocabulary page is three taps away.
  // This is the same two fields as the full form, in the topbar, on every
  // page: type, read the one line under the fields, press Enter. It stays
  // open afterwards because words arrive in twos and threes.
  function setupQuickAdd() {
    var btn = document.getElementById('addWordBtn');
    var menu = document.getElementById('addWordMenu');
    if (!btn || !menu) return;
    var timer = null;

    function close() {
      if (menu.hidden) return;
      menu.hidden = true;
      menu.innerHTML = '';
      btn.setAttribute('aria-expanded', 'false');
    }

    function open() {
      menu.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      menu.innerHTML =
        '<div class="qa-head"><strong>Add a word</strong>' +
          '<span class="qa-hint">Enter to add · Esc to close</span></div>' +
        '<input id="qaFr" class="qa-in" placeholder="le brouillard" autocomplete="off" ' +
          'spellcheck="false" aria-label="French">' +
        '<input id="qaEn" class="qa-in" placeholder="fog" autocomplete="off" aria-label="English">' +
        '<p class="qa-note" id="qaNote">Two fields, that is all: the type, the gender and the ' +
          'theme are read off the French.</p>' +
        '<div class="qa-actions">' +
          '<button class="btn btn-primary btn-sm" id="qaSave">Add</button>' +
          '<a class="qa-link" href="#/vocab">All my words</a>' +
        '</div>';

      var fr = menu.querySelector('#qaFr');
      var en = menu.querySelector('#qaEn');
      fr.focus();
      // The duplicate check needs the curated list, but the fields are usable
      // before it lands; the note simply gets better once it has.
      Vocab.load().then(function () { look(); });

      function look() {
        var note = menu.querySelector('#qaNote');
        var save = menu.querySelector('#qaSave');
        if (!note) return;
        var text = fr.value.trim();
        if (!text) {
          note.className = 'qa-note';
          note.textContent = 'Two fields, that is all: the type, the gender and the theme are ' +
            'read off the French.';
          save.disabled = false;
          return;
        }
        var hit = Vocab.findExisting(text);
        if (hit) {
          note.className = 'qa-note is-dupe';
          note.innerHTML = (hit.mine ? 'You already added ' : 'Already in the course: ') +
            '<strong>' + escapeHtml(hit.fr) + '</strong>, ' + escapeHtml(hit.en);
          save.disabled = true;
          return;
        }
        var g = Vocab.guess(text);
        note.className = 'qa-note is-new';
        note.textContent = 'New. Filing it as ' + (Vocab.POS_LABEL[g.pos] || g.pos) +
          (g.g ? ', ' + { m: 'masculine', f: 'feminine', pl: 'plural', mf: 'either' }[g.g] : '') +
          ', theme mine.';
        save.disabled = false;
      }

      function add() {
        var note = menu.querySelector('#qaNote');
        var input = { fr: fr.value, en: en.value, themes: [] };
        if (!input.fr.trim() || !input.en.trim()) {
          note.className = 'qa-note is-dupe';
          note.textContent = 'Both sides, please: the French and what it means.';
          (input.fr.trim() ? en : fr).focus();
          return;
        }
        if (Vocab.findExisting(input.fr)) return look();
        var g = Vocab.guess(input.fr);
        input.pos = g.pos;
        input.g = g.g;
        try {
          Progress.addWord(input);
        } catch (err) {
          note.className = 'qa-note is-dupe';
          note.textContent = err.message;
          return;
        }
        var added = input.fr.trim();
        fr.value = '';
        en.value = '';
        fr.focus();
        note.className = 'qa-note is-done';
        note.innerHTML = '✓ Added <strong>' + escapeHtml(added) + '</strong>. Next one?';
        // The vocabulary page is a snapshot, so it has to be redrawn to show
        // the new word; every other page is unaffected.
        if (location.hash.replace(/^#\/?/, '') === 'vocab') renderVocabPage();
      }

      menu.addEventListener('input', function (e) {
        if (e.target !== fr) return;
        clearTimeout(timer);
        timer = setTimeout(look, 140);
      });
      menu.addEventListener('click', function (e) {
        if (e.target.closest('#qaSave')) add();
        if (e.target.closest('.qa-link')) close();
      });
      menu.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); add(); }
        if (e.key === 'Escape') { e.preventDefault(); close(); btn.focus(); }
      });
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menu.hidden) open(); else close();
    });
    menu.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', close);

    // A word heard in passing should cost one key. Not while something is
    // being typed, and not while a test is taking the digits.
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'n' && e.key !== 'N') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
      e.preventDefault();
      if (menu.hidden) open();
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

  var escapeAttr = escapeHtml;   // escapeHtml already quotes "

  boot();
})();
