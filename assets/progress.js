/* ============================================================
   progress.js — everything the course remembers about you.

   State lives in localStorage. It is only ever sent anywhere if
   you connect the optional gist sync in sync.js.

   Shape:
   {
     v: 1,
     read:  { "<slug>": <epoch-ms> },
     ex:    { "<slug>:<exId>:<i>": "ok" | "again" },
     cards: { "<cardId>": { box: 0-5, due: <epoch-day>, seen: n, ok: n } },
     known: { "<wordId>": true },
     days:  { "<yyyy-mm-dd>": <reviews that day> },
     m:     { "<kind>:<key>": <epoch-ms> },   // when each entry last changed
     clearedAt: <epoch-ms>                    // last "reset everything"
   }

   `m` is what makes two devices mergeable. An entry that is missing
   from a map but present in `m` was deleted at that time, so a
   deletion on one device is not undone by the other still having it.
   ============================================================ */

window.Progress = (function () {
  'use strict';

  var KEY = 'lecarnet.v1';

  // Leitner: box index -> days until the card comes back.
  var INTERVALS = [0, 1, 2, 5, 10, 21, 45];
  var MAX_BOX = INTERVALS.length - 1;

  var state = load();

  var MAPS = ['read', 'ex', 'cards', 'known'];

  function blank() {
    return { v: 1, read: {}, ex: {}, cards: {}, known: {}, days: {}, m: {}, clearedAt: 0 };
  }

  // Clock for the merge. Two writes in the same millisecond would look
  // concurrent to the other device, and a reset followed straight away by
  // a tick would swallow the tick, so stamps always move forward.
  var lastStamp = 0;

  function stamp() {
    var t = Date.now();
    lastStamp = t > lastStamp ? t : lastStamp + 1;
    return lastStamp;
  }

  // Record when an entry last changed, so a merge can tell which device
  // knows the newer answer — and tell a deletion from a never-had-it.
  function touch(kind, key) {
    state.m[kind + ':' + key] = stamp();
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      var parsed = JSON.parse(raw);
      var base = blank();
      for (var k in base) if (!parsed[k]) parsed[k] = base[k];
      // Never hand out a stamp below one already on disk, even if the
      // system clock has moved backwards since.
      lastStamp = parsed.clearedAt || 0;
      for (var mk in parsed.m) if (parsed.m[mk] > lastStamp) lastStamp = parsed.m[mk];
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
    if (on) state.read[slug] = stamp();
    else delete state.read[slug];
    touch('read', slug);
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
    touch('ex', k);
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
    touch('cards', id);
    bumpDay();
    save();
    return c;
  }

  function resetCard(id) { delete state.cards[id]; touch('cards', id); save(); }

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
    touch('known', id);
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

  /* ---------------------------------------------------------- merging */

  // Anything arriving from outside this module — a gist, an imported file —
  // is rebuilt key by key into a shape this code is willing to trust. Only
  // the token holder can write the gist, but a merge should still never be
  // able to smuggle a foreign field into the state that the UI renders.
  var LIMIT = 20000;          // entries per map
  var KEY_MAX = 160;          // characters per key

  function sanitize(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      throw new Error('Not a progress file');
    }
    var out = blank();
    var ts = num(input.clearedAt);
    out.clearedAt = ts > 0 ? ts : 0;

    each(input.read, function (key, value) { out.read[key] = num(value); });
    each(input.ex, function (key, value) {
      if (value === 'ok' || value === 'again') out.ex[key] = value;
    });
    each(input.known, function (key, value) { if (value) out.known[key] = true; });
    each(input.cards, function (key, value) {
      if (!value || typeof value !== 'object') return;
      out.cards[key] = {
        box: clamp(num(value.box), 0, MAX_BOX),
        due: clamp(num(value.due), 0, 1e7),
        seen: clamp(num(value.seen), 0, 1e6),
        ok: clamp(num(value.ok), 0, 1e6)
      };
    });
    each(input.days, function (key, value) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(key)) out.days[key] = clamp(num(value), 0, 1e6);
    });
    each(input.m, function (key, value) {
      var t = num(value);
      // A key here is "<kind>:<entry>", and only the kinds we merge.
      if (t > 0 && MAPS.indexOf(key.slice(0, key.indexOf(':'))) !== -1) out.m[key] = t;
    });
    return out;
  }

  function each(obj, fn) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return;
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length && i < LIMIT; i++) {
      var key = keys[i];
      if (typeof key !== 'string' || key.length > KEY_MAX) continue;
      // Writing these by name would reach the prototype, not the map.
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
      fn(key, obj[key]);
    }
  }

  function num(v) { return typeof v === 'number' && isFinite(v) ? v : 0; }
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, Math.round(v))); }

  // Fold another device's state into this one. Entry by entry, the side
  // that wrote last wins; where neither recorded a time (state written
  // before `m` existed) having the entry beats not having it, so an old
  // export can only ever add to what is here.
  function mergeRemote(input) {
    var remote = sanitize(input);

    var cleared = Math.max(state.clearedAt || 0, remote.clearedAt || 0);
    var out = blank();
    out.clearedAt = cleared;

    MAPS.forEach(function (kind) {
      var keys = Object.create(null);
      Object.keys(state[kind]).forEach(function (key) { keys[key] = 1; });
      Object.keys(remote[kind]).forEach(function (key) { keys[key] = 1; });
      [state.m, remote.m].forEach(function (m) {
        Object.keys(m).forEach(function (mk) {
          if (mk.indexOf(kind + ':') === 0) keys[mk.slice(kind.length + 1)] = 1;
        });
      });

      Object.keys(keys).forEach(function (key) {
        var mk = kind + ':' + key;
        var lt = state.m[mk] || 0, rt = remote.m[mk] || 0;
        var ts = Math.max(lt, rt);
        // Anything last touched before a "reset everything" was wiped
        // on purpose and must not come back from the other device.
        if (cleared && ts <= cleared) return;

        var lHas = has(state[kind], key), rHas = has(remote[kind], key);
        if (kind === 'cards' && lHas && rHas) {
          out.cards[key] = mergeCard(state.cards[key], remote.cards[key], lt, rt);
        } else {
          var mine = lt === rt ? lHas : lt > rt;
          if (mine && lHas) out[kind][key] = state[kind][key];
          else if (!mine && rHas) out[kind][key] = remote[kind][key];
          // Neither branch taken means the winning side had deleted it.
        }
        if (ts) out.m[mk] = ts;
      });
    });

    // Both devices may have studied today; the larger count is the closer
    // guess, and adding them would inflate every shared day.
    Object.keys(state.days).concat(Object.keys(remote.days)).forEach(function (day) {
      out.days[day] = Math.max(state.days[day] || 0, remote.days[day] || 0);
    });

    state = out;
    save();
    return state;
  }

  function has(obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); }

  // Counters only ever grow, so take the highest of each; the schedule
  // comes from whichever device graded the card last.
  function mergeCard(a, b, at, bt) {
    var newer = at === bt ? ((a.seen || 0) >= (b.seen || 0) ? a : b) : (at > bt ? a : b);
    return {
      box: newer.box || 0,
      due: newer.due || 0,
      seen: Math.max(a.seen || 0, b.seen || 0),
      ok: Math.max(a.ok || 0, b.ok || 0)
    };
  }

  /* ---------------------------------------------------------- import / export */

  function snapshot() { return JSON.parse(JSON.stringify(state)); }

  // Cheap change detector for the sync loop: enough to tell "same as what
  // we last pushed" from "something moved".
  function fingerprint() {
    var s = JSON.stringify(state);
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
    return s.length + ':' + h.toString(36);
  }

  function exportJSON() { return JSON.stringify(state, null, 2); }

  function importJSON(text) {
    state = sanitize(JSON.parse(text));
    save();
  }

  function reset() {
    state = blank();
    // Remember when, so syncing afterwards does not pull the old
    // progress back off the other device.
    state.clearedAt = stamp();
    save();
  }

  return {
    mergeRemote: mergeRemote, snapshot: snapshot, fingerprint: fingerprint,
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
