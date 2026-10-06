---
title: "uv"
tags: [tools, cli, python]
created: 2026-10-01
---
`uv` is a Rust-written Python package and project manager from Astral, replacing `pip`, `pip-tools`, `pipx`, `virtualenv`, and `pyenv` with a single fast binary. It resolves and installs dependencies an order of magnitude faster than `pip` and manages Python interpreter versions itself.

## Project Workflow

```bash
uv init <project-name>    # scaffold a new project with pyproject.toml
uv add <package>          # add a dependency, updates pyproject.toml and uv.lock
uv remove <package>       # remove a dependency
uv sync                   # install deps from uv.lock into .venv
uv run <script.py>        # run inside the project's venv, auto-syncing first
```

`uv` creates and manages `.venv` automatically — no manual `venv` activation needed for `uv run`.

## Python Version Management

```bash
uv python install <version>   # install a CPython version, e.g. 3.12
uv python list                # list installed and available versions
uv python pin <version>       # pin project to a version, writes .python-version
```

## Isolated Runs

`uv run --isolated` runs a command in a temporary, throwaway environment built only from the given dependencies — it ignores the project's `.venv` and doesn't touch `uv.lock`. Use it to sanity-check a script against specific package versions without polluting the project environment, or to run a one-off script that needs packages the project itself doesn't depend on. The environment is rebuilt from scratch on every invocation — there's no flag to make `--isolated` persist and reuse that same environment.

If the goal is a persistent side environment that just stays separate from `.venv` (rather than a disposable one), use `UV_PROJECT_ENVIRONMENT` instead:

```bash
UV_PROJECT_ENVIRONMENT=.venv-scratch uv run <script.py>
```

This points uv at an alternate venv path for the project. It's created on first run and synced incrementally on later runs, same as `.venv` normally would be — `.venv` itself is never touched.

## Cheatsheet

```bash
uv init <project-name>              # new project with pyproject.toml
uv add <package>                    # add dependency
uv add --dev <package>              # add dev-only dependency
uv remove <package>                 # drop dependency
uv sync                             # install from lockfile
uv lock                             # regenerate uv.lock without installing
uv run <script.py>                  # run in project venv
uv run --isolated <script.py>       # run in a disposable, isolated venv
UV_PROJECT_ENVIRONMENT=<path> uv run <script.py> # use a persistent venv instead of .venv
uv run --with <package> <script.py> # run with an extra ad-hoc dependency
uv python install <version>         # install a Python version
uv python pin <version>             # pin project Python version
uv pip install <package>            # pip-compatible interface, no project needed
uv tool install <package>           # install a CLI tool globally (like pipx)
uv venv                             # create a bare .venv without a project
```
