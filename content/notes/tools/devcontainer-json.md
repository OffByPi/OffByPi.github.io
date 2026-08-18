---
title: "devcontainer.json"
tags: [tools, dev, containers, vscode]
created: 2026-07-18
modified: 2026-08-18
---
`devcontainer.json` is the config file for the [devcontainers spec](https://containers.dev/), describing a reproducible dev environment as code. Tools that read it — VS Code's Dev Containers extension, the `devcontainer` CLI, [[devpod]] — all build the same environment from the same file, regardless of provider.

> If a repo has no `devcontainer.json`, [[devpod]] auto-detects the language and generates a default one for you.

---

## Location

```text
<repo-root>/.devcontainer/devcontainer.json
# or for a single-file setup:
<repo-root>/.devcontainer.json
```

## Minimal Example

```json
{
  "name": "<workspace-name>",
  "image": "mcr.microsoft.com/devcontainers/python:3"
}
```

## Building from a Dockerfile Instead of an Image

`dockerfile` and `context` are resolved relative to the folder containing `devcontainer.json`, not the repo root. For the default `.devcontainer/devcontainer.json` layout that means `".."` to reach the repo root — giving the Dockerfile access to the whole project instead of just the `.devcontainer/` folder. For the single-file `.devcontainer.json` variant at the repo root, that same folder *is* already the repo root, so `context` should be `"."` instead.

```json
{
  "name": "<workspace-name>",
  "build": {
    "dockerfile": "Dockerfile",
    "context": ".."
  }
}
```

## Installing a Package with postCreateCommand

`postCreateCommand` runs once, right after the container is created — a quick way to install a package without writing a Dockerfile:

```json
{
  "postCreateCommand": "sudo apt-get update && sudo apt-get install -y <package>"
}
```

> This only runs at *creation*. Installing a package by hand inside a running workspace (e.g. SSH'ing in and running `apt install`) is untracked — it's lost on the next `--recreate` or image rebuild. Anything that needs to survive a rebuild belongs in `postCreateCommand`, a Dockerfile `RUN`, or a feature.

For apt packages specifically, prefer the [`apt-packages`](https://github.com/rocker-org/devcontainer-features/tree/main/src/apt-packages) feature over `postCreateCommand` — it's declarative and composes with other features' install ordering, instead of a raw shell command:

```json
{
  "features": {
    "ghcr.io/rocker-org/devcontainer-features/apt-packages:1": {
      "packages": "<package>,<package>"
    }
  }
}
```

## Key Fields

* `image` / `build` — base image to pull, or a Dockerfile/Containerfile to build (mutually exclusive).
* `features` — reusable, composable install scripts layered on top of the base image without hand-writing Dockerfile steps. Each key's value is that feature's options object (`{}` uses its defaults); available options are feature-specific, documented in its own README. Browse available features at [containers.dev/features](https://containers.dev/features).
* `forwardPorts` — ports to forward automatically once the container starts (e.g. `[3000, 5432]`).
* `postCreateCommand` — lifecycle hook: shell command run once, after the container is created (e.g. installing dependencies).
* `postStartCommand` — lifecycle hook: shell command run every time the container starts (create or restart).
* `customizations.vscode.extensions` — list of extension IDs to auto-install in the container.
* `remoteUser` — user the tooling connects as inside the container (defaults to the image's default user).
* `workspaceFolder` — path inside the container where the repo is mounted and where the tooling opens/`cd`s to on attach (defaults to `/workspaces/<repo-name>`).
* `workspaceMount` — overrides the automatic bind mount of the repo; pair with `workspaceFolder` to open a subdirectory instead of the repo root. A comma-separated mount string:
  * `source` — path on the host to mount, typically `${localWorkspaceFolder}` (the repo root on the host).
  * `target` — path inside the container where `source` gets mounted.
  * `type` — mount type:
    * `bind` — direct host-path mount; contents live on the host filesystem.
    * `volume` — a Docker-managed named volume; contents live inside Docker, not directly on the host (faster on macOS/Windows, no host filesystem clutter).
  * `consistency` — host/container filesystem sync behavior (`cached`, `delegated`, or `consistent`); `cached` favors container read performance.
* `mounts` — extra bind mounts beyond the automatic repo mount (e.g. SSH keys, Docker socket).

> To reach a service running on the host from inside the devcontainer, use `host.containers.internal`/`host.docker.internal` instead of `localhost` — see [[podman#Reaching the Host Machine from a Container]].

## Example with Features and Hooks

```json
{
  "name": "<workspace-name>",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/devcontainers/features/node:1": {},
    "ghcr.io/devcontainers/features/docker-in-docker:2": {}
  },
  "forwardPorts": [3000],
  "postCreateCommand": "npm install",
  "customizations": {
    "vscode": {
      "extensions": ["dbaeumer.vscode-eslint"]
    }
  }
}
```

## Opening a Subdirectory as the Workspace

When the actual project lives in a subfolder of the repo (e.g. a plugin nested inside a monorepo), override `workspaceMount` to bind-mount the whole repo, then point `workspaceFolder` at the subfolder:

```json
{
  "workspaceMount": "source=${localWorkspaceFolder},target=/workspaces/<repo-name>,type=bind,consistency=cached",
  "workspaceFolder": "/workspaces/<repo-name>/<subdir-name>"
}
```

## Useful features

- ghcr.io/jsburckhardt/devcontainer-features/lazygit:1
- ghcr.io/devcontainers/features/desktop-lite:1 — see [[devcontainer-gui-apps]] for GUI apps over VNC/noVNC
- ghcr.io/devcontainers/features/github-cli:1
- ghcr.io/devcontainers-extra/features/uv:1
- ghcr.io/devcontainers/features/node:2
