# Plan: 2026-10-21 to 2026-11-11

> **Current plan: see "## From 2026-11-19: fluency plan" below.** It replaces the 2026-11-01
> weekly table. Older sections stay as history.

Two months of logs show knowledge and listening growing, and cold production flat
(A2 fix 5/30, B1d 0/10 first attempt). The same errors repeat. This plan narrows the
work to what moves that number.

## Dropped

B1e, Dictée 2, b1c, the pronoun-idioms chapter, the song page. Not deleted, not planned.

## The loop, about 5 sessions a week

1. **Writing a scene** (15-20 min). A short prompt (my day, a memory, a place), 6-10
   linked sentences, connectors between them. Graded: corrected text, each error tagged
   with its theme, a count of errors per sentence. Logged in `writing.md`.
2. **Listening** (25-30 min). Same loop: cold watch, dictée, subtitled rewatch, clean
   rewatch. Finish podcast #103 (Dictée 5 from 46:50), then new clips.
3. **Cold retest** (5-10 min, twice a week). 10 old failed items from `vac`, `a2fix`,
   `b1d` banks, first attempt only. Measures what stuck.

## Top 3 themes, graded in every piece of writing

1. Verb + `à / de`, `lui` vs `le`.
2. `avoir / être` forms and silent endings (`tu as`, `ils ont`, `mes parents`, plural `s`).
3. `y` / `en`.

## Baseline (2026-10-21)

| Measure | Now |
|---|---|
| Cold sentences right, first attempt | 0-17% |
| Errors per sentence, cold | about 2-3 |
| Dictée, real speech, first attempt | 1-3/12 |
| New clip at 1x, cold watch | about 30% |

## Targets for 2026-11-11

| Measure | Target |
|---|---|
| Cold sentences right, first attempt | 40-50% |
| Errors per sentence, cold | 1 or less |
| `tu a / ils a / on somme`-type errors | none |
| Top 3 themes right when used | 80% |
| Scene of 8-10 sentences | readable to a native, past tenses mostly right |
| Dictée, first attempt | 5-6/12 |
| New clip of the same podcast, cold watch | 50-60% |

Not expected by then: 70% cold (the B1 line) or easy free speaking. That is months, not weeks.

## Measuring errors per sentence

Drill pages now count **word errors** on every first attempt: the fewest word edits
(wrong, missing or extra word) from the answer to the nearest accepted variant. The
report prints the total and the average per sentence. It is an approximation: one
wrong elision (`me attendre`) can count as 2. Writing is counted by hand in `writing.md`.

## Session 1: 2026-10-22, 60 min

Pages are served from the scratchpad on `localhost:8787`.

| min | block | what to paste back |
|---|---|---|
| 0-15 | **Writing.** Your day yesterday (2026-10-21), 8 sentences, linked. Must use: passé composé + imparfait, one `y` or `en`, two verbs + `à / de` (`décider de`, `essayer de`, `commencer à`, `hésiter à`), one `lui / leur`, one podcast expression (`du coup`, `tomber sur`, `avoir envie de`, `s'en sortir`). No dictionary for grammar. | the text |
| 15-45 | **Listening.** Cold watch of #103 at 1x from 46:46 (`https://www.youtube.com/watch?v=cOdKYE8WnCk&t=2806s`), pause at 51:30, note % understood. Then `drill-dictee-5.html`, then a French-subtitle rewatch at 0.75x, then a clean 1x rewatch. | cold %, the report, final % |
| 45-55 | **Cold retest.** `drill-retest-1.html`: 10 old failed sentences (vac, a2fix, b1d) on the top 3 themes. First attempt only, no hints. | the report |
| 55-60 | Log. | - |

Done 2026-10-22: writing scene 1 (2.75 errors per sentence, closed after 2 redos), cold watch
60%, Dictée 5 (0/12, 2.8 per sentence, 12/12 in 4). Not done: the two rewatches and
`drill-retest-1`: they open session 2.

## From 2026-11-01: comprehension first (superseded 2026-11-19)

Yariv's goal: understand French people when they speak. Writing stays important, grammar
continues, but listening gets most of the hours. The hour-a-day sessions had about 5 minutes
of real audio; comprehension needs hours of it.

### The week (about 7 hours)

Sun-Thu are work evenings (start before 23:00 when possible: 16:28 gave 0.7 word errors per
sentence, 02:14 gave 1.5). Fri / Sat are free daytime, used for the work that needs a fresh head.

| day | min | block |
|---|---|---|
| Sun-Thu | 0-5 | **Phrase deck** (`drill-phrases-1..6`, one deck a day, in rotation) |
| | 5-15 | **Translation**, up to 8 English -> French sentences (`ecrit-N`): 6 new from the latest errors + 2 failed ones from an earlier drill, cold. Typed, first attempt is the score |
| | 15-35 | **Dictée loop** on one clip: cold watch at 1x, dictée, one rewatch at 1x with French subtitles |
| | 35-60 | **Continuous listening without subtitles** (from 2026-11-06), one pass, no pausing, timestamps and sound guesses noted, then checked against the transcript. 80%+ cold: no subtitles first. 50-80%: French subtitles first, then the same part without. Under 50%: easier material. Lost more than once a minute = too hard |
| Fri | 0-5 | Phrase deck |
| | 5-15 | Translation, 8 sentences |
| | 15-60 | **Le Carnet**: next chapter or its test |
| Sat | 0-5 | Phrase deck |
| | 5-15 | Translation, 8 sentences |
| | 15-60 | **DELF-style exam listening** (from 2026-11-07, see B2 goal): one exam exercise cold, then transcript, words into Le Carnet, one re-listen. Leftover time: continuous listening, longer |

