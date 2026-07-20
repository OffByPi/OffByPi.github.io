---
title: "Devpod"
tags: [tools, dev, containers, vscode]
---
`devpod` is an open-source client for [devcontainers](https://containers.dev/), spinning up a reproducible dev environment from a repo's [[devcontainer-json|devcontainer.json]] on any provider (Docker, Podman, Kubernetes, SSH, cloud VMs).

> A "workspace" is **not** your repo — it's the running container (or VM/pod, depending on provider) that devpod builds from your repo's `devcontainer.json`. Your repo gets mounted/cloned into it; deleting a workspace destroys the container, not your source.

By default `devpod up` creates one persistent workspace per repo, named after it — the container isn't rebuilt on every `up`, it's stopped/started like any long-lived container, keeping installed packages and state between sessions. Re-running `devpod up` on a repo that already has a workspace just starts the existing container; use `--recreate` to force a rebuild, or `--id <name>` to spin up a second, independently-named workspace from the same repo.

---

## Install

Install the `devpod` CLI from [devpod.sh](https://devpod.sh/), then add and verify a provider. To use Podman instead of Docker, point the `docker` provider at the `podman` binary (see Cheatsheet).

## Create and Open a Workspace

`devpod up` reads `.devcontainer/devcontainer.json` from the target repo, builds/pulls the image, and provisions the container with your dotfiles and IDE tooling.

> If the repo has no `devcontainer.json`, devpod auto-detects the language (e.g. Python via `requirements.txt`/`pyproject.toml`) and generates one for you using a sane default image (e.g. `mcr.microsoft.com/devcontainers/python:3`), writing it into `.devcontainer/` so it's there to edit afterward.

## Using the VS Code / VSCodium Extension

Install the extension (VSCodium build shown in the Cheatsheet; same ID works for VS Code):

1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Run **Devpod: Open Workspace** and point it at a local folder or Git URL.
3. The extension shells out to the `devpod` CLI to create the workspace, then reopens the window connected to it — same experience as the built-in Dev Containers extension, but provider-agnostic.
4. Use the **Devpod** sidebar icon to browse existing workspaces, stop/delete them, or open a new one without touching the CLI.

> The extension is a thin UI over the CLI: anything you do in the sidebar maps to a `devpod` subcommand, so CLI and GUI workspaces are interchangeable.

## Useful Options

* `--provider <name>` — target a specific provider (e.g. `docker`, `kubernetes`) instead of the default.
* `--ide <ide>` — open with a specific IDE (`vscode`, `openvscode`, `goland`, etc.) instead of the configured default.
* `--recreate` — rebuild the workspace container from scratch, discarding cached layers.
* `devpod ssh <workspace-name>` — drop into a shell inside a running workspace without an IDE.

## Dotfiles

Set a dotfiles URL context-wide so every new workspace, on any provider, is created with it — no need to pass `--dotfiles` per `devpod up` call. Devpod clones the repo into the workspace and looks for an install script (`install.sh`, `install`, `bootstrap.sh`, `bootstrap`, `script/bootstrap`, `setup.sh`, `setup`, `script/setup`); if none is found, it falls back to symlinking every hidden file in the repo root straight into `$HOME`, `/etc/skel`-style — no script required for a simple dotfiles repo.

Override per-workspace with `devpod up <repo> --dotfiles <url> --dotfiles-script <path>`.

## Git Credentials

Devpod automatically forwards your local git credentials into every workspace, no per-repo config needed:

* **SSH keys** — via SSH agent forwarding, configured automatically on the workspace's SSH connection. Your private key never gets copied into the container, only the agent socket, so it relies on the key being loaded in your host's `ssh-agent` (`ssh-add -l`).
* **HTTPS credentials** — forwarded via a git credential helper.

> Commit *signing* via SSH has had rough edges with some third-party agents (e.g. 1Password's SSH agent) — worth testing if you rely on it.

## Cheatsheet

### Install and Configure a Provider

```bash
devpod provider add docker
devpod provider set-options docker -o DOCKER_PATH=$(which podman)   # optional: use Podman
devpod provider list
```

### Create and Open a Workspace

```bash
devpod up <repo-url-or-path>
```

### List Workspaces and Their Status

```bash
devpod list
```

### Stop a Workspace Without Deleting It

```bash
devpod stop <workspace-name>
```

### Delete a Workspace

```bash
# Removes the workspace and its volumes, unless --keep-volumes is passed
devpod delete <workspace-name>
```

### Install the VS Code / VSCodium Extension

```bash
codium --install-extension 3timeslazy.vscodium-devpodcontainers
```

### Set Default Dotfiles Repo

```bash
devpod context set-options -o DOTFILES_URL=<dotfiles-repo-url>
```

### Disable Automatic SSH Credential Forwarding

```bash
devpod context set-options default -o SSH_INJECT_GIT_CREDENTIALS=false
```
