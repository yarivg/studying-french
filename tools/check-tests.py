#!/usr/bin/env python3
"""Check every question bank against what assets/test.js is willing to run.

The banks are hand-written JSON, so this is the guard rail: a typo in a
field name would otherwise only show up as a broken question mid-test.

Run:  python3 tools/check-tests.py
"""

import collections
import json
import os
import re
import sys
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TESTS = os.path.join(ROOT, "content", "tests")
MANIFEST = os.path.join(ROOT, "content", "manifest.json")

TYPES = {"mcq", "fill", "order", "listen", "say", "open"}

problems = []
counts = collections.Counter()


def bad(path, qid, msg):
    problems.append("%s [%s] %s" % (os.path.relpath(path, ROOT), qid or "-", msg))


def unaccent(s):
    return "".join(c for c in unicodedata.normalize("NFD", s)
                   if not unicodedata.combining(c))


def norm(s):
    """Mirror of Test.norm() with loose=False."""
    s = str(s).lower().replace("’", "'")
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r'^[\s.,;:!?«»"]+|[\s.,;:!?«»"]+$', "", s)
    return s.strip()


def check_bank(path, slugs):
    with open(path, encoding="utf-8") as fh:
        try:
            bank = json.load(fh)
        except ValueError as e:
            bad(path, None, "not valid JSON: %s" % e)
            return

    ch = bank.get("ch")
    if ch not in slugs:
        bad(path, None, "ch %r is not a slug in manifest.json" % ch)
    if not bank.get("title"):
        bad(path, None, "no title")

    questions = bank.get("questions")
    if not isinstance(questions, list) or not questions:
        bad(path, None, "no questions")
        return

    seen = set()
    for q in questions:
        qid = q.get("id")
        counts[q.get("type")] += 1

        if not qid:
            bad(path, None, "a question has no id")
        elif qid in seen:
            bad(path, qid, "duplicate id")
        seen.add(qid)

        if q.get("type") not in TYPES:
            bad(path, qid, "unknown type %r" % q.get("type"))
            continue
        if not str(q.get("q", "")).strip():
            bad(path, qid, "empty q")
        if not str(q.get("why", "")).strip():
            bad(path, qid, "empty why — that is the part that teaches")

        t = q["type"]

        if t == "mcq":
            choices = q.get("choices")
            if not isinstance(choices, list) or not 2 <= len(choices) <= 5:
                bad(path, qid, "mcq needs 2-5 choices")
                continue
            if not isinstance(q.get("a"), int) or not 0 <= q["a"] < len(choices):
                bad(path, qid, "mcq answer index out of range")
            if len(set(map(norm, choices))) != len(choices):
                bad(path, qid, "mcq has two identical choices")

        elif t in ("fill", "listen"):
            answers = q.get("a")
            if not isinstance(answers, list) or not answers:
                bad(path, qid, "%s needs a non-empty array of answers" % t)
                continue
            if any(not str(a).strip() for a in answers):
                bad(path, qid, "%s has an empty answer" % t)
            if t == "listen":
                if not str(q.get("say", "")).strip():
                    bad(path, qid, "listen needs a `say` string")
                elif len(q["say"].split()) > 6:
                    bad(path, qid, "listen `say` is longer than six words")
                # Giving the answer away in the prompt makes it free.
                if any(norm(a) and norm(a) in norm(q.get("q", "")) for a in answers):
                    bad(path, qid, "the answer appears in the question text")

            # A typed answer whose letters are already in the prompt, differing
            # only by a diacritic, is a question about the accent — and the
            # learner has no French keyboard. Those belong in `mcq`.
            first = str(answers[0]) if answers else ""
            if first and unaccent(first) != first:
                whole = r"\b%s\b" % re.escape(unaccent(norm(first)))
                if re.search(whole, unaccent(norm(q.get("q", "")))):
                    bad(path, qid,
                        "the prompt already gives the letters and only the accent is missing; "
                        "make this an mcq so it can be answered without a French keyboard")

        elif t == "order":
            words, answer = q.get("words"), q.get("a")
            if not isinstance(words, list) or not isinstance(answer, list):
                bad(path, qid, "order needs `words` and `a` arrays")
                continue
            if sorted(words) != sorted(answer):
                bad(path, qid, "order `words` is not a rearrangement of `a`")
            for alt in q.get("also", []):
                if sorted(alt) != sorted(words):
                    bad(path, qid, "an `also` order uses different words")

        elif t == "say":
            target = q.get("target", "")
            if not str(target).strip():
                bad(path, qid, "say needs a `target`")
            elif not 1 <= len(target.split()) <= 6:
                bad(path, qid, "say target must be 1-6 words (recogniser guesses longer ones)")
            if "a" in q:
                bad(path, qid, "say must not have an `a`")

        elif t == "open":
            answers = q.get("a")
            if not isinstance(answers, list) or not answers or not str(answers[0]).strip():
                bad(path, qid, "open needs a model answer in a[0]")

        # An answer the learner has to type must be typeable, and IPA is
        # exactly what he said he could not read.
        typed = []
        if t in ("fill", "listen"):
            typed = q.get("a") or []
        for a in typed:
            if re.search(r"/[^/]*[ɑɛœøəɔɥʁʃʒɲŋɡʎæ][^/]*/", str(a)):
                bad(path, qid, "answer contains IPA")


def main():
    with open(MANIFEST, encoding="utf-8") as fh:
        manifest = json.load(fh)
    slugs = {c["slug"] for p in manifest["parts"] for c in p["chapters"]}
    expected = {
        c["file"].replace(".md", ".json"): c["slug"]
        for p in manifest["parts"] for c in p["chapters"]
    }

    found = 0
    for rel, slug in sorted(expected.items()):
        path = os.path.join(TESTS, rel)
        if not os.path.exists(path):
            continue
        found += 1
        check_bank(path, slugs)

    print("%d banks checked, %d questions" % (found, sum(counts.values())))
    print("  " + ", ".join("%s %d" % (t, n) for t, n in sorted(counts.items())))

    if problems:
        print("\n%d problems:" % len(problems))
        for p in problems:
            print("  " + p)
        return 1
    print("\nno problems")
    return 0


if __name__ == "__main__":
    sys.exit(main())
