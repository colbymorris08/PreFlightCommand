#!/usr/bin/env python3
"""
Build Preflight Command JSON seeds from OpenCommand + MLB live feed.

OpenCommand supplies inferred mitt targets + plate location; the live feed
supplies count, velo, movement, PA events, and baserunner occupancy
(``on_1b`` / ``on_2b`` / ``on_3b``) keyed by ``play_id``.

Coordinate convention (pitcher view): Statcast/OpenCommand catcher-right
``plate_x`` / ``inferred_x_in`` are negated so ``+x`` = pitcher's right / LHB.

Usage:
  python3 scripts/build_command_seed.py --pitcher woo
  python3 scripts/build_command_seed.py --pitcher yamamoto --outings-from-existing
  python3 scripts/build_command_seed.py --pitcher both
"""
from __future__ import annotations

import argparse
import json
import math
import sys
import time
from pathlib import Path
from typing import Any

import pandas as pd
import requests

ROOT = Path(__file__).resolve().parents[1]
OC_DIR = ROOT / "data" / "opencommand"
OUT_DIR = ROOT / "data"
CACHE_DIR = ROOT / "data" / "_live_feed_cache"
UA = {"User-Agent": "PreflightCommand/1.0 (non-commercial demo)"}

PITCH_LABELS = {
    "FF": "4-Seam",
    "SI": "Sinker",
    "FC": "Cutter",
    "SL": "Slider",
    "CU": "Curve",
    "KC": "Knuckle Curve",
    "CH": "Changeup",
    "FS": "Splitter",
    "FO": "Forkball",
    "SC": "Screwball",
    "KN": "Knuckleball",
    "EP": "Eephus",
    "CS": "Slow Curve",
    "SV": "Slurve",
    "ST": "Sweeper",
    "GY": "Gyroball",
    "PO": "Pitchout",
}

PITCHERS = {
    "yamamoto": {
        "name": "Yoshinobu Yamamoto",
        "team": "LAD",
        "mlbam": 808967,
        "throws": "R",
        "season": 2026,
        "slug": "yamamoto_2026_command",
        # Existing demo seed used these 9 outings (not full season).
        "default_outings": [
            "2026-03-26",
            "2026-04-01",
            "2026-06-27",
            "2026-07-04",
            "2026-07-11",
            "2026-07-19",
            "2026-08-01",
            "2026-08-08",
            "2026-08-14",
        ],
        "sample_note": "9-outing demo seed (same outings as prior Yamamoto release)",
    },
    "woo": {
        "name": "Bryan Woo",
        "team": "SEA",
        "mlbam": 693433,
        "throws": "R",
        "season": 2026,
        "slug": "woo_2026_command",
        "default_outings": None,  # all OC-covered regular-season starts
        "sample_note": (
            "Full 2026 regular-season starts with OpenCommand ok+plausible "
            "inferred mitt targets (not All-Star game only)"
        ),
    },
}

ZONE = {
    "chart_x_min_in": -36,
    "chart_x_max_in": 36,
    "chart_z_min_in": -12,
    "chart_z_max_in": 54,
    "plate_half_width_in": 8.5,
    "zone_bot_in": 18,
    "zone_top_in": 42,
    "plate_tip_z_in": -8.5,
    "batter_box_inner_in": 14.5,
    "batter_box_outer_in": 50,
    "view": "pitcher",
}


def apply_runner_movements(bases: dict[str, Any], runners: list[dict]) -> dict[str, Any]:
    stay = dict(bases)
    for r in runners or []:
        mv = r.get("movement") or {}
        start = mv.get("start")
        end = mv.get("end")
        rid = ((r.get("details") or {}).get("runner") or {}).get("id")
        if start in ("1B", "2B", "3B"):
            stay[start] = None
        if mv.get("isOut"):
            continue
        if end in ("1B", "2B", "3B"):
            stay[end] = rid
    return stay


