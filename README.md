# Preflight Command

Interactive **mitt target vs pitch location** tracker for Preflight.

## Live

**Live:** https://colbymorris08.github.io/PreFlightCommand/  
**Repo:** https://github.com/colbymorris08/PreFlightCommand

## Local

```bash
cd pitch-tips/command-tracking
python3 -m http.server 8765
# open http://localhost:8765/
```

## Pitchers / data

Use the **Pitcher** dropdown to switch players. Switching reloads that pitcher’s pitches and resets outing, pitch-type, and baserunner filters.

| Pitcher | Sample | Outings | Pitches | Targets |
|---------|--------|---------|---------|---------|
| Yoshinobu Yamamoto (LAD) | 9-outing 2026 demo seed (same outings as prior release) | 9 | ~824 | OpenCommand inferred mitt |
| Bryan Woo (SEA) | **Full 2026 regular-season starts** with OC coverage (not All-Star only) | 22 | ~1780 | OpenCommand inferred mitt |

- **Mitt targets:** Inferred mitt targets from broadcast glove CV (camera pose → glove XYZ → empirical-Bayes target). **Not invented coordinates.** See vendor attribution for pipeline source.
- **Locations:** Statcast plate location (pitcher-view; catcher-right `plate_x` negated on ingest).
- **Baserunners:** MLB Stats API live-feed occupancy before each pitch (`on_1b` / `on_2b` / `on_3b`), Statcast-equivalent.

Two July Woo starts (`2026-07-18`, `2026-07-25`) appear in OpenCommand pbp but lack ok+plausible inferred targets, so they are omitted. Later September Statcast starts are outside the current OpenCommand 2026 release window.

## Pitch marker key

| Marker | Meaning |
|--------|---------|
| Red X | Swing · whiff (swinging strike / foul tip) |
| Green X | Swing · hit (in play, no out / run) |
| Blue X | Swing · out (in play, out) |
| Amber X | Swing · foul |
| Blue dot | Take · ball |
| Red dot | Take · called strike |

Mitt graphic = average target · Ball graphic = average location (real independent means). Icons are true-to-scale vs the zone: mitt **9.5″** face width, ball **2.9″** diameter, using the same px/inch as pitch markers. Mitt sizing: adult catcher's mitts are ~32.5–34″ circumference (MLB gamers typically 33.5–34″; OBR 3.04 max 38″ circ / 15½″ top-to-bottom); circumference is the outer catching perimeter — a 33.5″ mitt as a modest ellipse (~12″ height) implies ~9.5″ pitcher-facing pocket/face (circular equiv 33.5/π ≈ 10.7″). Ball: regulation baseball from 9–9.25″ circumference ÷ π. Coordinates are pitcher-view inches (`+x` = pitcher's right / LHB, `+z` = up); Statcast/OpenCommand catcher-right `plate_x` is negated on ingest.

## Filters

- **Outings** and **pitch types** — select/deselect chips (or All / None). “All outings × types” ignores chip filters.
- **Men on base** — 1st / 2nd / 3rd selects: Any / Empty / Occupied. Filters combine with outing, pitch-type, and outcome-key toggles.
- Breakdown tables and mitt/ball averages update live. Click a marker for velo, movement, count, bases, result, and Savant video.

## Attribution / license

This UI adapts architecture and **data** from **tomdoyo/open-command** (OpenCommand © Tom Kim), licensed **CC BY-NC-SA 4.0**. See `vendor/OPEN_COMMAND_LICENSE` and `vendor/OPEN_COMMAND_README.md`. Non-commercial Preflight demo only; ShareAlike applies to adaptations of OpenCommand material.

Pipeline reference sources are vendored under `vendor/open-command/src/`.

## Rebuild seeds

Requires Hugging Face download of OpenCommand 2026 `targets.csv.gz` + `pbp_info.csv.gz` into `data/opencommand/`. Live-feed caches land in `data/_live_feed_cache/`.

```bash
cd pitch-tips/command-tracking
python3 scripts/build_command_seed.py --pitcher both --outings-from-existing
# Woo = all OC-covered 2026 starts; Yamamoto keeps the 9-outing demo set
# python3 scripts/build_command_seed.py --pitcher yamamoto --all-outings
```
