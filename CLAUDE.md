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

Progress so far on the Part I exam: 53% → 65% → 90% → 100% over eight sittings.
The running log is kept outside the repo, in the session scratchpad, as
`french-progress-log.md`.

### Exam pages

Temporary, deliberately not committed. They live in the scratchpad and are served
with `python3 -m http.server 8787` from that directory:

| page | what it covers |
|---|---|
| `test-part1-ch1-16.html` | 106 q, chapters 3-16, shuffled into one stream |
| `drill-possessives.html` | 18 q, chapter 9, the `le mien / la tienne` half |
| `drill-production.html` | 24 q, built from repeat offenders, English → French |

Each page keeps its own `localStorage` keys, so they never disturb each other.

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

Recognition is solid. Production from English is the weak side: fixed frames where
French needs a word English omits (`avoir mal à la`, `être en train de`, `aucun`,
`nulle part`, `à vélo`), and choosing between possessive, demonstrative and
stressed pronouns under pressure.

## Housekeeping

- Never commit without asking. The exam pages are throwaway and stay out of the
  repo; if one earns a permanent place, port it to `content/tests/` in the schema
  format rather than committing the HTML.
