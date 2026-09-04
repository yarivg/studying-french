# Working on Le Carnet

## What this repo is

A French course built out of Yariv's own notebook: Markdown chapters in `content/`,
a vocabulary list in `data/`, and a no-build static app in `assets/` that reads them.
No bundler, no dependencies. The app fetches the content files as they are.

- `content/manifest.json` is the index: parts, chapters, `slug`, `file`, `level`, `summary`.
- Chapter prose lives in `content/<part>/NN-slug.md` with `::: note / warning / rule /
  tip / examples / exercise` blocks.
- Chapter test banks belong in `content/tests/<part>/<same-basename>.json`, format
  documented in `content/tests/SCHEMA.md`. **Question ids are progress keys: append
  new ones at the end, never renumber.**

## The study loop

Yariv is working through Part I and self-testing. The loop we run:

1. He sits an exam page in the browser and answers what he can.
2. He grades, reads the per-question explanations, redoes his mistakes.
3. He pastes the generated report into the chat.
4. We log the sitting, name the error themes, teach them, and build the next
   drill from whatever is still failing.

Progress so far on the scratchpad Part I exam: 53% → 65% → 90% → 100% over eight
sittings. The in-app Part I exam, which covers all 22 chapters rather than the
first 16, is at 95% best of 2 and self-marked confident: Part I is closed.
Then `drill-traduction`, English → French: 3 of 21 right first time, 21/21 after
45 graded passes. Part II is open: `imparfait` and
`imparfait-vs-passe-compose` are both marked done. The running log is kept outside the repo, in the session
scratchpad, as `french-progress-log.md`.

### Exam pages

Temporary, deliberately not committed. They live in the scratchpad and are served
with `python3 -m http.server 8787` from that directory:

| page | what it covers |
|---|---|
| `test-part1-ch1-16.html` | 106 q, chapters 3-16, shuffled into one stream |
| `drill-possessives.html` | 18 q, chapter 9, the `le mien / la tienne` half |
| `drill-production.html` | 24 q, built from repeat offenders, English → French |
| `drill-traduction.html` | 21 q, English → French. Closed at 21/21 |
| `drill-frames.html` | 32 q, the eight error themes drill-traduction exposed |
| `drill-passe.html` | 34 q, imparfait and the choice against the passé composé |
| `drill-liants.html` | 45 q, adverb placement, frequency, connectors, false friends |
| `drill-mix.html` | 30 dealt out of those two banks joined; the current one |

Each page keeps its own `localStorage` keys, so they never disturb each other.
The newer ones share `engine.js` and `drill.css`: a drill is a `questions-<name>.js`
bank plus a thin shell that names its own key, so a new drill is a bank rather
than another copy of the page. A shell can also set `size` to deal a subset,
`priority` to say which questions the deal prefers, and `importFrom` to read
progress out of the drills it was assembled from - ids are never reused across
banks, so a question already cleared elsewhere comes across already locked.

### Rules these pages follow

Learned the hard way, from grading Yariv unfairly:

- **No pronunciation questions.** No IPA, no "which letter is silent", no writing
  sounds in slashes. He does not want them. Chapters 1, 2 and 3 are therefore
  almost absent; chapter 4 survives only as written rules (elision, what blocks
  liaison).
- **Accents, cédille and apostrophes are ignored when grading.** He types on a
  keyboard without them. `repondent` = `répondent`, `sest casse` = `s'est cassé`.
  Score the French, not the keyboard.
- **Accept the gap filler or the whole sentence.** A prompt printing
  `Je ___ réponds.` must accept `lui` and `je lui réponds` equally. The page
  derives the sentence template from the prompt to do this automatically.
- **List answers are order-insensitive** where order carries no meaning.
- **Intermediate and up.** Skip anything that is a one-step lookup.
- Questions are tagged with every chapter they touch, so the topic breakdown is
  diagnostic rather than a table of contents.

### Page features worth knowing

- Answers, question order and option order all persist; a refresh loses nothing.
- Correct answers **lock**: disabled, dimmed, skipped by Tab. Tab jumps to the
  next still-blank question.
- **Redo my mistakes** blanks only the wrong ones. **Clear answers** resets
  everything. **Reshuffle** deals a new order. The last two confirm first.
- **Hide correct** checkbox collapses the page down to what is left.
- Every grade appends to an attempt history, storing the full wrong answers, not
  just ids. The copyable report always includes the history, so a fixed mistake
  is still visible later when building the next drill.

## Current picture

Recognition is solid. Production from English is the weak side. The eight themes
that keep costing points, heaviest first:

1. Indirect object pronouns where he reaches for `à` + a stressed pronoun
   (`à leur` for `leur`, `à nous` for the noun that should have stayed).
2. Reflexive + body part: the missing `se`, and the slot order in `se les lave`.
3. `aucun` written without its `ne`, and with a plural verb.
4. Demonstrative pronouns: `celui/celle/ceux/celles de`, and the `c'est` in
   front of them.
5. Agreement: `longs` not `longue`, `petites` not `petits`, `tous` not `touts`,
   and the participle after a preceding direct object.
6. Fixed frames whose preposition is not the English one: `passer ... à lire`,
   `avoir mal au`, `avant de`, `être en train de`, `à vélo`.
7. Habitual time: `le dimanche`, `tous les soirs`, `tous les lundis`.
8. Passé composé: present written for past, and `être` vs `avoir`.

A grading note that matters more than any of them: three of the last sitting's
"errors" were correct French rejected by a too-narrow key. A drill page must
accept every real variant, or a sitting is wasted arguing with it.

## Housekeeping

- Never commit without asking. The exam pages are throwaway and stay out of the
  repo; if one earns a permanent place, port it to `content/tests/` in the schema
  format rather than committing the HTML.
