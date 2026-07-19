---
title: "Robocopy File Synchronization"
tags: [tools, cli, backup, windows]
---
`robocopy` (Robust File Copy) mirrors files and directory trees on Windows, with restartable copying and detailed retry logic for flaky connections. See [[rsync]] for the Unix equivalent.

---

## Basic Syntax

```powershell
robocopy <source> <destination> <file-filter> <options>
```

> **No trailing slash on paths:** unlike `rsync`, `robocopy` always copies the *contents* of `<source>` into `<destination>`; there's no directory-vs-contents distinction based on trailing slashes. Wrap paths with spaces in quotes and never end a quoted path with a backslash (`"C:\path\"` breaks the parser). To copy the source directory itself rather than just its contents, append its name to the destination: `robocopy <source-dir> <dest-parent>\<source-dir-name> /E`.

## Common Options

* `/E` — Copy subdirectories, including empty ones.
* `/MIR` — Mirror the source tree (equivalent to `/E` + `/PURGE`); deletes destination files that no longer exist in the source.
* `/Z` — Restartable mode: resume interrupted copies of large files.
* `/ZB` — Restartable mode, falls back to backup mode on access-denied errors.
* `/MT[:n]` — Multi-threaded copy (default 8 threads, max 128).
* `/R:<n>` — Number of retries on failed copies (default is 1,000,000 — always set this explicitly).
* `/W:<n>` — Wait time in seconds between retries (default 30 — always set this explicitly).
* `/LOG:<file>` — Write output to a log file, overwriting it.
* `/LOG+:<file>` — Append output to a log file.
* `/XD <dirs>` — Exclude directories matching the given names/paths.
* `/XF <files>` — Exclude files matching the given names/patterns.
* `/XO` — Exclude older files: skip source files that aren't newer than the matching destination file.
* `/DRY-RUN` equivalent: `/L` — List only, don't copy, delete, or timestamp.

## Cheatsheet

### Local Mirror

```powershell
# Mirror source-dir into dest-dir, fast retries for local disks
robocopy <source-dir> <dest-dir> /MIR /R:3 /W:5
```

### Copy Over a Network Share

```powershell
# Restartable copy with logging, tuned retry/wait for flaky links
robocopy <source-dir> \\<host>\<share> /E /Z /R:5 /W:15 /LOG:<logfile.txt>
```

### Dry Run Before Mirroring

```powershell
# Preview what would be copied/deleted without making changes
robocopy <source-dir> <dest-dir> /MIR /L
```

### Excluding Files and Directories

```powershell
robocopy <source-dir> <dest-dir> /E /XD node_modules .git /XF *.log
```

### Multi-threaded Large Copy

```powershell
robocopy <source-dir> <dest-dir> /E /MT:16 /R:3 /W:5
```

### Updating a Deployed App's Source from a New Repo Checkout

```powershell
# <new-repo> is a fresh checkout; <deployed-dir> holds source + config + data.
# Without /MIR, robocopy never deletes or touches destination-only paths,
# so data/ and config.ini are left alone as long as <new-repo> doesn't
# contain paths with the same names. If it does (e.g. a template
# config.ini or fixture data/ dir checked into the repo), add
# /XD data <config-dir> /XF config.ini *.env to stop those from
# overwriting the deployed versions.
robocopy <new-repo> <deployed-dir> /E /XO /R:3 /W:5
```