Total: about 3 hours of continuous listening, 1.7 of dictées, 70 min of translation, 45 of
grammar, 35 of phrases. Extra, any day: commute / walking audio of episodes already watched
(familiar material, no notes).

### Material

FWP #101 continues (Dictée 16 from 13:56), then #8 "Les secrets du français parlé"
(`B3ZxwooPT7Y`), which is about the reductions he keeps missing. Continuous listening, easier
to harder: RFI Journal en français facile, innerFrench, French With Panache, Easy French,
HugoDécrypte. French subtitles only, never English.

### Phrases

`study-log/phrases.bank.js`, ids `phr-NN`, append only. After each session the timestamps he
noted are looked up in the transcript and the phrase is added. Decks of 11 by position.

### First production drill (Fri)

The writing errors the dictées keep showing: silent plural `s` (`ils mettent`, `quelques
jours`, `nos abonnés`), `être` verbs + agreement (`est devenue`, `la rue sera barrée`), the
infinitive after a verb that is not `avoir / être` (`va changer`, `revenir chercher`) against
the participle after `rester / être` and as an adjective (`rester enfermé`, `une journée
passée`).

### Measures, checked 2026-11-11 and monthly

Word errors per sentence on the dictée first attempt, errors per sentence in the Friday
scene. Comprehension % is his own, not logged (2026-11-01).

### Change 2026-11-01: translations instead of scenes

Free scenes (2.75-3.5 errors per sentence, 22-39 corrections a scene) were too much at this
level. Writing is now sentence-level: translation only, his choice (no own sentences), every
day, up to 8 sentences. Écrit 1 baseline: 2.5 word errors per sentence first attempt.
Progress is judged on the cold retest a week later, not on closing a drill by redo: closed
drills did not move cold production before (`vac` 46/46, then cold 0-17%). So 2 of each day's
8 are earlier failures retested cold. Keys are written
wide from the start (word order, synonyms, ne-drop, on / nous).

## Checkpoint 2026-11-16: forecast written 2026-11-06

Week of 2026-11-01 to 11-06, first attempts: dictée word errors per sentence 1.5, 0.8, 1.8 (new
video), 3.2 (new, advanced), 1.6 (same video), 0.8 (new video, two clear speakers). Écrit 2.5,
1.1, 1.4. Phrase decks 2.4, 1.3. About 30-40 new words a day into Le Carnet. Late-night sittings
run about twice the errors of daytime ones.

Forecast for 2026-11-16, if the pace holds (about an hour a day):
- Dictée, first clip of a new video with clear speakers: 0.8-1.2 word errors per sentence;
  hard speakers (fast, solo, advanced): 1.5-2. Familiar speaker: 0.5-0.8.
- Écrit: about 1.0 per sentence. `ces / ses`, `c'est / ce`, `l'IA` feminine mostly fixed;
  agreement decisions (être / direct object before / indirect) still the top error.
- Listening band unchanged (B1+ alone, B2 with French subtitles): 10 days moves the numbers,
  not the band. Expect fewer lost passages on two-speaker podcasts without subtitles.
- Vocabulary: +200 to +300 own words in Le Carnet.

Measure on 2026-11-16: a cold dictée on a new two-speaker video (compare Dictée 20), Écrit retest
of ecr-21 to ecr-25 cold, and DELF B2 sample listening paper 2 (paper 1 taken as the baseline
before then, if done).

## Goal from 2026-11-06: B2 listener

His goal. B2 listening = normal-speed speech not made for learners, live or recorded, familiar
and new topics (news, podcasts, natives talking to each other). Slang-heavy films are C1.
Estimate: 2-4 months at about an hour a day, mostly listening; the lever is hours of checked
no-subtitle listening at 80%+ comprehension.

