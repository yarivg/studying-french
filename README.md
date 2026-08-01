# Le Carnet — a French course

My French study notes, rebuilt as a course you can actually work through: pronunciation and
grammar from the first sound to B2, 1,493 words with gender and theme, and spaced-repetition
flashcards built from them.

**→ [yarivg.github.io/studying-french](https://yarivg.github.io/studying-french/)**

No build step, no dependencies, no tracking. Progress lives in your browser and nowhere else.

## What's in it

| | |
|---|---|
| **Part I — Foundations** | 22 chapters. Sound, the noun phrase, the present tense, passé composé, futur simple. A1–A2. |
| **Part II — Building fluency** | 16 chapters. Imparfait, conditionnel, subjonctif, relative pronouns, y/en, comparison. B1. |
| **Part III — Refining** | 9 chapters. Sequence of tenses, reported speech, register, passé simple. B2. |
| **Part IV — Reference** | Irregular verb tables, a one-page sound cheat sheet, and a study plan. |
| **Tests** | A drill for every chapter and an exam for every part. Six question types, auto-graded, but you decide what counts as learned. |
| **Reading** | Ten passages A1–B2. Hear any line, tap any word for its meaning, answer for comprehension, then read a line back into the microphone. |
| **Vocabulary** | 1,493 entries, searchable and filterable by theme, part of speech and gender — plus any word you add yourself. |
| **Flashcards** | Leitner spaced repetition, sliced by theme or by word type. |
| **Audio** | Click any French example to hear it spoken; every phonetic transcription has a play button. |
| **Sync** | Optional: mirror your progress to a private GitHub gist so the phone and the laptop stay in step. |

Every chapter ends with exercises you reveal and grade yourself. The grades feed the same
progress store as the flashcards.

## Tests, and who marks them

Each chapter has a bank of 12–15 questions in `content/tests/`, and each part draws an exam by
sampling two from every chapter in it. Six question types:

| type | how it is graded |
|---|---|
| `mcq` | pick one, automatic |
| `fill` | type the answer; case and surrounding punctuation are ignored, accents are not — a row of accented letters sits under the box, and pressing a plain vowel twice cycles its accents |
| `order` | tap the words into order |
| `listen` | the voice reads it, you type what you heard |
| `say` | you read it aloud and the microphone checks you |
| `open` | free answer against a model answer, marked by you |

The score is automatic, but **the score is not the verdict.** At the end of every test you mark
the chapter *Not yet*, *Shaky* or *Confident* yourself, and that mark — not the percentage — is
what colours the sidebar and the Progress page. A chapter you aced but do not trust stays unmarked
until you say otherwise.

`say` and the read-aloud practice use the browser's speech recogniser (`fr-FR`). It works in
Chrome on desktop and Android and in Safari on iOS; Firefox has no recogniser, so those items
fall back to hearing the model and marking yourself. Two honest caveats: recognition sends audio
to Google's or Apple's service, and it measures **intelligibility, not accent** — its language
model will forgive a sloppy vowel in a word it can guess. That is why targets are capped at six
words, and why the result shows you which word failed rather than one flattering number.

Keyboard: `1`-`4` answers a multiple choice, a digit picks the next word in an
ordering question, `Enter` moves on. On a flashcard, `H` speaks the French.

Two rules the validator enforces, both because the course is written for someone
without a French keyboard: a typed answer may not be a word already in the prompt
that differs only by an accent (that question belongs in `mcq`), and no answer may
be an IPA symbol.

Add questions by editing the JSON in `content/tests/` — the format is documented in
`content/tests/SCHEMA.md`, and `python3 tools/check-tests.py` validates every bank against what
the engine will actually accept. Reading passages work the same way:
`content/reading/SCHEMA.md` and `python3 tools/check-reading.py`.

Audio uses the browser's own speech synthesis, so nothing is downloaded and it works offline —
but it needs a French voice installed on the machine. macOS ships one; on Linux, install
`espeak-ng` or a `speech-dispatcher` French voice. The speaker button in the header turns the
audio off, slows it down, or picks between the French voices you have. Shift-click any example
to hear it slowly.

## Adding your own words

The 1,493 curated entries are baked into `data/vocab.json` and never change at runtime. Words
you meet yourself go somewhere else: **Vocabulary → + Add word**, or paste a whole list at once
in `french - english` form (a leading number is ignored, so a slice of `vocab-source.txt` pastes
straight in). Fill in the French with its article and the gender and part of speech are guessed
for you.

Your words live in the same synced progress state as everything else, so they reach the phone
by the same route and merge the same way. They show up in the browser, in search, in their
themes, and as their own **My words** flashcard deck.

To promote one into the curated list: **Paste a list → Copy my words out** gives you the exact
line format `data/vocab-source.txt` expects, numbered from where it left off. Paste, run
`python3 tools/build-vocab.py`, and it becomes part of the course proper.

## Syncing between devices

Progress lives in `localStorage`, which is per-origin and per-device — `localhost:8000` and
the published site are two separate stores, and so is your phone. To join them up, open
**Progress → Sync across devices** and paste a GitHub token with the `gist` scope (and only
that scope). The first device creates a private gist; the others find it by filename. After
that each device pulls, merges and pushes on load and a few seconds after anything changes.

Merging is per entry, not per file: whichever device touched an entry last wins, deletions are
recorded so they are not undone by the other device still having the entry, and flashcard
counters take the higher of the two. So a session on the phone and a session on the laptop on
the same day both survive.

Security, briefly:

- The gist is private. Nobody can read or change your progress without the token.
- The token is kept in `localStorage` on that device and sent only to `api.github.com`. It is
  never rendered on screen, never logged, never put in a URL.
- `index.html` ships a Content-Security-Policy that allows scripts from this origin only and
  network requests to GitHub only, so no third-party code can run and reach the token.
- Anything read back from the gist is rebuilt field by field against a strict schema before it
  touches the state, with per-map size caps and `__proto__` keys dropped.
- A `gist`-scoped token can read and write *all* your gists. Give it an expiry, and revoke it
  on GitHub if a device is lost. "Disconnect this device" forgets the token locally.

## Running it locally

The page fetches its content at runtime, so opening `index.html` straight off disk will not
work — the browser blocks the requests. Serve the folder instead:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Repository layout

```
index.html              app shell
assets/
  style.css             light/dark theme, print stylesheet
  md.js                 markdown renderer (tables, callouts, exercises)
  audio.js              spoken French via the Web Speech API
  speech.js             speech recognition and pronunciation scoring
  sync.js               optional progress sync through a private gist
  app.js                router, navigation, search
  progress.js           localStorage: read state, scores, Leitner boxes, your words
  quiz.js               exercises and flashcard sessions
  test.js               the test engine and the mastery marks
  read.js               reading passages: line audio, glossing, read-aloud
  vocab.js              vocabulary browser and deck building
content/
  manifest.json         chapter order and titles
  part1..part4/*.md     the lessons
  tests/                question banks, one JSON per chapter (SCHEMA.md)
  reading/              reading passages (SCHEMA.md)
data/
  vocab-source.txt      the original word list, exactly as written
  vocab.json            generated — do not edit by hand
tools/
  build-vocab.py        vocab-source.txt -> vocab.json + CORRECTIONS.md
  check-tests.py        validates every question bank
  check-reading.py      validates every reading passage
CORRECTIONS.md          every change made to the source material
```

## Editing

| To change | Edit |
|---|---|
| a lesson | `content/part*/NN-*.md` |
| the chapter list or order | `content/manifest.json` |
| a vocabulary entry | `data/vocab-source.txt`, then `python3 tools/build-vocab.py` |
| a test question | `content/tests/<part>/<chapter>.json`, then `python3 tools/check-tests.py` |
| a reading passage | `content/reading/*.json`, then `python3 tools/check-reading.py` |
| a correction to the source notes | the `CORRECTIONS` table in `tools/build-vocab.py` |
| styling | `assets/style.css` |

Lessons are Markdown plus five custom blocks:

````
::: tip / warning / rule / sound / note
A styled callout.
:::

::: examples
Je parle français. || I speak French.
:::

::: exercise Title
Complete: Je ___ (parler) français. || parle || optional note
:::

::: vocab food,travel
:::
````

## Corrections to the source material

The original notes carried a number of wrong articles, typos and duplicate entries. All were
fixed, and every fix is listed with its reason in **[CORRECTIONS.md](CORRECTIONS.md)** — 85
corrected entries and 28 duplicates merged. Nothing was changed silently.

Three sections in the original document were headings with nothing under them — **Adverbs**,
**Connectors** and **The Negative Form**. They are now full chapters.

## Deploying

GitHub Pages, served from the repository root on `main`:

**Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**

`.nojekyll` is already present so Pages serves the files as they are.
