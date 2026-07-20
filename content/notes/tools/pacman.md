---
title: "Pacman"
tags: [tools, cli, arch-linux]
---
`pacman` is Arch Linux's package manager, configured via `/etc/pacman.conf` and `/etc/pacman.d/mirrorlist`.

---

## Disable the Slow-Download Timeout

Pacman aborts a download if its transfer rate drops too low for too long. Adding `DisableDownloadTimeout` to `/etc/pacman.conf` removes that cutoff, useful on a mirror/connection that's slow but not actually stalled.

## Check the Fastest Mirrors

`rankmirrors` (from the `pacman-contrib` package) benchmarks the mirrors in a list and prints them sorted fastest-first, so you can rebuild `/etc/pacman.d/mirrorlist` with the best ones on top.

---

## Cheatsheet

### Disable the Slow-Download Timeout

```ini
# /etc/pacman.conf
DisableDownloadTimeout
```

### Check the Fastest Mirrors

```bash
rankmirrors -n 6 /etc/pacman.d/mirrorlist
```
