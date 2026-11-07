# Plan: 2026-10-21 to 2026-11-11

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

## From 2026-11-01: comprehension first

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
