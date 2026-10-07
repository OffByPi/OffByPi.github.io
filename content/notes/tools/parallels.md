---
title: "Parallels"
tags: [tools, virtualization, macos]
created: 2026-10-07
---
`Parallels Desktop` is a commercial virtualizer for macOS. See [[utm]] for the QEMU-based alternative.

---

## Resize the disk of a new VM

Changing the hard disk size in the VM configuration before the first boot is not picked up by the guest. Replace the default disk instead:

1. Open the VM configuration (VM stopped, never started).
2. Go to **Hardware → Hard Disk** and remove the default disk.
3. Add a new hard disk with the desired size.
4. Start the VM.