Material ladder, move up when lost passages get rare: two-speaker podcasts (innerFrench, Elisa)
-> RFI normal journal, France Inter podcasts, HugoDécrypte -> street interviews, films.
2026-11-07: step 1 done. innerFrench E189 (Hugo and Ingrid, restaurants) 0:00-19:56 with no
subtitles: understood nearly all, lost only vocabulary (16 words, no speed problem), found it boring.
Moved to step 2 with visible speakers: HugoDécrypte Grands formats interviews (first: Pierre Niney,
`fLWvbnxVOnI`), then Konbini Small Talk, LEGEND.
Pierre Niney interview 0:00-~36:00: about 40% without subtitles, 80% with; vocabulary fine, speed
the limit. Speech rate from subtitles (words per minute, about +-10%): innerFrench 160-170, FWP #6
180, Easy French 190, HugoDécrypte / Niney about 250. Method at this level: 5-10 min chunks, French
subtitles first, then the same chunk without, until about 70% without (B2/C1 edge).
Queued: HugoDécrypte x Macron (`xRIw-ZmDzj4`, 1:21:15, about 225 wpm, formal political register,
DELF-style abstract argument), 15-min chunks from 0:00. Dictée 21 (#6 12:32-16:57, familiar clip)
built and not yet sat.

B2 reached when all three hold:
- DELF B2 sample listening paper: 70% or more.
- A new 20-minute podcast episode with no subtitles: 5 lost passages or fewer.
- First attempt of a dictée on a new two-speaker video: 1.0 word errors per sentence or fewer.

Weekly exam block (Saturday, about 45 min; added 2026-11-06 after sample paper 1 worked well):
1. One exam-style exercise cold, questions read first (underline WHO and WHAT exactly), audio as
   the exam plays it (once or twice), answers pasted for marking. Only this first pass is scored.
2. Transcript: every unknown word or phrase into Le Carnet (pulled from the gist, mapped to the
   question it cost).
3. One re-listen, no pausing.
Free sources, in order: official DELF B2 samples on france-education-international.fr (tout
public, junior, pro; audio + transcript), TV5Monde Apprendre le français B2 clips, RFI Le
français facile B2 exercises. Sample paper 2 tout public stays untouched for 2026-11-16.


### DELF B2 baseline: sample paper 1 (2026-11-06, 02:15, late night)

Listening only, the official integral recording. Marked against the transcripts in the
surveillant PDF (it holds no answer key; Ex. 2 Q6 is a judgement call).
- Exercise 1 (radio, sleep and morning sport): 8.5/9. Lost Q2 (`on ne peut pas les bouleverser
  sans danger` = dangerous: negation with sans).
- Exercise 2 (radio, offices with no fixed desk): 4/9. First three right; lost Q4 (`certains
  rentrent chez eux`), Q6 (older staff complain and fear for their place), Q7 (work / private
  life boundary shrinking). Inference on an abstract topic is the gap.
- Exercise 3 (3 short documents, heard once; sat 2026-11-06 at 11:00, fresh): 1.5/7. Only Q3
  right (board games bring people closer). Lost Q1 (new youth magazines centred on `l'actualité`),
  Q2 (`analyser l'actualité de façon critique`), Q4 (for children: `développer leur logique`,
  picked social integration, said about adults), Q5 (`destinés à créer des émotions` = provoke;
  picked show emotions, which the text denies: `pas capables de ressentir`), Q6 (`en matière
  d'éducation` = learning).
**Listening total 14/25 (56%).** Pattern: the distractor is a word or idea that was said, but about
another person or with the opposite claim. Concrete story heard twice is near perfect; short
abstract documents heard once collapse. Fix: read the question for WHO and WHAT exactly before
the audio; after it, check the chosen option is the claim made, not just a topic mentioned.
Ex. 1-3 transcripts then studied, words into Le Carnet, re-listened. Paper 2 is kept for 2026-11-16.

### Exam block 1: DELF B2 junior sample (SUJET_DÉMO_B2SJ_02, 2026-11-07, 12:45, fresh)

Listening only, the integral recording, no pausing; marked against the official corrigé.
- Exercise 1 (women's football at Bordeaux, heard twice): 7.5/9. Lost Q2 (`comme c'est le cas pour
  les garçons` = same follow-up as the boys).
- Exercise 2 (Éduc+ tablet, heard twice): 4.5/9. Lost Q1 (`en phase de test dans plusieurs écoles
  près de Lyon` heard as tested in all schools; `de la maternelle jusqu'au baccalauréat` = whole
  schooling), Q4 (`préparer mon cours en assemblant tous les supports`: everything in one place, not
  ready-made), Q5 (`nombreuses heures de préparation ... semaines déjà chargées` = lack of time; picked
  training, never said), Q7 (`font plus volontiers leurs devoirs` = more motivated at home; picked the
  class option, which was said about presentations).
- Exercise 3 (3 documents, heard once): 3.5/7 (1.5/7 on Thursday). Lost Q2 (`plus écologique ...
  gaspillage`), Q3 and Q4 blank (`le gaspillage diminue`, `repas bio végétariens, prix bien inférieur`).
**Listening total 15.5/25 (62%)**, up from 56%. Same distractor pattern: Q1 (a word said, wrong
scope: plusieurs vs toutes), Q5 (an option from world knowledge, not from the audio), Q7 (said, about
another thing). Missing words cost 3 points: `gaspillage` (twice), `volontiers`, `faute de`, `supports`.

### Exam block 2: DELF B2 junior sample 3, CO exercise 2 only (2026-11-10, evening, 20 min slot)

Older format: one short RFI report (libraires francophones abroad, 1:56), heard once, 7 points.
Marked against the official corrigé. **3/7 (43%).** Right: Q1 francophones, Q3 expériences
commerciales, Q6 concurrence d'internet.
- Q2 blank: `320 millions de personnes`, in the first sentence. A number at the very start is lost
  while still settling in.
- Q4 blank: the hair salon is good because `on passe un certain temps ... du temps pour lire`.
- Q5 wrong (B, lieux de formation): `un autre type de commerce` = autres magasins. Commerce = shop.
- Q7 wrong (A, inquiet): he kept `c'est déjà difficile ... encore plus` and lost the turn
  `quand même le vent en poupe ... on surfe sur cette vague` (positive). Tone questions are decided
  after the concession, not before it.
Same as Ex. 3 of the earlier papers: the short document heard once is the weak format (1.5, 3.5,
now 3 of 7).
Re-listen after reading the transcript and the words: about 90% understood (his estimate). Same as
Dix pour cent E6 (25 to 90): once the words are known the speed is fine; the loss is on first
hearing of unknown words and numbers.

Exercise 1 of the same paper (France Info interview, Claudie Haigneré on young people and science,
5:45, heard twice), same evening. **5.25/18 (29%)**, about 50% understood (his estimate). Right: Q1
theme, Q7 culture générale for teachers, Q8 enthousiasme; Q11 half (extra science courses for
teachers; key: ressources pédagogiques; formations en commun was said, judgement call).
- Word said, wrong slot: Q3 `primaire` (the primary school teachers are Q6; girls are many
  `en terminale scientifique`), Q4 `terminale ... ou social` (key: carrières sociales; the Q3 answer
  went into Q4, hedged answer = 0).
- Q2 B (France only): `un phénomène mondial et la France n'y échappe pas` = France and elsewhere.
- Q5 A (difficile): `une vision imparfaite et pas suffisamment actuelle` = incomplete.
- Q6 blank: `filières littéraires ... peu accoutumés ... quelques craintes, si ce n'est de la réticence`.
- Q9 C (propositions): key le rôle (that she has to tell the ministry to talk to each other).
- Q10 blank: classes Villette = `des enfants de l'école avec leurs professeurs`.
- Q12 blank: technique forgotten in `l'enveloppe du scientifique`; key: makes the paths accessible,
  gives the want (`redonner envie`).
- Q13 A (utilité, world knowledge): `fabriquer, créer, véritable génie créateur` = créativité.
Abstract institutional monologue (rapport, filières, rectorats, synergie) is the hardest register so
far. His note: reading the questions while listening overloads him, so on play 2 he stopped
looking at them. Fix: questions follow the audio order; before play 2 pick the blanks, keep one
trigger word each (Villette, aide, technique, ingénieur), and glance down only when it is heard.

### 2026-11-08: two listening tracks
Dix pour cent E4, 5-6 min rewatched without subtitles after the subtitled viewing: about 40% (he
guesses 10-20% cold). TV drama is too fast and slangy for no-subtitle listening now. Split:
- **Series = vocabulary source**, French subtitles, words to Le Carnet, then a 5 min no-subs
  rewatch as review.
- **No-subtitle listening = podcasts at 80%+**: innerFrench episodes he has not heard (E24, E103,
  then others), 20-30 min a day at 1x. Step up to FWP, then RFI / France Inter, when lost passages
  get rare. E119 stays reserved for dictées.
Measured 2026-11-08 (auto subtitles, words / talk minutes, +-10%): Easy French Podcast 179
(`nZhS2uJzN9k`) 162, French Mornings Ep27 with Judith (`F-rUMI_sQQs`) 178, FWP "Why your brain
loves wasting time" (`ueqPOzjjIao`) 187, FWP wedding [106] 197, FWP #86 202. Order for no-subs:
innerFrench -> Easy French Podcast -> French Mornings -> FWP.
More (same method): French Mornings Ep47 love (`a3wl2-Ul7rU`) 187, Ep69 summer (`yqy9-vgWyH0`) 158,
Ep72 protest rights (`oHManclewi4`) 142, Ep49 savoir-vivre 209; Easy French brothers and sisters
(`RYMrofsNQKk`) 176; FWP [98] France moche (`ubkBn9o3fbc`) 177, [104] too expensive (`KhaIVtRCgVw`)
191, #93 bio 201. French Mornings Ep27 already seen (late Oct), not used for no-subs.

### 2026-11-09: daily flashcards added to the skeleton

Le Carnet Flashcards, every day, about 15 min, outside the study session:
- Morning (before work or on the way): **due cards, listen-only mode** (FR -> EN), until nothing is due.
- Evening, after adding words: **last 2 days deck**, reading mode, one or two sessions of 25.
- Retire words known from English on first sight ("I know this").
Intervals are formula v1 from `memory.md` (7, 18, 45, 110 days; wrong = same day; after a miss 2 then 7).
Load guide: at about 70 new words a day, expect 80-120 reviews a day once the 7-day returns start (from 2026-11-16).

### 2026-11-11: DELF vocabulary track (his ask: "study the vocabulary of DELF")

He likes the DELF exercise page (`.claude/skills/french-drill/assets/delf.html`, data in gitignored
`local/delf/`) and asked to prepare the vocabulary DELF audio uses. Three parts:
1. **Sens DELF 1** (next session, before the next paper): about 40 question-deciding items in the
   Sens page format, exam-register context sentences: attitude adjectives (what the speaker feels or
   thinks), reporting verbs (what the speaker does: states, regrets, recommends, warns), concession
   connectors (where the tone turns: Q7 of SJ3 ex 2).
2. **Topic words from each paper's transcript** into Le Carnet (done for SJ3 ex 1 and 2). DELF B2
   recycles about 8 themes: education, work, environment, health, media / digital, consumption,
   society, science / culture.
3. **Morning listen-only slot**: RFI Journal en français facile (10 min, free transcript), same news
   register, slightly slower. Re-listen of SJ3 ex 1 once on the commute on 2026-11-11.
Next paper after Sens DELF 1: an unused official sample (tout public paper 2 stays for 2026-11-16).
Speech rate measured: SJ3 ex 1 about 180 wpm, ex 2 about 190: same as podcasts he follows at 80%+,
so the gap is register and vocabulary, not speed.

### Exam block 3: DELF Pro B2 sujet 1 (CIEP, via francepodcasts.com), CO ex 1 "Les contrats" (2026-11-11)

HR interview at a supermarket chain, 5:07, heard twice, 18 points. **8.75/18 on merit (49%)**, 7/18 by the
corrigé; up from 5.25/18 on SJ3 ex 1. Target 11 missed. Right: Q3 en augmentation, Q8 temps de travail,
Q10 salaires au-dessus du marché, Q11 all three pay tiers (fixe / performance = variable / bénéfices
annuels du groupe = intéressement, written in English).
- Key disputed, counted right: Q5 he chose 2 ans; she says `on va essayer de l'atteindre en deux ans`
  (corrigé: un an). Half credit Q6 `grande flexibilité` (key: horaires extrêmement étendus; same
  sentence, the consequence).
- Wrong person again: Q9 `à temps complet` is what HE wants; she offers `un contrat à 80 %`.
- Numbers lost: Q4 blank (`soixante-dix pour cent`); this document is number-dense (60 %, 5 points,
  70 %, 3 ans, 2 ans, 9 h-22 h, 80 %, 3-10 %, 28 heures).
- Question not understood: Q1 `secteur d'activité` = industry (supermarchés, first sentence); he
  answered about contracts. Q2 `en favorisant le temps complet`: wrote flexibilité.
- Q7 `les jeunes` for `énormément d'étudiants`: 0 (too general).
- Q12 lost the last sentences (`la responsable du personnel`).
- Answers in English (Q11, Q12): the real exam needs French; noted, not penalised.
Fix list: write numbers down as heard on play 1 (digits, no words); WHO check on every "propose /
souhaite" question; learn question-stem words (secteur d'activité, rémunération, conditions horaires).
After the transcript and words: second listen about 90%, then a third listen without text "understood
it all" (his words). Third paper in a row with the same shape (43 or 49% cold, 90-100% once the words
are known): the gap is exam-register vocabulary, and one paper + transcript closes it for that topic.

