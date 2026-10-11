// Full "vac" bank, 46 questions, rebuilt from the report of 2026-10-10.
// Keys and explanations are the page's own; accepted variants widened.
// ids are vacf-NN in page order. `from` is the original vac-NN id where it is known.
// `missed`: 'sitting' = wrong in the 2026-10-10 sitting, 'closing' = first answered on
// 2026-10-11 and wrong first time (was 'blank'),
// 'earlier' = wrong in earlier sittings, fixed by the end, null = clean first time.
// Shell: key 'drill-vac'; deal missed != null first (priority).
window.BANK = {
  "title": "Verbs, adverbs, comparisons",
  "key": "drill-vac",
  "intro": "Translate into French. Part II chapters 11-13 (comparatives, adverbs in -ment, verb + à / de + infinitive), mixed with the tenses, pronouns and subjunctive before them. (tu) / (vous) says which you.",
  "questions": [
    {
      "id": "vacf-01",
      "en": "I remember having met her, but I can't remember her name.",
      "a": [
        "Je me souviens de l'avoir rencontrée, mais je n'arrive pas à me souvenir de son nom.",
        "Je me souviens de l'avoir rencontrée, mais je ne peux pas me souvenir de son nom.",
        "Je me souviens de l'avoir rencontrée, mais je ne me souviens pas de son nom.",
        "Je me souviens de l'avoir rencontrée, mais je ne me souviens plus de son nom.",
        "Je me rappelle l'avoir rencontrée, mais je n'arrive pas à me rappeler son nom.",
        "Je me rappelle l'avoir rencontrée, mais je ne peux pas me rappeler son nom.",
        "Je me rappelle l'avoir rencontrée, mais je ne me rappelle pas son nom."
      ],
      "vocab": "se souvenir de - to remember / se rappeler - to remember (no de)",
      "why": "se souvenir de + past infinitive (avoir + participle). rencontrée agrees with l' (her), a direct object placed before avoir. se souvenir always keeps its de: se souvenir de son nom; se rappeler takes none. For 'can't remember', French prefers n'arrive pas à or plain ne ... pas over pouvoir.",
      "tags": [
        "reflexive-verbs",
        "verb-prepositions",
        "pronouns",
        "passe-compose"
      ],
      "from": "vac-11",
      "missed": "earlier"
    },
    {
      "id": "vacf-02",
      "en": "Stop complaining and start working! (tu)",
      "a": [
        "Arrête de te plaindre et commence à travailler !",
        "Arrête de te plaindre et mets-toi à travailler !",
        "Arrête de râler et commence à travailler !",
        "Arrête de râler et mets-toi à travailler !"
      ],
      "vocab": "se plaindre - to complain",
      "why": "arrêter de, commencer à / se mettre à. The reflexive stays inside the infinitive: de te plaindre.",
      "tags": [
        "imperatif-gerondif",
        "verb-prepositions",
        "reflexive-verbs"
      ],
      "from": "vac-06",
      "missed": "earlier"
    },
    {
      "id": "vacf-03",
      "en": "My brother is taller than me, but I run faster than him.",
      "a": [
        "Mon frère est plus grand que moi, mais je cours plus vite que lui."
      ],
      "vocab": "courir - to run",
      "why": "plus + adjective, plus + adverb, same frame. After que, stressed pronouns: moi, lui.",
      "tags": [
        "comparatives",
        "pronouns"
      ],
      "missed": null
    },
    {
      "id": "vacf-04",
      "en": "She is the most intelligent student in the class, and she is the one who works the most.",
      "a": [
        "C'est l'élève la plus intelligente de la classe, et c'est elle qui travaille le plus.",
        "C'est l'étudiante la plus intelligente de la classe, et c'est elle qui travaille le plus.",
        "Elle est l'élève la plus intelligente de la classe, et c'est elle qui travaille le plus.",
        "Elle est l'étudiante la plus intelligente de la classe, et c'est elle qui travaille le plus."
      ],
      "vocab": "un(e) élève - a pupil / un(e) étudiant(e) - a student",
      "why": "intelligente goes after the noun, so the article repeats: l'élève la plus intelligente. With an adverb the article is always le: travaille le plus.",
      "tags": [
        "comparatives",
        "adjectives"
      ],
      "from": "vac-32",
      "missed": "earlier"
    },
    {
      "id": "vacf-05",
      "en": "We need a car, but we don't have enough money to buy one.",
      "a": [
        "On a besoin d'une voiture, mais on n'a pas assez d'argent pour en acheter une.",
        "On a besoin d'une voiture, mais nous n'avons pas assez d'argent pour en acheter une.",
        "Nous avons besoin d'une voiture, mais on n'a pas assez d'argent pour en acheter une.",
        "Nous avons besoin d'une voiture, mais nous n'avons pas assez d'argent pour en acheter une."
      ],
      "vocab": "avoir besoin de - to need",
      "why": "avoir besoin de. 'One' after a quantity is en ... une: pour en acheter une.",
      "tags": [
        "verb-prepositions",
        "quantity",
        "y-en"
      ],
      "from": "vac-44",
      "missed": "earlier"
    },
    {
      "id": "vacf-06",
      "en": "I'm not used to getting up so early; I keep falling asleep in meetings.",
      "a": [
        "Je ne suis pas habitué à me lever si tôt, je n'arrête pas de m'endormir en réunion.",
        "Je ne suis pas habitué à me lever si tôt, je n'arrête pas de m'endormir en réunions.",
        "Je ne suis pas habitué à me lever si tôt, je n'arrête pas de m'endormir pendant les réunions.",
        "Je ne suis pas habitué à me lever si tôt, je continue à m'endormir en réunion.",
        "Je ne suis pas habitué à me lever si tôt, je continue à m'endormir en réunions.",
        "Je ne suis pas habitué à me lever si tôt, je continue à m'endormir pendant les réunions.",
        "Je ne suis pas habitué à me lever si tôt, je continue de m'endormir en réunion.",
        "Je ne suis pas habitué à me lever si tôt, je continue de m'endormir en réunions.",
        "Je ne suis pas habitué à me lever si tôt, je continue de m'endormir pendant les réunions.",
        "Je ne suis pas habitué à me lever tellement tôt, je n'arrête pas de m'endormir en réunion.",
        "Je ne suis pas habitué à me lever tellement tôt, je n'arrête pas de m'endormir en réunions.",
        "Je ne suis pas habitué à me lever tellement tôt, je n'arrête pas de m'endormir pendant les réunions.",
        "Je ne suis pas habitué à me lever tellement tôt, je continue à m'endormir en réunion.",
        "Je ne suis pas habitué à me lever tellement tôt, je continue à m'endormir en réunions.",
        "Je ne suis pas habitué à me lever tellement tôt, je continue à m'endormir pendant les réunions.",
        "Je ne suis pas habitué à me lever tellement tôt, je continue de m'endormir en réunion.",
        "Je ne suis pas habitué à me lever tellement tôt, je continue de m'endormir en réunions.",
        "Je ne suis pas habitué à me lever tellement tôt, je continue de m'endormir pendant les réunions.",
        "Je ne suis pas habituée à me lever si tôt, je n'arrête pas de m'endormir en réunion.",
        "Je ne suis pas habituée à me lever si tôt, je n'arrête pas de m'endormir en réunions.",
        "Je ne suis pas habituée à me lever si tôt, je n'arrête pas de m'endormir pendant les réunions.",
        "Je ne suis pas habituée à me lever si tôt, je continue à m'endormir en réunion.",
        "Je ne suis pas habituée à me lever si tôt, je continue à m'endormir en réunions.",
        "Je ne suis pas habituée à me lever si tôt, je continue à m'endormir pendant les réunions.",
        "Je ne suis pas habituée à me lever si tôt, je continue de m'endormir en réunion.",
        "Je ne suis pas habituée à me lever si tôt, je continue de m'endormir en réunions.",
        "Je ne suis pas habituée à me lever si tôt, je continue de m'endormir pendant les réunions.",
        "Je ne suis pas habituée à me lever tellement tôt, je n'arrête pas de m'endormir en réunion.",
        "Je ne suis pas habituée à me lever tellement tôt, je n'arrête pas de m'endormir en réunions.",
        "Je ne suis pas habituée à me lever tellement tôt, je n'arrête pas de m'endormir pendant les réunions.",
        "Je ne suis pas habituée à me lever tellement tôt, je continue à m'endormir en réunion.",
        "Je ne suis pas habituée à me lever tellement tôt, je continue à m'endormir en réunions.",
        "Je ne suis pas habituée à me lever tellement tôt, je continue à m'endormir pendant les réunions.",
        "Je ne suis pas habituée à me lever tellement tôt, je continue de m'endormir en réunion.",
        "Je ne suis pas habituée à me lever tellement tôt, je continue de m'endormir en réunions.",
        "Je ne suis pas habituée à me lever tellement tôt, je continue de m'endormir pendant les réunions.",
        "Je n'ai pas l'habitude de me lever si tôt, je n'arrête pas de m'endormir en réunion.",
        "Je n'ai pas l'habitude de me lever si tôt, je n'arrête pas de m'endormir en réunions.",
        "Je n'ai pas l'habitude de me lever si tôt, je n'arrête pas de m'endormir pendant les réunions.",
        "Je n'ai pas l'habitude de me lever si tôt, je continue à m'endormir en réunion.",
        "Je n'ai pas l'habitude de me lever si tôt, je continue à m'endormir en réunions.",
        "Je n'ai pas l'habitude de me lever si tôt, je continue à m'endormir pendant les réunions.",
        "Je n'ai pas l'habitude de me lever si tôt, je continue de m'endormir en réunion.",
        "Je n'ai pas l'habitude de me lever si tôt, je continue de m'endormir en réunions.",
        "Je n'ai pas l'habitude de me lever si tôt, je continue de m'endormir pendant les réunions.",
        "Je n'ai pas l'habitude de me lever tellement tôt, je n'arrête pas de m'endormir en réunion.",
        "Je n'ai pas l'habitude de me lever tellement tôt, je n'arrête pas de m'endormir en réunions.",
        "Je n'ai pas l'habitude de me lever tellement tôt, je n'arrête pas de m'endormir pendant les réunions.",
        "Je n'ai pas l'habitude de me lever tellement tôt, je continue à m'endormir en réunion.",
        "Je n'ai pas l'habitude de me lever tellement tôt, je continue à m'endormir en réunions.",
        "Je n'ai pas l'habitude de me lever tellement tôt, je continue à m'endormir pendant les réunions.",
        "Je n'ai pas l'habitude de me lever tellement tôt, je continue de m'endormir en réunion.",
        "Je n'ai pas l'habitude de me lever tellement tôt, je continue de m'endormir en réunions.",
        "Je n'ai pas l'habitude de me lever tellement tôt, je continue de m'endormir pendant les réunions."
      ],
      "vocab": "s'endormir - to fall asleep",
      "why": "être habitué à, avoir l'habitude de. 'Keep doing' is ne pas arrêter de. The reflexive pronoun follows the subject of the infinitive: me lever, m'endormir.",
      "tags": [
        "reflexive-verbs",
        "verb-prepositions"
      ],
      "from": "vac-10",
      "missed": "earlier"
    },
    {
      "id": "vacf-07",
      "en": "It's the first time I've managed to finish a book in French.",
      "a": [
        "C'est la première fois que j'arrive à finir un livre en français.",
        "C'est la première fois que je réussis à finir un livre en français.",
        "C'est la première fois que je parviens à finir un livre en français.",
        "C'est la première fois que j'ai réussi à finir un livre en français."
      ],
      "vocab": "arriver à / réussir à - to manage to",
      "why": "la première fois que takes the indicative, often the present where English uses 'I've'. arriver / réussir à.",
      "tags": [
        "verb-prepositions",
        "passe-compose"
      ],
      "missed": null
    },
    {
      "id": "vacf-08",
      "en": "He speaks English better than I do, but his accent is worse.",
      "a": [
        "Il parle anglais mieux que moi, mais son accent est pire.",
        "Il parle anglais mieux que moi, mais son accent est pire que le mien.",
        "Il parle anglais mieux que moi, mais son accent est plus mauvais.",
        "Il parle anglais mieux que moi, mais son accent est plus mauvais que le mien.",
        "Il parle mieux anglais que moi, mais son accent est pire.",
        "Il parle mieux anglais que moi, mais son accent est pire que le mien.",
        "Il parle mieux anglais que moi, mais son accent est plus mauvais.",
        "Il parle mieux anglais que moi, mais son accent est plus mauvais que le mien.",
        "Il parle mieux l'anglais que moi, mais son accent est pire.",
        "Il parle mieux l'anglais que moi, mais son accent est pire que le mien.",
        "Il parle mieux l'anglais que moi, mais son accent est plus mauvais.",
        "Il parle mieux l'anglais que moi, mais son accent est plus mauvais que le mien."
      ],
      "vocab": "un accent - an accent",
      "why": "How he speaks: mieux (adverb). What the accent is like: pire (adjective). 'Than I do' is que moi.",
      "tags": [
        "comparatives",
        "adverbs-ment"
      ],
      "from": "vac-37",
      "missed": "earlier"
    },
    {
      "id": "vacf-09",
      "en": "My new flat is smaller than the old one, but it's much brighter.",
      "a": [
        "Mon nouvel appartement est plus petit que l'ancien, mais il est beaucoup plus lumineux.",
        "Mon nouvel appartement est plus petit que l'ancien, mais il est bien plus lumineux.",
        "Mon nouvel appart est plus petit que l'ancien, mais il est beaucoup plus lumineux.",
        "Mon nouvel appart est plus petit que l'ancien, mais il est bien plus lumineux."
      ],
      "vocab": "lumineux - bright (of a room)",
      "why": "nouveau becomes nouvel before a vowel. 'Much' in front of a comparative is beaucoup or bien, never très.",
      "tags": [
        "comparatives",
        "adjectives"
      ],
      "from": "vac-38",
      "missed": "earlier"
    },
    {
      "id": "vacf-10",
      "en": "I have as much work as you, but I have less time than you. (tu)",
      "a": [
        "J'ai autant de travail que toi, mais j'ai moins de temps que toi.",
        "Je travaille autant que toi, mais j'ai moins de temps que toi."
      ],
      "vocab": "autant de - as much",
      "why": "With a noun: autant de, moins de, plus de. aussi is only for adjectives and adverbs.",
      "tags": [
        "comparatives",
        "quantity"
      ],
      "from": "vac-29",
      "missed": "earlier"
    },
    {
      "id": "vacf-11",
      "en": "Obviously, she speaks French fluently: she has been living in Paris for ten years.",
      "a": [
        "Évidemment, elle parle couramment français, elle habite à Paris depuis dix ans.",
        "Évidemment, elle parle couramment français, elle vit à Paris depuis dix ans.",
        "Évidemment, elle parle français couramment, elle habite à Paris depuis dix ans.",
        "Évidemment, elle parle français couramment, elle vit à Paris depuis dix ans.",
        "Évidemment, elle parle couramment le français, elle habite à Paris depuis dix ans.",
        "Évidemment, elle parle couramment le français, elle vit à Paris depuis dix ans.",
        "Évidemment, elle parle le français couramment, elle habite à Paris depuis dix ans.",
        "Évidemment, elle parle le français couramment, elle vit à Paris depuis dix ans."
      ],
      "vocab": "couramment - fluently",
      "why": "évident → évidemment (-ent → -emment). couramment = fluently. 'Has been living ... for' is the present + depuis.",
      "tags": [
        "adverbs-ment",
        "time-expressions"
      ],
      "from": "vac-18",
      "missed": "earlier"
    },
    {
      "id": "vacf-12",
      "en": "Fortunately, he answered politely, even though he was really annoyed.",
      "a": [
        "Heureusement, il a répondu poliment, même s'il était vraiment agacé.",
        "Heureusement, il a répondu poliment, même s'il était vraiment énervé.",
        "Heureusement, il a répondu poliment, même s'il était vraiment irrité.",
        "Heureusement, il a répondu poliment, même s'il était vraiment contrarié.",
        "Heureusement, il a répondu poliment, même s'il était très agacé.",
        "Heureusement, il a répondu poliment, même s'il était très énervé.",
        "Heureusement, il a répondu poliment, même s'il était très irrité.",
        "Heureusement, il a répondu poliment, même s'il était très contrarié.",
        "Heureusement, il a répondu poliment, même s'il était bien agacé.",
        "Heureusement, il a répondu poliment, même s'il était bien énervé.",
        "Heureusement, il a répondu poliment, même s'il était bien irrité.",
        "Heureusement, il a répondu poliment, même s'il était bien contrarié."
      ],
      "vocab": "agacé - annoyed",
      "why": "heureux → heureuse → heureusement. poli ends in a vowel: poliment. A long adverb goes after the participle. bien que takes the subjunctive, même si does not.",
      "tags": [
        "adverbs-ment",
        "passe-compose"
      ],
      "from": "vac-17",
      "missed": "earlier"
    },
    {
      "id": "vacf-13",
      "en": "This wine is better than the one we drank yesterday, and it's better to open it now.",
      "a": [
        "Ce vin est meilleur que celui qu'on a bu hier, et c'est mieux de l'ouvrir maintenant.",
        "Ce vin est meilleur que celui que nous avons bu hier, et c'est mieux de l'ouvrir maintenant.",
        "Ce vin est meilleur que celui qu'on a bu hier, et il vaut mieux l'ouvrir maintenant.",
        "Ce vin est meilleur que celui que nous avons bu hier, et il vaut mieux l'ouvrir maintenant."
      ],
      "vocab": "meilleur - better (adj) / mieux - better (adv)",
      "why": "meilleur describes the wine (adjective). mieux describes the situation (adverb). celui que for 'the one (that)'.",
      "tags": [
        "comparatives",
        "demonstratives"
      ],
      "from": "vac-28",
      "missed": "earlier"
    },
    {
      "id": "vacf-14",
      "en": "It's getting colder and colder, and I feel less and less like going out.",
      "a": [
        "Il fait de plus en plus froid, et j'ai de moins en moins envie de sortir."
      ],
      "vocab": "de plus en plus / de moins en moins",
      "why": "de plus en plus, de moins en moins. avoir envie de keeps its de; no extra de before envie.",
      "tags": [
        "comparatives",
        "verb-prepositions"
      ],
      "from": "vac-34",
      "missed": "earlier"
    },
    {
      "id": "vacf-15",
      "en": "Don't forget to shut the window before leaving. (tu)",
      "a": [
        "N'oublie pas de fermer la fenêtre avant de partir.",
        "Pense à fermer la fenêtre avant de partir."
      ],
      "vocab": "oublier de - to forget to",
      "why": "oublier de, or penser à = remember to. avant de + infinitive, never avant + infinitive.",
      "tags": [
        "imperatif-gerondif",
        "verb-prepositions",
        "negation"
      ],
      "from": "vac-08",
      "missed": "earlier"
    },
    {
      "id": "vacf-16",
      "en": "He did the work carefully and quietly, without saying a word.",
      "a": [
        "Il a fait le travail avec soin et en silence, sans dire un mot.",
        "Il a fait le travail avec soin et en silence, sans rien dire.",
        "Il a fait le travail avec soin et en silence, sans un mot.",
        "Il a fait le travail avec soin et silencieusement, sans dire un mot.",
        "Il a fait le travail avec soin et silencieusement, sans rien dire.",
        "Il a fait le travail avec soin et silencieusement, sans un mot.",
        "Il a fait le travail soigneusement et silencieusement, sans dire un mot.",
        "Il a fait le travail soigneusement et silencieusement, sans rien dire.",
        "Il a fait le travail soigneusement et silencieusement, sans un mot.",
        "Il a effectué le travail avec soin et en silence, sans dire un mot.",
        "Il a effectué le travail avec soin et en silence, sans rien dire.",
        "Il a effectué le travail avec soin et en silence, sans un mot.",
        "Il a effectué le travail avec soin et silencieusement, sans dire un mot.",
        "Il a effectué le travail avec soin et silencieusement, sans rien dire.",
        "Il a effectué le travail avec soin et silencieusement, sans un mot.",
        "Il a effectué le travail soigneusement et silencieusement, sans dire un mot.",
        "Il a effectué le travail soigneusement et silencieusement, sans rien dire.",
        "Il a effectué le travail soigneusement et silencieusement, sans un mot."
      ],
      "vocab": "avec soin - carefully / en silence - quietly",
      "why": "French often prefers avec + noun or en + noun to a long -ment word. sans + infinitive; sans rien dire puts rien before the infinitive.",
      "tags": [
        "adverbs-ment",
        "passe-compose"
      ],
      "from": "vac-25",
      "missed": "earlier"
    },
    {
      "id": "vacf-17",
      "en": "He asked me to help him carry the boxes.",
      "a": [
        "Il m'a demandé de l'aider à porter les cartons.",
        "Il m'a demandé de l'aider à porter les boîtes.",
        "Il m'a demandé de l'aider à emporter les cartons.",
        "Il m'a demandé de l'aider à emporter les boîtes."
      ],
      "vocab": "un carton - a box / porter - to carry",
      "why": "demander à quelqu'un de faire; aider quelqu'un à faire. aider takes a direct object, so l' (him), not lui.",
      "tags": [
        "verb-prepositions",
        "pronouns"
      ],
      "from": "vac-05",
      "missed": "earlier"
    },
    {
      "id": "vacf-18",
      "en": "My doctor advised me to stop smoking, and he forbade me to drink alcohol.",
      "a": [
        "Mon médecin m'a conseillé d'arrêter de fumer, et il m'a interdit de boire de l'alcool.",
        "Mon médecin m'a conseillé d'arrêter de fumer, et il m'a interdit de boire d'alcool.",
        "Mon médecin m'a conseillé d'arrêter de fumer, et il m'a défendu de boire de l'alcool.",
        "Mon médecin m'a conseillé de cesser de fumer, et il m'a interdit de boire de l'alcool.",
        "Mon médecin m'a conseillé d'arrêter de fumer, et il m'a interdit l'alcool."
      ],
      "vocab": "conseiller à qqn de - to advise / interdire à qqn de - to forbid / arrêter de - to stop",
      "why": "conseiller and interdire both take à + person and de + infinitive. quitter takes a noun, arrêter de takes a verb. m'a interdit: me is indirect, so no agreement.",
      "tags": [
        "verb-prepositions",
        "pronouns"
      ],
      "missed": "sitting"
    },
    {
      "id": "vacf-19",
      "en": "The friend I was telling you about has just found a flat. (tu)",
      "a": [
        "L'ami dont je te parlais vient de trouver un appartement.",
        "Mon ami dont je te parlais vient de trouver un appartement.",
        "L'ami dont je t'ai parlé vient de trouver un appartement.",
        "Mon ami dont je t'ai parlé vient de trouver un appartement.",
        "L'ami dont je te parlais a trouvé un appartement."
      ],
      "vocab": "un appartement / venir de + inf - to have just",
      "why": "parler de gives dont. English drops the relative or strands the preposition; French never does. venir de = has just.",
      "tags": [
        "relative-pronouns",
        "verb-prepositions"
      ],
      "from": "vac-45",
      "missed": "sitting"
    },
    {
      "id": "vacf-20",
      "en": "She drives fast, but she drives well: she has never had an accident.",
      "a": [
        "Elle conduit vite, mais elle conduit bien : elle n'a jamais eu d'accident.",
        "Elle conduit vite mais elle conduit bien, elle n'a jamais eu d'accident.",
        "Elle conduit vite, mais bien : elle n'a jamais eu d'accident.",
        "Elle conduit vite, mais elle conduit bien, elle n'a jamais eu d'accident."
      ],
      "vocab": "avoir un accident - to have an accident",
      "why": "Negation wraps the auxiliary: n'a jamais eu. avoir un accident, not faire. After jamais/pas, un becomes de: d'accident.",
      "tags": [
        "negation",
        "passe-compose",
        "adverbs-ment"
      ],
      "from": "vac-22",
      "missed": "sitting"
    },
    {
      "id": "vacf-21",
      "en": "If I had known, I would have tried to help you. (tu)",
      "a": [
        "Si j'avais su, j'aurais essayé de t'aider.",
        "Si j'avais su, j'aurais tenté de t'aider."
      ],
      "vocab": "essayer de - to try to",
      "why": "si + plus-que-parfait → conditionnel passé. essayer de + infinitive. aider is direct: t'aider.",
      "tags": [
        "si-clauses",
        "conditionnel",
        "verb-prepositions",
        "pronouns"
      ],
      "missed": null
    },
    {
      "id": "vacf-22",
      "en": "I haven't the faintest idea where he is, and I'm not the only one.",
      "a": [
        "Je n'ai pas la moindre idée d'où il est, et je ne suis pas le seul.",
        "Je n'ai pas la moindre idée d'où il est, mais je ne suis pas le seul.",
        "Je n'ai pas la moindre idée d'où il est, et je ne suis pas la seule.",
        "Je n'ai pas la moindre idée d'où il est, mais je ne suis pas la seule.",
        "Je n'en ai pas la moindre idée, et je ne suis pas le seul."
      ],
      "vocab": "la moindre idée - the faintest idea / le seul - the only one",
      "why": "Present, not imparfait. idée is feminine: la moindre idée. avoir idée de + question word: d'où. 'The only one' is le seul, not pas seulement moi.",
      "tags": [
        "negation",
        "pronouns"
      ],
      "from": "vac-36",
      "missed": "sitting"
    },
    {
      "id": "vacf-23",
      "en": "I'm thinking of moving next year, but I haven't dared to tell my parents yet.",
      "a": [
        "Je pense déménager l'année prochaine, mais je n'ai pas encore osé le dire à mes parents.",
        "Je pense déménager l'année prochaine, mais je n'ai pas encore eu le courage de le dire à mes parents.",
        "Je pense déménager l'année prochaine, mais je n'ai pas encore osé en parler à mes parents."
      ],
      "vocab": "déménager - to move house / oser - to dare",
      "why": "penser + infinitive (no preposition) = to intend to. oser takes nothing. pas encore wraps the auxiliary. parents takes its plural s.",
      "tags": [
        "negation",
        "verb-prepositions"
      ],
      "from": "vac-07",
      "missed": "sitting"
    },
    {
      "id": "vacf-24",
      "en": "He constantly interrupts me, and frankly, it gets on my nerves.",
      "a": [
        "Il m'interrompt constamment, et franchement, ça m'énerve.",
        "Il m'interrompt constamment, et franchement, ça m'agace.",
        "Il m'interrompt constamment, et honnêtement, ça m'énerve.",
        "Il m'interrompt constamment, et honnêtement, ça m'agace.",
        "Il m'interrompt tout le temps, et franchement, ça m'énerve.",
        "Il m'interrompt tout le temps, et franchement, ça m'agace.",
        "Il m'interrompt tout le temps, et honnêtement, ça m'énerve.",
        "Il m'interrompt tout le temps, et honnêtement, ça m'agace.",
        "Il m'interrompt sans cesse, et franchement, ça m'énerve.",
        "Il m'interrompt sans cesse, et franchement, ça m'agace.",
        "Il m'interrompt sans cesse, et honnêtement, ça m'énerve.",
        "Il m'interrompt sans cesse, et honnêtement, ça m'agace."
      ],
      "vocab": "interrompre - to interrupt / énerver - to get on one's nerves",
      "why": "constant → constamment (-ant → -amment). franc → franche → franchement. The adverb after the verb, never between subject and verb.",
      "tags": [
        "adverbs-ment",
        "pronouns"
      ],
      "from": "vac-21",
      "missed": "earlier"
    },
    {
      "id": "vacf-25",
      "en": "It's the best film I've ever seen, even better than the book.",
      "a": [
        "C'est le meilleur film que j'aie jamais vu, encore meilleur que le livre.",
        "C'est le meilleur film que j'aie jamais vu, même meilleur que le livre.",
        "C'est le meilleur film que j'ai jamais vu, encore meilleur que le livre.",
        "C'est le meilleur film que j'ai jamais vu, même meilleur que le livre."
      ],
      "vocab": "le meilleur - the best",
      "why": "le meilleur, never le plus bon. After a superlative the relative clause takes the subjunctive in writing: que j'aie jamais vu. 'Even better' is encore meilleur.",
      "tags": [
        "comparatives",
        "subjonctif-uses"
      ],
      "from": "vac-30",
      "missed": "earlier"
    },
    {
      "id": "vacf-26",
      "en": "She's afraid of being late, so she always leaves an hour early.",
      "a": [
        "Elle a peur d'être en retard, donc elle part toujours une heure en avance.",
        "Elle a peur d'être en retard, donc elle part toujours une heure plus tôt.",
        "Elle a peur d'être en retard, donc elle part toujours une heure à l'avance.",
        "Elle a peur d'être en retard, alors elle part toujours une heure en avance.",
        "Elle a peur d'être en retard, alors elle part toujours une heure plus tôt.",
        "Elle a peur d'être en retard, alors elle part toujours une heure à l'avance.",
        "Elle a peur d'être en retard, donc elle part toujours avec une heure d'avance.",
        "Elle a peur d'être en retard, alors elle part toujours avec une heure d'avance."
      ],
      "vocab": "être en retard - to be late",
      "why": "avoir peur de + infinitive. The adverb toujours follows the verb, never before it.",
      "tags": [
        "verb-prepositions",
        "adverbs-connectors"
      ],
      "missed": null
    },
    {
      "id": "vacf-27",
      "en": "I'd like you to stop interrupting me. (tu)",
      "a": [
        "Je voudrais que tu arrêtes de m'interrompre.",
        "J'aimerais que tu arrêtes de m'interrompre.",
        "Je voudrais que tu cesses de m'interrompre.",
        "J'aimerais que tu cesses de m'interrompre."
      ],
      "vocab": "interrompre - to interrupt",
      "why": "vouloir que + subjonctif. For -er verbs it looks like the present, so tu takes -s: arrêtes. arrêter de + infinitive.",
      "tags": [
        "subjonctif-uses",
        "verb-prepositions"
      ],
      "missed": "sitting"
    },
    {
      "id": "vacf-28",
      "en": "The situation is worse than I thought, but never mind.",
      "a": [
        "La situation est pire que je ne pensais, mais ce n'est pas grave.",
        "La situation est pire que je ne le pensais, mais ce n'est pas grave.",
        "La situation est pire que je pensais, mais ce n'est pas grave.",
        "La situation est pire que je ne pensais, mais tant pis.",
        "La situation est pire que je pensais, mais tant pis.",
        "La situation est pire que je ne le pensais, mais tant pis.",
        "La situation est pire que je ne pensais, mais peu importe.",
        "La situation est pire que je pensais, mais peu importe.",
        "La situation est pire que je ne pensais, mais ça ne fait rien.",
        "La situation est pire que je pensais, mais ça ne fait rien."
      ],
      "vocab": "ce n'est pas grave / tant pis / peu importe / ça ne fait rien - never mind",
      "why": "'Never mind' is a fixed expression, not pas important. pire, or plus grave, for a situation; plus mauvais is for concrete quality. ne after a comparative is optional in speech.",
      "tags": [
        "comparatives",
        "negation"
      ],
      "from": "vac-35",
      "missed": "sitting"
    },
    {
      "id": "vacf-29",
      "en": "He spent the whole weekend reading instead of revising.",
      "a": [
        "Il a passé tout le week-end à lire au lieu de réviser.",
        "Il a passé tout le weekend à lire au lieu de réviser.",
        "Il a passé le week-end entier à lire au lieu de réviser.",
        "Il a passé le weekend entier à lire au lieu de réviser.",
        "Il a passé tout son week-end à lire au lieu de réviser.",
        "Il a passé tout le week-end à lire plutôt que de réviser.",
        "Il a passé tout le weekend à lire plutôt que de réviser."
      ],
      "vocab": "passer du temps à + inf / au lieu de + inf / réviser - to revise",
      "why": "Time is passer, money is dépenser. passer + time + à + infinitive, never en lisant. au lieu de + infinitive.",
      "tags": [
        "verb-prepositions",
        "time-expressions"
      ],
      "missed": "sitting"
    },
    {
      "id": "vacf-30",
      "en": "When I'm older, I'll learn to play the piano.",
      "a": [
        "Quand je serai plus grand, j'apprendrai à jouer du piano.",
        "Quand je serai plus grande, j'apprendrai à jouer du piano.",
        "Quand je serai plus âgé, j'apprendrai à jouer du piano.",
        "Lorsque je serai plus grand, j'apprendrai à jouer du piano.",
        "Quand je serai plus grand, je vais apprendre à jouer du piano."
      ],
      "vocab": "apprendre à + inf / jouer de + instrument",
      "why": "quand + a future event takes the futur even where English keeps the present. Stem is apprend-. jouer de for an instrument, jouer à for a game.",
      "tags": [
        "futur-simple",
        "verb-prepositions"
      ],
      "from": "vac-40",
      "missed": "sitting"
    },
    {
      "id": "vacf-31",
      "en": "I've just finished eating, so I don't feel like going out.",
      "a": [
        "Je viens de manger, donc je n'ai pas envie de sortir.",
        "Je viens de finir de manger, donc je n'ai pas envie de sortir.",
        "Je viens de manger, alors je n'ai pas envie de sortir.",
        "Je viens de finir de manger, alors je n'ai pas envie de sortir.",
        "Je viens de manger, je n'ai donc pas envie de sortir."
      ],
      "vocab": "avoir envie de + inf - to feel like",
      "why": "venir de + infinitive is \"have just\". Both je viens de manger and je viens de finir de manger are real French. avoir envie de, like every avoir + noun frame.",
      "tags": [
        "verb-prepositions",
        "negation"
      ],
      "from": "vac-04",
      "missed": "sitting"
    },
    {
      "id": "vacf-32",
      "en": "She's learning to drive, but she still can't manage to park.",
      "a": [
        "Elle apprend à conduire, mais elle n'arrive toujours pas à se garer.",
        "Elle apprend à conduire, mais elle n'arrive toujours pas à garer la voiture.",
        "Elle apprend à conduire, mais elle n'arrive toujours pas à garer sa voiture.",
        "Elle apprend à conduire, mais elle n'arrive pas encore à se garer.",
        "Elle apprend à conduire, mais elle n'arrive toujours pas à se stationner."
      ],
      "vocab": "se garer - to park / arriver à - to manage to",
      "why": "arriver à + infinitive. 'Can't manage' is n'arrive pas à, not ne peut pas. 'Still' is toujours pas (pas encore is 'not yet'). With no object it is se garer; with an object, garer la voiture.",
      "tags": [
        "verb-prepositions",
        "negation",
        "reflexive-verbs"
      ],
      "from": "vac-02",
      "missed": "sitting"
    },
    {
      "id": "vacf-33",
      "en": "Speak slowly and gently, otherwise the child will get scared. (tu)",
      "a": [
        "Parle lentement et doucement, sinon l'enfant aura peur.",
        "Parle doucement et lentement, sinon l'enfant aura peur.",
        "Parle lentement et doucement, sinon l'enfant va avoir peur."
      ],
      "vocab": "doucement - gently / sinon - otherwise / avoir peur - to get scared",
      "why": "Imperative tu of an -er verb drops the -s: parle. doucement is gently; gentiment is nicely. sinon is otherwise (d'ailleurs is besides). sinon + futur, not conditionnel.",
      "tags": [
        "imperatif-gerondif",
        "adverbs-ment",
        "adverbs-connectors"
      ],
      "missed": "sitting"
    },
    {
      "id": "vacf-34",
      "en": "The more I practise, the fewer mistakes I make.",
      "a": [
        "Plus je pratique, moins je fais d'erreurs.",
        "Plus je m'entraîne, moins je fais d'erreurs.",
        "Plus je m'exerce, moins je fais d'erreurs.",
        "Plus je pratique, moins je fais de fautes.",
        "Plus je m'entraîne, moins je fais de fautes."
      ],
      "vocab": "s'entraîner - to practise / une erreur - a mistake",
      "why": "'The more..., the less...' is plus + clause, moins + clause, with no que. de plus en plus is 'more and more', a different structure.",
      "tags": [
        "comparatives"
      ],
      "missed": "sitting"
    },
    {
      "id": "vacf-35",
      "en": "It's the most beautiful city in the world, but also the most expensive.",
      "a": [
        "C'est la plus belle ville du monde, mais aussi la plus chère.",
        "C'est la plus belle ville du monde, mais elle est aussi la plus chère.",
        "C'est la plus belle ville du monde, mais c'est aussi la plus chère.",
        "C'est la plus belle ville du monde mais aussi la plus chère."
      ],
      "vocab": "cher, chère - expensive",
      "why": "After a superlative, 'in the world' is du monde (de + le). ville is feminine, so la plus chère.",
      "tags": [
        "comparatives",
        "adjectives"
      ],
      "from": "vac-31",
      "missed": "sitting"
    },
    {
      "id": "vacf-36",
      "en": "She blames him for never listening to her.",
      "a": [
        "Elle lui reproche de ne jamais l'écouter.",
        "Elle lui reproche de ne jamais l'avoir écoutée.",
        "Elle lui reproche de ne l'avoir jamais écoutée.",
        "Elle lui reproche de ne pas l'écouter."
      ],
      "vocab": "reprocher à qqn de + inf - to blame",
      "why": "reprocher à qqn de faire: the person is indirect, so lui. A negated infinitive needs ne: ne jamais + l'écouter. écouter qqn is direct: l'.",
      "tags": [
        "verb-prepositions",
        "negation",
        "pronouns"
      ],
      "from": "vac-15",
      "missed": "sitting"
    },
    {
      "id": "vacf-37",
      "en": "I'd rather stay at home than go out in this cold.",
      "a": [
        "Je préférerais rester à la maison plutôt que de sortir par ce froid.",
        "Je préfère rester à la maison plutôt que de sortir par ce froid.",
        "Je préférerais rester à la maison plutôt que sortir par ce froid.",
        "Je préférerais rester chez moi plutôt que de sortir par ce froid.",
        "Je préférerais rester à la maison plutôt que de sortir dans ce froid.",
        "Je préfère rester chez moi plutôt que de sortir par ce froid.",
        "J'aime mieux rester à la maison que de sortir par ce froid."
      ],
      "vocab": "plutôt que (de) - rather than / par ce froid - in this cold",
      "why": "I'd rather is conditionnel (je préférerais), though je préfère is heard. plutôt que (de), not plus que. 'In this cold' is par ce froid; en le does not exist.",
      "tags": [
        "conditionnel",
        "verb-prepositions"
      ],
      "from": "vac-46",
      "missed": "sitting"
    },
    {
      "id": "vacf-38",
      "en": "Unfortunately, the train had already left when we finally got to the station.",
      "a": [
        "Malheureusement, le train était déjà parti quand nous sommes enfin arrivés à la gare.",
        "Malheureusement, le train était déjà parti quand on est enfin arrivés à la gare.",
        "Malheureusement, le train était déjà parti quand nous sommes finalement arrivés à la gare.",
        "Malheureusement, le train était déjà parti quand on est finalement arrivés à la gare.",
        "Malheureusement, le train était déjà parti lorsque nous sommes enfin arrivés à la gare."
      ],
      "vocab": "la gare - the station / enfin - finally",
      "why": "plus-que-parfait for what was already done, passé composé for the arrival. partir takes être, and the participle agrees.",
      "tags": [
        "plus-que-parfait",
        "passe-compose",
        "imparfait-vs-passe-compose"
      ],
      "from": "vac-26",
      "missed": "closing"
    },
    {
      "id": "vacf-39",
      "en": "It's starting to rain; let's start by bringing the washing in.",
      "a": [
        "Il commence à pleuvoir, commençons par rentrer le linge.",
        "Il se met à pleuvoir, commençons par rentrer le linge.",
        "Il commence à pleuvoir, on commence par rentrer le linge.",
        "Il commence à pleuvoir ; commençons par rentrer le linge."
      ],
      "vocab": "le linge - the washing / rentrer - to bring in",
      "why": "commencer à + inf for starting to; commencer par + inf for starting by. The nous imperative is commençons.",
      "tags": [
        "verb-prepositions",
        "imperatif-gerondif"
      ],
      "from": "vac-16",
      "missed": "closing"
    },
    {
      "id": "vacf-40",
      "en": "Actually, I didn't sleep well; the neighbours talked loudly all night.",
      "a": [
        "En fait, je n'ai pas bien dormi, les voisins ont parlé fort toute la nuit.",
        "En fait, j'ai mal dormi, les voisins ont parlé fort toute la nuit.",
        "En fait, je n'ai pas bien dormi, les voisins ont parlé bruyamment toute la nuit.",
        "En fait, je n'ai pas bien dormi, les voisins ont parlé très fort toute la nuit.",
        "En fait, je n'ai pas bien dormi, les voisins ont parlé à voix haute toute la nuit."
      ],
      "vocab": "en fait - actually / fort - loudly",
      "why": "actually is en fait (actuellement means currently). parler fort is the adverb after the verb. toute la nuit, no preposition.",
      "tags": [
        "adverbs-ment",
        "adverbs-connectors",
        "passe-compose"
      ],
      "from": "vac-20",
      "missed": "closing"
    },
    {
      "id": "vacf-41",
      "en": "Currently I work from home, but I may go back to the office in the spring.",
      "a": [
        "Actuellement, je travaille de chez moi, mais je retournerai peut-être au bureau au printemps.",
        "Actuellement, je travaille de chez moi, mais je retourne peut-être au bureau au printemps.",
        "Actuellement, je travaille à la maison, mais je retournerai peut-être au bureau au printemps.",
        "En ce moment, je travaille de chez moi, mais je retournerai peut-être au bureau au printemps.",
        "Actuellement, je travaille de chez moi, mais je vais peut-être retourner au bureau au printemps.",
        "Actuellement, je travaille de chez moi, mais peut-être que je retournerai au bureau au printemps."
      ],
      "vocab": "actuellement - currently / peut-être - may",
      "why": "actuellement means currently, not actually. peut-être sits after the conjugated verb or opens the clause with que. au printemps, not en.",
      "tags": [
        "adverbs-ment",
        "futur-simple"
      ],
      "from": "vac-19",
      "missed": "closing"
    },
    {
      "id": "vacf-42",
      "en": "I told him to call me back, but he forgot to do it.",
      "a": [
        "Je lui ai dit de me rappeler, mais il a oublié de le faire.",
        "Je lui ai dit de me rappeler, mais il a oublié.",
        "Je lui ai dit de me rappeler, mais il l'a oublié.",
        "Je lui ai demandé de me rappeler, mais il a oublié de le faire."
      ],
      "vocab": "rappeler - to call back / oublier de + inf",
      "why": "dire à qqn de + inf: lui, not le. oublier de + inf, and le faire stands in for the infinitive.",
      "tags": [
        "verb-prepositions",
        "pronouns"
      ],
      "from": "vac-01",
      "missed": "closing"
    },
    {
      "id": "vacf-43",
      "en": "We decided to leave early to avoid getting stuck in traffic.",
      "a": [
        "On a décidé de partir tôt pour éviter d'être coincés dans les embouteillages.",
        "Nous avons décidé de partir tôt pour éviter d'être coincés dans les embouteillages.",
        "Nous avons décidé de partir tôt pour éviter les embouteillages.",
        "On a décidé de partir tôt pour éviter les embouteillages.",
        "Nous avons décidé de partir tôt pour ne pas être coincés dans les embouteillages.",
        "On a décidé de partir tôt pour ne pas être coincés dans les embouteillages.",
        "On a décidé de partir de bonne heure pour éviter d'être coincés dans les embouteillages.",
        "On a décidé de partir tôt pour éviter d'être coincé dans les embouteillages.",
        "On a décidé de partir tôt pour éviter d'être coincés dans un embouteillage.",
        "On a décidé de partir tôt pour éviter d'être coincés dans la circulation.",
        "On a décidé de partir tôt pour éviter d'être coincés dans les bouchons."
      ],
      "vocab": "un embouteillage - a traffic jam / éviter de + inf",
      "why": "décider de + inf. éviter de + inf, or éviter + noun. coincé agrees with the plural subject.",
      "tags": [
        "verb-prepositions",
        "passe-compose"
      ],
      "from": "vac-03",
      "missed": "closing"
    },
    {
      "id": "vacf-44",
      "en": "I thought about it all night and I've decided to accept.",
      "a": [
        "J'y ai pensé toute la nuit, et j'ai décidé d'accepter.",
        "J'y ai pensé toute la nuit et j'ai décidé d'accepter.",
        "J'y ai réfléchi toute la nuit, et j'ai décidé d'accepter.",
        "J'y ai réfléchi toute la nuit et j'ai décidé d'accepter.",
        "J'ai pensé à ça toute la nuit, et j'ai décidé d'accepter."
      ],
      "vocab": "penser à - to think about / accepter",
      "why": "penser à + thing is replaced by y: j'y ai pensé. décider de + inf. toute la nuit, no preposition.",
      "tags": [
        "y-en",
        "verb-prepositions",
        "passe-compose"
      ],
      "from": "vac-43",
      "missed": "closing"
    },
    {
      "id": "vacf-45",
      "en": "I recently read that he had finally found a job.",
      "a": [
        "J'ai lu récemment qu'il avait finalement trouvé un travail.",
        "J'ai récemment lu qu'il avait finalement trouvé un travail.",
        "J'ai lu récemment qu'il avait enfin trouvé un travail.",
        "J'ai lu récemment qu'il avait finalement trouvé un emploi.",
        "J'ai lu récemment qu'il avait enfin trouvé un emploi.",
        "J'ai lu récemment qu'il avait fini par trouver un travail.",
        "J'ai lu récemment qu'il a finalement trouvé un travail."
      ],
      "vocab": "récemment - recently / finalement - finally / un travail, un emploi - a job",
      "why": "Reported fact at an earlier time: plus-que-parfait (avait trouvé). récemment and finalement are adverbs in -ment.",
      "tags": [
        "plus-que-parfait",
        "adverbs-ment"
      ],
      "from": "vac-23",
      "missed": "closing"
    },
    {
      "id": "vacf-46",
      "en": "I hesitated to call you because I was afraid of disturbing you. (tu)",
      "a": [
        "J'ai hésité à t'appeler parce que j'avais peur de te déranger.",
        "J'ai hésité à t'appeler car j'avais peur de te déranger.",
        "J'ai hésité à te téléphoner parce que j'avais peur de te déranger.",
        "J'ai hésité à t'appeler parce que j'avais peur de te gêner."
      ],
      "vocab": "hésiter à - to hesitate to / déranger - to disturb",
      "why": "hésiter à + inf. passé composé for the hesitation, imparfait for the state (j'avais peur). avoir peur de + inf. te comes before the infinitive.",
      "tags": [
        "verb-prepositions",
        "imparfait-vs-passe-compose",
        "pronouns"
      ],
      "from": "vac-14",
      "missed": "closing"
    }
  ]
};
