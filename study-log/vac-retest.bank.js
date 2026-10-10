// Retest bank for the "vac" sitting (see part2-verbs-adverbs-comparisons.md).
// Copy to the scratchpad as questions-vacr.js and build the shell with the
// french-drill skill. Ids are new (vacr-NN); `from` is the original vac id.
window.BANK = {
  title: 'Verbs, adverbs, comparisons: retest',
  key: 'drill-vac-retest',
  intro: 'Translate into French. Frames with the wrong English preposition, and words that look right and are not.',
  questions: [
    {
      id: 'vacr-01',
      en: 'My doctor advised me to stop smoking, and he forbade me to drink alcohol.',
      a: [
        "Mon médecin m'a conseillé d'arrêter de fumer, et il m'a interdit de boire de l'alcool.",
        "Mon médecin m'a conseillé d'arrêter de fumer, et il m'a interdit de boire d'alcool.",
        "Mon médecin m'a conseillé d'arrêter de fumer, et il m'a défendu de boire de l'alcool.",
        "Mon médecin m'a conseillé de cesser de fumer, et il m'a interdit de boire de l'alcool.",
        "Mon médecin m'a conseillé d'arrêter de fumer, et il m'a interdit l'alcool."
      ],
      vocab: 'conseiller à qqn de - to advise / interdire à qqn de - to forbid / arrêter de - to stop',
      why: 'conseiller and interdire both take à + person and de + infinitive. quitter takes a noun, arrêter de takes a verb. m\'a interdit: me is indirect, so no agreement.',
      tags: ['verb-prepositions', 'pronouns']
    },
    {
      id: 'vacr-02',
      en: 'The friend I was telling you about has just found a flat. (tu)',
      a: [
        "L'ami dont je te parlais vient de trouver un appartement.",
        "Mon ami dont je te parlais vient de trouver un appartement.",
        "L'ami dont je t'ai parlé vient de trouver un appartement.",
        "Mon ami dont je t'ai parlé vient de trouver un appartement.",
        "L'ami dont je te parlais a trouvé un appartement."
      ],
      vocab: 'un appartement / venir de + inf - to have just',
      why: 'parler de gives dont. English drops the relative or strands the preposition; French never does. venir de = has just.',
      tags: ['relative-pronouns', 'verb-prepositions']
    },
    {
      id: 'vacr-03',
      en: 'She drives fast, but she drives well: she has never had an accident.',
      a: [
        "Elle conduit vite, mais elle conduit bien : elle n'a jamais eu d'accident.",
        "Elle conduit vite mais elle conduit bien, elle n'a jamais eu d'accident.",
        "Elle conduit vite, mais bien : elle n'a jamais eu d'accident.",
        "Elle conduit vite, mais elle conduit bien, elle n'a jamais eu d'accident."
      ],
      vocab: 'avoir un accident - to have an accident',
      why: "Negation wraps the auxiliary: n'a jamais eu. avoir un accident, not faire. After jamais/pas, un becomes de: d'accident.",
      tags: ['negation', 'passe-compose', 'adverbs-ment']
    },
    {
      id: 'vacr-04',
      en: "I haven't the faintest idea where he is, and I'm not the only one.",
      a: [
        "Je n'ai pas la moindre idée d'où il est, et je ne suis pas le seul.",
        "Je n'ai pas la moindre idée d'où il est, mais je ne suis pas le seul.",
        "Je n'ai pas la moindre idée d'où il est, et je ne suis pas la seule.",
        "Je n'ai pas la moindre idée d'où il est, mais je ne suis pas la seule.",
        "Je n'en ai pas la moindre idée, et je ne suis pas le seul."
      ],
      vocab: 'la moindre idée - the faintest idea / le seul - the only one',
      why: "Present, not imparfait. idée is feminine: la moindre idée. avoir idée de + question word: d'où. 'The only one' is le seul, not pas seulement moi.",
      tags: ['negation', 'pronouns']
    },
    {
      id: 'vacr-05',
      en: "I'm thinking of moving next year, but I haven't dared to tell my parents yet.",
      a: [
        "Je pense déménager l'année prochaine, mais je n'ai pas encore osé le dire à mes parents.",
        "Je pense déménager l'année prochaine, mais je n'ai pas encore eu le courage de le dire à mes parents.",
        "Je pense déménager l'année prochaine, mais je n'ai pas encore osé en parler à mes parents.",
        "Je pense déménager l'année prochaine, mais je n'ai pas encore osé le dire à mes parents."
      ],
      vocab: "déménager - to move house / oser - to dare",
      why: 'penser + infinitive (no preposition) = to intend to. oser takes nothing. pas encore wraps the auxiliary. parents takes its plural s.',
      tags: ['negation', 'verb-prepositions'],
      from: 'vac-07'
    },
    {
      id: 'vacr-06',
      en: "I'd like you to stop interrupting me. (tu)",
      a: [
        "Je voudrais que tu arrêtes de m'interrompre.",
        "J'aimerais que tu arrêtes de m'interrompre.",
        "Je voudrais que tu cesses de m'interrompre.",
        "J'aimerais que tu cesses de m'interrompre."
      ],
      vocab: 'interrompre - to interrupt',
      why: 'vouloir que + subjonctif. For -er verbs it looks like the present, so tu takes -s: arrêtes. arrêter de + infinitive.',
      tags: ['subjonctif-uses', 'verb-prepositions']
    },
    {
      id: 'vacr-07',
      en: 'The situation is worse than I thought, but never mind.',
      a: [
        "La situation est pire que je ne pensais, mais ce n'est pas grave.",
        "La situation est pire que je ne le pensais, mais ce n'est pas grave.",
        "La situation est pire que je pensais, mais ce n'est pas grave.",
        'La situation est pire que je ne pensais, mais tant pis.',
        'La situation est pire que je pensais, mais tant pis.',
        'La situation est pire que je ne le pensais, mais tant pis.',
        'La situation est pire que je ne pensais, mais peu importe.',
        'La situation est pire que je pensais, mais peu importe.',
        'La situation est pire que je ne pensais, mais ça ne fait rien.',
        'La situation est pire que je pensais, mais ça ne fait rien.'
      ],
      vocab: "ce n'est pas grave / tant pis / peu importe / ça ne fait rien - never mind",
      why: "'Never mind' is a fixed expression, not pas important. pire, or plus grave, for a situation; plus mauvais is for concrete quality. ne after a comparative is optional in speech.",
      tags: ['comparatives', 'negation']
    },
    {
      id: 'vacr-08',
      en: 'He spent the whole weekend reading instead of revising.',
      a: [
        'Il a passé tout le week-end à lire au lieu de réviser.',
        'Il a passé tout le weekend à lire au lieu de réviser.',
        'Il a passé le week-end entier à lire au lieu de réviser.',
        'Il a passé le weekend entier à lire au lieu de réviser.',
        'Il a passé tout son week-end à lire au lieu de réviser.',
        'Il a passé tout le week-end à lire plutôt que de réviser.',
        'Il a passé tout le weekend à lire plutôt que de réviser.',
        'Il a passé tout le week-end à lire au lieu de réviser.'
      ],
      vocab: 'passer du temps à + inf / au lieu de + inf / réviser - to revise',
      why: 'Time is passer, money is dépenser. passer + time + à + infinitive, never en lisant. au lieu de + infinitive.',
      tags: ['verb-prepositions', 'time-expressions']
    },
    {
      id: 'vacr-09',
      en: "When I'm older, I'll learn to play the piano.",
      a: [
        "Quand je serai plus grand, j'apprendrai à jouer du piano.",
        "Quand je serai plus grande, j'apprendrai à jouer du piano.",
        "Quand je serai plus âgé, j'apprendrai à jouer du piano.",
        "Lorsque je serai plus grand, j'apprendrai à jouer du piano.",
        "Quand je serai plus grand, je vais apprendre à jouer du piano."
      ],
      vocab: 'apprendre à + inf / jouer de + instrument',
      why: 'quand + a future event takes the futur even where English keeps the present. Stem is apprend-. jouer de for an instrument, jouer à for a game.',
      tags: ['futur-simple', 'verb-prepositions']
    },
    {
      id: 'vacr-10',
      en: "I've just finished eating, so I don't feel like going out.",
      a: [
        "Je viens de manger, donc je n'ai pas envie de sortir.",
        "Je viens de finir de manger, donc je n'ai pas envie de sortir.",
        "Je viens de manger, alors je n'ai pas envie de sortir.",
        "Je viens de finir de manger, alors je n'ai pas envie de sortir.",
        "Je viens de manger, je n'ai donc pas envie de sortir."
      ],
      vocab: 'avoir envie de + inf - to feel like',
      why: 'venir de + infinitive is "have just". Both je viens de manger and je viens de finir de manger are real French. avoir envie de, like every avoir + noun frame.',
      tags: ['verb-prepositions', 'negation'],
      from: 'vac-04'
    },
    {
      id: 'vacr-11',
      en: "She's learning to drive, but she still can't manage to park.",
      a: [
        "Elle apprend à conduire, mais elle n'arrive toujours pas à se garer.",
        "Elle apprend à conduire, mais elle n'arrive toujours pas à garer la voiture.",
        "Elle apprend à conduire, mais elle n'arrive toujours pas à garer sa voiture.",
        "Elle apprend à conduire, mais elle n'arrive pas encore à se garer.",
        "Elle apprend à conduire, mais elle n'arrive toujours pas à se stationner."
      ],
      vocab: 'se garer - to park / arriver à - to manage to',
      why: "arriver à + infinitive. 'Can't manage' is n'arrive pas à, not ne peut pas. 'Still' is toujours pas (pas encore is 'not yet'). With no object it is se garer; with an object, garer la voiture.",
      tags: ['verb-prepositions', 'negation', 'reflexive-verbs'],
      from: 'vac-02'
    },
    {
      id: 'vacr-12',
      en: 'Speak slowly and gently, otherwise the child will get scared. (tu)',
      a: [
        "Parle lentement et doucement, sinon l'enfant aura peur.",
        "Parle doucement et lentement, sinon l'enfant aura peur.",
        "Parle lentement et doucement, sinon l'enfant va avoir peur.",
        "Parle lentement et doucement, sinon l'enfant aura peur."
      ],
      vocab: 'doucement - gently / sinon - otherwise / avoir peur - to get scared',
      why: 'Imperative tu of an -er verb drops the -s: parle. doucement is gently; gentiment is nicely. sinon is otherwise (d\'ailleurs is besides). sinon + futur, not conditionnel.',
      tags: ['imperatif-gerondif', 'adverbs-ment', 'adverbs-connectors']
    },
    {
      id: 'vacr-13',
      en: 'The more I practise, the fewer mistakes I make.',
      a: [
        "Plus je pratique, moins je fais d'erreurs.",
        "Plus je m'entraîne, moins je fais d'erreurs.",
        "Plus je m'exerce, moins je fais d'erreurs.",
        "Plus je pratique, moins je fais de fautes.",
        "Plus je m'entraîne, moins je fais de fautes."
      ],
      vocab: "s'entraîner - to practise / une erreur - a mistake",
      why: "'The more..., the less...' is plus + clause, moins + clause, with no que. de plus en plus is 'more and more', a different structure.",
      tags: ['comparatives']
    },
    {
      id: 'vacr-14',
      en: "It's the most beautiful city in the world, but also the most expensive.",
      a: [
        "C'est la plus belle ville du monde, mais aussi la plus chère.",
        "C'est la plus belle ville du monde, mais elle est aussi la plus chère.",
        "C'est la plus belle ville du monde, mais c'est aussi la plus chère.",
        "C'est la plus belle ville du monde mais aussi la plus chère."
      ],
      vocab: 'cher, chère - expensive',
      why: "After a superlative, 'in the world' is du monde (de + le). ville is feminine, so la plus chère.",
      tags: ['comparatives', 'adjectives']
    },
    {
      id: 'vacr-15',
      en: 'She blames him for never listening to her.',
      a: [
        "Elle lui reproche de ne jamais l'écouter.",
        "Elle lui reproche de ne jamais l'avoir écoutée.",
        "Elle lui reproche de ne l'avoir jamais écoutée.",
        "Elle lui reproche de ne pas l'écouter."
      ],
      vocab: 'reprocher à qqn de + inf - to blame',
      why: "reprocher à qqn de faire: the person is indirect, so lui. A negated infinitive needs ne: ne jamais + l'écouter. écouter qqn is direct: l'.",
      tags: ['verb-prepositions', 'negation', 'pronouns'],
      from: 'vac-15'
    },
    {
      id: 'vacr-16',
      en: "I'd rather stay at home than go out in this cold.",
      a: [
        'Je préférerais rester à la maison plutôt que de sortir par ce froid.',
        'Je préfère rester à la maison plutôt que de sortir par ce froid.',
        'Je préférerais rester à la maison plutôt que sortir par ce froid.',
        'Je préférerais rester chez moi plutôt que de sortir par ce froid.',
        'Je préférerais rester à la maison plutôt que de sortir dans ce froid.',
        'Je préfère rester chez moi plutôt que de sortir par ce froid.',
        "J'aime mieux rester à la maison que de sortir par ce froid."
      ],
      vocab: 'plutôt que (de) - rather than / par ce froid - in this cold',
      why: "I'd rather is conditionnel (je préférerais), though je préfère is heard. plutôt que (de), not plus que. 'In this cold' is par ce froid; en le does not exist.",
      tags: ['conditionnel', 'verb-prepositions'],
      from: 'vac-46'
    },
    {
      id: 'vacr-17',
      en: 'Unfortunately, the train had already left when we finally got to the station.',
      a: [
        "Malheureusement, le train était déjà parti quand nous sommes enfin arrivés à la gare.",
        "Malheureusement, le train était déjà parti quand on est enfin arrivés à la gare.",
        "Malheureusement, le train était déjà parti quand nous sommes finalement arrivés à la gare.",
        "Malheureusement, le train était déjà parti quand on est finalement arrivés à la gare.",
        "Malheureusement, le train était déjà parti lorsque nous sommes enfin arrivés à la gare."
      ],
      vocab: 'la gare - the station / enfin - finally',
      why: 'plus-que-parfait for what was already done, passé composé for the arrival. partir takes être, and the participle agrees.',
      tags: ['plus-que-parfait', 'passe-compose', 'imparfait-vs-passe-compose'],
      from: 'vac-26'
    },
    {
      id: 'vacr-18',
      en: "It's starting to rain; let's start by bringing the washing in.",
      a: [
        'Il commence à pleuvoir, commençons par rentrer le linge.',
        'Il se met à pleuvoir, commençons par rentrer le linge.',
        'Il commence à pleuvoir, on commence par rentrer le linge.',
        'Il commence à pleuvoir, commençons par rentrer le linge.',
        'Il commence à pleuvoir ; commençons par rentrer le linge.'
      ],
      vocab: 'le linge - the washing / rentrer - to bring in',
      why: 'commencer à + inf for starting to; commencer par + inf for starting by. The nous imperative is commençons.',
      tags: ['verb-prepositions', 'imperatif-gerondif'],
      from: 'vac-16'
    },
    {
      id: 'vacr-19',
      en: "Actually, I didn't sleep well; the neighbours talked loudly all night.",
      a: [
        "En fait, je n'ai pas bien dormi, les voisins ont parlé fort toute la nuit.",
        "En fait, j'ai mal dormi, les voisins ont parlé fort toute la nuit.",
        "En fait, je n'ai pas bien dormi, les voisins ont parlé bruyamment toute la nuit.",
        "En fait, je n'ai pas bien dormi, les voisins ont parlé très fort toute la nuit.",
        "En fait, je n'ai pas bien dormi, les voisins ont parlé à voix haute toute la nuit."
      ],
      vocab: 'en fait - actually / fort - loudly',
      why: 'actually is en fait (actuellement means currently). parler fort is the adverb after the verb. toute la nuit, no preposition.',
      tags: ['adverbs-ment', 'adverbs-connectors', 'passe-compose'],
      from: 'vac-20'
    },
    {
      id: 'vacr-20',
      en: 'Currently I work from home, but I may go back to the office in the spring.',
      a: [
        'Actuellement, je travaille de chez moi, mais je retournerai peut-être au bureau au printemps.',
        'Actuellement, je travaille de chez moi, mais je retourne peut-être au bureau au printemps.',
        'Actuellement, je travaille à la maison, mais je retournerai peut-être au bureau au printemps.',
        'En ce moment, je travaille de chez moi, mais je retournerai peut-être au bureau au printemps.',
        'Actuellement, je travaille de chez moi, mais je vais peut-être retourner au bureau au printemps.',
        'Actuellement, je travaille de chez moi, mais peut-être que je retournerai au bureau au printemps.'
      ],
      vocab: 'actuellement - currently / peut-être - may',
      why: 'actuellement means currently, not actually. peut-être sits after the conjugated verb or opens the clause with que. au printemps, not en.',
      tags: ['adverbs-ment', 'futur-simple'],
      from: 'vac-19'
    },
    {
      id: 'vacr-21',
      en: 'I told him to call me back, but he forgot to do it.',
      a: [
        "Je lui ai dit de me rappeler, mais il a oublié de le faire.",
        "Je lui ai dit de me rappeler, mais il a oublié.",
        "Je lui ai dit de me rappeler, mais il l'a oublié.",
        "Je lui ai demandé de me rappeler, mais il a oublié de le faire."
      ],
      vocab: 'rappeler - to call back / oublier de + inf',
      why: 'dire à qqn de + inf: lui, not le. oublier de + inf, and le faire stands in for the infinitive.',
      tags: ['verb-prepositions', 'pronouns'],
      from: 'vac-01'
    },
    {
      id: 'vacr-22',
      en: 'We decided to leave early to avoid getting stuck in traffic.',
      a: [
        "On a décidé de partir tôt pour éviter d'être coincés dans les embouteillages.",
        "Nous avons décidé de partir tôt pour éviter d'être coincés dans les embouteillages.",
        "Nous avons décidé de partir tôt pour éviter les embouteillages.",
        "On a décidé de partir tôt pour éviter les embouteillages.",
        "Nous avons décidé de partir tôt pour ne pas être coincés dans les embouteillages.",
        "On a décidé de partir tôt pour ne pas être coincés dans les embouteillages.",
        "On a décidé de partir de bonne heure pour éviter d'être coincés dans les embouteillages."
      ],
      vocab: 'un embouteillage - a traffic jam / éviter de + inf',
      why: 'décider de + inf. éviter de + inf, or éviter + noun. coincé agrees with the plural subject.',
      tags: ['verb-prepositions', 'passe-compose'],
      from: 'vac-03'
    },
    {
      id: 'vacr-23',
      en: "I thought about it all night and I've decided to accept.",
      a: [
        "J'y ai pensé toute la nuit, et j'ai décidé d'accepter.",
        "J'y ai pensé toute la nuit et j'ai décidé d'accepter.",
        "J'y ai réfléchi toute la nuit, et j'ai décidé d'accepter.",
        "J'y ai réfléchi toute la nuit et j'ai décidé d'accepter.",
        "J'ai pensé à ça toute la nuit, et j'ai décidé d'accepter."
      ],
      vocab: 'penser à - to think about / accepter',
      why: "penser à + thing is replaced by y: j'y ai pensé. décider de + inf. toute la nuit, no preposition.",
      tags: ['y-en', 'verb-prepositions', 'passe-compose'],
      from: 'vac-43'
    },
    {
      id: 'vacr-24',
      en: 'I recently read that he had finally found a job.',
      a: [
        "J'ai lu récemment qu'il avait finalement trouvé un travail.",
        "J'ai récemment lu qu'il avait finalement trouvé un travail.",
        "J'ai lu récemment qu'il avait enfin trouvé un travail.",
        "J'ai lu récemment qu'il avait finalement trouvé un emploi.",
        "J'ai lu récemment qu'il avait enfin trouvé un emploi.",
        "J'ai lu récemment qu'il avait fini par trouver un travail."
      ],
      vocab: 'récemment - recently / finalement - finally / un travail, un emploi - a job',
      why: "Reported fact at an earlier time: plus-que-parfait (avait trouvé). récemment and finalement are adverbs in -ment.",
      tags: ['plus-que-parfait', 'adverbs-ment'],
      from: 'vac-23'
    },
    {
      id: 'vacr-25',
      en: "I hesitated to call you because I was afraid of disturbing you. (tu)",
      a: [
        "J'ai hésité à t'appeler parce que j'avais peur de te déranger.",
        "J'ai hésité à t'appeler parce que j'avais peur de te déranger.",
        "J'ai hésité à t'appeler car j'avais peur de te déranger.",
        "J'ai hésité à te téléphoner parce que j'avais peur de te déranger.",
        "J'ai hésité à t'appeler car j'avais peur de te déranger.",
        "J'ai hésité à t'appeler parce que j'avais peur de te gêner."
      ],
      vocab: 'hésiter à - to hesitate to / déranger - to disturb',
      why: 'hésiter à + inf. passé composé for the hesitation, imparfait for the state (j\'avais peur). avoir peur de + inf. te comes before the infinitive.',
      tags: ['verb-prepositions', 'imparfait-vs-passe-compose', 'pronouns'],
      from: 'vac-14'
    }
  ]
};
