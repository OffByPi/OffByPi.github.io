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

## OR a Pattern

`-e` repeated, or `|` inside a single pattern, matches a line against any of several alternatives.

```bash
rg -e <pattern1> -e <pattern2> ...
rg '<pattern1>|<pattern2>' ...
```

## AND a Pattern

Ripgrep has no native AND operator. Chain a second `rg` to require both patterns on the same line, or use `-P` (PCRE2) with lookaheads.

```bash
rg <pattern1> ... | rg <pattern2>
rg -P '(?=.*<pattern1>)(?=.*<pattern2>)' ...
```

## Cheatsheet

```bash
rg <pattern> # basic recursive search
rg --no-ignore <pattern> # include gitignored/hidden files
rg -t <type> <pattern> # restrict to a file type
rg --type-list # list available -t types
rg --sort modified <pattern> # sort results by modification time
rg -e <pattern1> -e <pattern2> # OR: match either pattern
rg <pattern1> | rg <pattern2> # AND: match both patterns
rg -P '(?=.*<p1>)(?=.*<p2>)' # AND via PCRE2 lookaheads
```
