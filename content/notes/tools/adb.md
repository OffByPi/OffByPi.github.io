---
title: "ADB (Android Debug Bridge)"
tags: [tools, android, cli]
created: 2026-08-31
---
Command-line tool to communicate with an Android device over USB, Wi-Fi, or emulator.

## Setup

Connect via USB with debugging enabled (Developer Options), or over Wi-Fi:

```bash
# Pair once, then connect over the network
adb pair <device-ip>:<pairing-port>
adb connect <device-ip>:<port>

# List connected devices/emulators
adb devices -l
```

When multiple devices are connected, target one with `-s <device-serial>`. Shell completion for device-side paths (e.g. `adb push ./file /st<TAB>`) also requires an explicit `-s <device-serial>` — with no device specified, or with an ambiguous/stale entry in `adb devices`, completion silently fails to enumerate remote paths.

## Apps

Install, uninstall, and inspect packages without going through the Play Store:

```bash
adb install <path-to-apk>
adb install -r <path-to-apk>       # reinstall, keep data
adb uninstall <package-name>
adb shell pm list packages -3       # list only user-installed packages
adb shell pm clear <package-name>   # wipe app data + cache
```

## Files

Push/pull files between the device and the host. Both are recursive when the source is a directory:

```bash
adb push <local-dir> <device-dir>
adb pull <device-dir> <local-dir>
```

`pull` skips symlinks inside a directory tree, and fails on permission-restricted paths (e.g. `/data/data/<package>`) unless the device is rooted or the target is your own debuggable app's data dir.

## Logs and debugging

```bash
adb logcat                          # stream full log
adb logcat -s <tag>                 # filter by tag
adb logcat *:E                      # errors only
adb shell dumpsys battery           # battery stats
adb shell dumpsys activity activities   # current activity stack
```

## Shell and reboot

```bash
adb shell                           # open interactive shell
adb reboot
adb reboot bootloader
adb reboot recovery
```

## Screen

```bash
adb shell screencap -p /sdcard/screen.png && adb pull /sdcard/screen.png
adb shell screenrecord /sdcard/demo.mp4   # ctrl-c to stop
```

## Cheatsheet

### Connection
```bash
adb devices -l
adb connect <device-ip>:<port>
adb disconnect <device-ip>:<port>
```

### Apps
```bash
adb install -r <path-to-apk>
adb uninstall <package-name>
adb shell pm clear <package-name>
adb shell pm list packages -3
```

### Files
```bash
adb push <local-path> <device-path>
adb pull <device-path> <local-path>
```

### Logs
```bash
adb logcat -s <tag>
adb logcat *:E
```

### Power
```bash
adb reboot
adb shell dumpsys battery
```
