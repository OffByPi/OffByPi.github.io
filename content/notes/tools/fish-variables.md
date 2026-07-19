---
title: "Fish Shell Variables"
tags: [tools, cli, shell, fish]
---
`fish` uses `set` for all variable manipulation — no `export`, no `$()` word-splitting surprises, and variables are lists by default.

---

## Cheatsheet

### Set a Variable

```fish
set <name> <value>
```

> No `=`, no quoting required for simple values. Read it back with `$<name>`.

### Scopes (`-l` / `-g` / `-U`)

```fish
set -l <name> <value>   # local: this block/function only
set -g <name> <value>   # global: this session, all scopes
set -U <name> <value>   # universal: persisted across every session and restart
```

Default (no flag) is function-local if inside a function, global otherwise. Universal variables live in fish's own storage and sync across all open fish instances instantly.

### Export to Subprocesses (`-x`)

```fish
set -gx <name> <value>
```

Equivalent to bash/zsh `export`. Combine with a scope flag — `-gx` (session-only) or `-Ux` (persisted) are the common pairings.

### Erase a Variable (`-e`)

```fish
set -e <name>
```

### Arrays (Lists)

Every fish variable is a list; a "scalar" is just a list of one:

```fish
set -gx <name> value1 value2 value3
echo $<name>[2]      # value2
echo $<name>[1..2]   # value1 value2
echo $<name>         # value1 value2 value3 (space-joined)
```

### Append/Prepend to PATH (`fish_add_path`)

```fish
fish_add_path <directory>
```

Adds `<directory>` to `$PATH` (deduplicated, persisted as a universal variable) without manually re-`set`-ing the whole list.

### Inspect a Variable's Scope/Flags (`-S`)

```fish
set -S <name>
```

Shows where a variable is defined (local/global/universal) and whether it's exported — useful when a variable isn't behaving as expected and you're not sure which scope shadows which.

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
