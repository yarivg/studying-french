# How to use this course

This is a notebook that grew into a course. It was built from my own study document, so it is
organised around the things I actually got wrong rather than around a syllabus.

## What is here

| Part | What it covers | Roughly |
|---|---|---|
| **I — Foundations** | Sound, the noun phrase, the present, the passé composé, the future | A1–A2 |
| **II — Building fluency** | The other tenses, the subjunctive, pronouns, comparison | B1 |
| **III — Refining** | Sequence of tenses, reported speech, register, literary forms | B2 |
| **IV — Reference** | Verb tables, sound cheat sheet, this page | — |
| **Vocabulary** | 1,493 words with gender, part of speech and theme | — |
| **Flashcards** | Spaced-repetition decks built from the vocabulary | — |

## How the app works

**Progress** is stored in your browser only — nothing is uploaded anywhere. Marking a lesson
read, grading an exercise, ticking a word as known and reviewing a flashcard all write to
`localStorage` under the key `lecarnet.v1`. Clearing site data resets everything, so export your
progress from the Progress page before switching machines.

**Exercises** appear at the end of most chapters. Try to answer before revealing, then grade
yourself honestly — *Review again* is not a failure, it is what schedules the material back to
you.

**Flashcards** use a Leitner system. A card you get right moves up a box and comes back after
1, 2, 5, 10, 21, then 45 days. A card you get wrong drops straight back to daily. The decks are
sliced by theme, so you can drill *food* before a restaurant and *work* before a meeting.

**Search** covers every lesson and every vocabulary entry. Press `/` from anywhere to jump into
it.

## Using it offline

Everything works with no network, in two ways.

**Installed as an app.** Open the site over https while you still have signal and wait for the
header pill to read **Offline ready** — that means all 133 files are on the device: every
lesson, every test, the reading passages and the whole vocabulary. Then add it to your home
screen (iOS: Share → *Add to Home Screen*; Android: ⋮ → *Install app*). It behaves like any
other app after that, aeroplane mode included.

**As a single file.** `le-carnet-offline.html` is the entire course in one file. Put it on a
phone, a laptop or a memory stick and open it. No server, no install, no network.

::: warning The two keep separate progress
A browser treats the hosted site and a local file as different origins, so they do not share
storage. If you move between them, carry your progress with **Export** / **Import** on the
Progress page. Gist sync cannot run from a local file.
:::

## A route through the material

You do not have to read in order, but the order is not arbitrary — later chapters assume earlier
ones.

### If you are starting out

1. **Sound first.** Chapters 1–4 of Part I. Do not skip these because they look like reference
   tables. Almost every later problem — hearing plurals, distinguishing tenses, understanding
   fast speech — is a pronunciation problem in disguise.
2. **The noun phrase.** Chapters 5–13: gender, articles, adjectives, pronouns, prepositions.
3. **The present tense**, then negation and questions.
4. **The passé composé**, then the future.

### If you already have the basics

Start at **Part I chapter 16 (Negation)** and work forward. The three chapters that were missing
from my original notes — negation, adverbs and connectors — are the ones most likely to be
holes in your own knowledge too.

### If you can hold a conversation

Go straight to **Part II**, and in this order:

1. Imparfait, then imparfait vs passé composé — this is the highest-value chapter in the course.
2. Y and en. Leaving these out is the clearest marker of a non-native speaker.
3. Relative pronouns.
4. The subjunctive, both chapters.
5. Everything else, as it comes up.

## A weekly rhythm

Something like this works, and takes about forty minutes a day.

| | |
|---|---|
| **Every day** | 10 minutes of flashcards. Whatever is due, no more. |
| **Every day** | Read something in French for 15 minutes. Anything. |
| **3× a week** | One new chapter, exercises included. |
| **1× a week** | Re-read a chapter you marked read more than a month ago. |
| **1× a week** | Write five sentences using this week's grammar. Say them out loud. |

::: tip The flashcards are the part that compounds
Ten minutes a day, every day, beats an hour once a week by a very wide margin. The scheduling
only works if you show up on the days it asks you to — a card due today and reviewed next week
has already been forgotten.
:::

## Things worth doing that this course cannot do for you

- **Say it out loud.** Every example in every chapter. Reading French silently builds a
  vocabulary you cannot pronounce and will not recognise when someone says it to you.
- **Listen to more than you can follow.** Podcasts, radio, television with French subtitles —
  not English ones. Comprehension arrives suddenly, after a long period of it not arriving.
- **Write badly, often.** Five wrong sentences that someone corrects are worth more than fifty
  right ones you never produced.
- **Find someone to talk to.** No amount of grammar substitutes for the pressure of a real
  conversation.

## Fixing and extending the course

Everything is plain text in this repository.

| To change | Edit |
|---|---|
| a lesson | `content/part*/NN-*.md` |
| the chapter list or order | `content/manifest.json` |
| a vocabulary entry | `data/vocab-source.txt`, then run `python3 tools/build-vocab.py` |
| a correction to the source notes | the `CORRECTIONS` table in `tools/build-vocab.py` |
| styling | `assets/style.css` |

Lessons are ordinary Markdown plus a few custom blocks:

```
::: tip / warning / rule / sound / note
Text of the callout.
:::

::: examples
Je parle français. || I speak French.
:::

::: exercise Title of the exercise
Question with a ___ gap. || answer || optional note
:::

::: vocab food,travel
:::
```

## Every change made to the source material

The original study document had a number of wrong articles, typos and duplicated entries. All of
them were corrected rather than copied — and every single correction is listed in
[CORRECTIONS.md](CORRECTIONS.md) in the repository, with the reason. Nothing was changed
silently. If you disagree with a call, the fix is one file edit and one script run away.

Three sections in the original were headings with no content underneath: **Adverbs**,
**Connectors** and **The Negative Form**. Those are now full chapters — Part I chapters 16 and
21.

::: note Where this came from
The whole thing started as a Google Doc of pronunciation tables and a numbered list of 1,521
words. Both are still here: the tables became Part I, and the word list is `data/vocab-source.txt`,
preserved exactly as it was written so that nothing is lost in translation.
:::