Ex 2 of the same paper ("Le Salon de l'étudiant", 2:11, heard once, 7 points): **3/7**, same as SJ3 ex 2.
Right: Q2 mieux répondre aux besoins du marché, Q3 (préparer les élèves pour travailler en entreprise
= insertion professionnelle), Q6 half (innovation; second item missing: recherche / secteurs de pointe).
- Q1 `marché du travail`: a phrase said later, not the theme (`les relations entre l'université et les
  entreprises`, second sentence).
- Q4 blank: the risk, `que la recherche devienne dépendante des besoins des entreprises` / `qu'elles ne
  soient plus un lieu de critiques`.
- Q5 A (reconnaissance) for `aller dans le sens des besoins de leurs financeurs`: financeurs unknown.
- Q6 "citez-en deux" answered with one.
Heard-once format is flat at 3/7 over two papers (1.5 and 3.5 on the 2020-format ex 3). Fix: answer
while listening (one keyword per question in order), and a list question gets its slots filled first.

### Exam block 4: DELF B2 TP sujet 3 (CIEP, francepodcasts), CO ex 1 "Initiative Océane" (2026-11-12, 23:50)

Sujet 2 skipped: its ex 1 is the Drancourt paper reserved for 2026-11-16 (same demo paper as FEI TP
exemple 2). Sujet 3 built as `tp3-ex1` (beach waste, 1:46, once, 5 pts) and `tp3-ex2` (UN languages,
3:18, twice, 20 pts) in `local/delf/`.