def classify_description(desc: str) -> dict[str, Any]:
    d = (desc or "").strip()
    dl = d.lower()
    if dl in ("ball", "ball in dirt"):
        return {
            "marker": "dot",
            "marker_class": "ball",
            "pitch_result": "Ball",
            "result_group": "ball",
            "swing": False,
        }
    if dl == "called strike":
        return {
            "marker": "dot",
            "marker_class": "called_strike",
            "pitch_result": "Called strike",
            "result_group": "called_strike",
            "swing": False,
        }
    if dl == "hit by pitch":
        return {
            "marker": "dot",
            "marker_class": "ball",
            "pitch_result": "Hit by pitch",
            "result_group": "hbp",
            "swing": False,
        }
    if dl in ("foul tip",):
        return {
            "marker": "x",
            "marker_class": "whiff",
            "pitch_result": "Foul tip",
            "result_group": "whiff",
            "swing": True,
        }
    if "swinging strike" in dl:
        return {
            "marker": "x",
            "marker_class": "whiff",
            "pitch_result": "Whiff",
            "result_group": "whiff",
            "swing": True,
        }
    if dl.startswith("foul"):
        return {
            "marker": "x",
            "marker_class": "foul",
            "pitch_result": "Foul Bunt" if "bunt" in dl else "Foul",
            "result_group": "foul",
            "swing": True,
        }
    if dl.startswith("in play, out"):
        return {
            "marker": "x",
            "marker_class": "out",
            "pitch_result": "In play, out",
            "result_group": "out",
            "swing": True,
        }
    if dl.startswith("in play, no out"):
        return {
            "marker": "x",
            "marker_class": "hit",
            "pitch_result": "In play, hit",
            "result_group": "hit",
            "swing": True,
        }
    if dl.startswith("in play, run"):
        return {
            "marker": "x",
            "marker_class": "hit",
            "pitch_result": "In play, run(s)",
            "result_group": "hit",
            "swing": True,
        }
    return {
        "marker": "dot",
        "marker_class": "other",
        "pitch_result": d or "Other",
        "result_group": "other",
        "swing": False,
    }


def count_before(desc: str, balls_after: int, strikes_after: int) -> tuple[int, int]:
    """Live-feed ``count`` is post-pitch; recover pre-pitch balls/strikes."""
    dl = (desc or "").lower()
    b, s = int(balls_after), int(strikes_after)
    if dl in ("ball", "ball in dirt"):
        return max(0, b - 1), s
    if dl == "called strike" or "swinging strike" in dl or dl == "foul tip":
        return b, max(0, s - 1)
    if dl.startswith("foul"):
        # Foul with 2 strikes stays at 2.
        if s == 2:
            return b, 2
        return b, max(0, s - 1)
    if dl == "hit by pitch":
        return b, s
    # In play / other: count unchanged by the pitch outcome.
    return b, s


