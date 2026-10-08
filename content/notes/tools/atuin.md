---
title: "Atuin"
tags: [tools, cli, shell]
created: 2026-10-08
modified: 2026-10-08
---
`atuin` replaces shell history with a SQLite database that records each command with its directory, exit code, duration, and session. Search is a fuzzy TUI bound to `Ctrl-R` (and optionally the up arrow), and the database can sync across machines.

## Quick Install

```bash
brew install atuin                                                # macOS / Linuxbrew
curl --proto '=https' --tlsv1.2 -LsSf https://setup.atuin.sh | sh # Linux, official script
cargo install atuin                                               # from source
```

Hook it into the shell, then import the existing history once:

```zsh
eval "$(atuin init zsh)"
```

```bash
atuin import auto
```

## Atuin vs. Shell History

Atuin records commands through a shell hook and stores them in its own database. It never fills the shell's built-in history. Without `HISTFILE`, `HISTSIZE`, and `SAVEHIST` set, zsh falls back to `HISTSIZE=30`, `SAVEHIST=0`, and no file, so up arrow cycles through an in-memory list that disappears with the session. macOS sets these in `/etc/zshrc`, so the problem only shows on Linux hosts without a distro-provided zshrc.

Two ways out:

- Let atuin own the up arrow (the default, no flag needed) and ignore the zsh history.
- Pass `--disable-up-arrow` to keep the plain zsh cycling, and set the history variables yourself.

## Up Arrow Filter

The default `atuin init` binds the up arrow to `atuin-up-search`, which opens the search UI. The filter it starts with is set separately from the `Ctrl-R` one:

```toml
filter_mode = "global"                              # Ctrl-R
filter_mode_shell_up_key_binding = "directory"      # up arrow
```

Valid values are `global`, `host`, `session`, `session-preload`, `directory`, and `workspace`. `workspace` matches any directory inside the current git repository and only applies when `workspaces = true` is set. I use `directory` for the up arrow so it surfaces what I ran in the current project.

## Extra Key Bindings

Atuin only binds `Ctrl-R` and the up arrow sequences (`^[[A`, `^[OA`). `Ctrl-P` stays on zsh's `up-line-or-history`, so it keeps showing plain history. Bind it after the init line, which is what defines the widget:

```zsh
eval "$(atuin init zsh)"
bindkey -M emacs '^p' atuin-up-search
```

There's no atuin widget for `Ctrl-N`, since there's nothing to go down to before the search opens.

## Compact Up Arrow Search

The full-screen UI hides the terminal, which is a problem when I run `<command> --help` and want to copy from the output before recalling the command. `inline_height` fixes that, but it applies to `Ctrl-R` too. To shrink only the up arrow, wrap `_atuin_up_search` in a widget that passes `--inline-height` and overrides the UI options through `ATUIN_*` environment variables:

```zsh
eval "$(atuin init zsh)"
_atuin_up_search_inline() {
  ATUIN_STYLE=compact ATUIN_SHOW_HELP=false ATUIN_SHOW_TABS=false ATUIN_SHOW_PREVIEW=false \
    _atuin_up_search --inline-height 2
}
zle -N atuin-up-search-inline _atuin_up_search_inline
bindkey -M emacs '^p' atuin-up-search-inline
bindkey -M emacs '^[[A' atuin-up-search-inline
bindkey -M emacs '^[OA' atuin-up-search-inline
```

`Ctrl-R` keeps the full UI. The `show_*` options drop the help row, the tabs row, and the preview row, which is what gets the strip down to two lines. If you only need the height, `inline_height_shell_up_key_binding = 2` in `config.toml` does it natively.

## Left Arrow in the Search UI

With an empty search box the cursor sits at position 0, so by default the left arrow exits the TUI (`exit_past_line_start = true`). `Ctrl-B` only moves the cursor, so at position 0 it does nothing, and atuin 18.22 has no option to rebind it. To make the left arrow copy the selected command to the prompt for editing, like `Tab`:

```toml
[keys]
accept_past_line_start = true
```

## Cheatsheet

```bash
atuin search <query>          # search from the command line
atuin search --cwd . <query>  # only commands run in this directory
atuin history list            # dump recorded commands
atuin stats                   # most-used commands
atuin import auto             # import existing shell history
atuin doctor                  # diagnose shell integration problems
```

```zsh
bindkey | grep atuin          # check which keys atuin owns
```
