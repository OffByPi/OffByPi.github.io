---
title: "Podman Machine Management"
tags: [tools, cli, containers]
---
On macOS and Windows, [[podman]] runs containers inside a lightweight Linux VM managed by `podman machine`, since the container runtime needs a Linux kernel. This layer doesn't exist on Linux, where Podman talks to the kernel directly.

---

## Common Commands

* `podman machine init` — Create the default VM (only needed once).
* `podman machine start` / `podman machine stop` — Start / stop the VM.
* `podman machine list` — Show configured machines and their status.
* `podman machine ssh` — Open a shell inside the VM.
* `podman machine rm` — Delete the VM.

```bash
# First-time setup on macOS/Windows
podman machine init
podman machine start
```

If containers become unreachable or behave oddly after a host sleep/wake cycle, `podman machine stop && podman machine start` usually resolves it before reaching for `podman system reset`.

## Tweak Machine Settings

Tweak CPU, memory, or disk allocation with `podman machine set` (stop the machine first) or at creation time with `podman machine init`:

> **No live resizing:** `podman machine set` refuses to run against a started VM — stop it first, apply the change, then start it back up.

```bash
# Adjust an existing machine's resources
podman machine stop
podman machine set --cpus 4 --memory 4096

# Or set them when creating a new machine
podman machine init --cpus 4 --memory 4096 --disk-size 50
```

## Check Resource Usage

```bash
podman machine inspect <machine-name>
```

Shows the VM's configured CPUs, memory, and disk allocation (defaults to the default machine if `<machine-name>` is omitted).

For live usage inside the VM, `podman machine ssh` in and use standard Linux tools:

```bash
podman machine ssh

# Inside the VM
top
df -h
```

`podman system df` reports disk usage by images/containers/volumes instead of the VM as a whole:

```bash
podman system df
```
