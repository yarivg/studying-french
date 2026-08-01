/* ============================================================
   vocab.js — loads data/vocab.json and renders the vocabulary
   browser, the ::: vocab blocks embedded in lessons, and the
   flashcard decks built from both.
   ============================================================ */

window.Vocab = (function () {
  'use strict';

  var data = null;
  var loading = null;

  var POS_LABEL = {
    noun: 'noun', verb: 'verb', adj: 'adjective', phrase: 'phrase',
    connector: 'connector', grammar: 'grammar word', other: 'word'
  };

  var GENDER_LABEL = { m: 'm', f: 'f', pl: 'pl', mf: 'm/f' };

  function load() {
    if (data) return Promise.resolve(data);
    if (loading) return loading;
    loading = fetch('data/vocab.json')
      .then(function (r) {
        if (!r.ok) throw new Error('vocab.json ' + r.status);
        return r.json();
      })
      .then(function (json) {
        data = json;
        data.words.forEach(function (w) {
          w.search = (w.fr + ' ' + w.en + ' ' + w.themes.join(' ')).toLowerCase();
          w.searchPlain = strip(w.search);
        });
        return data;
      });
    return loading;
  }

  function strip(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function all() { return data ? data.words : []; }

  function themes() { return data ? Object.keys(data.themes) : []; }

  function byTheme(list) {
    var wanted = String(list || '').split(/[,\s]+/).filter(Boolean);
    if (!wanted.length) return all();
    return all().filter(function (w) {
      return w.themes.some(function (t) { return wanted.indexOf(t) !== -1; });
    });
  }

  function search(query, opts) {
    opts = opts || {};
    var words = all();
    if (opts.theme && opts.theme !== 'all') {
      words = words.filter(function (w) { return w.themes.indexOf(opts.theme) !== -1; });
    }
    if (opts.pos && opts.pos !== 'all') {
      words = words.filter(function (w) { return w.pos === opts.pos; });
    }
    if (opts.status === 'known') words = words.filter(function (w) { return Progress.isKnown(w.id); });
    if (opts.status === 'unknown') words = words.filter(function (w) { return !Progress.isKnown(w.id); });

    var q = strip(String(query || '').trim().toLowerCase());
    if (!q) return words;
    return words.filter(function (w) { return w.searchPlain.indexOf(q) !== -1; })
      .sort(function (a, b) { return a.searchPlain.indexOf(q) - b.searchPlain.indexOf(q); });
  }

  /* ---------------------------------------------------------- rendering */

  function rowHtml(w) {
    var known = Progress.isKnown(w.id);
    var g = w.g ? '<span class="v-tag">' + GENDER_LABEL[w.g] + '</span>' : '';
    return '<div class="vocab-row' + (known ? ' is-known' : '') + '" data-id="' + w.id + '">' +
      '<button class="v-know" aria-label="Mark as known" aria-pressed="' + known + '">✓</button>' +
      '<span class="v-fr">' + escapeHtml(w.fr) + '</span>' +
      '<span class="v-en">' + escapeHtml(w.en) + '</span>' +
      '<span class="v-tag">' + (POS_LABEL[w.pos] || w.pos) + (g ? ' · ' + GENDER_LABEL[w.g] : '') + '</span>' +
      '</div>';
  }

  function listHtml(words) {
    if (!words.length) {
      return '<div class="empty"><div class="empty-icon">🔍</div><p>No words match that.</p></div>';
    }
    return '<div class="vocab-list">' + words.map(rowHtml).join('') + '</div>';
  }

  // One delegated handler covers every list on the page.
  function bindList(root) {
    root.addEventListener('click', function (e) {
      var btn = e.target.closest('.v-know');
      if (!btn) return;
      var row = btn.closest('.vocab-row');
      var on = Progress.toggleKnown(row.dataset.id);
      row.classList.toggle('is-known', on);
      btn.setAttribute('aria-pressed', String(on));
    });
  }

  // Fill any ::: vocab blocks that the markdown renderer left behind.
  function hydrateEmbeds(root) {
    var embeds = root.querySelectorAll('.vocab-embed');
    if (!embeds.length) return Promise.resolve();
    return load().then(function () {
      embeds.forEach(function (el) {
        var words = byTheme(el.dataset.themes);
        el.innerHTML =
          '<h4>' + escapeHtml(el.dataset.themes.replace(/,/g, ' · ')) + ' — ' + words.length + ' words</h4>' +
          listHtml(words);
        bindList(el);
      });
    });
  }

  /* ---------------------------------------------------------- decks */

  // A deck is a themed slice of the vocabulary in one direction.
  function deck(id, name, words, dir) {
    return {
      id: id, name: name, dir: dir, size: words.length,
      cards: words.map(function (w) {
        return {
          id: w.id + ':' + dir,
          front: dir === 'fr-en' ? w.fr : w.en,
          back: dir === 'fr-en' ? w.en : w.fr,
          tag: w.themes[0] === 'general' ? (POS_LABEL[w.pos] || '') : w.themes[0]
        };
      })
    };
  }

  function decks() {
    var out = [];
    themes().forEach(function (t) {
      if (t === 'general') return;
      var words = byTheme(t);
      out.push(deck('theme-' + t + '-fr', capitalise(t), words, 'fr-en'));
    });
    out.push(deck('all-fr', 'Everything (FR → EN)', all(), 'fr-en'));
    out.push(deck('all-en', 'Everything (EN → FR)', all(), 'en-fr'));
    var verbs = all().filter(function (w) { return w.pos === 'verb'; });
    out.push(deck('verbs-fr', 'Verbs', verbs, 'fr-en'));
    var nouns = all().filter(function (w) { return w.pos === 'noun' && w.g; });
    out.push(deck('gender', 'Noun genders', nouns, 'fr-en'));
    return out;
  }

  function deckById(id) {
    var found = null;
    decks().forEach(function (d) { if (d.id === id) found = d; });
    return found;
  }

  /* ---------------------------------------------------------- helpers */

  function capitalise(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  return {
    load: load, all: all, themes: themes, byTheme: byTheme, search: search,
    listHtml: listHtml, bindList: bindList, hydrateEmbeds: hydrateEmbeds,
    decks: decks, deckById: deckById,
    POS_LABEL: POS_LABEL, GENDER_LABEL: GENDER_LABEL
  };
})();
