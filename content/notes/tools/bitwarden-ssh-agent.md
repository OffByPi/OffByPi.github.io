---
title: "Bitwarden SSH Agent"
tags: [tools, ssh, security, bitwarden]
---
Bitwarden's desktop app can act as an [[ssh]] agent, storing your private keys in the encrypted vault instead of `~/.ssh/`. Requires Bitwarden release 2025.1.2 or newer.

---

## Enable It

1. Open the Bitwarden desktop app → **Settings** → toggle **Enable SSH agent**.
2. Add a key to your vault as an "SSH key" item, either:
   * **Generate new** (ED25519 only) directly in the desktop app, web app, or browser extension.
   * **Import existing** via the desktop app's clipboard import (OpenSSH or PKCS#8 format).

## Point SSH at It

Prefer `IdentityAgent` in `~/.ssh/config` over exporting `SSH_AUTH_SOCK` — it's scoped to SSH itself, applies uniformly across shells (bash, zsh, fish — see [[fish-variables]]), and needs no rc-file edits:

```
Host *
    IdentityAgent /Users/<user>/Library/Containers/com.bitwarden.desktop/Data/.bitwarden-ssh-agent.sock
```

```
# macOS (.dmg / Homebrew) / Linux
Host *
    IdentityAgent /Users/<user>/.bitwarden-ssh-agent.sock
```

On Windows, disable the `OpenSSH Authentication Agent` service (set startup type to Disabled) so it doesn't conflict. If a `Host` block already sets a specific `IdentityAgent` (e.g. per-account aliases, see [[ssh#Multiple Keys for the Same Host (`~/.ssh/config`)]]), the more specific match wins over `Host *`.

> **macOS still needs `SSH_AUTH_SOCK` in `config.fish`:** GUI apps and tools that talk to the agent directly (not through `ssh`/`scp`) don't read `~/.ssh/config`, so `IdentityAgent` alone isn't enough on macOS. Set the variable too (see [[fish-variables]]):
> ```fish
> set -Ux SSH_AUTH_SOCK ~/.bitwarden-ssh-agent.sock
> ```

## Test It

`IdentityAgent` is read by `ssh`/`scp`, not by `ssh-add` (which only looks at `SSH_AUTH_SOCK`), so verify through an actual connection instead:

```bash
ssh -T git@github.com
```

A successful `Hi <username>!` response confirms the agent is serving the right key — see [[git#Checking Which GitHub Account SSH Will Use]]. To list keys directly, export `SSH_AUTH_SOCK` for that one command instead of shell-wide:

```bash
SSH_AUTH_SOCK=/Users/<user>/.bitwarden-ssh-agent.sock ssh-add -L
```

## Authorization Prompts

**Settings → Ask for authorization when using SSH agent**: `Always` (default) prompts on every use, `Remember until vault is locked` prompts once per unlock session, `Never` disables prompting.

> The vault must be **unlocked** for the agent to serve keys — a locked vault triggers an unlock prompt on first use instead of failing silently.

## Requirements

* Desktop app running (the agent lives in it, not a separate background service).
* Git 2.34+ and OpenSSH 8.8+ if using a Bitwarden-held key for commit signing.
