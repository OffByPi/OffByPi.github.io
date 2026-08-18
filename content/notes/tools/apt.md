---
title: "APT"
tags: [tools, cli, ubuntu, debian]
created: 2026-08-07
---
`apt` is Debian/Ubuntu's package manager, wrapping `dpkg` with dependency resolution and repository handling.

---

## Skip Waiting on Phased Updates

Ubuntu staggers some updates to a subset of machines first ("phased updates"), so `apt upgrade` can silently skip a package until your machine is picked. Setting `APT::Get::Always-Include-Phased-Updates` to `true` forces `apt` to include them immediately instead of waiting.

---

## Cheatsheet

### Skip Waiting on Phased Updates

```bash
sudo apt -o APT::Get::Always-Include-Phased-Updates=true upgrade
```
