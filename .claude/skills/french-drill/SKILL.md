---
name: french-drill
description: Build a throwaway browser drill page for Le Carnet - an English-to-French production test served locally in Chrome. Use when Yariv asks for a test, a drill, an exam page, or practice on specific chapters. Covers the bank format, the grading rules learned from grading him unfairly, and the serve-and-report loop.
---

# Building a drill page

A drill is a **bank** plus a thin **shell**. The engine and the stylesheet are shared,
so a new drill is a new `questions-<name>.js`, never another copy of the page.

Everything lives in the session scratchpad and is **never committed**. The repo's
permanent tests live in `content/tests/` in the schema format instead; port a drill
there only if it earns a permanent place, and only after asking.

## Files

```
<scratchpad>/
  engine.js            shared, copy from .claude/skills/french-drill/assets/ if missing
  drill.css            shared, same
  speech.js            copy from assets/speech.js (the app's recogniser): written
                       questions get a Speak button; report counts spoken answers
  questions-<name>.js  the bank: window.BANK = { title, key, intro, questions: [...] }
  drill-<name>.html    shell: loads drill.css, the bank, engine.js
```

Serve with `python3 -m http.server 8787` from the scratchpad, then open
`http://localhost:8787/drill-<name>.html` in Chrome. Each page owns its own
`localStorage` key so drills never disturb each other.

**DELF listening exercises** (he likes this format): `assets/delf.html` is a reusable shell
(read timer, Play limited to the exam's 1 or 2 plays, answer timers, Submit, copy report, then
transcript and a free audio player). Content goes in `delf-<id>.js` (`window.DELF`, format in the
shell's comment) plus the official MP3, opened as `delf.html?x=<id>`. Official papers are
copyrighted and this repo is public: data and audio live in the gitignored `local/delf/`, never
committed. Mark against the official corrigé; never put the key in the data file.

Sources (all free; questions, audio, surveillant transcript, corrigé):
- france-education-international.fr: DELF B2 tout public exemples 1-2, junior/scolaire exemples 1-2.
- francepodcasts.com (old official CIEP papers, audio as a zip per sujet): DELF B2 tout public
  sujets 2-6, scolaire/junior sujets 1-3, DELF Pro sujet 1 (`/2021/05/05/delf-pro-b2-sujet-1/`).
  Index of all sujets on any of those pages. Sujet 1 tout public there is the 2020 reform paper =
  FEI exemple 1. Check every new paper's transcript against the used / reserved list first.
- Not usable: TV5Monde blocks curl (403) and he dislikes the site; DELF Pro on FEI is 403/404.

Used / reserved (update when a paper is sat):
| paper | status |
|---|---|
| FEI tout public exemple 1 (sleep / offices / youth magazines) | sat 2026-11-06, 14/25 |
| FEI tout public exemple 2 (Drancourt, phones in hospitals) | **reserved for the 2026-11-16 checkpoint**; it is also FEI's "entraînement" CO ex 1-2 |
| FEI junior exemple 1 (SJ démo 02: girls' football, tablets) | sat 2026-11-07, 15.5/25 |
| FEI junior exemple 2 (SJ démo 03: Haigneré sciences, libraires) | sat 2026-11-10/11: ex 1 5.25/18, ex 2 3/7 |
| francepodcasts DELF Pro sujet 1 (contrats / Salon de l'étudiant) | ex 1 sat 2026-11-11 (`pro1-ex1`): 8.75/18; corrigé Q5 "un an" disputed (audio: deux ans). Ex 2 (`pro1-ex2`) 3/7 |

Build recipe: `pdftotext -layout` for questions and corrigé (image-only PDFs: Read them visually).
Integral recordings include the instructions and pauses: cut the document with
`ffmpeg -af silencedetect=noise=-40dB:d=20` (pauses of 60 / 180 / 300 s), then
`ffmpeg -ss <end of 1-min pause> -to <start of 3-min pause> -c copy`. Speaker lines from the
surveillant PDF go in `transcript` as `<i>Name :</i> text` paragraphs.

## Bank format

```js
window.BANK = {
  title: 'Part II production',
  key:   'drill-part2-prod',      // localStorage namespace, unique per drill
  intro: 'Translate into French. Connectors matter as much as the tenses.',
  questions: [
    {
      id:    'p2tr-01',           // globally unique, never reused across banks
      en:    'While I was cooking, the phone rang twice.',
      a:     ['Pendant que je cuisinais, le téléphone a sonné deux fois.'],
      vocab: 'cuisiner - to cook / sonner - to ring',
      why:   'Background in the imparfait, the interruption in the passé composé.',
      tags:  ['imparfait-vs-passe-compose', 'connectors']
    }
  ]
}
```

- `a` lists **every** real variant: `on` for `nous`, `tu` for `vous`, futur proche
  beside futur simple wherever both are natural. A sitting spent arguing with a
  too-narrow key is a wasted sitting.
- `vocab` is the new words, shown as a hint before answering. This is how new
  vocabulary enters the drill instead of blocking it.
- `why` teaches. It is read on every question, right or wrong.
- `tags` name every chapter the question touches, so the breakdown is diagnostic.
- `listen: true` plus `say: '<French>'` makes a dictation item: Play / Slow buttons
  speak the French, `en` stays hidden until graded. Accept every homophone spelling.
  The engine picks **Google français (fr-FR)** first, then any fr-FR voice, and shows
  the voice name by the buttons. Yariv cannot follow the other voices: keep this
  preference, and tell him to use Chrome (Google voices need it and a connection).
- `day: N` plus a shell `filter` splits one bank into daily sets (`?day=N`).

## Rules these pages follow

Learned the hard way:

- **No pronunciation questions.** No IPA, no silent-letter spotting, no sounds in slashes.
- **Accents, cédille, apostrophes and hyphens are ignored when grading.** He types on a
  keyboard without them. `depeche toi` = `Dépêche-toi`. Score the French, not the keyboard.
- **Accept the gap filler or the whole sentence** when a prompt shows a template.
- **Intermediate and up.** Nothing that is a one-step lookup.
- **Complex sentences.** Two clauses and a connector, not four-word fragments.

## Page features the engine provides

- Answers, question order and hint state persist; a refresh loses nothing.
- Correct answers **lock**: disabled, dimmed, skipped by Tab.
- **Redo my mistakes** blanks only the wrong ones. **Clear answers** resets everything.
  **Reshuffle** deals a new order. The last two confirm first.
- **Hide correct** collapses the page to what is left.
- Every grade appends to an attempt history storing full wrong answers, not just ids.
- Each first attempt stores its **word errors** (fewest word edits to the nearest
  accepted variant); the stats line and the report show errors per sentence.
- **Copy report** produces the markdown Yariv pastes back into the chat.

## The loop

1. He sits the page and answers what he can.
2. He grades, reads the explanations, redoes his mistakes.
3. He pastes the report into the chat.
4. Log the sitting, name the error themes, teach them, and build the next drill
   from whatever is still failing.

Write each closed sitting to `study-log/` with its bank (see CLAUDE.md).
