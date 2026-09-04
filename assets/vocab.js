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
    loading = Data.json('data/vocab.json')
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

  /* ---------------------------------------------------------- my words */

  // The curated list ships with the site and never changes at runtime;
  // words you add live in the synced progress state. They are kept in two
  // places and joined here, so a rebuild of vocab.json cannot lose yours.
  var mineCache = null;
  var curatedCache = null;
  var joinedCache = null;

  function invalidate() {
    mineCache = null; curatedCache = null; joinedCache = null; indexCache = null;
  }
  window.addEventListener('progress:change', invalidate);

  function mine() {
    if (mineCache) return mineCache;
    mineCache = Progress.words().map(function (w) {
      var out = {
        n: 0, id: w.id, fr: w.fr, en: w.en, pos: w.pos || 'other', g: w.g || '',
        base: w.fr, themes: w.themes.length ? w.themes : ['mine'], at: w.at, mine: true
      };
      out.search = (out.fr + ' ' + out.en + ' ' + out.themes.join(' ')).toLowerCase();
      out.searchPlain = strip(out.search);
      return out;
    });
    return mineCache;
  }

  // A gloss in the curated list is sometimes wrong or too narrow. Your
  // correction is stored against the shipped id, so it is laid over the
  // word here rather than replacing it: the original stays on `was`, and
  // clearing the edit brings it straight back.
  function curated() {
    if (!data) return [];
    if (curatedCache) return curatedCache;
    curatedCache = data.words.map(function (w) {
      var e = Progress.getEdit(w.id);
      if (!e) return w;
      var out = {
        n: w.n, id: w.id, fr: e.fr, en: e.en, pos: e.pos, g: e.g, base: e.fr,
        // No themes typed means "leave it where it was filed"; for a word
        // you added the same empty box means "mine", but a curated word
        // already has a theme worth keeping.
        themes: e.themes.length ? e.themes : w.themes.slice(),
        edited: true, was: w
      };
      out.search = (out.fr + ' ' + out.en + ' ' + out.themes.join(' ')).toLowerCase();
      out.searchPlain = strip(out.search);
      return out;
    });
    return curatedCache;
  }

  function all() {
    if (!data) return [];
    if (!joinedCache) joinedCache = mine().concat(curated());
    return joinedCache;
  }

  function themeCounts() {
    var counts = {};
    if (data) for (var t in data.themes) counts[t] = data.themes[t];
    // The shipped tallies were counted before your edits, and an edit can
    // move a word to another theme, so the difference is applied here.
    curated().forEach(function (w) {
      if (!w.edited) return;
      w.was.themes.forEach(function (t) { counts[t] = (counts[t] || 0) - 1; });
      w.themes.forEach(function (t) { counts[t] = (counts[t] || 0) + 1; });
    });
    mine().forEach(function (w) {
      w.themes.forEach(function (t) { counts[t] = (counts[t] || 0) + 1; });
    });
    for (var k in counts) if (counts[k] <= 0) delete counts[k];
    return counts;
  }

  function themes() { return Object.keys(themeCounts()); }

  function byId(id) {
    var list = all();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

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
    if (opts.status === 'mine') words = words.filter(function (w) { return w.mine; });

    var q = strip(String(query || '').trim().toLowerCase());
    if (!q) return words;
    return words.filter(function (w) { return w.searchPlain.indexOf(q) !== -1; })
      .sort(function (a, b) { return a.searchPlain.indexOf(q) - b.searchPlain.indexOf(q); });
  }

  /* ---------------------------------------------------------- rendering */

  function rowHtml(w) {
    var known = Progress.isKnown(w.id);
    return '<div class="vocab-row' + (known ? ' is-known' : '') + (w.mine ? ' is-mine' : '') +
      (w.edited ? ' is-edited' : '') + '" data-id="' + w.id + '">' +
      '<button class="v-know" aria-label="Mark as known" aria-pressed="' + known + '" ' +
        'title="' + (known ? 'Known — tap to unmark' : 'Tap when you know this word') + '">✓</button>' +
      '<span class="v-fr">' + escapeHtml(w.fr) + '</span>' +
      '<span class="v-en">' + escapeHtml(w.en) + '</span>' +
      '<span class="v-tag">' + (POS_LABEL[w.pos] || w.pos) +
        (w.g ? ' · ' + GENDER_LABEL[w.g] : '') +
      '</span>' +
      // Its own cell rather than part of the tag, because the tag is the
      // one thing a narrow screen drops and this has to survive that.
      '<button class="v-edit" data-edit="' + w.id + '" ' +
        'title="' + (w.edited ? 'You corrected this one' : 'Correct this entry') + '">' +
        (w.edited ? 'edited' : 'edit') + '</button>' +
      '</div>';
  }

  function listHtml(words) {
    if (!words.length) {
      return '<div class="empty"><div class="empty-icon">🔍</div><p>No words match that.</p></div>';
    }
    return '<div class="vocab-list">' + words.map(rowHtml).join('') + '</div>';
  }

  // One delegated handler covers every list on the page. An embed is
  // refilled in place after an edit, so binding is once per container,
  // not once per fill, or the second tap would fire twice.
  function bindList(root) {
    if (root.dataset.vbound) return;
    root.dataset.vbound = '1';
    root.addEventListener('click', function (e) {
      var edit = e.target.closest('.v-edit');
      if (edit) {
        root.dispatchEvent(new CustomEvent('vocab:edit', {
          bubbles: true, detail: { id: edit.dataset.edit }
        }));
        return;
      }
      var btn = e.target.closest('.v-know');
      if (!btn) return;
      var row = btn.closest('.vocab-row');
      var on = Progress.toggleKnown(row.dataset.id);
      row.classList.toggle('is-known', on);
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('title', on ? 'Known — tap to unmark' : 'Tap when you know this word');
    });
  }

  /* ---------------------------------------------------------- adding words */

  // Fills in what can be read off the French side, so adding a word from
  // the phone is two fields and a tap rather than a form.
  function guess(fr) {
    var s = String(fr || '').trim().toLowerCase();
    var out = { pos: 'other', g: '' };

    // "le/la bénévole" is one noun that takes either gender, so it has to be
    // read before the plain-article branch, which would call it masculine.
    if (/^(le\s*\/\s*la|la\s*\/\s*le|un\s*\/\s*une|une\s*\/\s*un)\b/.test(s)) {
      return { pos: 'noun', g: 'mf' };
    }
    // "ancien/ne", "fort/e", "courageux/se": a word carrying its feminine
    // ending is an adjective by construction. Before the verb branch, or
    // "régulier/e" would be read as an infinitive in -er.
    if (/^[^\s/]+(\/[a-zà-ÿœæ']{1,3})+$/.test(s)) return { pos: 'adj', g: '' };

    // "les" before "le": alternation is ordered, and the shorter one would
    // match "les cheveux" and call it masculine.
    var article = s.match(/^(les|le|la|une|un|l')\s*/);
    if (article) {
      out.pos = 'noun';
      var a = article[1];
      out.g = a === 'le' || a === 'un' ? 'm' : a === 'la' || a === 'une' ? 'f' : a === 'les' ? 'pl' : '';
      return out;
    }
    // A reflexive is a verb however many words it runs to: "se lever".
    if (/^(se\s|s')/.test(s)) return { pos: 'verb', g: '' };
    if (/(er|ir|re|oir)$/.test(s)) {
      // Only a guess: "la mer" is caught by the article branch above, but
      // "cher" or "hier" would land here. Cheap to correct in the form.
      if (s.split(/\s+/).length === 1) out.pos = 'verb';
    }
    if (s.split(/\s+/).length > 2) out.pos = 'phrase';
    return out;
  }

  /* -------------------------------------------------- already have it? */

  // Same shape of key as Progress uses for its own duplicate check: case, an
  // accent, a leading article and the slash notation are not what makes a
  // word a different word, so "La Semaine" finds "la semaine".
  function key(fr) {
    return strip(String(fr || '').toLowerCase())
      .replace(/^(le|la|les|l'|un|une|des|du|de la)\s*/, '')
      .replace(/[^a-z0-9' ]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  var indexCache = null;

  function index() {
    if (indexCache) return indexCache;
    indexCache = {};
    // Yours go in last so an entry you edited is the one you are shown.
    all().slice().reverse().forEach(function (w) {
      var k = key(w.fr);
      if (k) indexCache[k] = w;
    });
    return indexCache;
  }

  // The whole point of the quick add: say so before a word is added twice,
  // whether the match is in the curated list or in your own.
  function findExisting(fr) {
    var k = key(fr);
    return k ? index()[k] || null : null;
  }

  // Accepts the same "fr - en" shape as data/vocab-source.txt, with or
  // without the leading number, so pasting from anywhere works.
  function parseBulk(text) {
    var rows = [];
    String(text || '').split(/\r?\n/).forEach(function (line) {
      line = line.trim();
      if (!line || line.charAt(0) === '#') return;
      line = line.replace(/^\d+[.)]\s*/, '');
      var m = line.split(/\s+[-–—]\s+|\s*[=:]\s*|\t+/);
      if (m.length < 2) return;
      var fr = m[0].trim();
      var en = m.slice(1).join(' - ').trim();
      if (!fr || !en) return;
      var g = guess(fr);
      rows.push({ fr: fr, en: en, pos: g.pos, g: g.g, themes: [] });
    });
    return rows;
  }

  // The reverse: the exact line format vocab-source.txt expects, so a word
  // can graduate from personal to curated by pasting and rebuilding.
  function exportMine() {
    var start = data ? data.source_count + 1 : 1;
    return mine().slice().reverse().map(function (w, i) {
      return (start + i) + '. ' + w.fr + ' - ' + w.en;
    }).join('\n');
  }

  // Fill one ::: vocab block. Separate from the sweep below so a block can
  // be redrawn after you correct a word in it, without touching the rest
  // of the lesson.
  function fillEmbed(el) {
    var words = byTheme(el.dataset.themes);
    el.innerHTML =
      '<h4>' + escapeHtml(el.dataset.themes.replace(/,/g, ' · ')) + ' — ' + words.length + ' words</h4>' +
      listHtml(words);
    bindList(el);
  }

  // Fill any ::: vocab blocks that the markdown renderer left behind.
  function hydrateEmbeds(root) {
    var embeds = root.querySelectorAll('.vocab-embed');
    if (!embeds.length) return Promise.resolve();
    return load().then(function () { embeds.forEach(fillEmbed); });
  }

  /* ---------------------------------------------------------- decks */

  // A deck is a themed slice of the vocabulary in one direction.
  function deck(id, name, words, dir) {
    return {
      id: id, name: name, dir: dir, size: words.length,
      cards: words.map(function (w) {
        return {
          id: w.id + ':' + dir,
          // The card id carries the direction; the known flag is per word,
          // so it needs the bare id too.
          wordId: w.id,
          front: dir === 'fr-en' ? w.fr : w.en,
          back: dir === 'fr-en' ? w.en : w.fr,
          fr: w.fr,
          // Reading the French aloud before an EN → FR card is flipped
          // would hand over the answer, so the button waits for the flip.
          frOnFront: dir === 'fr-en',
          tag: w.themes[0] === 'general' ? (POS_LABEL[w.pos] || '') : w.themes[0]
        };
      })
    };
  }

  // A word you have ticked as known is done with: it leaves the decks
  // rather than coming round again. Untick it and it comes back, with its
  // old box and schedule intact, because nothing about the card is deleted.
  function unknown(list) {
    return list.filter(function (w) { return !Progress.isKnown(w.id); });
  }

  function decks() {
    var out = [];
    if (unknown(mine()).length) {
      out.push(deck('mine-fr', 'My words (FR → EN)', unknown(mine()), 'fr-en'));
      out.push(deck('mine-en', 'My words (EN → FR)', unknown(mine()), 'en-fr'));
    }
    themes().forEach(function (t) {
      if (t === 'general') return;
      var words = unknown(byTheme(t));
      if (!words.length) return;
      out.push(deck('theme-' + t + '-fr', capitalise(t), words, 'fr-en'));
    });
    out.push(deck('all-fr', 'Everything (FR → EN)', unknown(all()), 'fr-en'));
    out.push(deck('all-en', 'Everything (EN → FR)', unknown(all()), 'en-fr'));
    var verbs = unknown(all()).filter(function (w) { return w.pos === 'verb'; });
    out.push(deck('verbs-fr', 'Verbs', verbs, 'fr-en'));
    var nouns = unknown(all()).filter(function (w) { return w.pos === 'noun' && w.g; });
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
    load: load, all: all, mine: mine, curated: curated,
    themes: themes, themeCounts: themeCounts,
    byTheme: byTheme, byId: byId, search: search,
    listHtml: listHtml, bindList: bindList,
    hydrateEmbeds: hydrateEmbeds, fillEmbed: fillEmbed,
    decks: decks, deckById: deckById,
    guess: guess, findExisting: findExisting, parseBulk: parseBulk, exportMine: exportMine,
    POS_LABEL: POS_LABEL, GENDER_LABEL: GENDER_LABEL
  };
})();
