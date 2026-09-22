# Preflight Command

Interactive **mitt target vs pitch location** tracker for Preflight, seeded with one 2026 MLB pitcher.

## Live

**Live:** https://colbymorris08.github.io/PreFlightCommand/  
**Repo:** https://github.com/colbymorris08/PreFlightCommand

## Local

```bash
cd pitch-tips/command-tracking
python3 -m http.server 8765
# open http://localhost:8765/
```

## Pitcher / data

- **Pitcher:** Yoshinobu Yamamoto (LAD), 2026 season seed (9 outings, ~800 pitches).
- **Mitt targets:** Inferred mitt targets from broadcast glove CV (camera pose → glove XYZ → empirical-Bayes target). **Not invented coordinates.** See vendor attribution for pipeline source.
- **Locations:** Statcast plate location.

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

Select/deselect individual **outings** and **pitch types** (or All / None). “All outings × types” ignores chip filters. Breakdown tables and mitt/ball averages update live. Click a marker for velo, movement, count, result, and Savant video.

## Attribution / license

This UI adapts architecture and **data** from **tomdoyo/open-command** (OpenCommand © Tom Kim), licensed **CC BY-NC-SA 4.0**. See `vendor/OPEN_COMMAND_LICENSE` and `vendor/OPEN_COMMAND_README.md`. Non-commercial Preflight demo only; ShareAlike applies to adaptations of OpenCommand material.

Pipeline reference sources are vendored under `vendor/open-command/src/`.

## Rebuild seed

Requires Hugging Face download of OpenCommand 2026 `targets.csv.gz` + `pbp_info.csv.gz` into `data/opencommand/`, plus local `pitch-tips/runs/catcher_*/features.csv` for cmitt joins. Re-run the seed builder script used to generate `data/yamamoto_2026_command.json`.
