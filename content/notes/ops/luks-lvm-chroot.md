---
title: "Chroot into a LUKS+LVM Encrypted System"
tags: [ops, linux, luks, lvm, chroot]
---
Repairing a Linux install (broken bootloader, kernel, fstab) that sits on a LUKS-encrypted LVM volume requires unlocking and activating both layers before you can mount it and `chroot` in.

---

## Find the Partition

`lsblk -f` lists block devices with their filesystem type and label, letting you pick out the LUKS-encrypted partition (shown as `crypto_LUKS`) among the disk's other partitions.

## Unlock the LUKS Container

`cryptsetup luksOpen <device> <name>` prompts for the passphrase and exposes the decrypted volume at `/dev/mapper/<name>`.

## Activate the LVM Volume Group

The decrypted volume is usually an LVM physical volume, not a filesystem directly. `vgscan` makes the kernel aware of the volume group inside it, and `vgchange -ay` activates all its logical volumes, making them appear under `/dev/mapper/`. Run `lsblk -f` again to confirm the logical volume's device name.

## Mount for Chroot

Mount the root logical volume, then the separate `/boot` partition (if any) inside it, then bind-mount the pseudo-filesystems the chrooted environment needs to function (`/dev`, `/proc`, `/sys`, etc.) before running `chroot`.

## Tear Down

Unmount everything, then deactivate the volume group — this locks the LUKS container back up implicitly, since its device-mapper entry depends on the VG being inactive first (a plain `luksClose` would otherwise fail with "device is busy").

---

## Cheatsheet

### Find the Partition

```bash
sudo lsblk -f
```

### Unlock the LUKS Container

```bash
sudo cryptsetup luksOpen <device> <name>
```

### Activate the LVM Volume Group

```bash
sudo vgscan
sudo vgchange -ay
sudo lsblk -f  # confirm the new /dev/mapper/<vg>-<lv> name
```

### Mount for Chroot

```bash
sudo mkdir /mnt/<name>
sudo mount /dev/mapper/<vg>-<lv> /mnt/<name>
sudo mount <boot-partition> /mnt/<name>/boot
for i in /dev /dev/pts /proc /sys /run; do sudo mount -B $i /mnt/<name>/$i; done
sudo chroot /mnt/<name>
```

### Tear Down

```bash
sudo sync
sudo umount -R /mnt/<name>
sudo vgchange -an <vg>
```
