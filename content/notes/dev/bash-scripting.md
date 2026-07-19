---
title: "Bash Scripting Defaults"
tags: [dev, bash, cli, shell]
---
A running collection of small Bash idioms worth reaching for by default, not a full guide.

---

## Strict Mode

```bash
set -euo pipefail
```

Put at the top of every non-trivial script. Each flag:

- `-e` — exit immediately if a command exits non-zero. Exceptions: commands in an `if`/`while` condition, negated with `!`, or part of `&&`/`||`.
- `-u` — treat unset variables as an error instead of expanding to an empty string. Catches typos like `$fiel` instead of `$file`.
- `-o pipefail` — a pipeline's exit status is the last non-zero command in it, not just the last command. Without it, `false | true` exits 0.

`-o pipefail` has no short flag, hence the separate `-o` form; `-eu` are combinable short flags.

## Trap

`trap <action> <signal...>` runs `<action>` when the shell receives a signal or hits a pseudo-signal. Not just for errors — it's the general hook into a script's lifecycle.

Common signals/pseudo-signals:

- `EXIT` — fires on any script exit (normal, `exit N`, or error). Use for cleanup that must always run.
- `ERR` — fires when a command fails (respects `set -e` semantics).
- `INT` — `Ctrl-C` (SIGINT).
- `TERM` — normal kill signal.
- `DEBUG` — fires before every command; useful for tracing.
- `RETURN` — fires when a function or sourced script returns.

Error trap, prints where the script died:

```bash
trap 'echo "Error on line $LINENO" >&2' ERR
```

Cleanup regardless of exit status — the most common use, since `EXIT` fires even after `set -e` kills the script:

```bash
tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT
```

Catch multiple signals with one trap (space-separated):

```bash
trap 'echo "interrupted" >&2; exit 1' INT TERM
```

Chain cleanup with the original exit code preserved:

```bash
trap 'ec=$?; rm -rf "$tmpdir"; exit $ec' EXIT
```

Reset a trap to default behavior:

```bash
trap - INT
```

List currently registered traps:

```bash
trap -p
```
