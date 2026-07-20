---
title: "Wireless Drivers (Debian)"
tags: [ops, linux, wifi, drivers]
---
Debian ships only free firmware by default, so most wireless chipsets need an extra package before the adapter works at all.

---

## Enable Wireless Firmware

`firmware-misc-nonfree` bundles the non-free firmware blobs for common wireless (and other) chipsets that Debian's default install excludes for licensing reasons.

## AWUS1900 (Realtek RTL8814AU)

The Alfa AWUS1900 USB adapter uses a Realtek RTL8814AU chipset, which isn't supported by Debian's in-kernel driver. `realtek-rtl88xxau-dkms` builds and installs the out-of-tree driver via DKMS, so it survives kernel upgrades.

---

## Cheatsheet

### Enable Wireless Firmware

```bash
sudo apt install firmware-misc-nonfree
```

### AWUS1900

```bash
sudo apt-get install realtek-rtl88xxau-dkms
```
