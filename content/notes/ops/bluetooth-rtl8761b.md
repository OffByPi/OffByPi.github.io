---
title: "Fix Bluetooth on RTL8761B (Kernel 6+)"
tags: [ops, linux, bluetooth, drivers]
---
Some Bluetooth 5.0 adapters using the RTL8761B chipset fail to load their driver on Ubuntu 20.04/22.04 (and other distros) — not because the firmware is missing, but because the kernel asks for the wrong filename.

---

## Diagnose

Plug in the adapter and check `dmesg` for a firmware load failure:

```bash
sudo dmesg | grep bluetooth
```

A failing device shows something like:

```text
bluetooth hci0: loading /lib/firmware/rtl_bt/rtl8761bu_config.bin failed with error -40
bluetooth hci0: Direct firmware load for rtl_bt/rtl8761bu_config.bin failed with error -40
```

The driver requests the `rtl8761bu` (USB) firmware files, but the system only ships the `rtl8761b` (non-`u`) ones — so the load fails even though a compatible firmware is already present.

## Fix

Symlink the missing `rtl8761bu` filenames to the `rtl8761b` files that already exist in `/lib/firmware/rtl_bt`. No package install or download needed. After creating the links, unplug and replug the adapter — no reboot required.

Reference: [fosspost.org — Fix Bluetooth RTL8761B on Ubuntu 22.04](https://fosspost.org/fix-bluetooth-rtl8761b-problem-on-linux-ubuntu-22-04)

---

## Cheatsheet

### Diagnose

```bash
sudo dmesg | grep bluetooth
```

### Fix

```bash
cd /lib/firmware/rtl_bt
sudo ln -s rtl8761b_config.bin rtl8761bu_config.bin
sudo ln -s rtl8761b_fw.bin rtl8761bu_fw.bin
```
