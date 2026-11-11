# Writing log

Free writing: a scene of 6-10 linked sentences from a short prompt. Graded on the
French, not against a key. Each error is tagged with its theme; the top 3 themes in
`plan.md` are counted separately.

## Score

| # | Date | Prompt | Sentences | Errors | Per sentence | Top 3 right when used |
|---|---|---|---|---|---|---|
| 1 | 2026-10-22 | My day (wrote today, not yesterday) | 8 | 22 | 2.75 | 7/14 (50%) |
| 2 | 2026-10-24 | A trip or weekend away (wrote: 24th birthday at Alabama) | 11 | 39 | 3.5 | 6/10 (60%) |
| 3 | 2026-11-09 | Real message: the Mahomet mountain story, after the breakup | 10 | 26 | 2.6 | - |
| 4 | 2026-11-11/12 | Meeting prep (Mon 11-16): lines for the ex, from Le Carnet words | 11 | 27 | 2.5 | - |

## 1. 2026-10-22: my day

Corrected:

> Aujourd'hui, j'ai travaillé chez mes parents, où j'habite. Je me suis réveillé à 10 heures,
> puis je me suis levé. D'habitude, la première chose que je fais le matin, c'est me brosser
> les dents, mais ces derniers jours, je commence par prendre mon petit-déjeuner, et ensuite je
> me les brosse. En ce moment, j'ai une tâche très intéressante au travail : je dois changer la
> façon de travailler de tous les employés, et surtout la changer pour mes collègues, qui sont
> aussi développeurs. Ce sera un peu difficile, mais je suis très content de faire cette tâche.
> J'ai envie de la finir, parce que j'y travaille beaucoup, et quand je l'aurai finie, je
> voudrais aller à un concert à Tel Aviv ce week-end pour fêter ça. Ma copine voudrait y aller
> avec moi aussi. Donc j'espère que je finirai le travail comme prévu.

Errors per sentence: 0, 0, 10, 5, 2, 2, 3, 0. Sentence 3 alone holds 10 of 22: a long
sentence built from English word by word.

Themes, ranked:
1. **Reflexive + body part** (2): `je lavais les dents`, `je les lave` -> `je me brosse les
   dents`, `je me les brosse`. Old CLAUDE.md theme 2, back.
2. **Verb + preposition** (3): `commencer à` for start by (`commencer par`), `heureux pour
   faire` (`content / heureux de`), `voudrait d'y aller` (`vouloir` + bare infinitive).
3. **Silent endings / avoir** (4): `je une tâche` (`j'ai`), `tout les` (`tous`), `programmateur`
   (plural `s`), `voudrais` for `elle` (`voudrait`).
4. **Calques** (6): `dans le matin` (`le matin`), `dans les jours derniers` (`ces derniers
   jours`), `pour la première chose`, `spécialement` (`surtout`), `programmateur` (that is an
   event or TV programmer: `développeur`), `Aussi` opening a sentence (means "therefore").
5. **Tense** (3): `je lavais` and `je commençais` for a present habit; `quand je finirai`
   where the finishing comes first (`quand je l'aurai finie`).
6. **Small**: `celle tâche` (`cette`: `celle` is a pronoun, never before a noun), `petite
   déjeuner` (`mon petit-déjeuner`), `fêter` needs an object (`fêter ça`).

Right: reflexive passé composé with être (`je me suis réveillé / levé`), `quand` + futur,
`qui sont` (plural after qui), `la finir / la changer` (object pronoun before an infinitive),
`y aller`, `j'ai envie de`, `ce sera`, `comme prévu`.

Brief missed: no imparfait for a past background, no `lui / leur`.

Redo: 22 -> 5. Survivors: `voudrais` for `elle` (`voudrait`, survived the correction),
`c'est me brosse` (`me brosser`: infinitive after `c'est`), `mon petite déjeuner`
(`petit-déjeuner`, masculine). Spelling: `D'Habitue` (`D'habitude`), `prière` (prayer) for
`première`. Style: `en ce moment` and `maintenant` in one sentence, keep one.
Second redo: 5 -> 1 (`primière` for `première`). Closed.

## 2. 2026-10-24: my 24th birthday at Alabama

Prompt asked for a trip; he wrote a birthday dinner. Fine as a past scene.

Corrected:

