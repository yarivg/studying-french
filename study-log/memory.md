# Memory model

Goal: flashcard intervals fitted to how Yariv forgets, not a textbook default.
Data source: Le Carnet gist (`words[].at` = day added, `cards[]` box + due = last review day and result).

## Mémoire 1: 2026-11-09

58 of his own words, self-graded FR -> EN recall. 40 never reviewed (group A, by days since added),
18 reviewed in flashcards before (group B, by days since the last review). Words from my drills and
words marked known excluded. **37/58.** He notes some were known from English: cognates (intervenir,
espionner, vaccin, toxique, convaincre, propriétaire, envisager, observer...) are counted apart.

Never reviewed, non-cognates only (27 words):

| days since added | known |
|---|---|
| 3-4 | 1/2 |
| 5-7 | 3/8 |
| 8-14 | 2/3 |
| 15-30 | 3/7 |
| 31-60 | 3/7 |

About 40-45% at every age from 5 to 60 days. The fit is a floor, not a slope: a word met once is
either kept (about 45%) or lost within the first days; waiting longer barely changes it.

Reviewed before:

| last review | result then | known now |
|---|---|---|
| right (box 1) | 2 to 78 days ago | **11/13 (85%)** |
| wrong (box 0) | 2 to 57 days ago | 1/5 |

One correct review lifts a word from about 45% to about 85%, and it holds for weeks (23-78 days).
Small samples: direction is clear, numbers are rough.

## Formula v1 (provisional, from Mémoire 1)

- Wrong: due again the same day.
- First time right, never missed: 7 days (his data: 85% kept at 23+ days after one correct review).
- Right after a miss (relearned the same day): 2 days, then 7.
- Each later success: interval x 2.5 (7, 18, 45, 110 days).
- Cognates he gets from English: "I know this", retire on first sight.

## Next

- Log every review (day, days since last review, result) in the app; today only box and due survive.
- Mémoire 2 in two weeks (2026-11-23), then fit FSRS-style per-person parameters from the log,
  target about 90% recall at each review.
