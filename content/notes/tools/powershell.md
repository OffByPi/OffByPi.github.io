---
title: "PowerShell"
tags: [tools, shell, windows]
---
`powershell` is Windows' shell and scripting engine. Persistent config lives in `$PROFILE`.

---

## Activate Readline Keybindings

Add to `$PROFILE` (typically `\Documents\PowerShell\Microsoft.PowerShell_profile.ps1`) to switch `PSReadLine` to Emacs-style bindings (`Ctrl+A`/`Ctrl+E` for line start/end, `Ctrl+R` for reverse search, etc.) instead of the default Windows `-EditMode`.

---

## Cheatsheet

### Activate Readline Keybindings

```powershell
Set-PSReadLineOption -EditMode Emacs
```
