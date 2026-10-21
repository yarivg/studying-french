/* Shared drill engine. A page sets window.BANK (the bank) and window.SHELL
   ({ key, title?, filter?(q) }), then loads this file.
   A question with listen: true is a dictation: the French in q.say (or the
   first key) is spoken, q.en stays hidden until it is graded.
   Answers may use {a|b|c} groups; every combination is accepted.
   Grading ignores case, accents, apostrophes, hyphens, punctuation and spaces.
   Each first attempt also stores its word errors, reported per sentence. */
(function () {
  var B = window.BANK, S = window.SHELL || {};
  var KEY = S.key || B.key;
  var QS = B.questions.filter(S.filter || function () { return true; });
  var byId = {}; QS.forEach(function (q) { byId[q.id] = q; });

  function norm(s) {
    return (s || '').toLowerCase().replace(/œ/g, 'oe').replace(/æ/g, 'ae')
      .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  }
  function expand(t) {
    var m = t.match(/\{([^{}]*)\}/);
    if (!m) return [t];
    var out = [];
    m[1].split('|').forEach(function (opt) {
      expand(t.slice(0, m.index) + opt + t.slice(m.index + m[0].length)).forEach(function (x) {
        if (out.length < 20000) out.push(x);
      });
    });
    return out;
  }
  var KEYS = {};
  QS.forEach(function (q) {
    var set = {};
    q.a.forEach(function (a) { expand(a).forEach(function (x) { set[norm(x)] = 1; }); });
    KEYS[q.id] = set;
  });
  function model(q) { return expand(q.a[0])[0]; }

  // Word errors: fewest word edits from the answer to any accepted variant.
  // Words are compared like the grader compares sentences; two words that join
  // into one (dis lui / dis-lui) cost nothing.
  var VARS = {};
  QS.forEach(function (q) {
    var v = [];
    q.a.forEach(function (a) { expand(a).forEach(function (x) { if (v.length < 5000) v.push(words(x)); }); });
    VARS[q.id] = v;
  });
  function words(t) { return t.split(/\s+/).map(norm).filter(Boolean); }
  function dist(a, b) {
    var n = a.length, m = b.length, d = [], i, j;
    for (i = 0; i <= n; i++) { d.push([i]); }
    for (j = 1; j <= m; j++) d[0][j] = j;
    for (i = 1; i <= n; i++) for (j = 1; j <= m; j++) {
      var x = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && a[i - 2] + a[i - 1] === b[j - 1]) x = Math.min(x, d[i - 2][j - 1]);
      if (j > 1 && b[j - 2] + b[j - 1] === a[i - 1]) x = Math.min(x, d[i - 1][j - 2]);
      d[i][j] = x;
    }
    return d[n][m];
  }
  function errCount(q, ans) {
    var w = words(ans), best = Infinity;
    VARS[q.id].forEach(function (v) { if (best) best = Math.min(best, dist(w, v)); });
    return best;
  }

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  var st = load() || {};
  st.order = (st.order || []).filter(function (id) { return byId[id]; });
  QS.forEach(function (q) { if (st.order.indexOf(q.id) < 0) st.order.push(q.id); });
  if (!st.shuffled) { shuffle(st.order); st.shuffled = true; }
  st.answers = st.answers || {}; st.results = st.results || {};
  st.first = st.first || {}; st.hints = st.hints || {}; st.history = st.history || []; st.lastWrong = st.lastWrong || {};
  save();

  var root = document.getElementById('app');
  document.title = S.title || B.title;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function btn(label, fn, cls) { var b = el('button', cls || '', label); b.type = 'button'; b.onclick = fn; return b; }

  function score() {
    var r = 0; QS.forEach(function (q) { if (st.results[q.id]) r++; }); return r;
  }
  function firstScore() {
    var tried = 0, right = 0;
    var err = 0;
    QS.forEach(function (q) {
      var f = st.first[q.id];
      if (!f) return;
      tried++; if (f.ok) right++;
      if (f.err == null) f.err = f.ok ? 0 : errCount(q, f.ans);
      err += f.err;
    });
    return { tried: tried, right: right, err: err, per: tried ? Math.round(10 * err / tried) / 10 : 0 };
  }

  function grade() {
    var wrong = [];
    QS.forEach(function (q) {
      if (st.results[q.id]) return;
      var ans = (st.answers[q.id] || '').trim();
      var ok = !!ans && !!KEYS[q.id][norm(ans)];
      st.results[q.id] = ok;
      if (ans && !st.first[q.id]) st.first[q.id] = { ok: ok, ans: ans, err: ok ? 0 : errCount(q, ans) };
      if (ans && !ok && st.lastWrong[q.id] !== ans) wrong.push({ id: q.id, ans: ans });
      if (ans && !ok) st.lastWrong[q.id] = ans;
    });
    st.graded = true;
    st.history.push({ when: new Date().toISOString(), score: score(), total: QS.length, wrong: wrong });
    save(); render();
  }
  function redo() {
    QS.forEach(function (q) { if (!st.results[q.id]) st.answers[q.id] = ''; });
    st.graded = false; save(); render();
  }
  function clearAll() {
    if (!confirm('Clear every answer? History and first-attempt scores are kept.')) return;
    st.answers = {}; st.results = {}; st.graded = false; save(); render();
  }
  function reshuffle() {
    if (!confirm('Deal a new order?')) return;
    shuffle(st.order); save(); render();
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function stamp(iso) {
    var d = new Date(iso);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function report() {
    var f = firstScore(), s = score(), L = [];
    L.push('# ' + (S.title || B.title) + ' report', '');
    L.push('Score: ' + s + '/' + QS.length + ' (' + Math.round(100 * s / QS.length) + '%), ' + st.history.length + ' graded attempts');
    L.push('First attempt: ' + f.right + '/' + f.tried + (f.tried ? ' (' + Math.round(100 * f.right / f.tried) + '%)' : '') + ', ' + (QS.length - f.tried) + ' not yet answered');
    L.push('Word errors, first attempt: ' + f.err + ' in ' + f.tried + ' sentences (' + f.per + ' per sentence)', '');
    var tags = {};
    QS.forEach(function (q) {
      (q.tags || []).forEach(function (t) {
        tags[t] = tags[t] || { first: 0, tried: 0 };
        var x = st.first[q.id]; if (x) { tags[t].tried++; if (x.ok) tags[t].first++; }
      });
    });
    L.push('## First attempt by topic', '', '| topic | right first time |', '|---|---|');
    Object.keys(tags).forEach(function (t) { L.push('| ' + t + ' | ' + tags[t].first + '/' + tags[t].tried + ' |'); });
    L.push('', '## Wrong first time', '');
    QS.forEach(function (q) {
      var x = st.first[q.id];
      if (x && !x.ok) L.push('- `' + q.id + '` ' + q.en + ' (' + x.err + ' word error' + (x.err === 1 ? '' : 's') + ')', '  - wrote: ' + x.ans, '  - key: ' + model(q));
    });
    L.push('', '## History', '');
    st.history.forEach(function (h, i) {
      L.push((i + 1) + '. ' + stamp(h.when) + ': ' + h.score + '/' + h.total);
      h.wrong.forEach(function (w) { L.push('   - `' + w.id + '` ' + w.ans); });
    });
    return L.join('\n');
  }
  function copyReport(b) {
    var txt = report();
    var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy report'; }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, function () { fallback(txt); });
    else fallback(txt);
  }
  function fallback(txt) {
    var t = el('textarea', 'report-box'); t.value = txt; root.appendChild(t); t.select();
  }

  var voice = null;
  function pickVoice() {
    var vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    voice = vs.filter(function (v) { return /google/i.test(v.name) && /^fr(-|_)FR/i.test(v.lang); })[0] ||
            vs.filter(function (v) { return /^fr(-|_)FR/i.test(v.lang); })[0] ||
            vs.filter(function (v) { return /^fr/i.test(v.lang); })[0] || null;
  }
  if (window.speechSynthesis) { pickVoice(); speechSynthesis.onvoiceschanged = function () { pickVoice(); render(); }; }
  function say(text, rate) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR'; u.rate = rate; if (voice) u.voice = voice;
    speechSynthesis.speak(u);
  }

  function render() {
    root.innerHTML = '';
    var head = el('header');
    head.appendChild(el('h1', '', S.title || B.title));
    if (B.intro) head.appendChild(el('p', 'intro', B.intro));
    var f = firstScore(), s = score();
    var stats = el('p', 'stats');
    stats.textContent = 'Score ' + s + '/' + QS.length + '  ·  First attempt ' + f.right + '/' + f.tried +
      (f.tried ? ' (' + Math.round(100 * f.right / f.tried) + '%)  ·  ' + f.per + ' word errors per sentence' : '');
    head.appendChild(stats);
    var bar = el('div', 'bar');
    bar.appendChild(btn('Grade', grade, 'primary'));
    bar.appendChild(btn('Redo my mistakes', redo));
    bar.appendChild(btn('Clear answers', clearAll));
    bar.appendChild(btn('Reshuffle', reshuffle));
    var lab = el('label', 'hide');
    var cb = el('input'); cb.type = 'checkbox'; cb.checked = !!st.hideCorrect;
    cb.onchange = function () { st.hideCorrect = cb.checked; save(); render(); };
    lab.appendChild(cb); lab.appendChild(document.createTextNode(' Hide correct'));
    bar.appendChild(lab);
    var cp = btn('Copy report', function () { copyReport(cp); });
    bar.appendChild(cp);
    head.appendChild(bar);
    root.appendChild(head);

    var list = el('ol', 'qs');
    st.order.forEach(function (id) {
      var q = byId[id], ok = st.results[id];
      if (ok && st.hideCorrect) return;
      var li = el('li', 'q' + (ok ? ' ok' : (st.graded && st.first[id] && st.results[id] === false ? ' bad' : '')));
      var shown = (st.graded && st.first[id]) || ok;
      if (q.listen) {
        var text = q.say || model(q), play = el('p', 'en');
        play.appendChild(btn('▶ Play', function () { say(text, 0.95); }));
        play.appendChild(document.createTextNode(' '));
        play.appendChild(btn('Slow', function () { say(text, 0.7); }));
        if (voice) play.appendChild(el('span', 'vocab', '  ' + voice.name));
        if (shown && q.en) play.appendChild(el('span', 'vocab', '  ' + q.en));
        li.appendChild(play);
      } else li.appendChild(el('p', 'en', q.en));
      if (q.vocab) {
        if (st.hints[id]) li.appendChild(el('p', 'vocab', q.vocab));
        else li.appendChild(btn('vocab hint', function () { st.hints[id] = true; save(); render(); }, 'link'));
      }
      var inp = el('textarea'); inp.rows = 2; inp.value = st.answers[id] || '';
      inp.disabled = !!ok; inp.spellcheck = false; inp.setAttribute('autocapitalize', 'off');
      inp.oninput = function () { st.answers[id] = inp.value; save(); };
      inp.onkeydown = function (e) { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); grade(); } };
      li.appendChild(inp);
      if (shown) {
        var fb = el('div', 'fb');
        var fe = st.first[id], tag = fe && !fe.ok && fe.err != null ? '  (first try: ' + fe.err + ' word error' + (fe.err === 1 ? '' : 's') + ')' : '';
        fb.appendChild(el('p', 'verdict', (ok ? '✓ ' : '✗ ') + model(q) + tag));
        if (q.why) fb.appendChild(el('p', 'why', q.why));
        li.appendChild(fb);
      }
      list.appendChild(li);
    });
    root.appendChild(list);
  }
  render();
})();
