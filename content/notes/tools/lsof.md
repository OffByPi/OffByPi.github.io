---
title: "lsof"
tags: [tools, cli, networking, debugging]
created: 2026-07-24
---
`lsof` lists open files — and on Unix, sockets and network connections count as files too, making it the go-to tool for finding which process holds a port or a file handle open.

## Find What's Using a TCP Port

`-i` filters by network address/port, `:tcp` or `:udp` scope it to a protocol. Combine with `-P` (skip port-name resolution, e.g. show `80` not `http`) and `-n` (skip host-name resolution) for fast, unambiguous output.

```bash
lsof -i :<port> # any protocol on that port
lsof -i tcp:<port> # TCP only
lsof -nP -i tcp:<port> # fast, no DNS/service-name lookups
```

## Find All Open Files for a Process

`-p` restricts output to a given PID.

```bash
lsof -p <pid>
```

## Find Which Process Has a File Open

Pass the path directly — useful for "device busy" or "resource in use" errors before unmounting.

```bash
lsof <path>
```

## Kill Whatever Owns a Port

Combine `-t` (terse: PIDs only) with `kill` to free a stuck port in one line.

```bash
kill -9 $(lsof -t -i tcp:<port>)
```

## Cheatsheet

```bash
lsof -i :<port> # who's using this port (any protocol)
lsof -nP -i tcp:<port> # who's using this TCP port, fast
lsof -i tcp -s tcp:listen # all listening TCP sockets
lsof -p <pid> # all open files for a process
lsof <path> # who has this file open
lsof -u <user> # all open files owned by a user
lsof -t -i tcp:<port> # PID only, for scripting
kill -9 $(lsof -t -i tcp:<port>) # kill whatever owns a port
```
