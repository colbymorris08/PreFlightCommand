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
- **Mitt targets:** [OpenCommand](https://github.com/tomdoyo/open-command) inferred targets (broadcast glove CV → camera pose → glove XYZ → empirical-Bayes target). **Not invented coordinates.**
- **Locations:** Statcast plate location via OpenCommand `pbp_info`.
- **Preflight cmitt:** Where `play_id` overlaps this repo’s catcher mitt tracking (`cmitt_*` from Savant/CF clips + `parts_gear`), a secondary mitt overlay is available (early-season overlap in this seed). Toggle “Only pitches with Preflight cmitt overlay.”

## Filters

Select/deselect individual **outings** and **pitch types** (or All / None). “All outings × types” ignores chip filters. Breakdown tables and glove/ball averages update live.

## Attribution / license

This UI adapts architecture and **data** from **tomdoyo/open-command** (OpenCommand © Tom Kim), licensed **CC BY-NC-SA 4.0**. See `vendor/OPEN_COMMAND_LICENSE` and `vendor/OPEN_COMMAND_README.md`. Non-commercial Preflight demo only; ShareAlike applies to adaptations of OpenCommand material.

Pipeline reference sources are vendored under `vendor/open-command/src/`.

## Rebuild seed

Requires Hugging Face download of OpenCommand 2026 `targets.csv.gz` + `pbp_info.csv.gz` into `data/opencommand/`, plus local `pitch-tips/runs/catcher_*/features.csv` for cmitt joins. Re-run the seed builder script used to generate `data/yamamoto_2026_command.json`.
