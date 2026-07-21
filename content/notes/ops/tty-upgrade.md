---
title: "Upgrading a Reverse Shell to a Full TTY"
tags: [ops, security, pentesting, shell]
---
A raw reverse shell lacks job control, tab completion, arrow-key history, and proper signal handling (`Ctrl+C` kills the shell instead of the running command). Upgrading it to a fully interactive TTY fixes all of that.

## Penelope

[Penelope](https://github.com/brightio/penelope) is a shell handler that automates TTY upgrading, logging, and file transfers for you — it detects the remote shell and upgrades it automatically when a session connects, no manual steps required.

## Manual upgrade

Spawn a proper PTY on the target first:

```bash
python -c 'import pty; pty.spawn("/bin/bash")'
```

Then background the shell on your attacking machine, fix the terminal, and foreground it again:

```bash
stty raw -echo; fg
```

After `fg`, press `Enter` twice. Finally, set the terminal type so tools like `vim` and `less` render correctly:

```bash
export TERM=xterm-256color
```

## Cheatsheet

### Spawn a PTY on target
```bash
python -c 'import pty; pty.spawn("/bin/bash")' # requires python on target
python3 -c 'import pty; pty.spawn("/bin/bash")' # python3 variant
```

### Fix terminal on attacker side
```bash
stty raw -echo; fg # background shell first with Ctrl+Z
export TERM=xterm-256color
```

### Match window size (attacker side)
```bash
stty -a # note attacker rows/columns
stty rows <rows> cols <columns> # run on target shell
```
