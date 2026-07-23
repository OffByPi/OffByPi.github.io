---
title: "Dua"
tags: [tools, cli, disk-usage]
---
`dua` (Disk Usage Analyzer) is a fast, parallelized disk space utility written in Rust, useful as a drop-in `du` replacement or, more importantly, through its interactive terminal UI.

## Interactive Mode

`dua interactive` (alias `dua i`) opens a full-screen TUI where you navigate directories with the arrow keys, drill into a directory with `Enter`/`→`, and go back with `←`. Mark one or more entries with `Space` to queue them, then press `d` to delete the marked entries on disk — handy for reclaiming space without leaving the terminal.

Other useful keys inside the TUI:
- `u` — move up to the parent directory.
- `s` — cycle sort order (size, name, count, mtime).
- `q` — quit.

## Non-Interactive Scan

Without `interactive`, `dua` just prints aggregated sizes, sorted largest first, similar to `du -sh * | sort -rh` but multithreaded.

```bash
dua <path> # aggregate sizes for a path (defaults to cwd)
```

## Cheatsheet

```bash
dua i # open interactive TUI in cwd
dua i <path> # open interactive TUI at a specific path
dua <path> # print aggregated sizes, no TUI
```
