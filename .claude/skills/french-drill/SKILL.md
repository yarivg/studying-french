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
  engine.js            shared, write once per session if missing
  drill.css            shared
  questions-<name>.js  the bank: window.BANK = { title, key, intro, questions: [...] }
  drill-<name>.html    shell: loads drill.css, the bank, engine.js
```

Serve with `python3 -m http.server 8787` from the scratchpad, then open
`http://localhost:8787/drill-<name>.html` in Chrome. Each page owns its own
`localStorage` key so drills never disturb each other.

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
- **Copy report** produces the markdown Yariv pastes back into the chat.

## The loop

1. He sits the page and answers what he can.
2. He grades, reads the explanations, redoes his mistakes.
3. He pastes the report into the chat.
4. Log the sitting, name the error themes, teach them, and build the next drill
   from whatever is still failing.

Keep the running log outside the repo, in the scratchpad, as `french-progress-log.md`.
