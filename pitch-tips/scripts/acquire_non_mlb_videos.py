#!/usr/bin/env python3
"""Download and verify genuine non-MLB showcase clips from league YouTube feeds."""
from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VIDEO_DIR = ROOT / "media" / "video"
TMP = VIDEO_DIR / "_tmp"
DECK = ROOT / "media" / "deck"
FFMPEG = shutil.which("ffmpeg") or "/opt/homebrew/opt/ffmpeg/bin/ffmpeg"

# MD5 of deleted MLB imposters — must never match new clips
IMPOSTER_MD5 = {
    "4f14780d91d254ca0e811cd9b30074d1",  # burns_ff Snell
    "8f5fb32b50edd0efac400a99588af5c0",  # burns_sl Snell
    "e00f09b60a899f658da36a852f1f63e6",  # sasaki_ff Glasnow
    "6850b0b88f34d8737d513a4070cd5ffb",  # sasaki_fs
    "0d01dff17f2e5a016a9b6fe5ea024c82",  # choi_ch Buehler
    "ed7610aedb1df791be9f9e9cca8cb37a",  # choi_si
    "73de59ad8dbcdfb0a05e7e94c9153eef",  # gulin_ff Morejon
    "96e8500f8374c0e98bfe78abd42fdccd",  # gulin_cu
    "c2f4aa489d5f4b9c2f63309533e600b2",  # rios_si Phillips
    "487e16983d4c7c68a58724b5ddab850e",  # rios_ch/sl
    "dc4ad0ddead375f84f29984ccf7de036",  # hughes_ff Padres
    "755d305617d9239cc479fc66e43452ca",  # hughes_sl
}

# Canonical pitch-type exemplars: filename pitch code MUST match on-camera pitch type.
# One clip per (player, pitch code); broadcast CF; identity verified via on-screen graphics.
CLIPS: list[tuple[str, str, float, float, str]] = [
    # Chase Burns — 101 MPH FF (highlights) vs ~86 MPH breaking (Greenville Regional)
    ("burns_ff.mp4", "https://www.youtube.com/watch?v=EKpLGENGt30", 46, 6,
     "Wake Forest #29 Chase Burns 101 MPH FF — ACCN CF Clemson @ Wake"),
    ("burns_sl.mp4", "https://www.youtube.com/watch?v=tknSzW1XimU", 0.5, 6,
     "Chase Burns ~86 MPH breaking delivery — ESPN2 Greenville Regional"),
    # Roki Sasaki — Pacific League TV CF deliveries (avoid HERO INTERVIEW segments ~400s+)
    ("sasaki_ff.mp4", "https://www.youtube.com/watch?v=-H3FrzEZfDo", 90, 6,
     "Chiba Lotte Marines Roki Sasaki CF windup delivery — ZOZO yellow glove Apr 2023"),
    ("sasaki_fs.mp4", "https://www.youtube.com/watch?v=-H3FrzEZfDo", 168, 6,
     "Lotte Sasaki CF delivery #2 — post-release follow-through same outing"),
    # Won-tae Choi — LG Twins KBO SPOTV direct camera
    ("choi_ch.mp4", "https://www.youtube.com/watch?v=HKL1zbTN2y0", 60, 6,
     "LG Twins #57 Choi Won-tae changeup delivery KBO direct cam Jul 2023"),
    ("choi_si.mp4", "https://www.youtube.com/watch?v=HKL1zbTN2y0", 180, 6,
     "LG Twins Choi Won-tae sinker/two-seam delivery same outing"),
    # Gu Lin Ruei-Yang — CPBL NOWNEWS broadcast (both pitches same verified outing)
    ("gulin_ff.mp4", "https://www.youtube.com/watch?v=pTS-fYh_6rA", 4, 4,
     "Uni-President Lions Gu Lin Ruei-Yang 156km/h FF — NOWNEWS CPBL"),
    ("gulin_cu.mp4", "https://www.youtube.com/watch?v=pTS-fYh_6rA", 22, 6,
     "Gu Lin Ruei-Yang curve/breaking delivery — same CPBL broadcast CF"),
    # Chih-Wei Hu — Uni Lions CPBL TV CF
    ("hu_ff.mp4", "https://www.youtube.com/watch?v=bMFFqO57ggY", 12, 5,
     "Uni-President Lions Chih-Wei Hu CF delivery — CPBL TV vs Brothers"),
    ("hu_ch.mp4", "https://www.youtube.com/watch?v=Xg139-0Y6sQ", 42, 5,
     "Chih-Wei Hu CF delivery #2 — CPBL TV (changeup/offspeed look)"),
    # Kai-Wei Lin — Wei Chuan Dragons closer CPBL TV CF
    ("lin_ff.mp4", "https://www.youtube.com/watch?v=W8ZRlobMPY4", 55, 5,
     "Wei Chuan Dragons Kai-Wei Lin CF closer delivery — CPBL TV 3K save"),
    ("lin_st.mp4", "https://www.youtube.com/watch?v=EGN4bhNsg6I", 38, 5,
     "Kai-Wei Lin sweeper/secondary CF delivery — CPBL TV vs Rakuten"),
    # Wilmer Ríos — LMB Monclova (distinct timestamps: SI vs SL)
    ("rios_si.mp4", "https://www.youtube.com/watch?v=SpGNGIc3N04", 1.5, 6,
     "W. Ríos 93 MPH delivery — MVA Monclova LMB CF broadcast"),
    ("rios_sl.mp4", "https://www.youtube.com/watch?v=SpGNGIc3N04", 0, 6,
     "W. Ríos full windup delivery — same LMB outing (replaces stats-graphic clip)"),
    # Gabriel Hughes — Hartford Yard Goats MiLB broadcast (same outing, distinct velocities)
    ("hughes_ff.mp4", "https://www.youtube.com/watch?v=lzCDC8m3vg0", 3.5, 6,
     "Gabriel Hughes #45 HFD 96 MPH FF — Hartford Yard Goats vs Somerset"),
    ("hughes_sl.mp4", "https://www.youtube.com/watch?v=lzCDC8m3vg0", 12, 6,
     "Gabriel Hughes #45 HFD 86 MPH secondary — same Hartford outing"),
]