> C'était il y a quatre ans : j'ai fêté mon 24e anniversaire. J'ai trouvé sur internet un
> endroit qui avait l'air bien pour le fêter avec mes amis. C'était un restaurant qui s'appelle
> Alabama et qui sert surtout de la viande. La viande y est cuite lentement dans un fumoir.
> Nous étions onze, mes dix amis et moi, et c'était super. Il y avait une ambiance comme à la
> maison : on se sentait comme chez soi. Chez Alabama, on a le droit d'apporter son alcool, et
> c'est même recommandé, parce qu'il n'y en a pas sur place. Tous les invités peuvent apporter
> les boissons qu'ils aiment. Aujourd'hui, quatre ans plus tard, on va y retourner, mais avec
> vingt-cinq amis. J'espère que ce sera au moins aussi bien que la dernière fois.

Errors per sentence: 1, 5, 2, 5, 2, 5, 8, 5, 4, 1, 2. Calques carry about half.

Themes, ranked:
1. **Calques and English words** (about 15): `une place` (`un endroit`; `place` = square or
   seat), `Vibe` (`ambiance`), `Smoker` (`fumoir`), `en un process lentement` (`lentement`),
   `comme être dans chez` (`comme chez soi`), `après 4 ans` (`quatre ans plus tard`),
   `raccommoder` (to mend clothes: `recommander`), `les attendant` (`les invités`), `les boires`
   (`les boissons`), `l'internet` (`internet`), `ce permit` (`c'est permis / on a le droit de`).
2. **Partitive** (2): `sert surtout la viande` (`de la viande`), `pas de l'alcool` (`pas d'alcool`,
   or `il n'y en a pas`). Same error as `boire l'alcool` in retest 1 the same day.
3. **Verb choice** (3): `cuisine` (`cuite`: `cuire` for the food, `cuisiner` for the cook),
   `emmener` (people) for `apporter` (things), `fêter` with no object (`le fêter`).
4. **Missing verb** (1): `qui peut-être bon` (`peut-être` is "maybe": `qui pouvait être bien /
   qui avait l'air bien`).
5. **Elision** (3): `parce que il` twice, `de Alabama`.
6. **Relative** (1): `les boissons qui ils aiment` (`qu'ils`: object of `aiment`).
7. **Comparison** (1): `au moins cool comme` (`au moins aussi bien que`).
8. **Silent plural / number** (2): `25 ami` (`amis`), `24 anniversaire` (`24e`).

Right: passé composé for the event (`j'ai fêté`) against imparfait for the setting (`c'était`,
`nous étions`, `il y avait`), `il y a quatre ans`, `permis d'apporter`, `on va` + infinitive,
`ce sera`, `j'espère que` + futur, `la dernière fois`.

Brief missed: no `lui / leur`, no `y / en` (two places asked for them: `il n'y en a pas`, `on va y
retourner`), no plural `qui` + verb, no podcast expression.

## 3. 2026-11-09: the Mahomet mountain story (real message)

His own text, a message about "notre situation". Bacon's anecdote, punchline = the French
proverb itself: `Si la montagne ne vient pas à Mahomet, Mahomet ira à la montagne.`

Corrected:

> J'ai beaucoup réfléchi à notre situation, et ça m'a fait penser à une expression un peu drôle
> en hébreu. Pour que tu comprennes, il vaut mieux que je t'explique quelque chose. Le prophète
> Mahomet, tu le connais ? Un écrivain qui s'appelle Francis Bacon a écrit dans un de ses livres
> que Mahomet était très connu et très puissant. Il pouvait faire des miracles avec ses paroles.
> Un jour, il a dit qu'il était assez fort pour faire venir une montagne avec ses mots. Pas mal,
> hein ? Beaucoup de gens sont venus pour voir ce miracle, puis il a commencé. Il a récité les
> bénédictions l'une après l'autre. Mais rien ne s'est passé. Il y avait un silence si long qu'on
> aurait entendu une mouche voler. Et puis Mahomet a conclu calmement : « Alors, si la montagne ne
> veut pas venir à moi, j'irai moi-même à la montagne. » Je voulais te raconter cette histoire pour
> te dire que parfois, pour trouver un équilibre dans une relation, il faut que l'un des deux fasse
> le premier pas. Après tout, on commence à peine à se connaître.

Errors per sentence (first attempt, 10 story sentences): 3, 2, 0, 6, 4, 1, 0, 2, 5, 3.

Themes, ranked:
1. **Past narration tense** (5): `il a dit qu'il est` (`était`: tense shift after a past verb),
   `il pouvais`, `il y avais`, `qu'on a peut` (`pouvait`), `qui écrit` (`a écrit`).
2. **Silent endings / homophones** (4): `ces mots` and `un de ces livres` (`ses`), `-ais` for `il`
   (`-ait`), `on dois` (`doit`). `ces/ses` survived the first redo.
