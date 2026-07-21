---
title: "Git Ignore Mechanisms"
tags: [tools, cli, git]
---
Git offers several ways to exclude files from being tracked, differing in *scope* (repo-wide vs personal vs global) and *whether they're versioned*.

---

## Overview

| Mechanism | Scope | Shared with team? | Location |
|---|---|---|---|
| `.gitignore` | Per-directory, repo-wide | Yes (committed) | Anywhere in the repo tree |
| `.git/info/exclude` | Repo-local, personal | No (not committed) | `.git/info/exclude` |
| Global gitignore | All repos on the machine | No (per-user) | Path set via `core.excludesFile` |
| `.gitignore_global` (example name) | Same as above | No | Wherever `core.excludesFile` points |

## `.gitignore`

The standard, versioned way to exclude files. Committed to the repo so every clone shares the same rules.

* Can exist in multiple directories — rules apply to that directory and its subdirectories.
* Nested `.gitignore` files can override or extend rules from parent directories.
* Use for patterns relevant to *anyone* working on the project (build artifacts, dependency folders, compiled output).


## `.git/info/exclude`

Functions exactly like a `.gitignore` at the repo root, but lives inside `.git/` so it is **never committed or shared**.

* Ideal for personal, repo-specific ignores (e.g., your own scratch files, editor workspace files you don't want to force on teammates).
* Same pattern syntax as `.gitignore`.

```bash
# Edit it directly
$EDITOR .git/info/exclude
```

## Precedence & Checking

Git applies ignore rules in this order, with more specific (deeper) `.gitignore` files taking precedence over broader ones, and negation (`!pattern`) able to override an earlier match:

1. `.git/info/exclude`
2. `.gitignore` files, read from the repo root down to the file's directory
3. Global excludes file (`core.excludesFile`)

```bash
# Check why a file is ignored (which rule/file matches)
git check-ignore -v <path>

# List all ignored files in the repo
git status --ignored
```

## When to Use Which

* **`.gitignore`** — build output, dependencies, anything the whole team should ignore.
* **`.git/info/exclude`** — your own local cruft in *this* repo that isn't worth polluting the shared `.gitignore`.
* **Global excludes file** — OS/editor files that show up in *every* repo you touch (`.DS_Store`, `*.swp`, `Thumbs.db`).

## Already-Tracked Files

Adding a pattern to any ignore file does **not** untrack files Git already knows about.

```bash
# Stop tracking a file but keep it on disk, then let .gitignore take over
git rm --cached <file>
git commit -m "chore: stop tracking <file>"
```

## Cheatsheet
### Ignoring Directories

Append a trailing slash to match a directory only (not a file of the same name):

```gitignore
node_modules/    # matches a "node_modules" directory at any depth
/build/          # matches only the "build" directory at repo root (anchored)
```

Without the trailing slash, the pattern matches a file *or* a directory of that name.

```gitignore
# Ignore all .log files
*.log

# Ignore a specific directory
node_modules/

# Negate a pattern (un-ignore a file)
!important.log

# Ignore only at repo root
/build
```

### Global gitignore (`core.excludesFile`)

Applies to *every* repository on your machine. Good for OS/editor artifacts unrelated to any specific project (`.DS_Store`, `*.swp`, `.idea/`).

```bash
# Configure a global ignore file (path is arbitrary)
git config --global core.excludesFile ~/.gitignore_global

# Add patterns
echo ".DS_Store" >> ~/.gitignore_global
echo "*.swp" >> ~/.gitignore_global
```

> Not committed anywhere — this is a per-user machine setting, not part of any repo.

### Path Anchoring Outside `.gitignore`

`core.excludesFile` and `.git/info/exclude` don't live inside the repo, but leading-slash patterns in them are still anchored to *that repo's root* (the top of the working tree) — not to the location of the excludes file itself.

```gitignore
# In ~/.gitignore_global or .git/info/exclude
/build      # only matches <repo-root>/build, evaluated per-repo
build/      # matches build/ at any depth (no leading slash = unanchored)
```

Since the global file applies to every repo, `/build` is re-anchored to whichever repo's root Git is currently evaluating — it doesn't refer to a fixed path on disk.