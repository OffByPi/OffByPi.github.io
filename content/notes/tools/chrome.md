---
title: "Chrome"
tags: [tools, browser]
created: 2026-07-20
modified: 2026-08-04
---
`chrome` is Google's browser. Notes below cover privacy/security tweaks not obvious from the settings UI.

---

## Block Ads Through DNS

Settings → Privacy and security → Security → Secure DNS → Custom, then set the provider to AdGuard's DoH resolver. Routes all DNS-over-HTTPS lookups through it, blocking ad/tracker domains before the browser even connects to them.

---

## Auto-Restore a Session on Startup (Tab Session Manager)

Chrome's own "Continue where you left off" only keeps one rolling state and doesn't survive a crash reliably. The [Tab Session Manager](https://chromewebstore.google.com/detail/tab-session-manager/iaiomicjabeggjcfkbimgmglanimpnae) extension fixes this: it lets you pin a named, saved session to load automatically on every launch, independent of whatever tabs were open when you last closed the browser.

Set it up from the extension's options: Settings → Startup → **Open startup session**. Then save the session you want, right-click it in the session list, and select **Register for startup**. That session opens automatically every time Chrome starts.

---

## Cheatsheet

### Block Ads Through DNS

```text
https://dns.adguard-dns.com/dns-query
```
