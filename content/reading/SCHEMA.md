# Reading passage format

One JSON file per passage in `content/reading/`, listed in
`content/reading/index.json`.

```json
{
  "id": "a1-01-le-matin",
  "title": "Le matin de Julie",
  "level": "A1",
  "blurb": "One morning, start to finish. Present tense and reflexive verbs.",
  "grammar": ["present-tense", "reflexive-verbs", "time-expressions"],
  "text": "Julie se réveille à sept heures.\nElle prend son café dans la cuisine.\n\nDehors, il pleut.",
  "gloss": { "le réveil": "alarm clock", "dehors": "outside" },
  "aloud": ["Julie se réveille à sept heures."],
  "questions": [ ... ]
}
```

| field | notes |
|---|---|
| `id` | matches the filename without `.json`. Progress is keyed on it, so never change one. |
| `level` | `A1`, `A2`, `B1` or `B2` |
| `blurb` | one line, says what grammar the passage exercises |
| `grammar` | chapter slugs from `content/manifest.json`. Used to link back to the lesson. |
| `text` | the passage. **One sentence per line.** A blank line starts a new paragraph. The reader makes every line separately playable, so a line must be a sensible thing to hear on its own. |
| `gloss` | word or phrase → English, for anything the reader will not know. Keys are matched case-insensitively against the passage, longest first. |
| `aloud` | one or two lines from the passage to read into the microphone. Each must be 3-10 words. |
| `questions` | comprehension questions, in the **same format as the test banks** — see `content/tests/SCHEMA.md`. Use `mcq`, `fill` and `open` only; the passage is already on screen, so `listen` and `say` add nothing. |

## Writing rules

- **Length by level:** A1 80-120 words, A2 120-180, B1 180-260, B2 260-350.
- **Only grammar the course has already taught**, and only what the named
  chapters cover. An A1 passage may not use the passé composé.
- **Vocabulary:** prefer words already in `data/vocab.json`. Anything outside
  it that a learner would not guess belongs in `gloss`.
- **5 to 7 questions.** At least two must need the passage rather than
  general knowledge, and at least one must ask about a grammar point rather
  than the plot. The last one should be `open`.
- **Write something worth reading.** A person, a situation, a small turn.
  Not a list of sentences that happen to share a tense.
- French must be correct, and it must sound like French rather than English
  with French words.
