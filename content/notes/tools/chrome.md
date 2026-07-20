---
title: "Chrome"
tags: [tools, browser]
---
`chrome` is Google's browser. Notes below cover privacy/security tweaks not obvious from the settings UI.

---

## Block Ads Through DNS

Settings → Privacy and security → Security → Secure DNS → Custom, then set the provider to AdGuard's DoH resolver. Routes all DNS-over-HTTPS lookups through it, blocking ad/tracker domains before the browser even connects to them.

---

## Cheatsheet

### Block Ads Through DNS

```
https://dns.adguard-dns.com/dns-query
```
