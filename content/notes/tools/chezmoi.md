---
title: "Chezmoi"
tags: [tools, cli, dotfiles]
created: 2026-07-20
modified: 2026-10-07
---
`chezmoi` manages dotfiles across machines from a single git repository, applying per-machine differences through templating. See [[chezmoi-templates]] for the templating syntax.

---

## Install

```bash
sh -c "$(curl -fsLS https://get.chezmoi.io/lb)"
```

## Initialize from an existing repo

```bash
chezmoi init git@github.com/<user>/<repo>.git
```

### Apply a single file

`init` only clones the repo; nothing touches `$HOME` until you apply. Skip `--apply` and pass the target to `apply`:

```bash
chezmoi init git@github.com/<user>/<repo>.git
chezmoi diff <target>
chezmoi apply <target>
```

A bare `chezmoi apply` applies everything, so keep passing the target. Other files' `run_*` scripts don't run, but `init` still renders `.chezmoi.toml.tmpl` and may prompt for values.

To keep files from ever being applied on a machine, list them in `.chezmoiignore` (templates allowed). To read a file without applying it, use `chezmoi cat <target>`.

## Add a File

```bash
chezmoi add <file>
```

To turn a tracked file into a template, use `chezmoi chattr template <file>` — see [[chezmoi-templates]].

## Add an On-Change Script

Chezmoi runs any source file prefixed `run_onchange_` when its rendered content changes.

```bash
chezmoi cd
touch run_onchange_install-dependencies.sh.tmpl
chmod +x run_onchange_install-dependencies.sh.tmpl
```

### Example: per-distro dependency install

```bash
#!/bin/bash

{{ if eq .chezmoi.os "darwin" }}
brew install tmux zoxide fzf ripgrep

{{ else if eq .chezmoi.os "linux" }}

    {{ if eq .chezmoi.osRelease.id "debian" "ubuntu" }}
    sudo apt-get update
    sudo apt-get install -y tmux zoxide fzf ripgrep

    {{ else if eq .chezmoi.osRelease.id "fedora" }}
    sudo dnf install -y tmux zoxide fzf ripgrep

    {{ else if eq .chezmoi.osRelease.id "arch" }}
    sudo pacman -S --noconfirm tmux zoxide fzf ripgrep

    {{ end }}

{{ end }}
```
