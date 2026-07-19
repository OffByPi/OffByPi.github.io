---
title: "Rsync File Synchronization"
tags: [tools, cli, backup, networking]
---
`rsync` synchronizes files and directories, locally or over SSH, transferring only the differences between source and destination. See [[robocopy]] for the Windows equivalent.

---

## Basic Syntax

```bash
rsync <options> <source> <destination>
```

> **Trailing slash matters:** `<source-dir>/` copies the *contents* of the directory; `<source-dir>` (no slash) copies the directory itself into the destination.

## Common Options

* `-a` — Archive mode (recursive, preserves permissions, timestamps, symlinks, ownership).
* `-v` — Verbose output.
* `-z` — Compress data during transfer.
* `-h` — Human-readable sizes.
* `-P` — Show progress and allow resuming partial transfers.
* `--dry-run` — Simulate the sync without making changes.
* `--delete` — Delete files in the destination that no longer exist in the source.
* `--exclude=<pattern>` — Skip files/directories matching the pattern.

## Cheatsheet

### Local Sync

```bash
# Copy contents of source-dir into dest-dir
rsync -avh <source-dir>/ <dest-dir>/
```

### Remote Sync over SSH

```bash
# Push local files to a remote host
rsync -avz -e ssh <local-dir>/ <user>@<host>:<remote-dir>/

# Pull files from a remote host
rsync -avz -e ssh <user>@<host>:<remote-dir>/ <local-dir>/
```

### Dry Run Before Deleting

```bash
# Preview what would be deleted without actually deleting
rsync -avh --delete --dry-run <source-dir>/ <dest-dir>/
```

### Excluding Files

```bash
rsync -avh --exclude='*.log' --exclude='node_modules/' <source-dir>/ <dest-dir>/
```

### Backup with Hard Links (Incremental Snapshots)

```bash
# Reuses unchanged files from the previous backup via hard links
rsync -avh --link-dest=<previous-backup-dir> <source-dir>/ <new-backup-dir>/
```

### Updating a Deployed App's Source from a New Repo Checkout

```bash
# <new-repo> is a fresh checkout; <deployed-dir> holds source + config + data.
# Without --delete, rsync never removes destination-only paths, so data/
# and config.ini are left alone as long as <new-repo> doesn't contain
# paths with the same names. If it does (e.g. a template config.ini or
# fixture data/ dir checked into the repo), add --exclude=data
# --exclude=<config-dir> --exclude=config.ini --exclude=*.env to stop
# those from overwriting the deployed versions.
rsync -avh <new-repo>/ <deployed-dir>/
```
