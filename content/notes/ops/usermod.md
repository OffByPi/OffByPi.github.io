---
title: "usermod: Adding a User to a Group"
tags: [ops, linux, users, groups]
created: 2026-09-02
---
`usermod -aG` appends an existing user to a supplementary group without touching their other group memberships.

```bash
sudo usermod -aG <group-name> <username>
```

The `-a` (append) flag is critical: omit it and `-G` **replaces** the user's entire supplementary group list with the one given, dropping every other group they belonged to.

Group membership only refreshes on the next login (or new shell session) — an already-open shell keeps the old `id` output. Force a refresh in the current shell without logging out:

```bash
newgrp <group-name>
```

Verify membership:

```bash
groups <username>
id <username>
```

## Cheatsheet

### Add user to a group
```bash
sudo usermod -aG <group-name> <username>
```

### Add user to multiple groups at once
```bash
sudo usermod -aG <group-one>,<group-two> <username>
```

### Verify
```bash
id <username>
```

### Apply new group in current shell
```bash
newgrp <group-name>
```
