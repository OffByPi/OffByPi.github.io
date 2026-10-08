---
title: "Shell"
tags: [tools, shell, cli]
created: 2026-07-22
modified: 2026-10-08
---
A running collection of interactive shell tricks worth knowing.

---

## End of Options (`--`)

`--` tells a command to stop parsing options — everything after it is a literal operand, even if it starts with `-`. Place it after the command's own flags, before the operands:

```bash
rm -- -f          # removes a file literally named "-f"
rm -rf -- -f       # real options first, then --, then the operand
touch -- --help    # creates a file named "--help" instead of printing help
```

Most useful when a filename or argument you don't control could start with `-` and get mistaken for a flag.

## Process Substitution

Feed a command's output to another command as if it were a file, without writing a temp file yourself.

```bash
diff <(cmd1) <(cmd2)
```

Fish has no `<()` syntax — use `psub` instead, which pipes into a temp file under the hood:

```fish
diff (cmd1 | psub) (cmd2 | psub)
```

## Time-Limit a Command (`timeout`)

Kill a command if it runs longer than a given duration — useful for flaky network calls or scripts that might hang.

```bash
timeout 5s curl https://example.com
timeout -k 2s 5s some-command   # send SIGTERM at 5s, SIGKILL 2s later if still alive
timeout --signal=INT 10s cmd    # send a specific signal instead of the default SIGTERM
```

Exit code `124` means the command was killed by the timeout, not that it failed on its own.

For a command you're not sure will terminate, `timeout` replaces the background-and-`kill` dance (`cmd & ...; kill %1`) — it cleans up after itself and the exit code tells you what happened:

```bash
timeout 30s python main.py; test $status -eq 124; and echo "timed out"   # fish
timeout 30s python main.py; [ $? -eq 124 ] && echo "timed out"            # bash/zsh
timeout --foreground 30s <command>   # needed when the command reads from the TTY interactively
```

macOS ships no `timeout`; install GNU coreutils (`brew install coreutils`), which provides `gtimeout`.
