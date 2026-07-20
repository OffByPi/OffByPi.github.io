---
title: "Chezmoi"
tags: [tools, cli, dotfiles]
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
