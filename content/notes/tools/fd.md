---
title: "fd"
tags: [tools, cli, filesystem]
---
`fd` is a fast, user-friendly alternative to `find`, written in Rust. It ignores hidden files and `.gitignore` entries by default, uses colorized output, and matches regex or glob patterns against filenames without the `find`-style `-name` boilerplate.

## Basic Syntax

```bash
fd <pattern> <path>
```

Both `<pattern>` and `<path>` are optional — bare `fd` lists everything under the cwd (respecting ignore rules).

## Common Options

* `-H` — Include hidden files and directories.
* `-I` — Include files ignored by `.gitignore`.
* `-t <type>` — Filter by type: `f` (file), `d` (directory), `l` (symlink), `x` (executable).
* `-e <ext>` — Filter by file extension.
* `-d <depth>` — Limit search depth.
* `-g` — Treat `<pattern>` as a glob instead of regex.
* `-x <cmd>` — Execute `<cmd>` for each result (parallelized), `{}` is the placeholder for the path.
* `-X <cmd>` — Execute `<cmd>` once with all results appended as arguments.

## Cheatsheet

```bash
fd <pattern> # search cwd, regex match on filename
fd <pattern> <path> # search a specific path
fd -e <ext> # find by extension, e.g. fd -e md
fd -t d <pattern> # directories only
fd -H -I <pattern> # include hidden and gitignored files
fd -d 2 <pattern> # limit recursion depth

# Execute a command per match (parallel), {} is the match path
fd <pattern> --exec <cmd> {}

# Danger: recursively force-delete every match, no confirmation
fd <pattern> --exec rm -Rf {}
```

> **`--exec rm -Rf {}` is destructive and irreversible.** Always dry-run the `fd <pattern>` search alone first to confirm the match set before appending `--exec rm -Rf {}`.
