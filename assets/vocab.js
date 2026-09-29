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
    // œ and æ do not decompose, so without this "œil" would key as "il".
    return strip(String(fr || '').toLowerCase().replace(/œ/g, 'oe').replace(/æ/g, 'ae'))
      // A space after the article, or "lever" keys as "ver", like "laver".
      .replace(/^(?:(?:le|la|les|un|une|des|du|de la)\s+|l')/, '')
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

  /* ------------------------------------------------ the dictionary form

     A word tapped on a page is the word as it stands in the sentence:
     "Hier,", "qu'il", "études", "mangeons". The list wants it the way a
     dictionary has it, so this takes off the punctuation, the capital a
     sentence gave it and any elided word in front of it except l', which is
     the article and says the gender. Then, where the words before it say
     what it is, a verb goes back to its infinitive and a plural noun to its
     singular. "études" alone is left alone: it is a noun as often as not.
     "tu études" is a verb, "les études" a plural.

     There is no dictionary here, only the endings and the word list. Where
     the endings allow several infinitives, the one already in the list
     wins; otherwise the commonest pattern does, and the quick add shows
     what changed and offers the original back. */

  var SUBJECT = ['je', "j'", 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles', 'qui'];
  // Before a verb and not before a noun. le, la and les are both, so they
  // are not here.
  var BEFORE_VERB = SUBJECT.concat(['ne', "n'", 'me', "m'", 'te', "t'", 'se', "s'", 'y', 'en', 'lui', 'leur']);
  var PLURAL_DET = ['les', 'des', 'mes', 'tes', 'ses', 'nos', 'vos', 'leurs', 'ces', 'aux',
    'quelques', 'plusieurs', 'certains', 'certaines', 'deux', 'trois', 'quatre', 'cinq', 'six',
    'sept', 'huit', 'neuf', 'dix', 'vingt', 'cent', 'mille', 'beaucoup de', 'nombreux', 'nombreuses'];
  var AVOIR_AUX = ['ai', 'as', 'a', 'avons', 'avez', 'ont', 'avais', 'avait', 'avions', 'aviez',
    'avaient', 'aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront', 'aurais', 'aurait', 'avoir'];
  var ETRE_AUX = ['suis', 'es', 'est', 'sommes', 'êtes', 'sont', 'étais', 'était', 'étions', 'étiez',
    'étaient', 'serai', 'sera', 'serons', 'serez', 'seront', 'serais', 'serait', 'être'];
  var AUX = AVOIR_AUX.concat(ETRE_AUX);

  // The irregular verbs, by the forms a learner meets. Checked before any
  // ending rule, so "ont" is avoir and not some verb in -er.
  var IRREGULAR = {
    'être': 'suis es est sommes êtes sont étais était étions étiez étaient été serai seras sera serons serez seront serais serait serions seriez seraient sois soit soyons soyez soient fus fut furent',
    'avoir': 'ai as a avons avez ont avais avait avions aviez avaient eu eue eus eues aurai auras aura aurons aurez auront aurais aurait aurions auriez auraient aie aies ait ayons ayez aient eut',
    'aller': 'vais vas va allons allez vont allais allait allions alliez allaient allé allée allés allées irai iras ira irons irez iront irais irait irions iriez iraient aille ailles aillent',
    'faire': 'fais fait faisons faites font faisais faisait faisions faisiez faisaient faite faits faites ferai feras fera ferons ferez feront ferais ferait fasse fasses fassent fit',
    'pouvoir': 'peux peut pouvons pouvez peuvent pouvais pouvait pouvions pouviez pouvaient pu pourrai pourras pourra pourrons pourrez pourront pourrais pourrait puisse puissent',
    'vouloir': 'veux veut voulons voulez veulent voulais voulait voulions vouliez voulaient voulu voudrai voudras voudra voudrons voudrez voudront voudrais voudrait veuille veuillez',
    'devoir': 'dois doit devons devez doivent devais devait devions deviez devaient dû due dus devrai devras devra devrons devrez devront devrais devrait doive',
    'savoir': 'sais sait savons savez savent savais savait savions saviez savaient su saurai sauras saura saurons saurez sauront saurais saurait sache saches sachons sachez',
    'venir': 'viens vient venons venez viennent venais venait venions veniez venaient venu venue venus venues viendrai viendras viendra viendrons viendrez viendront viendrais viendrait vienne vint',
    'tenir': 'tiens tient tenons tenez tiennent tenais tenait tenu tenue tiendrai tiendra tiendrait tienne',
    'prendre': 'prends prend prenons prenez prennent prenais prenait prenions preniez prenaient pris prise prises prendrai prendras prendra prendrons prendrez prendront prendrais prendrait prenne prennes prit',
    'mettre': 'mets met mettons mettez mettent mettais mettait mis mise mises mettrai mettra mettrait mette mit',
    'dire': 'dis dit disons dites disent disais disait disions disiez disaient dite dits dites dirai diras dira dirons direz diront dirais dirait dise',
    'voir': 'vois voit voyons voyez voient voyais voyait voyions voyiez voyaient vu vue vus vues verrai verras verra verrons verrez verront verrais verrait voie vit',
    'boire': 'bois boit buvons buvez boivent buvais buvait bu bue boirai boira boive',
    'lire': 'lis lit lisons lisez lisent lisais lisait lu lue lus lues lirai lira lise',
    'écrire': 'écris écrit écrivons écrivez écrivent écrivais écrivait écrite écrits écrites écrirai écrira écrive',
    'croire': 'crois croit croyons croyez croient croyais croyait cru crue croirai croira croie',
    'connaître': 'connais connaît connait connaissons connaissez connaissent connaissais connaissait connu connue connus connaîtrai connaîtra connaisse',
    'partir': 'pars part partons partez partent partais partait parti partie partis parties partirai partira parte',
    'sortir': 'sors sort sortons sortez sortent sortais sortait sorti sortie sortis sorties sortirai sortira sorte',
    'dormir': 'dors dort dormons dormez dorment dormais dormait dormi dormirai dormira dorme',
    'sentir': 'sens sent sentons sentez sentent sentais sentait senti sentie sentirai sentira sente',
    'servir': 'sers sert servons servez servent servais servait servi servie servirai servira serve',
    'vivre': 'vis vit vivons vivez vivent vivais vivait vécu vécue vivrai vivra vive',
    'suivre': 'suit suivons suivez suivent suivais suivait suivi suivie suivrai suivra suive',
    'ouvrir': 'ouvre ouvres ouvrons ouvrez ouvrent ouvrais ouvrait ouvert ouverte ouverts ouvertes ouvrirai ouvrira',
    'offrir': 'offre offres offrons offrez offrent offrais offrait offert offerte offrirai offrira',
    'découvrir': 'découvre découvres découvrons découvrez découvrent découvrait découvert découverte',
    'souffrir': 'souffre souffres souffrons souffrez souffrent souffrait souffert',
    'courir': 'cours court courons courez courent courais courait couru courrai courra',
    'mourir': 'meurs meurt mourons mourez meurent mourait mort morte morts mourra',
    'naître': 'nais naît naissons naissent naissait né née nés nées naquit',
    'recevoir': 'reçois reçoit recevons recevez reçoivent recevais recevait reçu reçue recevrai recevra reçoive',
    'falloir': 'faut fallait fallu faudra faudrait faille',
    'pleuvoir': 'pleut pleuvait plu pleuvra pleuvrait',
    'envoyer': 'envoie envoies envoient envoyons envoyez envoyais envoyait envoyé envoyée enverrai enverra enverrait',
    'asseoir': 'assieds assied asseyons asseyez asseyent assis assise',
    'rire': 'ris rit rions riez rient riais riait ri rirai rira',
    'plaire': 'plais plaît plait plaisons plaisent plaisait plu plaira',
    'conduire': 'conduis conduit conduisons conduisez conduisent conduisais conduisait conduite conduirai conduira',
    'craindre': 'crains craint craignons craignez craignent craignais craignait crainte',
    'éteindre': 'éteins éteint éteignons éteignez éteignent éteignait éteinte',
    'peindre': 'peins peint peignons peignez peignent peignait peinte',
    'joindre': 'joins joint joignons joignez joignent joignait jointe',
    'valoir': 'vaux vaut valons valez valent valait valu vaudra vaudrait',
    'battre': 'bats bat battons battez battent battait battu battue',
    'acquérir': 'acquiers acquiert acquérons acquièrent acquis acquise',
    'suffire': 'suffis suffit suffisons suffisez suffisent suffisait suffi'
  };
  // The futures and conditionals built on a stem of their own: pourriez,
  // viendrons, saurait.
  var FUTURE_STEM = { 'ser': 'être', 'aur': 'avoir', 'ir': 'aller', 'fer': 'faire', 'pourr': 'pouvoir',
    'voudr': 'vouloir', 'devr': 'devoir', 'saur': 'savoir', 'viendr': 'venir', 'tiendr': 'tenir',
    'verr': 'voir', 'enverr': 'envoyer', 'faudr': 'falloir', 'vaudr': 'valoir', 'courr': 'courir',
    'mourr': 'mourir', 'recevr': 'recevoir', 'pleuvr': 'pleuvoir' };
  var FUTURE_END = /(ai|as|a|ons|ez|ont|ais|ait|ions|iez|aient)$/;
  var IRREG = {};
  Object.keys(IRREGULAR).forEach(function (inf) {
    IRREGULAR[inf].split(' ').forEach(function (f) { if (!IRREG[f]) IRREG[f] = inf; });
  });
  // Families that take a prefix and conjugate like the verb inside them:
  // comprendre, devenir, obtenir, promettre, refaire, prévoir.
  var FAMILY = ['prendre', 'venir', 'tenir', 'mettre', 'faire', 'voir', 'dire', 'écrire', 'partir', 'sortir',
    'connaître'];
  var PREFIX = ['ap', 'com', 'sur', 're', 'ré', 'de', 'dé', 'ob', 'sou', 'con', 'pro', 'ad', 'entre',
    'pré', 'par', 'sub', 'main', 'per', 'sous', 'contre', 'inter', 'trans', 'con', 'ap', 'dé', 'd', 'in'];

  // Ending rules, longest first. Each gives the infinitive ending that
  // replaces it. Order within a length does not matter: every match is a
  // candidate, and the list or the preference below picks between them.
  var RULES = [
    ['issaient', 'ir'], ['issions', 'ir'], ['issiez', 'ir'], ['issais', 'ir'], ['issait', 'ir'],
    ['issant', 'ir'], ['issons', 'ir'], ['issez', 'ir'], ['issent', 'ir'], ['isse', 'ir'],
    ['eraient', 'er'], ['erions', 'er'], ['eriez', 'er'], ['erais', 'er'], ['erait', 'er'],
    ['erons', 'er'], ['eront', 'er'], ['erez', 'er'], ['eras', 'er'], ['erai', 'er'], ['era', 'er'],
    ['iraient', 'ir'], ['irions', 'ir'], ['irais', 'ir'], ['irait', 'ir'], ['irons', 'ir'],
    ['iront', 'ir'], ['irez', 'ir'], ['iras', 'ir'], ['irai', 'ir'], ['ira', 'ir'],
    ['draient', 'dre'], ['drais', 'dre'], ['drait', 'dre'], ['drons', 'dre'], ['dront', 'dre'],
    ['drez', 'dre'], ['dras', 'dre'], ['drai', 'dre'], ['dra', 'dre'],
    ['daient', 'dre'], ['dions', 'dre'], ['diez', 'dre'], ['dais', 'dre'], ['dait', 'dre'],
    ['dant', 'dre'], ['dons', 'dre'], ['dez', 'dre'], ['dent', 'dre'], ['dues', 'dre'],
    ['dus', 'dre'], ['due', 'dre'], ['du', 'dre'], ['ds', 'dre'], ['d', 'dre'],
    ['aient', 'er'], ['ions', 'er'], ['iez', 'er'], ['ais', 'er'], ['ait', 'er'], ['ant', 'er'],
    ['ons', 'er'], ['ez', 'er'], ['ent', 'er'], ['ées', 'er'], ['és', 'er'], ['ée', 'er'],
    ['es', 'er'], ['é', 'er'], ['e', 'er'],
    ['ies', 'ir'], ['ie', 'ir'], ['is', 'ir'], ['it', 'ir'], ['i', 'ir']
  ];

  // Words that are never the verb or the noun in question, whatever is in
  // front of them: "a une", "c'est moi", "ne lui", "est vraiment".
  var FUNCTION = BEFORE_VERB.concat(PLURAL_DET, ['le', 'la', 'un', 'une', 'du', 'de', 'moi', 'toi',
    'soi', 'eux', 'pas', 'plus', 'jamais', 'rien', 'personne', 'bien', 'très', 'trop', 'déjà',
    'encore', 'toujours', 'aussi', 'si', 'là', 'ici', 'que', 'quoi', 'mon', 'ton', 'son', 'ma',
    'ta', 'sa', 'notre', 'votre', 'leur', 'ce', 'cet', 'cette', 'tout', 'tous', 'toute', 'toutes']);
  var PARTICIPLE = /(é|ée|és|ées|i|ie|is|ies|u|ue|us|ues|it|ite|its|ites|ert|erte|erts|ertes|eint|einte|aint|ointe?|ort|orte)$/;

  function norm(w) { return String(w || '').toLowerCase().replace(/’/g, "'"); }
  function inList(fr) { return !!findExisting(fr); }

  // The spelling changes the -er verbs make in their stem, undone:
  // mangeons, commençons, ennuie, achète, préfère, appelle.
  function stemVariants(stem, inf) {
    var out = [stem];
    if (inf !== 'er') return out;
    if (/ge$/.test(stem)) out.push(stem.slice(0, -1));
    if (/ç$/.test(stem)) out.push(stem.slice(0, -1) + 'c');
    if (/i$/.test(stem)) out.push(stem.slice(0, -1) + 'y');
    var grave = stem.lastIndexOf('è');
    if (grave !== -1) {
      var head = stem.slice(0, grave), tail = stem.slice(grave + 1);
      // préfère and répète keep an é, achète and lève lose the accent. The
      // tell is an é earlier in the word.
      var acute = head + 'é' + tail, bare = head + 'e' + tail;
      // No infinitive keeps the è, so the stem as written goes last.
      out = /é/.test(head) ? [acute, bare] : [bare, acute];
    }
    if (/(ll|tt)$/.test(stem) && /(appel|jet|rappel|renouvel|épel|ficel)/.test(stem.slice(0, -1))) {
      out.splice(1, 0, stem.slice(0, -1));
    } else if (/(ll|tt)$/.test(stem)) {
      out.push(stem.slice(0, -1));
    }
    return out;
  }

  // The infinitive of a form known to be a verb. Candidates in the list
  // come first; then the ones the endings make likeliest.
  function infinitive(w) {
    if (IRREG[w]) return IRREG[w];
    var fe = FUTURE_END.exec(w);
    if (fe && FUTURE_STEM[w.slice(0, -fe[1].length)]) return FUTURE_STEM[w.slice(0, -fe[1].length)];
    for (var f = 0; f < FAMILY.length; f++) {
      var fam = FAMILY[f], forms = IRREGULAR[fam].split(' ');
      for (var i = 0; i < forms.length; i++) {
        var head = w.slice(0, w.length - forms[i].length);
        if (head && w.slice(-forms[i].length) === forms[i] && PREFIX.indexOf(head) !== -1) {
          var cand = head + fam;
          if (head === 'd' && fam === 'écrire') return 'décrire';
          if (inList(cand) || head.length > 1) return cand;
        }
      }
    }
    var cands = [];
    RULES.forEach(function (r) {
      var end = r[0];
      if (w.length <= end.length + 1 || w.slice(-end.length) !== end) return;
      var stem = w.slice(0, -end.length);
      if (r[1] === 'dre') {
        // attend-ons, but demand-ons: -dre only after -en, -on, -er, -or,
        // -an in répandre and a few more, never after the -and of demander.
        var st = stem + 'd';
        cands.push({ v: st + 're', rank: /(en|on|er|or|ou)d$/.test(st) ? 1 : 4 });
        return;
      }
      stemVariants(stem, r[1]).forEach(function (s, k) {
        var rank = r[1] === 'er' ? 2 : 3;
        // finis, finit, fini: the -ir reading of a bare -i ending beats -er.
        if (r[1] === 'ir' && /^(is|it|i|ie|ies)$/.test(end)) rank = /a$/.test(stem) ? 9 : 1;
        cands.push({ v: s + r[1], rank: rank + k * 0.1 });
      });
    });
    if (!cands.length) return null;
    for (var c = 0; c < cands.length; c++) {
      if (inList(cands[c].v) || inList('se ' + cands[c].v)) return cands[c].v;
    }
    cands.sort(function (a, b) { return a.rank - b.rank; });
    return cands[0].v;
  }

  var SAME_IN_PLURAL = ('bras pays prix voix fois mois temps corps dos fils gens jus nez poids pas repas ' +
    'souris avis cours discours succès progrès accès français anglais bois choix croix riz gaz héros ' +
    'ananas autobus bus virus os sens colis tapis radis puits univers vers lilas matelas cas bas tas ' +
    'palais relais frais marais tennis mais legs remords secours concours parcours taux époux prix ' +
    'heureux vieux sérieux curieux joyeux paresseux nerveux dangereux délicieux ennuyeux amoureux ' +
    'jaloux doux roux faux').split(' ');

  // The singular of a form known to be a plural.
  function singular(w) {
    if (w === 'yeux') return 'œil';
    if (SAME_IN_PLURAL.indexOf(w) !== -1) return w;
    var cands = [];
    if (/eaux$/.test(w)) cands.push(w.slice(0, -1));
    if (/aux$/.test(w)) cands.push(w.slice(0, -3) + 'al', w.slice(0, -3) + 'ail');
    if (/eux$/.test(w)) cands.push(w.slice(0, -1));
    if (/oux$/.test(w)) cands.push(w.slice(0, -1));
    if (/[^s]s$/.test(w)) cands.push(w.slice(0, -1));
    if (!cands.length) return w;
    for (var i = 0; i < cands.length; i++) if (inList(cands[i])) return cands[i];
    return cands[0];
  }

  // What the words in front of it say it is: 'verb', 'participle',
  // 'plural' or nothing. ctx is { prev, prev2 }, the two words before it
  // in the same sentence.
  function roleOf(w, ctx, elided) {
    if (elided && /^([jnmts]')$/.test(elided)) return 'verb';
    if (elided === "c'" && IRREG[w] === 'être') return 'verb';
    var p = norm(ctx.prev), p2 = norm(ctx.prev2);
    if (!p) return '';
    if (AUX.indexOf(p) !== -1 || (p === 'pas' && AUX.indexOf(p2) !== -1)) return 'participle';
    if (BEFORE_VERB.indexOf(p) !== -1) return 'verb';
    if (p === 'pas' || p === 'jamais' || p === 'plus') return BEFORE_VERB.indexOf(p2) !== -1 ? 'verb' : '';
    if (PLURAL_DET.indexOf(p) !== -1 || PLURAL_DET.indexOf(p2 + ' ' + p) !== -1) return 'plural';
    return '';
  }

  // The last two words before a word, stopping at the end of a sentence.
  function lastWords(text) {
    var ws = String(text || '').split(/\s+/).filter(Boolean);
    var out = [];
    for (var i = ws.length - 1; i >= 0 && out.length < 2; i--) {
      if (/[.!?;:»«"]$/.test(ws[i])) break;
      // "j'ai" is two words: the subject and the auxiliary.
      var parts = ws[i].toLowerCase().replace(/’/g, "'").replace(/[,()]/g, '').match(/[^']+'?|'/g) || [];
      for (var k = parts.length - 1; k >= 0 && out.length < 2; k--) out.push(parts[k]);
    }
    return { prev: out[0] || '', prev2: out[1] || '' };
  }

  // { fr, full, dropped, change }: fr goes in the list, full is what was
  // tapped, change says what was done to it ('infinitive' or 'singular').
  // ctx is optional: { prev, prev2 }, or { before: 'the text in front' }.
  function baseForm(word, ctx) {
    ctx = ctx || {};
    if (ctx.before !== undefined) ctx = lastWords(ctx.before);
    var full = String(word == null ? '' : word).trim()
      .replace(/^[^a-zà-öø-ÿœæ]+/i, '').replace(/[^a-zà-öø-ÿœæ]+$/i, '');
    full = norm(full);
    var out = { fr: full, full: full, dropped: [], change: '' };

    // "tu études", "les maisons": a selection that starts with the words
    // that decide it is worked like the last word with those in front.
    var toks = full.split(/\s+/);
    if (toks.length > 1) {
      // "j'ai" is two words here too.
      var lead = [];
      toks.slice(0, -1).forEach(function (t) { lead = lead.concat(t.match(/[^']+'?|'/g) || []); });
      var ok = lead.every(function (t) {
        return BEFORE_VERB.indexOf(t) !== -1 || PLURAL_DET.indexOf(t) !== -1 ||
          AUX.indexOf(t) !== -1 || t === 'pas';
      });
      if (!ok) return out;
      var inner = baseForm(toks[toks.length - 1], {
        prev: lead[lead.length - 1], prev2: lead[lead.length - 2] || ctx.prev || ''
      });
      inner.full = full;
      return inner;
    }

    var elided = '';
    var m = /^((?:jusqu|lorsqu|puisqu|qu|[jnsmtcd])')(.+)$/.exec(out.fr);
    if (m && m[2].length > 1) { elided = m[1]; out.dropped.push(elided); out.fr = m[2]; }

    var w = out.fr, role = roleOf(w, ctx, elided);
    // Already in the list as it stands, or a word no rule should touch.
    if (inList(w) || FUNCTION.indexOf(w) !== -1 || /ment$/.test(w)) return out;
    // After avoir or être it is a participle only if it ends like one: "est
    // important" is an adjective, "a mangé" a verb.
    if (role === 'participle' && !IRREG[w] && !PARTICIPLE.test(w)) role = '';
    // "était gratuit", "est petit": after être an -it is an adjective.
    if (role === 'participle' && !IRREG[w] && /its?|ites?$/.test(w) &&
        ETRE_AUX.indexOf(norm(ctx.prev)) !== -1) role = '';
    if (role === 'verb' || role === 'participle') {
      var inf = infinitive(w);
      if (inf && inf !== w) {
        // se lave, s'appelle, je me lave: the list files these under "se".
        var p = norm(ctx.prev), p2 = norm(ctx.prev2);
        var refl = elided === "s'" || p === 'se' || p === "s'" ||
          ((p === 'me' || p === "m'") && (p2 === 'je' || p2 === "j'")) ||
          ((p === 'te' || p === "t'") && p2 === 'tu') ||
          (p === 'nous' && p2 === 'nous') || (p === 'vous' && p2 === 'vous') ||
          // s'est levée, se sont assis, me suis lavé
          (ETRE_AUX.indexOf(p) !== -1 && ["s'", 'se', "m'", 'me', "t'", 'te'].indexOf(p2) !== -1);
        if (refl) inf = (/^[aeiouhéèêâîôû]/.test(inf) ? "s'" : 'se ') + inf;
        out.fr = inf;
        out.change = 'infinitive';
      }
    } else if (role === 'plural' && /[sx]$/.test(w)) {
      var one = singular(w);
      if (one !== w) { out.fr = one; out.change = 'singular'; }
    } else {
      // No context, but the list knows the singular: "fenêtres" is "fenêtre".
      var sg = /[sx]$/.test(w) ? singular(w) : w;
      if (sg !== w && inList(sg)) { out.fr = sg; out.change = 'singular'; }
      // Or the infinitive: "Odile discutait", a verb opening a line.
      else if (!role) {
        var guessInf = infinitive(w);
        if (guessInf && guessInf !== w) {
          // "souvenait" is se souvenir, not the noun le souvenir.
          var plain = findExisting(guessInf);
          var se = (/^[aeiouhéèêâîôû]/.test(guessInf) ? "s'" : 'se ') + guessInf;
          var pick = plain && plain.pos === 'verb' ? guessInf : inList(se) ? se : plain ? guessInf : '';
          if (pick) { out.fr = pick; out.change = 'infinitive'; }
        }
      }
    }
    // The list's own spelling, article and all, when it has the word.
    var hit = out.change && findExisting(out.fr);
    if (hit) out.fr = hit.fr;
    return out;
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
    guess: guess, findExisting: findExisting, baseForm: baseForm, parseBulk: parseBulk, exportMine: exportMine,
    POS_LABEL: POS_LABEL, GENDER_LABEL: GENDER_LABEL
  };
})();
