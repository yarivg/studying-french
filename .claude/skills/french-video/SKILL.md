---
name: french-video
description: Turn a French YouTube video Yariv is watching into a listening session - fetch the French subtitles, cut a 4-5 minute clip, give him the timed link with first and last sentence, build a 12-sentence dictée from it, then grade, log and answer his word questions from the transcript. Use when he pastes a YouTube link, says "let's work on this video", or asks what a phrase in a video means.
---

# Working on a French video

The listening loop that took a podcast clip from 30% to 95% understood (2026-10-20):
cold watch at 1x, dictée, French-subtitle rewatch at 0.75x, clean rewatch at 1x.

## 1. Fetch the transcript

The scratchpad is wiped on reboot, so check before assuming anything is there.
Work in `$CLAUDE_JOB_DIR/tmp/yt` (or the session scratchpad). yt-dlp is not installed
system-wide; build a venv once per machine boot:

```bash
python3 -m venv env && env/bin/pip -q install yt-dlp
env/bin/yt-dlp -q --no-playlist --skip-download --write-auto-subs --write-subs \
  --sub-langs "fr.*,fr" --sub-format vtt -o v "<url>"
```

- `--no-playlist`: his links often carry `&list=`.
- Do not add `--print`: it turns the run into a simulation and writes nothing.
- Warnings about a JS runtime or a 429 on other languages are harmless if `v.fr.vtt` exists.

Flatten to one timestamped line per caption (`MM:SS text`):

```bash
awk '/-->/{t=substr($ 1,4,5)} !/-->/ && NF && !/WEBVTT|Kind:|Language:/{gsub(/<[^>]*>/,""); if(!seen[$ 0]++) print t" "$ 0}' v.fr.vtt > v.txt
# The space after each dollar sign is on purpose: the skill loader replaces a dollar
# sign followed directly by a digit with the skill's arguments.
```

Auto-subtitles mishear rare words (`frôer` for `frôler`, `rabageois` for `rabat-joie`,
`Ex en Provence` for `Aix-en-Provence`). When he asks about a word, grep the transcript
for the line, then correct it from context before explaining. Never trust the spelling.

## 2. Cut the clip

4-5 minutes of talk, starting after any music intro, ending on a sentence boundary.
Give him, before he watches:

- the link with `&t=<seconds>s` (drop the `&list=` part),
- start and pause times,
- the first and last sentence, so he can check he is synced.

Next clip starts where the last one stopped.

## 3. Build the dictée

Follow the `french-drill` skill (bank + shell, shared `engine.js` / `drill.css` from
`.claude/skills/french-drill/assets/`). Specific to video dictées:

- 12 sentences from the clip, **cleaned up**: fillers (`euh`), restarts and stutters cut,
  meaning and the speaker's words kept.
- Pick sentences that load the current top themes in `study-log/plan.md` (verb + `de / à`,
  silent endings and plurals, `y / en`, `-é` vs `-er` after `avoir / être`).
- Accept spoken `ne`-drop where the speaker drops it, and every homophone the audio
  cannot separate.
- Ids `dic-NN`, continuing the highest in `study-log/*.bank.js`. Never reuse.
- `questions-dictee-<N>.js`, key `drill-dictee-<N>`. Copy the bank to
  `study-log/dictee-<N>.bank.js` straight away: the scratchpad will not survive.
- Serve on 8787: `curl -s localhost:8787` first, start `python3 -m http.server 8787`
  from the page folder in the background only if it is down.

## 4. While he watches

- He reports a cold % after the first watch. Log it.
- Rules for the dictée: max 3 normal plays + 1 slow per sentence, then a grammar check
  without audio.
- Word questions: verdict first, the correct spelling, the line with its timestamp,
  the meaning, then the family (`frôler l'accident`, `il a frôlé la mort`). Tie it to an
  earlier drill when one used the same frame.

## 5. Grade and log

- Split errors into **heard wrong** and **silent grammar** (see `french-session`).
- Log in `study-log/dictee.md`: score row (first attempt with word errors per sentence,
  final, attempts), a section per dictée, cold and final comprehension %.
- Commit and push `study-log/` straight away (standing approval).