def load_live_pitches(game_pk: int, pitcher_id: int) -> dict[str, dict]:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_path = CACHE_DIR / f"{game_pk}.json"
    if cache_path.is_file():
        js = json.loads(cache_path.read_text())
    else:
        url = f"https://statsapi.mlb.com/api/v1.1/game/{game_pk}/feed/live"
        r = requests.get(url, headers=UA, timeout=45)
        r.raise_for_status()
        js = r.json()
        cache_path.write_text(json.dumps(js))
        time.sleep(0.15)

    out: dict[str, dict] = {}
    bases: dict[str, Any] = {"1B": None, "2B": None, "3B": None}
    half_key: tuple[Any, Any] | None = None
    for pl in (js.get("liveData") or {}).get("plays", {}).get("allPlays", []) or []:
        about = pl.get("about") or {}
        # Clear ghost runners at each half-inning boundary.
        cur_half = (
            about.get("inning"),
            about.get("halfInning") or about.get("half") or about.get("isTopInning"),
        )
        if half_key is not None and cur_half != half_key:
            bases = {"1B": None, "2B": None, "3B": None}
        half_key = cur_half

        matchup = pl.get("matchup") or {}
        pit = (matchup.get("pitcher") or {}).get("id")
        on1, on2, on3 = bool(bases["1B"]), bool(bases["2B"]), bool(bases["3B"])
        pa_event = (pl.get("result") or {}).get("event")
        for ev in pl.get("playEvents") or []:
            if not ev.get("isPitch"):
                continue
            pid = ev.get("playId")
            if not pid:
                continue
            if pit is not None and int(pit) != int(pitcher_id):
                continue
            details = ev.get("details") or {}
            count = ev.get("count") or {}
            pdata = ev.get("pitchData") or {}
            breaks = pdata.get("breaks") or {}
            ptype = ((details.get("type") or {}).get("code")) or ""
            desc = details.get("description") or ""
            balls_after = int(count.get("balls") or 0)
            strikes_after = int(count.get("strikes") or 0)
            balls, strikes = count_before(desc, balls_after, strikes_after)
            out[str(pid)] = {
                "play_id": str(pid),
                "game_pk": int(game_pk),
                "pitch_type": str(ptype),
                "description": desc,
                "balls": balls,
                "strikes": strikes,
                "balls_after": balls_after,
                "strikes_after": strikes_after,
                "velo": pdata.get("startSpeed"),
                "hb_in": breaks.get("breakHorizontal"),
                "ivb_in": breaks.get("breakVerticalInduced"),
                "events": pa_event,
                "on_1b": on1,
                "on_2b": on2,
                "on_3b": on3,
            }
        bases = apply_runner_movements(bases, pl.get("runners") or [])
    return out


def load_oc(pitcher_id: int) -> pd.DataFrame:
    pbp = pd.read_csv(OC_DIR / "pbp_info.csv.gz")
    tgt = pd.read_csv(OC_DIR / "targets.csv.gz")
    m = pbp[pbp["pitcher_id"] == pitcher_id].merge(
        tgt, on="play_id", how="inner", suffixes=("", "_t")
    )
    ok = m[
        (m["status"].astype(str).str.lower() == "ok")
        & (m["plausible"].fillna(False).astype(bool))
        & m["inferred_x_in"].notna()
        & m["inferred_z_in"].notna()
        & m["plate_x_in"].notna()
        & m["plate_z_in"].notna()
    ].copy()
    ok["date"] = ok["date"].astype(str)
    ok["play_id"] = ok["play_id"].astype(str)
    ok["game_pk"] = ok["game_pk"].astype(int)
    return ok


def load_cmitt_index() -> dict[str, dict]:
    """Optional Preflight cmitt overlay from catcher PoC features."""
    runs = ROOT.parent / "runs"
    idx: dict[str, dict] = {}
    if not runs.is_dir():
        return idx
    for feat in runs.glob("*/features.csv"):
        try:
            cols = list(pd.read_csv(feat, nrows=0).columns)
        except Exception:
            continue
        if "play_id" not in cols:
            continue
        xcol = next(
            (c for c in ("cmitt_x_in", "cmitt_target_x_in", "cmitt_target_lateral_in") if c in cols),
            None,
        )
        zcol = next(
            (c for c in ("cmitt_z_in", "cmitt_target_z_in", "cmitt_target_height_in") if c in cols),
            None,
        )
        if not xcol or not zcol:
            continue
        use = ["play_id", xcol, zcol]
        ncol = "cmitt_n_frames" if "cmitt_n_frames" in cols else None
        if ncol:
            use.append(ncol)
        df = pd.read_csv(feat, usecols=use, dtype={"play_id": str})
        catcher = feat.parent.name.replace("catcher_", "").replace("_poc", "").replace("_", " ")
        for _, r in df.iterrows():
            pid = str(r["play_id"])
            xv, zv = r[xcol], r[zcol]
            if pd.isna(xv) or pd.isna(zv):
                continue
            idx[pid] = {
                "cmitt_x_in": round(float(xv), 2),
                "cmitt_z_in": round(float(zv), 2),
                "cmitt_n_frames": (
                    float(r[ncol]) if ncol and pd.notna(r.get(ncol)) else None
                ),
                "catcher_name": catcher.title() if catcher else None,
            }
    return idx


