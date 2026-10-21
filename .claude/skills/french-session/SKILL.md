---
name: french-session
description: Plan and build Yariv's next French study session from his logs and error reports. Use when he says he has time to study, asks what to do next, or asks for a session plan (e.g. "I have 2 hours", "/french-session 90"). Produces a timed plan across writing, listening, speaking, reading and one new Le Carnet chapter, and builds the drill pages it needs.
---

# Building the next study session

Argument: minutes available (default 60). The output is a timed plan plus every page
it links to, built and served before the plan is shown.

## 1. Read the state (do not ask him for it)

In this order, stop when the picture is clear:

1. `study-log/*.md`, newest first by its dates. Its `## Next` section is the
   first commitment: an unfinished multi-day drill (e.g. `a2-fix.md` day N) comes first.
2. The ranked themes in `CLAUDE.md` ("Current picture") and in the newest log.
3. `content/roleplay/index.json` `focus`: what Talk already targets.
4. His app progress, synced by `assets/sync.js` to a private gist. Read it, never guess:
   `gh gist list | grep "Le Carnet"` for the id, then
   `gh gist view <id> --raw -f le-carnet-progress.json` into the scratchpad. Shape is
   documented at the top of `assets/progress.js`: `read` (slug → when read), `mastery`
   (slug → level 0-2), `tests` (slug → best, runs), `lib` (story → reading / done),
   `words` (his own added words), `qstat` (per-question misses). If the gist is missing
   or stale, ask for `Stats → Export progress`.
5. `content/manifest.json` for the next chapter: the first one with no `read` entry.
   Prefer the unread chapter that **attacks the top error theme** over the next in order
   (pronoun errors → `pronoun-idioms`; tense → `discours-indirect`). A done chapter with
   a weak best test (< 75%) can be a retest block instead of a new chapter.
6. What he has been reading: `lib` items marked `reading`, and the newest `words` he added.

## 2. Shape the session

**Until 2026-11-11 the skeleton is the one in `study-log/plan.md`:** writing a scene,
the listening loop, a cold retest. Chapter, song, reading and Talk blocks are paused.

Fixed skeleton, scaled to the time. For 120 minutes:

| min | block | skill |
|---|---|---|
| 20 | Cold production drill (the log's next commitment) | writing |
| 25 | New chapter: read `#/<slug>`, then `#/test/<slug>` | grammar |
| 15 | Dictée built from his recent reading words + top theme | listening |
| 15 | Reading: next chunk of the current book, aloud, words noted | reading |
| 20 | Talk scene chosen for the theme (`#/talk`) | speaking |
| 15 | Writing: 100-150 words, prompt tied to the reading, with required structures | writing |
| 15 | Song: translate 1-2 verses, notes on the frames, 3 lines of his own with them | reading |
| 10 | Paste reports, log, decide next | - |

Scale: 90 min drops reading and writing; 60 min also cuts the rest to drill 12,
chapter 13, dictée 10, song 12, Talk 8, close 5.

**Song:** a page in the scratchpad (`song-<slug>.html`): ▶ per line in Google français,
an English box per verse, notes behind a fold, a copy button. Lyrics on the page only
when public domain (author dead 70+ years: `Le Temps des cerises`, traditional songs).
For Piaf, Brel, Aznavour, Brassens, Trenet he pastes the lines from a free lyrics site
and the notes are built from his paste. Pick songs whose frames hit the top theme.
Order matters: production cold first, new grammar while fresh, speaking after the
chapter so it can use it.

Each block names: the exact URL or route, what to paste back, and the target
(e.g. "first attempt ≥ 7/10", "use lui/leur 3 times").

## 3. Build what the plan links to

- **Drills and dictées** follow the `french-drill` skill. Engine and CSS live in
  `.claude/skills/french-drill/assets/`: copy them into the scratchpad if missing,
  serve the scratchpad on 8787 (`curl -s localhost:8787` first; start
  `python3 -m http.server 8787` in the background only if down).
- **Dictée:** a bank whose questions have `listen: true` and `say`. 10-12 B1
  sentences, built from the words of his current reading and the failing theme.
  Accept every homophone spelling the audio cannot distinguish (`embrassé /
  embrassée`, `rendu / rendus`). Ids `dic-NN`, continuing the highest used.
  Name it `questions-dictee-<N>.js`, key `drill-dictee-<N>`. Voice: Google français
  fr-FR, already the engine default; never switch it.
- **Writing prompt:** in the plan itself. Name the 3-4 structures he must use (from
  the top themes) and 5-6 words from his recent reading.
- **Talk:** pick a scene id from `content/roleplay/index.json` whose situation
  forces the theme (pronouns → telling what you gave / said to people; tense →
  `souvenirs`). Give a one-line goal for it.

## 4. While he works

- Grade every paste by the `CLAUDE.md` rules: verdict first, rule, theme, widen the key
  when his French is right.
- Speaking: he pastes his own lines from Talk. Grade them as production.
- Dictée: split errors into **heard wrong** (a word missing or a different form,
  e.g. `pense` for `pensait`) and **silent grammar** (sounds the same, spelled wrong:
  `était / étaient`, `sa / ça`, `-é / -er`, agreement). The second kind is a writing
  error and feeds the production drills. Dictée 1 (2026-10-13): 2/12 exact, the
  majority silent grammar.

## 5. Close

When reports are in, update the relevant `study-log/` file (score row, ranked failures,
`## Next`), or start a new log for a new drill. Banks worth keeping go in
`study-log/<name>.bank.js`. Commit and push the `study-log/` files to main straight
away (standing approval, logs only). Anything else still waits for `/ship`.

## Rules

- No pronunciation theory, no IPA. Listening = dictée and Talk, not sound questions.
- Free resources only. Never recommend a paid book.
- No em dash anywhere.
- One plan, one recommendation per block. No menu of options.
