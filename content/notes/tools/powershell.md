---
title: "PowerShell"
tags: [tools, shell, windows]
created: 2026-07-20
modified: 2026-09-11
---
`powershell` is Windows' shell and scripting engine. Persistent config lives in `$PROFILE`.

---

## Activate Readline Keybindings

Add to `$PROFILE` (typically `\Documents\PowerShell\Microsoft.PowerShell_profile.ps1`) to switch `PSReadLine` to Emacs-style bindings (`Ctrl+A`/`Ctrl+E` for line start/end, `Ctrl+R` for reverse search, etc.) instead of the default Windows `-EditMode`.

---

## Stream Redirection

PowerShell has 6 numbered output streams, not just stdout/stderr: `1` Success, `2` Error, `3` Warning, `4` Verbose, `5` Debug, `6` Information. Redirect any of them to a file or merge them into another stream with `>&`.

- `>` and `2>` redirect a single stream (overwrite); `>>` and `2>>` append instead.
- `*>` redirects **all** streams at once; `*>>` appends all streams.
- `2>&1` merges stream 2 into stream 1 (any `n>&1` works, must come last on the line).
- Redirecting to `$null` discards a stream instead of writing it to disk.

---

## Cheatsheet

### Activate Readline Keybindings

```powershell
Set-PSReadLineOption -EditMode Emacs
```

### Stream Redirection

```powershell
Get-Item ./missing > out.txt        # success stream to file, overwrite
Get-Item ./missing 2> err.txt       # error stream to file
Get-Item ./missing *> all.txt       # every stream to file
Get-Item ./missing >> out.txt       # append success stream
Get-Item ./missing 2>&1             # merge error stream into success stream
Get-Item ./missing 2> $null         # discard error stream
```
