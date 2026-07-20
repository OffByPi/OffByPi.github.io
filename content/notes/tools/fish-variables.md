---
title: "Fish Shell Variables"
tags: [tools, cli, shell, fish]
---
`fish` uses `set` for all variable manipulation — no `export`, no `$()` word-splitting surprises, and variables are lists by default.

---

## Scopes and Export

Default (no flag) is function-local if inside a function, global otherwise. Universal variables (`-U`) live in fish's own storage and sync across all open fish instances instantly, persisting across restarts.

`-x` exports a variable to subprocesses, equivalent to bash/zsh `export`. Combine with a scope flag — `-gx` (session-only) or `-Ux` (persisted) are the common pairings.

Every fish variable is a list; a "scalar" is just a list of one, indexed and sliced with `[ ]`.

## Cheatsheet

### Set a Variable

```fish
set <name> <value>
```

### Scopes (`-l` / `-g` / `-U`)

```fish
set -l <name> <value>   # local: this block/function only
set -g <name> <value>   # global: this session, all scopes
set -U <name> <value>   # universal: persisted across every session and restart
```

### Export to Subprocesses (`-x`)

```fish
set -gx <name> <value>
```

### Erase a Variable (`-e`)

```fish
set -e <name>
```

### Arrays (Lists)

```fish
set -gx <name> value1 value2 value3
echo $<name>[2]      # value2
echo $<name>[1..2]   # value1 value2
echo $<name>         # value1 value2 value3 (space-joined)
```

### Append/Prepend to PATH

```fish
fish_add_path <directory>
```

### Inspect a Variable's Scope/Flags (`-S`)

```fish
set -S <name>
```

### Query Existence (`-q`)

```fish
set -q <name>
and echo "set"
or echo "unset"
```

### List All Variables

```fish
set        # all variables
set -U     # universal only
set -x     # exported only
```
