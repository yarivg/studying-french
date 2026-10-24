# Writing log

Free writing: a scene of 6-10 linked sentences from a short prompt. Graded on the
French, not against a key. Each error is tagged with its theme; the top 3 themes in
`plan.md` are counted separately.

## Score

| # | Date | Prompt | Sentences | Errors | Per sentence | Top 3 right when used |
|---|---|---|---|---|---|---|
| 1 | 2026-10-22 | My day (wrote today, not yesterday) | 8 | 22 | 2.75 | 7/14 (50%) |
| 2 | 2026-10-24 | A trip or weekend away (wrote: 24th birthday at Alabama) | 11 | 39 | 3.5 | 6/10 (60%) |

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
