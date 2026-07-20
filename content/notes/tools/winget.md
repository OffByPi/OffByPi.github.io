---
title: "winget"
tags: [tools, cli, windows]
---
`winget` is Windows' built-in package manager.

---

## Install a Package Without Admin Privileges

Not every package supports a user-scoped install (it depends on the installer), but when it does, `--scope=user` avoids the UAC prompt by installing to the current user's profile instead of system-wide.

---

## Cheatsheet

### Install a Package Without Admin Privileges

```powershell
winget install --scope=user <package>
```
