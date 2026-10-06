---
title: "Ephemeral Ports"
tags: [dev, networking, python]
created: 2026-10-06
---
Binding to port `0` asks the OS to pick a free port from its ephemeral range, which removes hard-coded ports and the race of "find a free port, then hope it stays free" — the kernel reserves it atomically during `bind`.

Read the assigned port back with `getsockname()` after binding, then hand it to whoever needs to connect.

## Python

```python
import socket

with socket.socket() as sock:
    sock.bind(("127.0.0.1", 0))
    port = sock.getsockname()[1]
```

Closing the socket before reusing the port reintroduces the race — another process can grab it in between. Keep the socket open and pass it (or its file descriptor) to the server whenever possible.

Many servers accept `0` directly:

```bash
python3 -m http.server 0 --bind 127.0.0.1 # prints the chosen port on startup
```

## ZMQ

Use `bind_to_random_port` or the `*` wildcard, then read `LAST_ENDPOINT` (see [[zmq]]).

```python
port = socket.bind_to_random_port("tcp://127.0.0.1")

socket.bind("tcp://127.0.0.1:*")
endpoint = socket.getsockopt_string(zmq.LAST_ENDPOINT)
```

## Ephemeral range

The range is OS-specific; check it before firewalling or when you hit exhaustion.

```bash
sysctl net.inet.ip.portrange.first net.inet.ip.portrange.last # macOS: 49152-65535
cat /proc/sys/net/ipv4/ip_local_port_range # Linux: 32768-60999 by default
```

Find which process got the port with [[lsof]].

## Cheatsheet

```python
sock.bind(("127.0.0.1", 0)); sock.getsockname()[1] # plain socket
socket.bind_to_random_port("tcp://127.0.0.1") # ZMQ
```

```bash
python3 -m http.server 0 # let the OS choose
lsof -nP -i tcp:<port> # who owns the port
```
