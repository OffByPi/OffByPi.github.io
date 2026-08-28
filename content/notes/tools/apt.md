---
title: "APT"
tags: [tools, cli, ubuntu, debian]
created: 2026-08-07
modified: 2026-08-28
---
`apt` is Debian/Ubuntu's package manager, wrapping `dpkg` with dependency resolution and repository handling.

---

## Skip Waiting on Phased Updates

Ubuntu staggers some updates to a subset of machines first ("phased updates"), so `apt upgrade` can silently skip a package until your machine is picked. Setting `APT::Get::Always-Include-Phased-Updates` to `true` forces `apt` to include them immediately instead of waiting.

---

## Finding the Fastest Mirror

`netselect-apt` benchmarks Debian mirrors by latency/throughput and writes a ready-to-use `sources.list` for the fastest ones. Run it with your release codename (e.g. `trixie`); by default it writes to `./sources.list` in the current directory, so review it before copying it into `/etc/apt/sources.list`.

By default the generated file only enables `main` and `contrib` — pass `-n`/`--nonfree` to also include `non-free`. The man page only documents `-n` as adding `non-free`, but on trixie it also brings in `non-free-firmware`, so a plain `-n` run is enough to preserve both if your existing `sources.list` had them.

---

## Cheatsheet

### Skip Waiting on Phased Updates

```bash
sudo apt -o APT::Get::Always-Include-Phased-Updates=true upgrade
```

### Find and Use the Fastest Mirror

```bash
sudo apt install netselect-apt
sudo netselect-apt -n <release-codename>  # -n also enables non-free
sudo cp sources.list /etc/apt/sources.list
sudo apt update
```