Ex 1: **4/5 by the key, 2/5 known**. Q1, Q2 heard; stuck on Q3 and lost Q4-Q5, guessed Q3 and Q5 right.
Q4 `tri sélectif des ordures ménagères` = recyclage (paraphrase not recognised). Fix: questions follow
the audio; drop a missed one at once and listen for the next keyword. Environment words given, ranked
(lutter contre, sensibiliser, bénévole, veiller à ce que, se borner à, emballage, tri sélectif ...).
**Ex 2 not sat yet.**

### 2026-11-13: numbers by ear (his ask)

He said numbers in DELF audio take all his attention and he loses what follows. Built a fixed
60-item drill (`study-log/nombres.bank.js`, one play per item via the engine's new `SHELL.onePlay`)
and then an endless random trainer, shipped into Le Carnet as `#/nombres` (c27f18c). He liked the
sentence version and the fast speed.

| set | first attempt (on merit) |
|---|---|
| Day 1, bare numbers + noun (num-01..30) | 26/30 |
| Day 2, DELF-style sentences (num-31..60) | 24/30 |
| Endless, 100-999 only, slow | 29.5/59 (from 1/8 at fast) |
| Endless, mixed 60-99 / traps / 100-999 / years | 10.5/15 |

Error themes, ranked:
1. **Bare `cent` = 1xx** (6): 132, 164, 181, 135, 414, 194 all lost; no digit before cent means 1.
2. **+10 endings** (6): soixante-deux / soixante-douze, quatre-vingt-trois / quatre-vingt-treize,
   quatre-vingt-quatorze; six / seize (6 h -> 16 h).
3. **Last word dropped** (8): 99 -> 97, 679 -> 670, 997 -> 990, 81 000 -> 80 000, 269 -> 276.
4. **Extra blocks when writing** (4): 1 000 200 for 1200, 2 300 000 for 2300, 80 milliards for 8.
5. First block or first number lost: vingt et une heures -> 1 h, `entre 120 et 200` -> 200.
6. Expectation after a long single-category run: 63 -> 303.

### 2026-11-13: HugoDécrypte interview with the Education minister (his own viewing)

Partial watch, subtitles. Asked about about 25 words and caption errors (`la mise de` = la ministre de,
`supement` = Parcoursup / enseignement supérieur, `temps` = tant, `coupfil` = coupe-file). Gave a
time-ordered list of 37 recommended words with links; top 10 for DELF: témoignage, aborder, donner
lieu à, porter sur, remédier à, enjeu, prendre en charge, délai, légitime, faire en sorte que.
He added them to Le Carnet (card fixes given: la tentative, être pris en charge, délai = deadline).

### 2026-11-14 (Saturday, evening): numbers, DELF TP3 ex 2, rescue kit

**Numbers by ear** (`#/nombres`). Practice, normal speed: Two numbers 12/29 (41%), traps 13.5/16, 100-999
11/18. After a reset (traps, 100-999, years): 12/20 (60%) in 5 min, median answer 11.1 s (target < 5 s).
Error themes, ranked:
1. Two numbers: the second one is lost or swapped (`quarante / cinquante` x5: 40 -> 50 three times, 58 -> 48).
2. 70s / 90s mixed: 79 -> 99 twice, 72 -> 92, 93 -> 83, 77 -> 68. `soixante` = 60s-70s, `quatre-vingt` = 80s-90s.
3. Last word dropped or `dix / quinze` lost: 1899 -> 1889, 495 -> 484, 82 -> 80, 59 -> 50.
4. `deux / dix`: 82 -> 90, 702 -> 710 (new).
Shipped to the app: report now logs time, speed and answer time per item and groups sittings (77c2189);
settings apply at once (6d08b7a); game mode, three hearts and a clock from 8 s down to 4 s (bd1abb4).

**DELF B2 TP sujet 3, CO ex 2** (UN languages, 3:18, twice, 20 pts): **about 6.5/20 (33%)**, first attempt.
Right: Q2, Q5, Q6 (2 pts), Q8 about, Q19 about, Q1 half. Q3 1400 for 189 (the Internet number, wrong
noun), Q4 49 for 6, Q7 `anglais` for Assemblée générale + Conseil de sécurité, Q9 `auteur de rapport`
for inspecteur, Q10 `sécurité` for multilinguisme, Q11 `cohérente` for peu cohérente (`ça varie d'une
organisation à l'autre`). **Q12-Q18 blank (7 pts)**: stuck on Q12 in the second play, lost the rest.
Third paper in a row lost this way (TP3 ex 1 Q3, Pro1). Fix: write "?" and jump the moment a keyword
passes; write each number with its noun. Words given (missing from Le Carnet, ranked): se rendre compte,
au lieu de, un coût, une problématique, les ressources, plus... plus..., recenser, moitié moins,
retenir, diffuser, privilégié, le quotidien, jouer (fig.), en être encore à, membres fondateurs, varier;
plus his own: le sida, l'adhésion, par ailleurs, un organe, d'emblée, la charte. Card fix: `un coup du
main` -> un coup de main.

**Rescue kit cold test** (`study-log/rescue.bank.js`, 20 items, given 11-12): page 10/20, **14/20 on
merit** (key widened: `Pardon ? Hein ?`, `tu peux le répéter`, `Vraiment ?`, `tu veux aller boire quelque
chose`; key bug `Tu veux d'aller` fixed). Wrong: reactions 1/6 (`vachement ?` for Ah bon, `bien sûr` for
Grave, `tellement bien` for Trop bien), `la définition ?` for C'est-à-dire, `j'en n'ai pas tout compris`,
`comment je le peux mettre` (calque + pronoun slot). Hear set 4/4.

Production in chat: `je n'écrivais pas à toi une lettre encore` -> je ne t'ai pas encore écrit de lettre
(4 errors: tense, à toi for te, pas encore slot, une -> de); `quel belle fille` (quelle);
`au fur et à mesure je pourrais parler avec toi français dans une manière` (3: word order, calque,
pourrai); `on peut parle ... tant que on` (2). Themes unchanged: à + stressed pronoun, calques, word
order, silent -er / agreement.

### 2026-11-15 (Sunday, evening): meetup eve, rescue retest, Dictée 24, numbers game

**Words.** 62 added to Le Carnet in 24 h (1,169 total). Per day since 11-06: 95, 114, 115, 67, 38, 87, 13,
37, 37, 25+. Backlog advice: FR -> EN, newest 5 days first, max 50 a day. Video word list (new standing
rule, memory `video-word-list`) given for HugoDécrypte x Aurélie Bessançon (YJX44RNKFM0). Search fix
shipped: `au dela` finds `au-delà` (36c1506).

**Rescue kit, cold retest** (`study-log/rescue.bank.js`): page 17/20, **18/20 on merit**, reactions
**6/6** (11-14: 14/20, 1/6). Key widened: `tu veux aller prendre un verre`. Wrong: `tu veux ce que je veux
dire` (vois), `comment je peux dire` (Comment dire). Every 11-14 error gone.

**Dictée 24: ses questions** (dic-275..286, 12 casual tu-questions she is likely to ask, max 2 plays):
**6/12 exact**, meaning caught on 11/12. Heard wrong: `elle est boulo` for Et le boulot, `j'étais raconter`
for je t'ai raconté, `m'attendais pas que` for s'attendre à ce que, `de cours` for des cours. Silent
grammar: -er for -é after avoir (raconter, déménager: the Dictée 1 theme again), `on avais`, `ça c'est /
s'est passe` for ça se passe (en ce moment = present).

**Spoken lines for the meetup** (chat): `honeuse` (not a word; honteuse = shameful, heureuse = happy),
`si tu n'ai pas` (tu as), `peut-être notre relation n'est pas finie` (peut-être que + normal order).
Final versions correct: `Notre relation était honnête et heureuse`, `Si tu n'as pas fermé ton cœur,
peut-être que notre histoire n'est pas finie.`

**Numbers, game mode** (first real run, works): best **12** (target 12), streak 9, 15 heard (traps, 60-99,
two numbers). All 3 misses on the second number, two of them 97: `65 90` for 65 and 97, `9` for 58 and 97,
`45 86` for 49 and 57. Theme unchanged: the tail of a 90s number (`dix-sept`) is lost.
Phone: Galaxy Buds on the Pixel 7 clip the first 1-2 s of TTS (Bluetooth link waking). Offered fix: a
silent keep-alive stream in `assets/audio.js` (needs /ship).

### 2026-11-16 (Monday, morning before work): meetup warm-up, Dix pour cent S1E1

Read-aloud card (scratchpad `carte.html`): Writing 4 + 5 lines, rescue lines, new lines. Production in chat,
first attempts: `c'est pas facile à trouver un autre qui est si similaire à toi` (3: de + inf, quelqu'un,
calque `similaire` -> quelqu'un comme toi); `venir ici était une decisione rationale` (2: décision,
rationnelle) + `ce que c'est le pouvoir` (ce qu'est); `j'avais la niaque pour améliore` (-er after pour),
`en revench`, `je sais quel manque profond que je me sens` (mixed frame; ressentir un manque); `il y
avait un écrivain qui s'appellait` (avait, appelait), `il y a belle lurette cette histoire` (ça remonte à
belle lurette). Themes unchanged: silent -er, mixed frames, calques.

Dix pour cent S1E1 rewatch, 20 min. 44 words added since last night (1,213 total). Card fixes given:
`toujours pas` = still not (not yet = pas encore), `déchire` -> ça déchire / il déchire, `broder` = to
embellish. Numbers game on the phone (Bluetooth fix test) not done yet.

### 2026-11-17 (Tuesday, late night): DELF B2 TP sujet 4, CO ex 1

The 11-16 evening meetup happened and went well; the only word missed was `binôme` (pair, duo).
DELF B2 TP sujet 4 (CIEP, francepodcasts) built as `tp4-ex1` / `tp4-ex2` (local only). FEI exemple 2
(checkpoint paper) is behind a bot challenge: download by hand when needed.

**CO ex 1** (tri sélectif, RFI, 1:15, 5 pts): **4/5, but after 2 plays** (exam: 1). Wrong: Q1 `commencent à
changer` for `ont radicalement changé`: the degree is the trap; the cue was `pas un seul Français ne
triait`, `un emballage sur deux`, `absolument prodigieuse`. Words carded: tri sélectif, emballage, un X sur
Y, bac, démarche (citoyenne), se soumettre / insoumis, prodigieux. Ex 2 (Belle-Île citadel, 5:08, 20 pts,
date-heavy) not sat: tired.

### 2026-11-17 (Tuesday, evening): DELF TP4 CO ex 2, Arfi video, Dictée 25

Session asked for: the Arfi video (HugoDécrypte, `Wva8N7wdX-g`, watched to 35:14 with little understood),
numbers, one oral test, FR -> EN flashcards. Done: the oral test and the video. Not done (tired): numbers,
flashcards (643 FR -> EN due on My words: 141 reviews, 502 never seen).

**DELF TP4 CO ex 2** (Belle-Île citadel, 20 pts): **8/20**, under the 10 target. Lost:
- Q6 (2): `2005` for `fin du XIXe siècle`: the number trap again; the question said "à quelle époque".
- Q7 (1): `c` (passion) for `b` (documentation): word-match trap, `passion` attached to the monument.
- Q9 + Q12 (4): both said in the intro (chaîne hôtelière, aides allouées): the first 20 s were lost.
- Q8 (2): `financement`, too vague; the reason had to be written out (décentralisation coûte cher).
- Q11 (2): blank; frame `à cette condition que` unknown. Q3 (1): Vauban missing.
He asked whether all 12 questions can be read in the 1-minute window: no, skim stems for one keyword each.

Words carded (his adds, checked): gênant, en effet, la pierre, la ruine, acquérir, le joyau; `siècle des
Lumières` added then removed by him (card said "18th century": fix was "the Enlightenment"). Word answers
given: célèbre par, surplomber, contemporains, recouvert de, tomber raide amoureux, confondre, piéger,
dater de, racheter, classé / inscrit, consentir à, ruiner / gâcher, déposer (une plainte), authentique,
en somme, vis-à-vis de, tendu, sur + number = out of. Arfi word list (0:00-35:14) given in two tiers:
cold test on 11-19.

**Dictée 25** (Arfi 35:12-40:04): 2/12 first time, 41 word errors, see `dictee.md`.

### 2026-11-18 (Wednesday, evening): new video format, Verb lab

- **Format change (his call):** for a video he watches with French subtitles and writes the phrases himself;
  I fix spelling, give meaning + family, Speaking / DELF rating, drop what is in Le Carnet, add what he missed.
  From the same evening: keep-or-drop verdicts only, detail for the keepers.
- **Video:** HugoDécrypte, "Les espions du président" (`0l3GRkYEcJ0`), 0:00-10:00. 22 items written, 4 misheard
  (*une espion* for un espion / une espionne, *à légal* for illégal, *voir pire* for voire pire, *la div* for la lubie).
  15 cards added: se renseigner, héberger, dédié à, voire, décideurs, légitime, insolite, méconnu, faire pression sur,
  le moindre, mettre en avant, un frein à, pour le compte de, se faire prendre, en toute connaissance de cause.
  Also: l'enjeu / les enjeux / être en jeu, être à deux doigts de, se dévouer, panache (drop).
- French With Panache #107 (`VB3vbT0I5Lc`): one keeper, *se la péter / frimer*.
- Earlier words: ténacité, une allée, foutre (*tu fous quoi là*, *je m'en fous*), s'éloigner.
- **Flashcards:** 65 verbs found failing (missed 2+), 147 own verbs never reviewed. 57 word entries fixed in the gist
  (typos: renvoyer, remplacer, verser, aménager, être accro; wrong glosses: contraindre, bénéficier de, reprocher;
  tags). **Verb lab** shipped (`#/cards/lab`, `data/verb-lab.json`, 134 verbs: root hook + heard scene + cloze),
  plus a context sentence helper (C) in the due list and 1 by 1: a right answer after it comes back in 2 days.
- **Asked how I would teach him from here.** Verdict: input too hard (C1 interviews), too many new words (about 40 a day),
  almost no speaking, no writing, and too much time on tools. Rebuilt the plan below.

## From 2026-11-19: fluency plan

Goal (his words, 2026-11-20): speak fluently and understand French people when they talk. **The DELF is not the
goal**; its listening papers stay as the monthly yardstick. Register for the exam only if he later wants the
certificate (June 2027 would still be reachable on this plan).

Where he is (2026-11-18): grammar recognition B1+, standard listening B1 (TP4 CO ex 2: 8/20), dictée first attempt
2/12, about 1,250 own words with 690 due, speaking and writing almost untrained. **Speaking decides the date.**

### The day (Sun-Thu evenings; planned 60 min, real about 90)

| min | block | what | rule |
|---|---|---|---|
| 20 | **Easy listening, volume** | RFI *Journal en français facile* -> innerFrench -> HugoDécrypte daily news (short) | No pausing, no word lists. Move up a rung when about 90% is understood. |
| 10 | **Intensive listening** | 2 min of a B2 clip: transcribe, check against the transcript, then shadow it aloud | Replaces the 12-sentence dictée. Errors split heard wrong / silent grammar as before. |
| 10 | **Flashcards** | Due reviews + Verb lab | **Max 10 new words a day, ●●● only, up to 5 of them spoken expressions / slang** (see "Spoken French" below). Retire freely. Context helper (C) allowed. |
| 10 | **Speaking** | Talk for 3 min about the day's listening or your day, recorded: what happened, what you think, why | Use 3 frames + 2 spoken expressions from the week's cards. Paste the transcript (phone dictation is fine) for correction. |
| 10 | **Listening drill** | Alternate: one DELF CO exercise / numbers game | Method notes in `## Next`. |

### The week

- **Conversation, the core of speaking:** at least once a week, aim for twice, 30-45 min with a real person
  (free: Tandem / HelloTalk partner, or the IF Israël conversation evenings), with a list of the 10 newest
  phrases to use. Afterwards, paste the 3 things you could not say: they become next week's frames.
- **Saturday:** one timed DELF CO paper (francepodcasts CIEP papers, TP sujet 5 next), as the listening test.
- **No essay writing.** Formal letters, 250-word essays and exam tactics for the written paper are out
  unless he registers.
- **Fun, unscored:** *Dix pour cent* and anything C1 (Arfi, espionage interview), at most once a week, no drills.

### Spoken French: expressions and slang (added 2026-11-20, his ask)

What friends say to each other, the gap between textbook and conversation.
- **Batches of 10 a week from me**, checked against Le Carnet, most frequent first, each as a frame with one
  example (card style: *être partant(e) pour = to be up for it*). Keep-or-drop rule as for videos.
- **Heard in the wild:** expressions from *Dix pour cent*, tandem partners and casual videos (Easy French street
  interviews) go through the same keep-or-drop check before becoming cards.
- **Use them:** 2 of the week's expressions in every 3-min talk, and in each conversation. A card is learned
  once it has come out of his mouth in a real conversation.
- Register matters: mark slang as casual (friends, under 40) so it stays out of formal settings.

Batch 1 (2026-11-20): t'inquiète (pas), ça marche / ça roule, j'avoue (from avouer), en vrai, ça te dit ?,
être partant(e) pour, c'est chaud, j'en ai marre (de), je suis crevé(e), au fait. Also given: (pas) de ouf,
au pire, tu veux dire quoi par… ?, et toi, tu fais quoi dans la vie ?
Batch 2 (queued): ça fait un bail, à toute, n'importe quoi, t'es sérieux ?, c'est clair, tu m'étonnes, nickel,
en mode, être à la bourre, j'ai la dalle, c'est mort.

### Stopped or reduced

- C1 interviews as daily material (Dictée 26 Arfi dropped).
- New Le Carnet grammar chapters: grammar only from speaking and writing errors (`subjonctif-passe` parked).
- Adding about 40 words a day: cap 10.
- New app features: frozen unless something is broken.
- Dictée 24 redo and the checkpoint cold dictée: dropped; the monthly measures below replace them.
- DELF written paper and reading (CE) practice: dropped 2026-11-20 with the exam as a goal.

### Monthly measures (first: 2026-12-19)

| measure | how | target month 1 | month 3 |
|---|---|---|---|
| Listening | a new DELF CO paper, first pass, out of 25 | 12 | 15 |
| Speaking | recorded 5-min talk on a news story heard that week: pauses over 3 s, frames used | baseline | half the pauses |
| Conversation | conversations held that month; things he could not say, per conversation | 4 | 8, fewer gaps |
| Vocabulary | due pile size; Verb lab verbs missed 3+ times | under 400 | under 200, lab empty |
| Spelling by ear | 2-min intensive transcription, word errors per sentence | baseline | 1.0 or fewer |

## Next (from 2026-11-19)

- Start the daily table above. First speaking topic: pick one RFI *français facile* article of the day,
  3-min opinion, paste the transcript.
- Cold test 11-19 (promised): Arfi tier-1 list + TP4 ex 2 words (chaîne hôtelière, décentralisation,
  se désintéresser de, consentir à, à condition que, allouer, au large de).
- Cold test 11-20: the 15 espionage-video cards above.
- Verb lab: one round a day inside the flashcards slot until the 30 failing verbs are cleared.
- DELF CO method, next paper (TP sujet 5): the first 20 s carry answers; "à quelle époque" = a period,
  not a year; a matching word in an option is a trap until checked.
- Numbers game `#/nombres` inside the DELF slot: target best ≥ 15.
- Sens DELF 1 cold retest (overdue since 11-13), inside the listening-drill slot. Clear the page answers first.
- Spoken French batch 2 (queued above) on 11-27; cold check of batch 1 on 11-22.
- **Find one free conversation partner this week** (Tandem / HelloTalk, or ask IF Israël about conversation
  evenings). This is now the most important item.
- DELF B2 registration: on hold (optional). Email drafted to IF Israël Tel Aviv (h.barsheshet@ambfr-il.org);
  Pau fallback: B2 on 17-19 Mar, 16-17 Jun, 17-18 Nov 2027, 150 EUR.
