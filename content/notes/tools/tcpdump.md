---
title: "tcpdump"
tags: [tools, cli, networking]
created: 2026-08-07
---
`tcpdump` captures and filters packets on a network interface using the same BPF syntax as `pcap`-based tools like Wireshark.

---

## Pick the Right Interface

`-i any` captures on every interface, useful when you don't know which one carries the traffic. Once you've narrowed it down, pin to a single interface (`-i eth0`) to cut noise and avoid double-counting packets that traverse bridges or VPNs.

## Filter Before You Capture

BPF filters (`host`, `port`, `net`, `tcp`, `udp`, `icmp`) run in the kernel, so filtering at capture time is far cheaper than piping everything through `grep` later. Combine terms with `and`/`or`/`not`:

```bash
sudo tcpdump -i eth0 host 10.0.0.5 and port 443
```

## Read Payloads, Not Just Headers

`-A` prints packet payload as ASCII, `-X` prints hex+ASCII. Handy for inspecting plaintext protocols (HTTP, DNS, SMTP) without reaching for Wireshark:

```bash
sudo tcpdump -i eth0 -A port 80
```

## Save and Replay Captures

`-w` writes raw packets to a `.pcap` file instead of decoding them live — always prefer this over redirecting stdout, since decoding is lossy. `-r` reads a capture back, and any display/filter flag still applies on replay:

```bash
sudo tcpdump -i eth0 -w capture.pcap port 53
tcpdump -r capture.pcap -A
```

## Write and Watch at the Same Time

`-w` saving and live decoding are mutually exclusive on a single `tcpdump` process — once packets go to a file, nothing gets printed. Write to stdout (`-w -`) instead of a file, then `tee` the stream to a second `tcpdump` reading from stdin (`-r -`) for the live decode while the first copy still lands on disk. Add `-U` on the capturing process so packets are flushed as they arrive instead of sitting in a buffer, otherwise the live view lags:

```bash
sudo tcpdump -i eth0 -U -w - port 443 | tee capture.pcap | tcpdump -r - -n
```

## Isolate Traffic by Direction

`-Q` restricts capture to a single direction: `in`, `out`, or `inout`. `-Q out` is the one worth remembering — it isolates packets your machine originates, which cuts noise in half when you're chasing something local (a process phoning out, a leaky client) rather than inbound traffic:

```bash
sudo tcpdump -i eth0 -Q out port 443
```

## Resolve Less, See More

By default `tcpdump` reverse-resolves IPs and translates port numbers to service names, which slows capture and can leak DNS queries about the traffic you're watching. `-n` (no host resolution) and `-nn` (no host or port resolution) keep output raw and fast.

---

## Cheatsheet

### Capture on Every Interface

```bash
sudo tcpdump -i any
```

### Filter by Host and Port

```bash
sudo tcpdump -i eth0 host <ip-address> and port <port-number>
```

### Show Packet Payload as ASCII

```bash
sudo tcpdump -i eth0 -A port <port-number>
```

### Show Packet Payload as Hex + ASCII

```bash
sudo tcpdump -i eth0 -X port <port-number>
```

### Write Capture to a File

```bash
sudo tcpdump -i eth0 -w <capture-file>.pcap
```

### Read Capture from a File

```bash
tcpdump -r <capture-file>.pcap
```

### Write to a File and Watch Live

```bash
sudo tcpdump -i eth0 -U -w - port <port-number> | tee <capture-file>.pcap | tcpdump -r - -n
```

### Capture Only Outbound Packets

```bash
sudo tcpdump -i eth0 -Q out port <port-number>
```

### Skip DNS/Port Resolution

```bash
sudo tcpdump -nn -i eth0
```

### Capture a Fixed Number of Packets

```bash
sudo tcpdump -i eth0 -c <packet-count>
```
