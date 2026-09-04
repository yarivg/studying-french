# Test bank format

One JSON file per chapter, at `content/tests/<part>/<same-basename-as-the-chapter>.json`.
So `content/part1/04-liaisons.md` is tested by `content/tests/part1/04-liaisons.json`.

The chapter test reads its own file. A whole-part test samples across every
file in that part. Nothing else builds or bundles these: the app fetches them
as they are.

```json
{
  "ch": "liaisons",
  "title": "Liaisons",
  "questions": [ ... ]
}
```

`ch` must equal the chapter's `slug` in `content/manifest.json`.

## Every question

| field | required | notes |
|---|---|---|
| `id` | yes | unique inside the file, e.g. `liaisons-07`. Progress is keyed on it, so **never renumber an existing id** — add new ones at the end. |
| `type` | yes | one of the six below |
| `q` | yes | the prompt. Plain text, no markdown except `« »` around French. |
| `why` | yes | one or two sentences explaining the answer. Shown after grading, right or wrong. This is the part that teaches, so make it worth reading. |
| `tags` | no | array of extra strings for filtering, e.g. `["h-aspire"]` |

## Types

### `mcq` — pick one
```json
{ "id": "liaisons-03", "type": "mcq",
  "q": "Is there a liaison in « un grand homme » ?",
  "choices": ["No — h blocks it", "Yes — d is pronounced /t/", "Yes — d is pronounced /d/"],
  "a": 1,
  "why": "The h of homme is mute, so the liaison happens. A liaison d always surfaces as /t/." }
```
`a` is the **index** into `choices`. 3-4 choices. Wrong choices must be plausible
mistakes a learner actually makes, not filler.

### `fill` — type the answer
```json
{ "id": "articles-05", "type": "fill",
  "q": "Je ne bois pas ___ eau.",
  "a": ["d'"],
  "why": "After a negative, the partitive collapses to de, and de elides before a vowel." }
```
`a` is an array of every acceptable answer; the first is the model answer shown
on failure. Grading strips case, surrounding punctuation and outer whitespace.
Accents are **required** by default — add `"loose": true` to accept an
unaccented answer, for questions where the accent is not the point.

### `order` — put the words in order
```json
{ "id": "adjectives-08", "type": "order",
  "q": "Build the phrase: a small white car",
  "words": ["une", "petite", "voiture", "blanche"],
  "a": ["une", "petite", "voiture", "blanche"],
  "why": "Petit goes before the noun, colours go after." }
```
`words` is what gets shuffled and shown as chips; `a` is the correct order.
Add `"also": [[...]]` for other orders that are equally correct.

Chips are compared exactly, so the answer has to be reachable by clicking:
drop the hyphens of a command (`["Donne", "le", "moi"]`), keep an elision as
one chip (`"n'ai"`, `"l'ai"`, `"il y a"`) and leave the final `?` or `!` out
altogether. Every chip must be used, and only one arrangement of them should
read as correct - otherwise list the rest in `also`.

### `listen` — hear it, write it
```json
{ "id": "vowels-11", "type": "listen",
  "say": "le poisson",
  "q": "Type what you hear.",
  "a": ["le poisson"],
  "why": "oi is /wa/, and the -on is nasal." }
```
`say` is what the speech synthesiser reads. Never put the answer in `q`.
Keep `say` short — under six words — because that is what the voices do well.

### `say` — read it aloud
```json
{ "id": "liaisons-12", "type": "say",
  "q": "Say this out loud, with the liaison.",
  "target": "les enfants",
  "why": "The s of les links onto enfants as /z/." }
```
`target` is what the microphone is checked against. One to six words, no more:
the recogniser guesses long sentences from context and stops being evidence of
anything. No `a` field.

### `open` — free answer, you mark it
```json
{ "id": "gender-14", "type": "open",
  "q": "Name three noun endings that reliably mean feminine, with an example each.",
  "a": ["-tion (la nation), -té (la liberté), -ette (la fourchette) — also -ure, -ance, -ence, -ie"],
  "why": "Endings are the only systematic handle on gender; the rest is memory." }
```
`a[0]` is the model answer, revealed when you ask for it. You grade yourself.

## Writing rules

- **12 to 15 questions per chapter.** Cover the whole chapter, not just its first
  section. Read the chapter markdown before writing.
- **Only test what the chapter teaches.** No vocabulary the chapter never used,
  no grammar from a later chapter.
- **Mix the types.** Per chapter, roughly: 5-6 `mcq`, 3-4 `fill`, 1-2 `order`,
  1 `listen`, 1-2 `say`, 1 `open`. Pronunciation chapters (1-4) should lean
  harder on `listen` and `say`; grammar chapters on `fill` and `order`.
- **Order easy to hard** inside the file.
- **French must be correct.** Accents, agreement, elision. Check every string.
- **`why` is not optional and not a restatement of the answer.** It gives the
  rule, and where useful the contrast that makes the rule stick.
