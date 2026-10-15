#!/usr/bin/env python3
"""Prepare the instrument sounds that "Type a feeling" plays.

Fetches single-note recordings, trims and re-encodes them small, and writes
assets/audio/instruments/<instrument>/<midi note>.mp3 plus _data/instruments.yml (which notes exist).
The page loads one instrument's notes only when a feeling needs it, after the visitor presses play.

Where the recordings come from: VSCO 2 Community Edition (Versilian Studios; recorded by Sam Gossner
and Simon Dalzell, cut by Elan Hickler; released under CC0 1.0), as repackaged for the web by
tonejs-instruments (Nicholaus P. Brosowsky, github.com/nbrosowsky/tonejs-instruments; the repository
labels its samples CC BY 3.0, so both are credited on the project page). The repository's own
sample-source-info.txt shows which instruments are VSCO 2: the ones below are. Its cello and guitars
come from Freesound recordings with other terms, so they are not used here.

Needs Python 3 and ffmpeg. ffmpeg is found on PATH, or pass --ffmpeg path/to/ffmpeg(.exe).
Downloads go to tools/_raw/instruments/ (not committed).

  python -I tools/make_samples.py --ffmpeg C:/path/to/ffmpeg.exe
  python -I tools/make_samples.py --only flute --ffmpeg ...      one instrument
"""
import argparse
import json
import pathlib
import re
import shutil
import subprocess
import sys
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / "tools" / "_raw" / "instruments"
OUT = ROOT / "assets" / "audio" / "instruments"
DATA = ROOT / "_data" / "instruments.yml"
REPO = "nbrosowsky/tonejs-instruments"
PC = {"C": 0, "Cs": 1, "D": 2, "Ds": 3, "E": 4, "F": 5, "Fs": 6, "G": 7, "Gs": 8, "A": 9, "As": 10, "B": 11}

# instrument: (folder in the repository, kind, MIDI range to keep, keep every n-th semitone at most)
# kind sets how long a note is kept: "sustained" notes (bowed, blown) 4.5 s, "struck" notes 3.5 s.
SPEC = {
    "piano": ("piano", "struck", (36, 96), 3),
    "harp": ("harp", "struck", (36, 96), 1),
    "xylophone": ("xylophone", "struck", (60, 108), 1),
    "flute": ("flute", "sustained", (48, 100), 1),
    "violin": ("violin", "sustained", (48, 100), 1),
    "horn": ("french-horn", "sustained", (24, 84), 1),
    "trumpet": ("trumpet", "sustained", (48, 90), 1),
    "contrabass": ("contrabass", "sustained", (20, 60), 1),
}
LENGTH = {"sustained": (4.5, 1.0), "struck": (3.5, 1.0)}      # seconds kept, seconds of fade-out


def midi_of(name):
    m = re.fullmatch(r"([A-G]s?)(\d)", name)
    return 12 * (int(m.group(2)) + 1) + PC[m.group(1)] if m else None


def http_json(url):
    req = urllib.request.Request(url, headers={"Accept": "application/vnd.github+json", "User-Agent": "dos-make-samples"})
    return json.load(urllib.request.urlopen(req, timeout=60))


def fetch(url, dest):
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": "dos-make-samples"})
    dest.write_bytes(urllib.request.urlopen(req, timeout=120).read())


def pick(notes, lo, hi, step):
    """Keep notes in [lo, hi] roughly `step` semitones apart (all of them when step is 1)."""
    notes = sorted(n for n in notes if lo <= n[0] <= hi)
    if step <= 1:
        return notes
    kept = [notes[0]]
    for n in notes[1:]:
        if n[0] - kept[-1][0] >= step:
            kept.append(n)
    return kept


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ffmpeg", default=shutil.which("ffmpeg"))
    ap.add_argument("--only", help="comma-separated instruments")
    a = ap.parse_args()
    if not a.ffmpeg or not pathlib.Path(a.ffmpeg).exists():
        sys.exit("ffmpeg not found. Install it or pass --ffmpeg path/to/ffmpeg(.exe).")
    names = a.only.split(",") if a.only else list(SPEC)
    sha = http_json("https://api.github.com/repos/%s/commits/master" % REPO)["sha"]
    manifest = {}
    for inst in names:
        folder, kind, (lo, hi), step = SPEC[inst]
        listing = http_json("https://api.github.com/repos/%s/contents/samples/%s?ref=%s" % (REPO, folder, sha))
        notes = [(midi_of(f["name"][:-4]), f["name"][:-4], f["download_url"]) for f in listing
                 if f["name"].endswith(".mp3") and midi_of(f["name"][:-4]) is not None]
        chosen = pick(notes, lo, hi, step)
        length, fade = LENGTH[kind]
        outdir = OUT / inst
        outdir.mkdir(parents=True, exist_ok=True)
        total = 0
        for midi, name, url in chosen:
            src = RAW / inst / (name + ".mp3")
            if not src.exists():
                fetch(url.replace("/master/", "/%s/" % sha), src)
            dst = outdir / ("%d.mp3" % midi)
            cmd = [a.ffmpeg, "-y", "-v", "error", "-i", str(src), "-t", str(length), "-ac", "1", "-ar", "32000",
                   "-af", "loudnorm=I=-26:TP=-3:LRA=7,afade=t=out:st=%s:d=%s" % (length - fade, fade),
                   "-b:a", "64k", str(dst)]
            subprocess.run(cmd, check=True)
            total += dst.stat().st_size
        manifest[inst] = (kind, [c[0] for c in chosen], total)
        print("%-11s %2d notes, %4d KB  (%s)" % (inst, len(chosen), total // 1024, kind))
    lines = [
        "# Generated by tools/make_samples.py. Do not edit by hand.",
        "# Single-note recordings from VSCO 2 Community Edition (Versilian Studios, CC0 1.0), as repackaged by",
        "# tonejs-instruments (Nicholaus P. Brosowsky, %s, commit %s)." % (REPO, sha[:10]),
        "# File for a note: assets/audio/instruments/<instrument>/<MIDI number>.mp3",
        "instruments:",
    ]
    old = {}
    if DATA.exists():                      # keep instruments not rebuilt this time
        txt = DATA.read_text(encoding="utf-8")
        for m in re.finditer(r"  (\w+):\n    kind: (\w+)\n    notes: \[([\d, ]*)\]", txt):
            old[m.group(1)] = (m.group(2), [int(x) for x in m.group(3).split(",") if x.strip()])
    for inst in SPEC:
        if inst in manifest:
            kind, notes = manifest[inst][0], manifest[inst][1]
        elif inst in old:
            kind, notes = old[inst]
        else:
            continue
        lines += ["  %s:" % inst, "    kind: %s" % kind, "    notes: [%s]" % ", ".join(str(n) for n in notes)]
    DATA.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
    print("wrote", DATA)


if __name__ == "__main__":
    main()
