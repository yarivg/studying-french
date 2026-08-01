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
| **Vocabulary** | 1,493 entries, searchable and filterable by theme, part of speech and gender. |
| **Flashcards** | Leitner spaced repetition, sliced by theme or by word type. |

Every chapter ends with exercises you reveal and grade yourself. The grades feed the same
progress store as the flashcards.

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
  app.js                router, navigation, search
  progress.js           localStorage: read state, scores, Leitner boxes
  quiz.js               exercises and flashcard sessions
  vocab.js              vocabulary browser and deck building
content/
  manifest.json         chapter order and titles
  part1..part4/*.md     the lessons
data/
  vocab-source.txt      the original word list, exactly as written
  vocab.json            generated — do not edit by hand
tools/
  build-vocab.py        vocab-source.txt -> vocab.json + CORRECTIONS.md
CORRECTIONS.md          every change made to the source material
```

## Editing

| To change | Edit |
|---|---|
| a lesson | `content/part*/NN-*.md` |
| the chapter list or order | `content/manifest.json` |
| a vocabulary entry | `data/vocab-source.txt`, then `python3 tools/build-vocab.py` |
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
fixed, and every fix is listed with its reason in **[CORRECTIONS.md](CORRECTIONS.md)** — 84
corrected entries and 28 duplicates merged. Nothing was changed silently.

Three sections in the original document were headings with nothing under them — **Adverbs**,
**Connectors** and **The Negative Form**. They are now full chapters.

## Deploying

GitHub Pages, served from the repository root on `main`:

**Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**

`.nojekyll` is already present so Pages serves the files as they are.
