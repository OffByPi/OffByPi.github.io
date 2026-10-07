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

---

## Clicks ignored in a fullscreen Linux guest

With a KDE Plasma guest (X11 or Wayland) in macOS fullscreen, clicking pinned icons in the Task Manager often does nothing and a "not allowed" cursor flashes, as if a drag were rejected. The Quick Launch widget and the application menu work. Clicking the lower part of an icon works, the upper part (closer to the top screen edge) fails. A maximized, non-fullscreen window is not affected.

`evtest` on the Parallels Virtual Mouse (absolute device) shows a spurious `ABS_X`/`ABS_Y` jump to the left edge between the `BTN_LEFT` press and release, then the pointer returns. Plasma reads it as a drag. The event is already present at kernel level, so it comes from the virtual device, not from KDE, X11 or Wayland. The trigger is the macOS menu bar / Parallels pop-up that appears when the pointer hits the top edge in normal fullscreen.

Ruled out: focus stealing prevention, trackball vs trackpad, keyboard activity, `prlcc`, and the **Mouse optimization** setting (it made clicks worse).

Fix: **Configure → Options → Full Screen → Optimize full screen for games**. With it on, press `Ctrl` + `Option` to release the mouse and reach the macOS menu bar or Dock.

### Cheatsheet

```bash
# Watch raw events of the virtual mouse (adjust the event number)
sudo evtest /dev/input/event1
```