def build_pitcher(
    key: str,
    *,
    outings: list[str] | None = None,
    cmitt: dict[str, dict] | None = None,
) -> dict:
    meta = PITCHERS[key]
    oc = load_oc(meta["mlbam"])
    if outings is None:
        outings = meta.get("default_outings")
    if outings:
        oc = oc[oc["date"].isin(outings)].copy()
    if oc.empty:
        raise RuntimeError(f"No OpenCommand rows for {meta['name']}")

    game_pks = sorted(oc["game_pk"].unique().tolist())
    print(f"  {meta['name']}: {len(oc)} OC pitches across {len(game_pks)} games …")
    live: dict[str, dict] = {}
    for i, gpk in enumerate(game_pks, 1):
        print(f"    live feed {i}/{len(game_pks)} game_pk={gpk}", flush=True)
        live.update(load_live_pitches(int(gpk), meta["mlbam"]))

    pitches: list[dict] = []
    miss_list: list[float] = []
    for _, row in oc.iterrows():
        pid = str(row["play_id"])
        lv = live.get(pid, {})
        desc = lv.get("description") or row.get("description") or ""
        cls = classify_description(str(desc))
        # Pitcher-view inches: negate catcher-right x.
        loc_x = -float(row["plate_x_in"])
        loc_z = float(row["plate_z_in"])
        tgt_x = -float(row["inferred_x_in"])
        tgt_z = float(row["inferred_z_in"])
        naive_x = (
            -float(row["naive_x_in"]) if pd.notna(row.get("naive_x_in")) else None
        )
        naive_z = float(row["naive_z_in"]) if pd.notna(row.get("naive_z_in")) else None
        miss = math.hypot(loc_x - tgt_x, loc_z - tgt_z)
        miss_list.append(miss)
        ptype = str(lv.get("pitch_type") or row.get("pitch_type") or "")
        cm = (cmitt or {}).get(pid)
        pitch = {
            "id": pid,
            "play_id": pid,
            "game_pk": int(row["game_pk"]),
            "outing": str(row["date"]),
            "venue": row.get("venue") if pd.notna(row.get("venue")) else None,
            "pitch_type": ptype,
            "pitch_label": PITCH_LABELS.get(ptype, ptype or "Pitch"),
            "description": desc,
            "events": lv.get("events"),
            "balls": lv.get("balls"),
            "strikes": lv.get("strikes"),
            "balls_after": lv.get("balls_after"),
            "strikes_after": lv.get("strikes_after"),
            "velo": round(float(lv["velo"]), 1) if lv.get("velo") is not None else None,
            "hb_in": round(float(lv["hb_in"]), 1) if lv.get("hb_in") is not None else None,
            "ivb_in": round(float(lv["ivb_in"]), 1) if lv.get("ivb_in") is not None else None,
            "target_x_in": round(tgt_x, 2),
            "target_z_in": round(tgt_z, 2),
            "loc_x_in": round(loc_x, 2),
            "loc_z_in": round(loc_z, 2),
            "naive_x_in": round(naive_x, 2) if naive_x is not None else None,
            "naive_z_in": round(naive_z, 2) if naive_z is not None else None,
            "miss_in": round(miss, 2),
            "source_target": "opencommand_inferred",
            "marker": cls["marker"],
            "marker_class": cls["marker_class"],
            "pitch_result": cls["pitch_result"],
            "result_group": cls["result_group"],
            "swing": cls["swing"],
            "on_1b": bool(lv["on_1b"]) if "on_1b" in lv else None,
            "on_2b": bool(lv["on_2b"]) if "on_2b" in lv else None,
            "on_3b": bool(lv["on_3b"]) if "on_3b" in lv else None,
            "has_preflight_cmitt": bool(cm),
            "cmitt_x_in": cm["cmitt_x_in"] if cm else None,
            "cmitt_z_in": cm["cmitt_z_in"] if cm else None,
            "cmitt_n_frames": cm["cmitt_n_frames"] if cm else None,
            "catcher_name": cm["catcher_name"] if cm else None,
            "video_url": f"https://baseballsavant.mlb.com/sporty-videos?playId={pid}",
        }
        pitches.append(pitch)

    pitches.sort(key=lambda p: (p["outing"], p["play_id"]))
    outing_list = sorted({p["outing"] for p in pitches})
    n_with_runners = sum(
        1 for p in pitches if p.get("on_1b") is not None
    )
    median_miss = float(pd.Series(miss_list).median()) if miss_list else None
    cmitt_n = sum(1 for p in pitches if p.get("has_preflight_cmitt"))

    payload = {
        "pitcher": {
            "name": meta["name"],
            "team": meta["team"],
            "mlbam": meta["mlbam"],
            "throws": meta["throws"],
            "season": meta["season"],
        },
        "data_source": {
            "primary": (
                "OpenCommand (https://github.com/tomdoyo/open-command) 2026 inferred "
                "mitt targets from broadcast glove CV + Statcast plate location"
            ),
            "license": "CC BY-NC-SA 4.0",
            "attribution": (
                "OpenCommand © Tom Kim (tomdoyo). Adapted for Preflight non-commercial UI; "
                "changes: pitcher-view chart, outing/pitch-type/baserunner filters."
            ),
            "baserunners": (
                "MLB Stats API live feed occupancy before each pitch "
                "(on_1b / on_2b / on_3b booleans; Statcast-equivalent)"
            ),
            "sample": meta["sample_note"],
            "preflight_cmitt": (
                "pitch-tips catcher mitt tracking (cmitt_*) joined on play_id where measured"
            ),
            "filter_model": (
                "Select outings + pitch types + 1B/2B/3B occupancy; aggregates recompute "
                "avg glove/target, avg location, median/mean miss from OpenCommand inferred targets"
            ),
            "outings": outing_list,
            "pitch_count": len(pitches),
            "cmitt_overlap": cmitt_n,
            "baserunner_coverage": n_with_runners,
            "season_inferred_median_in": round(median_miss, 2) if median_miss is not None else None,
            "ui_label": "Preflight Command · mitt target vs location",
        },
        "zone": ZONE,
        "pitches": pitches,
    }
    return payload