3. **Frames** (5): `penser d'une` (`penser à`), `assez fort peut` (`assez ... pour`), `très long
   qu'on` (`si ... que`), `pour comprendre` with a change of subject (`pour que tu comprennes`),
   `avoir beaucoup se connaître` (`apprendre à se connaître`).
4. **Negation** (2): `rien est passé` (`rien ne s'est passé`: `ne`, and `se passer` = happen).
5. **Adverb slot** (2): `j'ai réfléchi beaucoup` (`j'ai beaucoup réfléchi`), `calmement a conclu`.
6. **Calques / wrong idiom** (4): `faire magic`, `une grande chose à dire` (`Pas mal, hein ? /
   C'est pas rien`), `voir le revers de la médaille` (= the downside, not the other view: `voir les
   choses sous un autre angle`), `en relation` (= in contact: `dans une relation`).
7. **Small**: `notre situations`, `s'appele`, missing article (`un silence`, `une montagne` on first
   mention), colon before quoted speech, `un doit` (`chacun / l'un des deux`).

Right: `pour que tu comprennes` and `il vaut mieux que je t'explique` after correction,
`sont venus` (être), `l'une après l'autre`, `on aurait entendu une mouche voler`, `j'irai`.

Expressions picked up: à vrai dire, Fallait oser / Rien que ça / Pas mal, hein ?, bénédiction après
bénédiction / enchaîner, faire le premier pas, faire passer un message, repartir sur de meilleures
bases, on commence à peine à se connaître, l'un sur l'autre / chez l'autre, faire penser à vs
rappeler qqch à qqn, véhiculer (formal: convey).

Redo: 26 -> 9 -> 4 -> 1 (period for colon before the quote). Closed.

Words he added to Le Carnet from this session (22:38-00:53, 14): le prophète, la prophétie, raconter, calmement,
un/e des deux, (se) rapprocher, se parler, se reparler, la bénédiction, embarrassant, pour dire la vérité, réciter,
la mouche.

## 4. 2026-11-11/12: meeting prep, lines for the ex

He may meet her Monday evening 2026-11-16 and wanted spoken lines. First attempts: the
mountain-story opener (3 errors), its follow-up paragraph (7, 3 sentences), *honte* (4),
*peur* (1), then 7 lines built from his own Le Carnet words (12). 27 errors over 11 sentences.

Corrected keepers:

> Alors, je voudrais te raconter une petite histoire, pour dire que parfois, il y a des situations
> où il faut faire le premier pas pour obtenir ce qu'on veut.
> Et voilà, maintenant je parle français, et j'espère que tu te souviens de tous ces moments fous
> qu'on a vécus ensemble. J'espère que ça te manque autant qu'à moi.
> Il ne faut pas avoir honte de penser à se remettre ensemble.
> J'ai peur qu'on ait eu tort de rompre / de mettre fin à notre relation.
> J'ai un faible pour toi. Ensemble, on peut dire des bêtises en trois langues.
> J'ai l'impression que la dernière fois qu'on s'est embrassés, c'était il y a belle lurette.
> Si je te vois à Jerusalang, je te draguerai à fond.
> Si on m'effaçait la mémoire, je te draguerais à nouveau.
> J'espérais que tu hallucinerais quand je te parlerais en français.
> T'es complètement frappée.

Themes, ranked:
1. **si clauses** (1, survived 2 redos): `si je te voir`, then `si je te verrais`, then `si je te verrai`. Rule: si +
   présent -> futur, si + imparfait -> conditionnel, never -rai / -rais after si.
2. **Verb frames** (6): `se souvenir de`, `penser à` + inf (not `d'`), `draguer qqn` (not `avec`),
   `en` + language, `à` + place, `manquer`: `autant qu'à moi`.
3. **Mixed frames** (1, survived 2 redos): `j'ai me sens` -> `j'ai l'impression` / `je sens que`.
4. **Tense sequence** (3): `avoir peur que` + subj passé (`ait eu`), `j'espérais` + conditionnel
   (not `seras`), `être halluciner`.
5. **où after situation nouns** and **one person** (quelqu'un / on): repeats from Écrit 8 Next.
6. **Silent endings**: `je parles`, `on ne dois`.
7. **Calques**: `notre temps` (moments), `on convient` (on va bien ensemble), `encore ensemble`
   (se remettre ensemble), `terminer` a relationship.

Right first time: `ça te manque`, `faire le premier pas`, `ce qu'on veut`, `j'ai un faible pour
toi`, `je m'en fous / fiche`, `il y a belle lurette`, reciprocal `on s'est embrassés` after one note.

Redo: 12 -> 3 -> 1 -> 0 on the 7 lines. Closed. Next: say them aloud without reading; topic 1
(présente-toi) and 8 questions to ask her still open.
