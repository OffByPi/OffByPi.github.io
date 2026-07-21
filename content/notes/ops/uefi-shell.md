---
title: "UEFI Interactive Shell"
tags: [ops, uefi, bios, boot]
---
The UEFI shell is a pre-boot command-line environment for inspecting and repairing boot configuration directly, useful when an OS's bootloader is broken or missing.

---

## Access It

Many motherboards expose it directly from the UEFI firmware's Boot menu. If not, boot a Linux live ISO or a [TianoCore](https://www.tianocore.org/) `.efi` build from a USB stick (e.g. via Ventoy), or pick "Use a device" from Windows' Advanced Boot Options.

## Navigate Filesystems

`map` lists every explorable filesystem the shell can see (`FS0:`, `FS1:`, ...) — EFI partitions and any attached storage. Switch into one by typing its name (e.g. `FS0:`), then browse with `ls`.

## Manage Boot Entries

`bcfg boot` reads and rewrites the firmware's boot entry list (the same one you'd otherwise edit via `efibootmgr` from a running OS). Entries can carry a kernel parameters file, useful for boot options a bootloader config wouldn't otherwise let you inject at this stage.

---

## Cheatsheet

### Navigate Filesystems

```text
map                    # list filesystems (FS0:, FS1:, ...)
FS0:                   # switch into a filesystem
ls -r -b FS0:          # list contents recursively, paginated
help -b                # list all commands, paginated
help -b <command>      # help for a specific command
```

### Boot an OS Directly

```text
FS0:\EFI\BOOT\bootx64.efi
```

### Inspect and Edit Boot Entries

```text
bcfg boot dump -v                                  # show current boot order
bcfg boot add <index> <path.efi> "<description>"   # add a boot entry
bcfg boot rm <index>                               # remove a boot entry
```

### Add Kernel Parameters to a Boot Entry

```text
edit FS0:\EFI\GRUB\option.txt
# write params, e.g.: root=/dev/sdb3 rw initrd=/boot/initrd.img

bcfg boot -opt <index> FS0:\EFI\GRUB\option.txt
```

### Exit to the Boot Menu

```text
exit
```