def write_payload(payload: dict, slug: str) -> Path:
    path = OUT_DIR / f"{slug}.json"
    path.write_text(json.dumps(payload, separators=(",", ":")))
    print(
        f"  wrote {path.name}: {payload['data_source']['pitch_count']} pitches, "
        f"{len(payload['data_source']['outings'])} outings, "
        f"baserunner_coverage={payload['data_source']['baserunner_coverage']}"
    )
    return path


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--pitcher", choices=["woo", "yamamoto", "both"], default="both")
    ap.add_argument(
        "--outings-from-existing",
        action="store_true",
        help="For Yamamoto, keep the prior 9-outing demo set",
    )
    ap.add_argument("--all-outings", action="store_true", help="Use all OC outings")
    args = ap.parse_args()

    if not (OC_DIR / "targets.csv.gz").is_file() or not (OC_DIR / "pbp_info.csv.gz").is_file():
        print(f"Missing OpenCommand files in {OC_DIR}", file=sys.stderr)
        return 1

    cmitt = load_cmitt_index()
    print(f"cmitt index: {len(cmitt)} play_ids")

    keys = ["yamamoto", "woo"] if args.pitcher == "both" else [args.pitcher]
    for key in keys:
        outings = None
        if key == "yamamoto" and args.all_outings:
            outings = None  # override default list → all
            # force all by temporarily clearing default
            PITCHERS[key]["default_outings"] = None
        elif key == "yamamoto" and not args.outings_from_existing and not args.all_outings:
            # default: keep demo outings
            pass
        payload = build_pitcher(key, outings=outings, cmitt=cmitt)
        write_payload(payload, PITCHERS[key]["slug"])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
