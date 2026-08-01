#!/usr/bin/env python3
"""Check the reading passages against content/reading/SCHEMA.md.

Run:  python3 tools/check-reading.py
"""

import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
READING = os.path.join(ROOT, "content", "reading")
MANIFEST = os.path.join(ROOT, "content", "manifest.json")

WORDS = {"A1": (80, 120), "A2": (120, 180), "B1": (180, 260), "B2": (260, 350)}
QTYPES = {"mcq", "fill", "open"}

problems = []


def bad(name, msg):
    problems.append("%s: %s" % (name, msg))


def check(path, slugs):
    name = os.path.basename(path)
    with open(path, encoding="utf-8") as fh:
        try:
            p = json.load(fh)
        except ValueError as e:
            bad(name, "not valid JSON: %s" % e)
            return None

    if p.get("id") != name[:-5]:
        bad(name, "id %r does not match the filename" % p.get("id"))
    if p.get("level") not in WORDS:
        bad(name, "level %r is not A1/A2/B1/B2" % p.get("level"))
        return p
    for field in ("title", "blurb", "text"):
        if not str(p.get(field, "")).strip():
            bad(name, "empty %s" % field)

    for slug in p.get("grammar", []):
        if slug not in slugs:
            bad(name, "grammar slug %r is not a chapter" % slug)

    n = len(re.findall(r"[\w’'-]+", p.get("text", ""), re.UNICODE))
    lo, hi = WORDS[p["level"]]
    if not lo <= n <= hi:
        bad(name, "%d words, outside the %s range %d-%d" % (n, p["level"], lo, hi))

    # Every line has to be worth hearing on its own.
    for line in [l for l in p.get("text", "").split("\n") if l.strip()]:
        if len(line.split()) > 30:
            bad(name, "a line is %d words long; split it" % len(line.split()))

    aloud = p.get("aloud") or []
    if not 1 <= len(aloud) <= 2:
        bad(name, "needs one or two `aloud` lines, has %d" % len(aloud))
    for line in aloud:
        if not 3 <= len(line.split()) <= 10:
            bad(name, "aloud line %r must be 3-10 words" % line)
        if line not in p.get("text", ""):
            bad(name, "aloud line %r is not in the passage" % line)

    qs = p.get("questions") or []
    if not 5 <= len(qs) <= 7:
        bad(name, "needs 5-7 questions, has %d" % len(qs))
    seen = set()
    for q in qs:
        qid = q.get("id", "?")
        if qid in seen:
            bad(name, "duplicate question id %r" % qid)
        seen.add(qid)
        if q.get("type") not in QTYPES:
            bad(name, "%s: type %r not allowed in a passage" % (qid, q.get("type")))
            continue
        if not str(q.get("why", "")).strip():
            bad(name, "%s: empty why" % qid)
        if q["type"] == "mcq":
            ch = q.get("choices") or []
            if not 2 <= len(ch) <= 5 or not isinstance(q.get("a"), int) \
                    or not 0 <= q["a"] < len(ch):
                bad(name, "%s: bad mcq" % qid)
        else:
            a = q.get("a")
            if not isinstance(a, list) or not a or not str(a[0]).strip():
                bad(name, "%s: needs an answer array" % qid)
    if qs and qs[-1].get("type") != "open":
        bad(name, "the last question should be `open`")

    return p


def main():
    with open(MANIFEST, encoding="utf-8") as fh:
        manifest = json.load(fh)
    slugs = {c["slug"] for p in manifest["parts"] for c in p["chapters"]}

    files = sorted(f for f in os.listdir(READING) if f.endswith(".json") and f != "index.json")
    passages = [check(os.path.join(READING, f), slugs) for f in files]
    passages = [p for p in passages if p]

    index_path = os.path.join(READING, "index.json")
    if not os.path.exists(index_path):
        bad("index.json", "missing")
    else:
        with open(index_path, encoding="utf-8") as fh:
            listed = json.load(fh).get("passages", [])
        listed_ids = [e.get("id") for e in listed]
        for p in passages:
            if p["id"] not in listed_ids:
                bad("index.json", "does not list %s" % p["id"])
        for e in listed:
            if not os.path.exists(os.path.join(READING, e.get("file", ""))):
                bad("index.json", "lists %s, which has no file" % e.get("id"))
            if not str(e.get("blurb", "")).strip():
                bad("index.json", "%s has an empty blurb" % e.get("id"))

    print("%d passages checked" % len(passages))
    for p in passages:
        n = len(re.findall(r"[\w’'-]+", p["text"], re.UNICODE))
        print("  %-26s %s  %3d words  %d questions" %
              (p["id"], p["level"], n, len(p.get("questions") or [])))

    if problems:
        print("\n%d problems:" % len(problems))
        for x in problems:
            print("  " + x)
        return 1
    print("\nno problems")
    return 0


if __name__ == "__main__":
    sys.exit(main())
