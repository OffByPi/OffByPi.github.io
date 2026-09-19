---
title: "Claude Code"
tags: [tools, cli, ai]
created: 2026-09-16
---
`CLAUDE_CONFIG_DIR` points Claude Code at its config/auth/session directory — set it to run multiple accounts side by side, each fully isolated.

---

## Switch Accounts via `CLAUDE_CONFIG_DIR`

Default config dir is `~/.claude`. Point a second account at its own directory:

```sh
CLAUDE_CONFIG_DIR=~/.claude-second-user claude
```

Each directory holds its own credentials, settings, and session history — no logout/login dance to switch. Log into the new account once (`claude` prompts for auth on first run in an empty dir), then reuse the same env var to come back to it.

## Cheatsheet

### One-off Run on Second Account

```sh
CLAUDE_CONFIG_DIR=~/.claude-second-user claude
```

### Permanent Shell Alias

```sh
alias claude2='CLAUDE_CONFIG_DIR=~/.claude-second-user claude'
```
