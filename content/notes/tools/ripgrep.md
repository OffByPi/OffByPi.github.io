---
title: "Ripgrep"
tags: [tools, cli, search]
created: 2026-07-21
modified: 2026-08-25
---
`rg` is a line-oriented search tool that recursively searches the current directory for a regex pattern, respecting `.gitignore` by default and outperforming `grep`/`ack`/`ag` on large trees.

## Include Ignored Files

By default `rg` skips files matched by `.gitignore` and `.ignore`. `--no-ignore` disables that filtering.

```bash
rg --no-ignore ...
```

## Include Hidden Files

`rg` also skips dotfiles and dotdirs by default. `--hidden`/`-.` includes them; combine with `--no-ignore` to search everything.

```bash
rg --hidden ...
rg --hidden --no-ignore ...
```

## Search Only Files of a Certain Type

`-t` restricts the search to a known file type (e.g. `py`, `js`, `md`). List all supported types with `rg --type-list`.

```bash
rg -t <type> ...
```

## Search Files Matching a Pattern Instead of a Known Type

`-t` only accepts types from `--type-list`. For anything else — a custom extension, a filename pattern — use `-g`/`--glob` to filter by glob, or `--iglob` for a case-insensitive glob. Globs aren't regex, but cover most filename-matching needs without a known `-t` type.

```bash
rg <pattern> -g '<glob>'
rg <pattern> -g '*.<ext>'
rg <pattern> -g '!<glob>' # exclude instead of include
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

## Follow Symlinks

By default `rg` doesn't follow symbolic links. `-L`/`--follow` makes it traverse them, which is handy when your search root contains symlinked dirs or files.

```bash
rg -L <pattern> ...
```

## Cheatsheet

```bash
rg <pattern> # basic recursive search
rg --no-ignore <pattern> # include gitignored files
rg --hidden <pattern> # include hidden files/dirs
rg -t <type> <pattern> # restrict to a file type
rg --type-list # list available -t types
rg <pattern> -g '*.<ext>' # restrict via glob instead of -t
rg <pattern> -g '!<glob>' # exclude via glob
rg --sort modified <pattern> # sort results by modification time
rg -e <pattern1> -e <pattern2> # OR: match either pattern
rg <pattern1> | rg <pattern2> # AND: match both patterns
rg -P '(?=.*<p1>)(?=.*<p2>)' # AND via PCRE2 lookaheads
rg -L <pattern> # follow symlinks
```
