---
title: "Podman Machine Management"
tags: [tools, cli, containers]
---
On macOS and Windows, [[podman]] runs containers inside a lightweight Linux VM managed by `podman machine`, since the container runtime needs a Linux kernel. This layer doesn't exist on Linux, where Podman talks to the kernel directly.

---

## VM Lifecycle

If containers become unreachable or behave oddly after a host sleep/wake cycle, stopping and starting the machine usually resolves it before reaching for `podman system reset`.

## Tweak Machine Settings

Tweak CPU, memory, or disk allocation with `podman machine set` (stop the machine first) or at creation time with `podman machine init`.

> **No live resizing:** `podman machine set` refuses to run against a started VM — stop it first, apply the change, then start it back up.

## Check Resource Usage

`podman machine inspect` shows the VM's configured CPUs, memory, and disk allocation (defaults to the default machine if none is named). For live usage inside the VM, `podman machine ssh` in and use standard Linux tools. `podman system df` reports disk usage by images/containers/volumes instead of the VM as a whole.

## Cheatsheet

### Common Commands

```bash
podman machine init      # create the default VM (only needed once)
podman machine start     # start the VM
podman machine stop      # stop the VM
podman machine list      # show configured machines and their status
podman machine ssh       # open a shell inside the VM
podman machine rm        # delete the VM
```

### Resize an Existing Machine

```bash
podman machine stop
podman machine set --cpus 4 --memory 4096
```

### Set Resources at Creation Time

```bash
podman machine init --cpus 4 --memory 4096 --disk-size 50
```

### Inspect Resource Allocation

```bash
podman machine inspect <machine-name>
```

### Check Usage Inside the VM

```bash
podman machine ssh

# Inside the VM
top
df -h
```

### Check Podman Disk Usage

```bash
podman system df
```
