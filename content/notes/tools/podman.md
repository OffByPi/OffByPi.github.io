---
title: Podman
tags:
  - tools
  - cli
  - containers
---
`podman` runs OCI containers without a background daemon, using rootless mode by default. It's a drop-in replacement for most `docker` commands. On macOS/Windows, see [[podman-machine]] for the VM that hosts the container runtime.

---

## Basic Syntax

```bash
podman <command> <options> <image>
```
## Common Commands

* `podman run <image>` — Create and start a container.
* `podman ps` — List running containers.
* `podman ps -a` — List all containers, including stopped ones.
* `podman images` — List local images.
* `podman exec -it <container> <cmd>` — Run a command in a running container.
* `podman logs <container>` — Show container logs.
* `podman stop <container>` / `podman rm <container>` — Stop / remove a container.
* `podman build -t <name> .` — Build an image from a `Containerfile` (or `Dockerfile`).
* `podman system reset` — Remove all containers, images, volumes, and pods, resetting Podman to its initial state.

## Common Flags

`--rm` deletes the container as soon as it exits, instead of leaving it around in `podman ps -a`. Use it for throwaway or interactive sessions where you don't need to inspect the container or its logs afterward; omit it for long-running or debuggable containers.

Without `--name`, Podman assigns a random name (e.g. `wizardly_curie`) to every container, which makes it hard to target with `podman exec`, `podman stop`, or `podman logs` later. Always pass `--name <container-name>` for anything you intend to interact with again.

## Enable Docker Hub Registry

Unlike Docker, Podman doesn't default to Docker Hub for unqualified image names (`podman pull nginx` may prompt you to pick a registry or fail). Add `docker.io` to `unqualified-search-registries` in `registries.conf`:

```bash
# User-level config (or /etc/containers/registries.conf for system-wide)
mkdir -p ~/.config/containers
```

```toml
# ~/.config/containers/registries.conf
unqualified-search-registries = ["docker.io"]
```

> Be aware: on Linux and Windows the registries are to be configured on the [[podman-machine]], but on newer version of podman are already configured.

## Docker Compatibility

Podman's CLI mirrors Docker's closely enough that most scripts and muscle memory carry over unchanged. To make `docker` itself resolve to Podman, symlink the binary:

```bash
mkdir -p ~/.local/bin
ln -s "$(command -v podman)" ~/.local/bin/docker
```

Ensure `~/.local/bin` is early in `PATH`. Tools that shell out to `docker` (build scripts, editor plugins) then transparently use Podman instead.

Podman also serves a Docker-compatible REST API over a socket, so SDKs and tools that talk to the Docker daemon (Testcontainers, `docker-compose`, IDE Docker integrations) work unchanged.

On macOS/Windows the socket is exposed by [[podman-machine]] automatically once the machine is running while on Linux:

```bash
# Enable the user-level socket (rootless)
systemctl --user enable --now podman.socket

# Point Docker-API clients at it
export DOCKER_HOST="unix://$XDG_RUNTIME_DIR/podman/podman.sock"
```

## Cheatsheet

### Run a Container Interactively

```bash
podman run -it --rm <image> <shell>
```

### Run in Background with Port Mapping

```bash
podman run -d --name <container-name> -p <host-port>:<container-port> <image>
```

### Persist Data with a Volume

```bash
podman run -d -v <host-dir>:<container-dir> <image>
```

### Pods (Podman-specific)

A pod groups containers sharing the same network namespace, similar to a Kubernetes pod.

```bash
# Create a pod with a published port
podman pod create --name <pod-name> -p <host-port>:<container-port>

# Add a container to the pod
podman run -d --pod <pod-name> <image>
```

### Generate a systemd Unit

```bash
# Generate a user-level systemd service for a running container
podman generate systemd --name <container-name> --files --new
```

### Docker Compose Compatibility

```bash
# podman-compose reads the same docker-compose.yml
podman-compose up -d
```