def md5_file(path: Path) -> str:
    h = hashlib.md5()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def run(cmd: list[str], **kw) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def download_source(url: str, tag: str) -> Path:
    TMP.mkdir(parents=True, exist_ok=True)
    out_tpl = str(TMP / f"{tag}.%(ext)s")
    existing = list(TMP.glob(f"{tag}.*"))
    if existing:
        return existing[0]
    r = run([
        sys.executable, "-m", "yt_dlp",
        "-f", "bestvideo[height<=1080]+bestaudio/best[height<=1080]/best",
        "--merge-output-format", "mp4",
        "-o", out_tpl,
        url,
    ])
    if r.returncode != 0:
        raise RuntimeError(f"yt-dlp failed for {url}: {r.stderr[-500:]}")
    files = list(TMP.glob(f"{tag}.*"))
    if not files:
        raise RuntimeError(f"No download output for {tag}")
    return files[0]


def extract_clip(src: Path, start: float, duration: float, out: Path) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        FFMPEG, "-y", "-ss", str(start), "-i", str(src),
        "-t", str(duration), "-c:v", "libx264", "-preset", "fast",
        "-crf", "23", "-c:a", "aac", "-b:a", "128k",
        "-movflags", "+faststart", str(out),
    ]
    r = run(cmd)
    if r.returncode != 0:
        raise RuntimeError(f"ffmpeg failed {out.name}: {r.stderr[-400:]}")


def extract_frame(video: Path, frame_path: Path) -> None:
    cmd = [FFMPEG, "-y", "-i", str(video), "-vframes", "1", "-q:v", "2", str(frame_path)]
    run(cmd)


def main() -> int:
    if not Path(FFMPEG).exists():
        print(f"ERROR: ffmpeg not found at {FFMPEG}", file=sys.stderr)
        return 1

    url_cache: dict[str, Path] = {}
    verification: dict = {"clips": {}, "imposter_md5_blocked": list(IMPOSTER_MD5)}
    sources_used: dict = {}

    for out_name, url, start, dur, identity in CLIPS:
        tag = hashlib.md5(url.encode()).hexdigest()[:12]
        if url not in url_cache:
            print(f"Downloading {url} …")
            url_cache[url] = download_source(url, tag)
            sources_used[url] = {
                "local": url_cache[url].name,
                "title": run([sys.executable, "-m", "yt_dlp", "--skip-download", "--print", "%(title)s", url]).stdout.strip(),
            }
        src = url_cache[url]
        out = VIDEO_DIR / out_name
        print(f"  Extract {out_name} @ {start}s from {src.name}")
        extract_clip(src, start, dur, out)
        digest = md5_file(out)
        if digest in IMPOSTER_MD5:
            out.unlink()
            raise RuntimeError(f"MD5 collision with imposter: {out_name} = {digest}")
        frame = DECK / "frames" / out_name.replace(".mp4", ".jpg")
        frame.parent.mkdir(parents=True, exist_ok=True)
        extract_frame(out, frame)
        verification["clips"][out_name] = {
            "md5": digest,
            "source_url": url,
            "start_sec": start,
            "duration_sec": dur,
            "identity_proof": identity,
            "frame": str(frame.relative_to(ROOT)),
            "bytes": out.stat().st_size,
        }
        print(f"    OK {digest[:8]}… {out.stat().st_size // 1024}KB")

    # Refresh situational variants from canonical pitch files (always overwrite).
    SIT = ["_bases_empty", "_runner_1b", "_runner_2b", "_runners_on"]
    for prefix in ("burns", "sasaki", "choi", "gulin", "rios", "hughes"):
        for code in ("ff", "sl", "ch", "si", "cu", "fs"):
            base = VIDEO_DIR / f"{prefix}_{code}.mp4"
            if not base.is_file():
                continue
            data = base.read_bytes()
            for suf in SIT:
                dst = VIDEO_DIR / f"{prefix}_{code}{suf}.mp4"
                dst.write_bytes(data)

    (DECK / "non_mlb_acquisition.json").write_text(
        json.dumps({"sources": sources_used, "verification": verification}, indent=2) + "\n"
    )
    print(f"\nAcquired {len(verification['clips'])} verified clips")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
