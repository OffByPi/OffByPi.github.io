---
title: "nohup"
tags: [tools, shell, cli, processes]
created: 2026-08-07
---
`nohup` runs a command immune to `SIGHUP`, so it keeps running after the shell that launched it exits — the standard way to survive a closed terminal or dropped SSH session.

## Basic Usage

Without a trailing `&` the shell still blocks on the command; `nohup` alone only changes signal handling, it doesn't background the process.

```bash
nohup <command> &
```

## Output Redirection

`nohup` also redirects stdout/stderr to `nohup.out` in the current directory if they're still attached to a terminal. Redirect explicitly to control where logs land:

```bash
nohup <command> > <output.log> 2>&1 &
```

## Detaching Fully (`disown`)

`nohup` blocks `SIGHUP` but the job is still tied to the shell's job table — some shells send it a hangup anyway on exit. `disown` removes it from that table after backgrounding it:

```bash
nohup <command> &
disown
```

## When to Reach for `tmux`/`screen` Instead

`nohup` is a one-shot fire-and-forget: no way to reattach and check progress interactively. For anything you'll want to check back on, a terminal multiplexer session is a better fit than `nohup` + log tailing.

## Cheatsheet

```bash
nohup <command> &                       # run detached from SIGHUP, background it
nohup <command> > <output.log> 2>&1 &   # background, redirect stdout+stderr
disown                                  # drop last background job from shell's job table
tail -f nohup.out                       # follow default nohup log
```
