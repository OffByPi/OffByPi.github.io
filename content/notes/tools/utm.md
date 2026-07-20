---
title: "UTM"
tags: [tools, virtualization, macos]
---
`UTM` is a QEMU-based virtualizer for macOS (Apple Silicon and Intel). These notes cover setting up guest tools and file sharing on a Debian-based Linux guest.

---

## Install guest tools (Debian-based guest)

```bash
sudo apt install spice-vdagent
sudo apt install qemu-guest-agent
```

## Linux guest file sharing

1. Create a mount point:

```bash
sudo mkdir /mnt/utm
```

2. Add the shared folder to `/etc/fstab`:

```
share /mnt/utm 9p trans=virtio,version=9p2000.L,rw,_netdev,nofail,auto 0 0
```

### Allow user write permission

The `9p` mount is owned by root by default. Use `bindfs` to re-mount it under your user.

1. Install `bindfs`:

```bash
sudo apt install bindfs
```

2. Create the user mountpoint:

```bash
mkdir ~/utm
```

3. Add the bind mount to `/etc/fstab`, mapping the host UID/GID (`502/1000`) to your user:

```
/mnt/utm /home/user/utm fuse.bindfs map=502/1000:@20/@1000,x-systemd.requires=/mnt/utm,_netdev,nofail,auto 0 0
```
