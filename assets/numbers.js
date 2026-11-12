/* ============================================================
   numbers.js — Nombres à l'oreille: numbers by ear, without end.

   A random number, spoken once inside a news-style sentence, the
   way a DELF recording drops it. Type the digits, Enter to check,
   Enter again plays the next one. One replay is allowed and is
   worth half a point. Nothing is a fixed list: every number is
   generated, so it never runs out and never repeats on purpose.

   The categories are the traps the exam actually sets: 60-99
   (soixante-dix, quatre-vingts), six / seize, deux / douze inside
   62 / 72, hundreds with a bare "cent", years, percentages and
   decimals (virgule), milliards, 24-hour times, prices, phone
   numbers, dates, and two numbers in one sentence.

   Speaks through Say (audio.js), so it uses the voice chosen in
   the audio menu. Scores live in localStorage under
   lecarnet.numbers; they are not synced.
   ============================================================ */

window.Numbers = (function () {
  'use strict';

  var KEY = 'lecarnet.numbers';
  var RATES = { slow: 0.75, normal: 0.95, fast: 1.1 };

  /* ---------------------------------------------------------- words */

  var U = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
           'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
  var T = { 2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante', 6: 'soixante' };

  // 0..99. Only 71 keeps "et" above 61; 80 alone takes its s.
  function u100(n) {
    if (n <= 16) return U[n];
    if (n < 20) return 'dix-' + U[n - 10];
    var t = Math.floor(n / 10), r = n % 10;
    if (t === 7) return n === 71 ? 'soixante et onze' : 'soixante-' + u100(10 + r);
    if (t === 8) return r ? 'quatre-vingt-' + U[r] : 'quatre-vingts';
    if (t === 9) return 'quatre-vingt-' + u100(10 + r);
    return T[t] + (r === 1 ? ' et un' : r ? '-' + U[r] : '');
  }

  // 0..999. `last`: nothing follows, so "deux cents" and "quatre-vingts" keep their s.
  function u1000(n, last) {
    var h = Math.floor(n / 100), r = n % 100, s = '';
    if (h) s = (h > 1 ? U[h] + ' ' : '') + 'cent' + (h > 1 && !r && last ? 's' : '');
    if (r) {
      var w = u100(r);
      if (!last && r === 80) w = 'quatre-vingt';
      s += (s ? ' ' : '') + w;
    }
    return s;
  }

  function fr(n) {
    if (n === 0) return 'zéro';
    var parts = [];
    [[1e9, 'milliard'], [1e6, 'million']].forEach(function (b) {
      var q = Math.floor(n / b[0]);
      if (q) { parts.push(u1000(q, true) + ' ' + b[1] + (q > 1 ? 's' : '')); n %= b[0]; }
    });
    var th = Math.floor(n / 1000), r = n % 1000;
    if (th) parts.push(th === 1 ? 'mille' : u1000(th, false) + ' mille');
    if (r) parts.push(u1000(r, true));
    return parts.join(' ');
  }

  function R(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function spaced(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function dec(x) {
    var i = Math.floor(x), f = Math.round((x - i) * 10);
    return { w: fr(i) + ' virgule ' + fr(f), k: i + ',' + f };
  }
  // Minutes are feminine: "dix heures vingt et une".
  function minutes(m) { return fr(m).replace(/\bun$/, 'une'); }

  /* ---------------------------------------------------------- categories */

  // gen() -> { w: spoken number (or [a, b]), k: the key as shown, alt: other accepted digit strings,
  //            s: carrier sentences, # marks the number }
  var SMALL = ['Il habite au # de la rue.', 'Nous étions # dans la salle.', 'J\'ai attendu # minutes.',
               'Le dossier fait # pages.', 'Elle a couru # kilomètres.', 'Il y a # élèves dans la classe.',
               'Prenez la ligne #.', 'Il manque # euros.', 'Il a perdu # kilos.', 'On a marché pendant # minutes.',
               'Il a # ans.', 'Ça coûte # euros.', 'La salle numéro #, s\'il vous plaît.', 'Il y avait # personnes.'];

  var CATS = [
    { id: 'n6099', name: '60-99', gen: function () {
      var n = R(60, 99);
      return { w: fr(n), k: '' + n, s: SMALL.concat(['Elle habite au numéro #.', 'On attend # invités.', 'Il reste # places.']) };
    } },
    { id: 'traps', name: 'Traps: 6/16, 62/72, 83/93, endings', gen: function () {
      var n = pick([6, 16, 60, 66, 76, 96, 3, 13, 30, 4, 14, 40, 44, 74, 94, 5, 15, 50, 2, 12,
                    62, 72, 63, 73, 83, 93, 82, 92, 79, 99, 77, 97]);
      return { w: fr(n), k: '' + n, s: SMALL };
    } },
    { id: 'cent', name: '100-999', gen: function () {
      var n = R(100, 999);
      return { w: fr(n), k: '' + n, s: ['Le trajet fait # kilomètres.', 'Le loyer est de # euros.', 'On a reçu # candidatures.',
        'L\'école accueille # élèves.', 'La salle peut accueillir # personnes.', 'Le vol a coûté # euros.',
        'Nous avons parcouru # kilomètres.', 'Le livre fait # pages.', 'Il a envoyé # messages ce mois-ci.',
        'Le village compte # habitants.', 'La facture s\'élève à # euros.'] };
    } },
    { id: 'mille', name: '1 000-99 999', gen: function () {
      var n = R(1, 99) * 1000 + pick([0, 0, R(1, 999), R(100, 999)]);
      return { w: fr(n), k: spaced(n), s: ['La ville compte # habitants.', 'Le festival a attiré # visiteurs.',
        'Cette voiture coûte # euros.', 'L\'entreprise emploie # salariés.', 'Le salaire annuel est de # euros.',
        'La manifestation a réuni # personnes.', 'Le stade peut accueillir # spectateurs.',
        'On a vendu # exemplaires du livre.', 'La pétition a recueilli # signatures.'] };
    } },
    { id: 'big', name: '100 000 to milliards', gen: function () {
      var t = R(0, 3), n;
      if (t === 0) {
        n = R(1, 9) * 100000 + R(0, 9) * 10000;
        return { w: fr(n), k: spaced(n), s: ['La réforme concerne # personnes.', 'On compte # chômeurs de plus.',
          'Le concert a été vu par # spectateurs.'] };
      }
      if (t === 1) {
        n = R(1, 99) * 1e6;
        return { w: fr(n), k: spaced(n), s: ['Le pays compte # d\'habitants.', '# de Français partent en vacances.',
          'La vidéo a été vue # de fois.'] };
      }
      if (t === 2) {
        n = R(1, 9) * 1e9;
        return { w: fr(n), k: spaced(n), s: ['Le projet a coûté # d\'euros.', 'La population dépasse # d\'habitants.'] };
      }
      var x = R(11, 99), d = dec(x / 10), u = pick(['millions', 'milliards']);
      return { w: d.w + ' ' + u, k: d.k + ' ' + u, alt: [String(x * (u === 'millions' ? 1e5 : 1e8))],
        s: ['Le budget atteint # d\'euros.', 'Ce marché représente # d\'euros.'] };
    } },
    { id: 'year', name: 'Years', gen: function () {
      var n = R(1789, 2035);
      return { w: fr(n), k: '' + n, s: ['La loi a été votée en #.', 'Le musée a ouvert ses portes en #.', 'Tout a changé en #.',
        'Il est né en #.', 'Le bâtiment date de #.', 'Elle a quitté la France en #.', 'Le livre est paru en #.',
        'L\'entreprise a été fondée en #.', 'Ils se sont mariés en #.', 'Le pont a été construit en #.'] };
    } },
    { id: 'pct', name: '% and decimals', gen: function () {
      var s = ['Le chômage a baissé de #.', 'Les ventes ont augmenté de #.', 'Le taux atteint #.', 'La croissance a été de #.',
        'L\'inflation est de #.', 'Le prix de l\'essence a augmenté de #.', 'Les votes blancs représentent #.',
        'Le nombre d\'accidents a reculé de #.', 'La participation a atteint #.', 'Les loyers ont grimpé de #.'];
      if (Math.random() < 0.5) {
        var n = R(1, 99);
        return { w: fr(n) + ' pour cent', k: n + ' %', s: s.concat(['Près de # des jeunes sont d\'accord.', 'Seuls # des salariés sont concernés.']) };
      }
      var d = dec(R(11, 999) / 10);
      return { w: d.w + ' pour cent', k: d.k + ' %', s: s };
    } },
    { id: 'time', name: 'Times (24 h)', gen: function () {
      var h = R(0, 23), m = pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, R(1, 59)]);
      var w = (h === 1 ? 'une' : h === 21 ? 'vingt et une' : fr(h)) + ' heure' + (h > 1 ? 's' : '') + (m ? ' ' + minutes(m) : '');
      return { w: w, k: h + ' h ' + (m < 10 ? '0' : '') + m, alt: m ? [] : ['' + h],
        s: ['Le train part à #.', 'Rendez-vous à #.', 'La séance commence à #.', 'Le magasin ferme à #.', 'Le vol décolle à #.',
          'Le film commence à #.', 'Je finis le travail à #.', 'La réunion est prévue à #.', 'On se retrouve à #.', 'Les portes ouvrent à #.'] };
    } },
    { id: 'price', name: 'Prices', gen: function () {
      var e = R(1, 999), c = pick([0, 10, 20, 25, 50, 90, 95, 99, R(1, 99)]);
      return { w: fr(e) + ' euro' + (e > 1 ? 's' : '') + (c ? ' ' + fr(c) : ''), k: e + (c ? ',' + (c < 10 ? '0' : '') + c : '') + ' €',
        s: ['Ça fait #.', 'Le billet coûte #.', 'Le menu est à #.', 'Je l\'ai payé #.', 'Le livre coûte #.', 'Ils demandent #.',
          'Le ticket est à #.', 'Ça m\'a coûté #.', 'Le total s\'élève à #.', 'La place de cinéma est à #.'] };
    } },
    { id: 'phone', name: 'Phone numbers', gen: function () {
      var g = ['0' + R(1, 9)];
      for (var i = 0; i < 4; i++) g.push(R(10, 99));
      return { w: g.map(function (x) { return typeof x === 'string' ? 'zéro ' + U[+x[1]] : fr(x); }).join(', '),
        k: g.join(' '), s: ['Mon numéro, c\'est le #.', 'Appelez le #.', 'Vous pouvez me joindre au #.',
          'Le numéro de l\'accueil est le #.', 'Pour toute question, composez le #.'] };
    } },
    { id: 'date', name: 'Dates', gen: function () {
      var d = R(1, 31), m = pick(['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août',
        'septembre', 'octobre', 'novembre', 'décembre']);
      return { w: (d === 1 ? 'premier' : fr(d)) + ' ' + m, k: d + ' ' + m, s: ['Le colloque aura lieu le #.',
        'C\'est ouvert jusqu\'au #.', 'Je pars le #.', 'La réunion est fixée au #.', 'Les soldes commencent le #.',
        'Il est né le #.', 'Le dossier est à rendre avant le #.', 'Nous rentrons le #.'] };
    } },
    { id: 'two', name: 'Two numbers', gen: function () {
      var a = R(12, 79), b = a + R(5, 40);
      return { w: [fr(a), fr(b)], k: a + ' and ' + b, two: [a, b], s: ['Il faut avoir entre # et # ans.',
        'Le prix varie entre # et # euros.', 'On attend entre # et # personnes.', 'Les températures iront de # à # degrés.',
        'Le trajet prend entre # et # minutes.', 'Les candidats ont entre # et # ans.'] };
    } }
  ];
  var byId = {};
  CATS.forEach(function (c) { byId[c.id] = c; });

  /* ---------------------------------------------------------- state */

  function load() {
    var st = { on: { n6099: 1, traps: 1, cent: 1, mille: 1, big: 1, year: 1, pct: 1, time: 1, price: 1, two: 1 },
               speed: 'normal', sent: true, rep: false, sc: {}, miss: [], wrong: [], n: 0 };
    try {
      var o = JSON.parse(localStorage.getItem(KEY));
      if (o) Object.keys(o).forEach(function (k) { st[k] = o[k]; });
    } catch (e) { /* defaults */ }
    if (!RATES[st.speed]) st.speed = 'normal';
    return st;
  }
  var st = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* private mode */ } }

  var cur = null, phase = 'ready', lastS = '', root = null;

  function next() {
    var ks = Object.keys(st.on).filter(function (k) { return byId[k]; });
    if (!ks.length) { cur = null; return; }
    if (st.rep && st.miss.length && Math.random() < 0.3) { cur = st.miss.shift(); }
    else {
      var k = pick(ks), g = byId[k].gen();
      var pool = g.s.filter(function (x) { return x !== lastS; });
      var s = pick(pool.length ? pool : g.s);
      lastS = s;
      var text;
      if (g.two) text = st.sent ? s.replace('#', g.w[0]).replace('#', g.w[1]) : g.w[0] + ' et ' + g.w[1];
      else text = st.sent ? s.replace('#', g.w) : g.w;
      text = text.charAt(0).toUpperCase() + text.slice(1);
      var digits = g.two ? g.two.join('') : g.k.replace(/[^0-9]/g, '');
      cur = { cat: k, text: text, k: g.k, d: [digits].concat(g.alt || []) };
    }
    cur.again = false;
    phase = 'ready';
  }

  function speak() {
    if (!window.Say || !Say.on()) { flash('Turn the voice on in the speaker menu (top bar).'); return false; }
    Say.speak(cur.text, { rate: RATES[st.speed] });
    return true;
  }

  /* ---------------------------------------------------------- view */

  function $(sel) { return root.querySelector(sel); }

  function render(view) {
    root = view;
    var cats = CATS.map(function (c) {
      return '<label class="nb-cat"><input type="checkbox" data-cat="' + c.id + '"' + (st.on[c.id] ? ' checked' : '') + '> ' + c.name + '</label>';
    }).join('');
    view.innerHTML =
      '<div class="eyebrow"><span>Listening</span></div>' +
      '<h1>Nombres à l\'oreille</h1>' +
      '<p class="lead">A random number in a real sentence, played once, like the exam. Type only the digits ' +
      '(spaces, commas, h and % are ignored). Two numbers: both, in order.</p>' +
      '<p class="nb-keys"><kbd>Enter</kbd> play · type · <kbd>Enter</kbd> check · <kbd>Enter</kbd> next, played at once · ' +
      '<kbd>R</kbd> replay once for ½ point</p>' +
      '<div class="nb-box">' + cats + '</div>' +
      '<div class="nb-box nb-main">' +
        '<div class="nb-opts">' +
          '<label>Speed <select id="nbSpeed"><option value="slow">slow</option><option value="normal">normal</option><option value="fast">fast</option></select></label>' +
          '<label><input type="checkbox" id="nbSent"> inside a sentence</label>' +
          '<label><input type="checkbox" id="nbRep"> repeat my misses</label>' +
        '</div>' +
        '<div class="nb-actions">' +
          '<button class="btn btn-primary btn-lg" id="nbPlay">▶ Play once</button>' +
          '<button class="btn" id="nbAgain" disabled>Again (½ pt)</button>' +
          '<button class="btn" id="nbNext">Next</button>' +
          '<span class="nb-count" id="nbCount"></span>' +
        '</div>' +
        '<input type="text" id="nbAns" class="nb-ans" autocomplete="off" inputmode="numeric" spellcheck="false" placeholder="digits" aria-label="The number you heard">' +
        '<div class="nb-fb" id="nbFb" aria-live="polite"></div>' +
      '</div>' +
      '<div class="nb-box"><div class="nb-score-head"><b>Score</b>' +
        '<span><button class="btn" id="nbCopy">Copy report</button> <button class="btn" id="nbReset">Reset</button></span></div>' +
        '<table class="nb-table" id="nbTable"></table></div>';

    root.querySelectorAll('[data-cat]').forEach(function (cb) {
      cb.onchange = function () {
        if (cb.checked) st.on[cb.dataset.cat] = 1; else delete st.on[cb.dataset.cat];
        save();
        if (phase !== 'played') { next(); paint(); }
      };
    });
    var spd = $('#nbSpeed'); spd.value = st.speed;
    spd.onchange = function () { st.speed = spd.value; save(); $('#nbAns').focus(); };
    $('#nbSent').checked = st.sent;
    $('#nbSent').onchange = function (e) { st.sent = e.target.checked; save(); if (phase === 'ready') { next(); paint(); } };
    $('#nbRep').checked = st.rep;
    $('#nbRep').onchange = function (e) { st.rep = e.target.checked; save(); };
    $('#nbPlay').onclick = play;
    $('#nbAgain').onclick = again;
    $('#nbNext').onclick = function () { if (phase === 'played') check(); else advance(); };
    $('#nbCopy').onclick = function (e) {
      if (navigator.clipboard) navigator.clipboard.writeText(report()).then(function () { e.target.textContent = 'Copied'; });
    };
    $('#nbReset').onclick = function () {
      if (!confirm('Reset all number scores?')) return;
      st.sc = {}; st.miss = []; st.wrong = []; st.n = 0; save(); table(); count();
    };
    $('#nbAns').addEventListener('keydown', onKey);

    next();
    paint();
    table();
    $('#nbAns').focus({ preventScroll: true });
  }

  function onKey(e) {
    if ((e.key === 'r' || e.key === 'R') && phase === 'played') { e.preventDefault(); again(); return; }
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (phase === 'ready') play();
    else if (phase === 'played') check();
    else advance();
  }

  function flash(msg) { var fb = root && $('#nbFb'); if (fb) fb.innerHTML = '<span class="nb-bad">' + msg + '</span>'; }

  function paint() {
    if (!root) return;
    var pb = $('#nbPlay'), ag = $('#nbAgain'), ans = $('#nbAns');
    if (!cur) { pb.disabled = true; ans.disabled = true; flash('Pick at least one category.'); return; }
    pb.disabled = phase !== 'ready';
    pb.textContent = phase === 'ready' ? '▶ Play once' : 'Played';
    ag.disabled = !(phase === 'played' && !cur.again);
    ans.disabled = false;
    ans.readOnly = phase === 'checked';
    if (phase === 'ready') { ans.value = ''; $('#nbFb').innerHTML = ''; }
    count();
  }

  function play() {
    if (phase !== 'ready' || !cur) return;
    if (!speak()) return;
    phase = 'played';
    paint();
    $('#nbAns').focus();
  }

  function again() {
    if (phase !== 'played' || cur.again) return;
    cur.again = true;
    speak();
    paint();
    $('#nbAns').focus();
  }

  function advance() {
    next();
    paint();
    var ans = $('#nbAns');
    ans.disabled = false;
    ans.focus();
    play();
  }

  function check() {
    var ans = $('#nbAns'), a = ans.value.replace(/[^0-9]/g, '');
    var ok = a !== '' && cur.d.indexOf(a) >= 0;
    var s = st.sc[cur.cat] || (st.sc[cur.cat] = { r: 0, n: 0 });
    s.n++; if (ok) s.r += cur.again ? 0.5 : 1; st.n++;
    if (!ok) {
      st.miss.push({ cat: cur.cat, text: cur.text, k: cur.k, d: cur.d });
      st.miss = st.miss.slice(-50);
      st.wrong = (st.wrong || []).concat([{ k: cur.k, a: ans.value, t: cur.text, again: cur.again }]).slice(-40);
    }
    phase = 'checked';
    save();
    var fb = $('#nbFb');
    fb.innerHTML = '<span class="' + (ok ? 'nb-ok">' + (cur.again ? '½ ' : '✓ ') : 'nb-bad">✗ ') + esc(cur.k) + '</span>' +
      '<div class="nb-said">' + esc(cur.text) + '</div>' +
      '<button class="btn" id="nbReplay">Replay</button> <button class="btn" id="nbSlow">Slow</button>';
    $('#nbReplay').onclick = function () { Say.speak(cur.text, { rate: RATES[st.speed] }); ans.focus(); };
    $('#nbSlow').onclick = function () { Say.speak(cur.text, { rate: RATES.slow }); ans.focus(); };
    paint();   // the box stays focused, read-only, so Enter flows to the next number
    ans.focus();
    table();
  }

  function count() { var c = root && $('#nbCount'); if (c) c.textContent = st.n + ' heard'; }

  function fmt(x) { return String(Math.round(x * 10) / 10); }

  function table() {
    var t = root && $('#nbTable');
    if (!t) return;
    var h = '<tr><th>Category</th><th>Right</th><th>%</th></tr>', tr = 0, tn = 0;
    CATS.forEach(function (c) {
      var s = st.sc[c.id]; if (!s) return;
      tr += s.r; tn += s.n;
      h += '<tr><td>' + c.name + '</td><td>' + fmt(s.r) + '/' + s.n + '</td><td>' + Math.round(100 * s.r / s.n) + '</td></tr>';
    });
    if (tn) h += '<tr><th>Total</th><th>' + fmt(tr) + '/' + tn + '</th><th>' + Math.round(100 * tr / tn) + '</th></tr>';
    else h += '<tr><td colspan="3" class="nb-empty">Nothing yet.</td></tr>';
    t.innerHTML = h;
  }

  function report() {
    var L = ['# Nombres à l\'oreille report', ''];
    CATS.forEach(function (c) { var s = st.sc[c.id]; if (s) L.push('- ' + c.name + ': ' + fmt(s.r) + '/' + s.n); });
    L.push('', 'Last wrong:');
    (st.wrong || []).slice(-20).forEach(function (w) {
      L.push('- key ' + w.k + ' | wrote ' + (w.a || '(blank)') + (w.again ? ' (after replay)' : '') + ' | ' + w.t);
    });
    return L.join('\n');
  }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function stop() { root = null; if (window.Say) Say.stop(); }

  return { render: render, stop: stop, words: fr };
})();
