/* ============================================================
   progress.js — everything the course remembers about you.

   All state is local to the browser (localStorage). Nothing is
   sent anywhere; clearing site data resets the course.

   Shape:
   {
     v: 1,
     read:  { "<slug>": <epoch-ms> },
     ex:    { "<slug>:<exId>:<i>": "ok" | "again" },
     cards: { "<cardId>": { box: 0-5, due: <epoch-day>, seen: n, ok: n } },
     known: { "<wordId>": true },
     days:  { "<yyyy-mm-dd>": <reviews that day> }
   }
   ============================================================ */

window.Progress = (function () {
  'use strict';

  var KEY = 'lecarnet.v1';

  // Leitner: box index -> days until the card comes back.
  var INTERVALS = [0, 1, 2, 5, 10, 21, 45];
  var MAX_BOX = INTERVALS.length - 1;

  var state = load();

  function blank() {
    return { v: 1, read: {}, ex: {}, cards: {}, known: {}, days: {} };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      var parsed = JSON.parse(raw);
      var base = blank();
      for (var k in base) if (!parsed[k]) parsed[k] = base[k];
      return parsed;
    } catch (e) {
      return blank();
    }
  }

  var saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* quota or private mode */ }
    }, 120);
    if (typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('progress:change'));
    }
  }

  /* ---------------------------------------------------------- dates */

  function today() {
    var d = new Date();
    return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
  }

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  /* ---------------------------------------------------------- chapters */

  function isRead(slug) { return !!state.read[slug]; }

  function setRead(slug, on) {
    if (on) state.read[slug] = Date.now();
    else delete state.read[slug];
    save();
  }

  function toggleRead(slug) {
    setRead(slug, !isRead(slug));
    return isRead(slug);
  }

  function readCount() { return Object.keys(state.read).length; }

  /* ---------------------------------------------------------- exercises */

  function exKey(slug, exId, i) { return slug + ':' + exId + ':' + i; }

  function getEx(slug, exId, i) { return state.ex[exKey(slug, exId, i)] || null; }

  function setEx(slug, exId, i, verdict) {
    var k = exKey(slug, exId, i);
    if (verdict) state.ex[k] = verdict;
    else delete state.ex[k];
    bumpDay();
    save();
  }

  function exStats(slug) {
    var ok = 0, again = 0;
    var prefix = slug + ':';
    for (var k in state.ex) {
      if (k.indexOf(prefix) !== 0) continue;
      if (state.ex[k] === 'ok') ok++; else again++;
    }
    return { ok: ok, again: again, total: ok + again };
  }

  /* ---------------------------------------------------------- flashcards */

  function card(id) {
    return state.cards[id] || { box: 0, due: 0, seen: 0, ok: 0 };
  }

  function isDue(id) { return card(id).due <= today(); }

  function gradeCard(id, correct) {
    var c = card(id);
    c.seen++;
    if (correct) { c.ok++; c.box = Math.min(MAX_BOX, c.box + 1); }
    else { c.box = 0; }
    c.due = today() + INTERVALS[c.box];
    state.cards[id] = c;
    bumpDay();
    save();
    return c;
  }

  function resetCard(id) { delete state.cards[id]; save(); }

  function dueCount(ids) {
    var t = today(), n = 0;
    for (var i = 0; i < ids.length; i++) {
      var c = state.cards[ids[i]];
      if (!c || c.due <= t) n++;
    }
    return n;
  }

  // Cards never seen come first, then the most overdue.
  function dueQueue(ids) {
    var t = today();
    return ids
      .filter(function (id) { var c = state.cards[id]; return !c || c.due <= t; })
      .sort(function (a, b) {
        var ca = state.cards[a], cb = state.cards[b];
        if (!ca && !cb) return 0;
        if (!ca) return -1;
        if (!cb) return 1;
        return (ca.due - cb.due) || (ca.box - cb.box);
      });
  }

  function cardStats(ids) {
    var learned = 0, learning = 0, fresh = 0;
    ids.forEach(function (id) {
      var c = state.cards[id];
      if (!c || !c.seen) fresh++;
      else if (c.box >= 4) learned++;
      else learning++;
    });
    return { learned: learned, learning: learning, fresh: fresh, total: ids.length };
  }

  /* ---------------------------------------------------------- vocabulary */

  function isKnown(id) { return !!state.known[id]; }

  function toggleKnown(id) {
    if (state.known[id]) delete state.known[id];
    else state.known[id] = true;
    save();
    return isKnown(id);
  }

  function knownCount() { return Object.keys(state.known).length; }

  /* ---------------------------------------------------------- streak */

  function bumpDay() {
    var k = todayKey();
    state.days[k] = (state.days[k] || 0) + 1;
  }

  function streak() {
    var n = 0;
    var d = new Date();
    for (;;) {
      var k = d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
      if (!state.days[k]) {
        // Today not yet studied doesn't break a streak that ran through yesterday.
        if (n === 0 && k === todayKey()) { d.setDate(d.getDate() - 1); continue; }
        break;
      }
      n++;
      d.setDate(d.getDate() - 1);
    }
    return n;
  }

  function reviewsToday() { return state.days[todayKey()] || 0; }

  /* ---------------------------------------------------------- import / export */

  function exportJSON() { return JSON.stringify(state, null, 2); }

  function importJSON(text) {
    var parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object') throw new Error('Not a progress file');
    state = parsed;
    var base = blank();
    for (var k in base) if (!state[k]) state[k] = base[k];
    save();
  }

  function reset() { state = blank(); save(); }

  return {
    isRead: isRead, setRead: setRead, toggleRead: toggleRead, readCount: readCount,
    getEx: getEx, setEx: setEx, exStats: exStats,
    card: card, isDue: isDue, gradeCard: gradeCard, resetCard: resetCard,
    dueCount: dueCount, dueQueue: dueQueue, cardStats: cardStats,
    isKnown: isKnown, toggleKnown: toggleKnown, knownCount: knownCount,
    streak: streak, reviewsToday: reviewsToday,
    exportJSON: exportJSON, importJSON: importJSON, reset: reset,
    INTERVALS: INTERVALS, MAX_BOX: MAX_BOX
  };
})();
