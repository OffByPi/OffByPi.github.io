---
title: "Ripgrep"
tags: [tools, cli, search]
---
`rg` is a line-oriented search tool that recursively searches the current directory for a regex pattern, respecting `.gitignore` by default and outperforming `grep`/`ack`/`ag` on large trees.

## Include Ignored Files

By default `rg` skips files matched by `.gitignore`, `.ignore`, and hidden files. `--no-ignore` disables that filtering.

```bash
rg --no-ignore ...
```

## Search Only Files of a Certain Type

`-t` restricts the search to a known file type (e.g. `py`, `js`, `md`). List all supported types with `rg --type-list`.

```bash
rg -t <type> ...
```

## Sort by Date

`--sort` orders results instead of the default (arbitrary/parallel) traversal — useful when you want the most recently touched matches first.

```bash
rg --sort modified ...
```

## Cheatsheet

```bash
rg <pattern> # basic recursive search
rg --no-ignore <pattern> # include gitignored/hidden files
rg -t <type> <pattern> # restrict to a file type
rg --type-list # list available -t types
rg --sort modified <pattern> # sort results by modification time
```
