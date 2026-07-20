---
title: "launchctl"
tags: [tools, macos, launchd, cli]
---
`launchctl` is the CLI for `launchd`, macOS's init system and service manager — it starts/stops daemons and agents, and manages the environment `launchd` hands to every process it spawns.

---

## Session-Wide Environment Variables

`setenv` sets a variable in the `launchd` user session's environment. Every process `launchd` spawns afterward inherits it — including GUI apps launched from Finder/Dock/Spotlight, which don't go through a login shell and so never see variables set in `~/.zshrc`, `config.fish`, etc. Changes apply immediately to newly spawned processes; already-running processes keep whatever environment they started with.

> `setenv`/`getenv`/`unsetenv` only affect the *user* `launchd` session (`gui/<uid>`), not the system-wide `launchd` (`system` domain) used by daemons running as root.

## Persisting Across Reboots

`launchctl setenv` is session-only — it's wiped on logout/reboot. To make it stick, run it from a `LaunchAgent` that fires at login. Create `~/Library/LaunchAgents/<reverse-dns-id>.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string><reverse-dns-id></string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/launchctl</string>
        <string>setenv</string>
        <string><name></string>
        <string><value></string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
```

Loading it also runs it once immediately. `RunAtLoad` makes it fire on every login going forward, since `launchd` loads everything under `~/Library/LaunchAgents/` automatically at session start.

## Managing Services

`load`/`unload` are legacy but still work; on modern macOS, `bootstrap`/`bootout` are the lower-level equivalents they wrap. `bootout` targets a domain + label (or a domain + plist path) instead of just a plist, which is what current macOS actually tracks internally — it's the precise form `unload` approximates. It can fail with `Operation not permitted while System Integrity Protection is engaged` for system LaunchAgents/Daemons (anything under `/System/Library/Launch*`) that are currently loaded; `disable` (see below) is the workaround when a live `bootout` is blocked.

## Enabling/Disabling a Job

`disable`/`enable` persistently flag a job as (not) allowed to run, without touching its plist — the flag lives in launchd's own override database (`/var/db/com.apple.xpc.launchd/disabled.<uid>.plist`). `disable` doesn't stop an already-running/bootstrapped instance immediately (pair it with `bootout` when that's possible); it prevents the job from being bootstrapped on the *next* load, e.g. at the next login or `bootstrap` call.

> **Doesn't survive reboot for SIP-protected jobs.** For an ordinary third-party job, the override in the database persists indefinitely. For a job flagged `system service | tle system` in `launchctl print` (Apple-signed, SIP-protected — e.g. `com.openssh.ssh-agent`), SIP silently discards the override on the next boot: `disable` appears to succeed and shows up in `print-disabled` for the rest of the current session, but the entry is just gone after a reboot, with no error at disable-time to warn you. Confirmed by checking `disabled.<uid>.plist` before/after a reboot rather than trusting `print-disabled` alone. There's no persistent way to keep a SIP-protected job disabled — it has to be re-disabled after every boot, which usually isn't worth the trouble.

## Cheatsheet

### Set/Read/Remove a Session Variable

```bash
launchctl setenv <name> <value>
launchctl getenv <name>
launchctl unsetenv <name>
```

### Load/Unload a LaunchAgent

```bash
launchctl load ~/Library/LaunchAgents/<reverse-dns-id>.plist
launchctl unload ~/Library/LaunchAgents/<reverse-dns-id>.plist
rm ~/Library/LaunchAgents/<reverse-dns-id>.plist
```

### Manage Loaded Services

```bash
launchctl list                            # all loaded agents/daemons for this session
launchctl list <label>                    # status + PID for one
launchctl kickstart -k gui/<uid>/<label>  # restart a loaded service immediately
```

### Bootstrap/Bootout (Modern Load/Unload)

```bash
launchctl bootstrap gui/<uid> <plist>   # load a job into a specific domain by path
launchctl bootout gui/<uid>/<label>     # unload a job from a specific domain by label
```

### Enable/Disable a Job

```bash
launchctl disable gui/<uid>/<label>
launchctl enable gui/<uid>/<label>
```
