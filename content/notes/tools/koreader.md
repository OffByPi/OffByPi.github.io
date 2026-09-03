---
title: "KOReader"
tags: [tools, ebook]
created: 2026-07-20
modified: 2026-09-03
---
`koreader` is a document viewer for e-ink devices, also packaged for desktop.

---

## Fix macOS Crash on Resize

- Enable system fonts
- Disable partial rendering

## Enable debug log

- **Top Bar Menu** -> **Three Lines menu** (the leftmost one) -> **Help** -> **Report a bug**
- **Enable verbose logging**
- Restart KOReader
- Reproduce the issue
- Open **Report a bug** again to flush the log to `crash.log`

> [!warning]
> On Android, `crash.log` is not written continuously. Verbose logging only feeds the in-memory logcat buffer; the log is dumped to `crash.log` only when you open **Report a bug** from the menu again. Do this right after reproducing the issue, before the buffer rotates.

### Where to find it?

The debug logs can be found in file `crash.log`:

- Desktop/other platforms: in the KOReader installation directory.
- Android: in `<external_storage>/koreader/crash.log`.