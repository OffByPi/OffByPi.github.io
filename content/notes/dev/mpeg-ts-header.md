---
title: "MPEG-TS Packet Header"
tags: [dev, mpeg-ts, video, protocols]
---
An MPEG-TS packet is 188 bytes: a 4-byte header, optionally followed by an adaptation field, then payload.

---

## Header (4 Bytes / 32 Bits)

| Field | Bits | Notes |
|---|---|---|
| Sync Byte | 8 | Fixed `0x47`, lets a decoder lock onto the stream. |
| Transport Error Indicator (TEI) | 1 | `1` = demodulator flagged an uncorrectable error. |
| Payload Unit Start Indicator (PUSI) | 1 | `1` = payload's first byte starts a new PES/PSI unit; `0` = continuation. |
| Transport Priority | 1 | `1` = higher priority than packets with `0`. |
| Packet Identifier (PID) | 13 | Identifies the payload's stream (video, audio, PAT, PMT, ...). |
| Transport Scrambling Control (TSC) | 2 | `00` unscrambled, `01` reserved, `10` even key, `11` odd key. |
| Adaptation Field Control | 2 | `00` reserved, `01` payload only, `10` adaptation field only, `11` both. |
| Continuity Counter | 4 | Increments per packet per PID, wraps 15→0; detects drops/reordering. Frozen when Adaptation Field Control is `00` or `10`. |

## Adaptation Field

Present when Adaptation Field Control is `10` or `11`. Variable length, carries timing/misc data.

| Field | Bits | Notes |
|---|---|---|
| Adaptation Field Length | 8 | Byte count of everything below this byte. `0` is valid (1-byte stuffing field). |
| Discontinuity Indicator | 1 | `1` = system time base discontinuity (seek, stream switch). |
| Random Access Indicator | 1 | `1` = packet enables random access (e.g. carries an I-frame). |
| Elementary Stream Priority Indicator | 1 | `1` = higher-priority payload. |
| PCR Flag | 1 | `1` = PCR field present. |
| OPCR Flag | 1 | `1` = OPCR field present. |
| Splicing Point Flag | 1 | `1` = splice countdown field present. |
| Transport Private Data Flag | 1 | `1` = private data bytes present. |
| Adaptation Field Extension Flag | 1 | `1` = extension present. |
| _Optional fields_ | var | PCR, OPCR, splice countdown, etc. — gated by the flags above. |
| _Stuffing bytes_ | var | `0xFF` padding to fill the declared length. |

### Optional Fields (Gated by Flags Above)

| Field | Flag | Bits | Notes |
|---|---|---|---|
| PCR | PCR Flag | 48 | 42-bit timestamp packed into 6 bytes — see below. |
| OPCR | OPCR Flag | 48 | Same layout as PCR. |
| Splice Countdown | Splicing Point Flag | 8 | Signed; TS packets remaining until the splice point. |
| Transport Private Data Length | Transport Private Data Flag | 8 | Byte length of the private data that follows. |
| Transport Private Data | Transport Private Data Flag | var | Broadcaster-defined payload. |
| Adaptation Field Extension | Adaptation Field Extension Flag | var | See below. |

### PCR / OPCR Layout

A 42-bit value packed into 6 bytes as base + extension:

| Field | Bits | Notes |
|---|---|---|
| `program_clock_reference_base` | 33 | Count of a 90 kHz clock. |
| Reserved | 6 | Ignore; typically all `1`s. |
| `program_clock_reference_extension` | 9 | Count of a 27 MHz clock, for sub-tick precision. |

```
PCR (27 MHz) = base * 300 + extension
PCR (seconds) = PCR (27 MHz) / 27_000_000
```

### Adaptation Field Extension

Present when Adaptation Field Extension Flag is `1`.

| Field | Bits | Notes |
|---|---|---|
| Adaptation Field Extension Length | 8 | Byte count following this byte. |
| Legal Time Window (LTW) Flag | 1 | `1` = LTW fields present. |
| Piecewise Rate Flag | 1 | `1` = piecewise rate field present. |
| Seamless Splice Flag | 1 | `1` = seamless splice fields present. |
| Reserved | 5 | — |

| Field | Flag | Bits | Notes |
|---|---|---|---|
| LTW Valid Flag | LTW Flag | 1 | `1` = `legal_time_window_offset` is valid. |
| Legal Time Window Offset | LTW Flag | 15 | Used for video buffering verification. |
| Piecewise Rate | Piecewise Rate Flag | 22 (+2 reserved) | Bitrate over a given segment. |
| Splice Type | Seamless Splice Flag | 4 | Splice/bitstream characteristics at the splice point. |
| DTS Next Access Unit | Seamless Splice Flag | 36 | DTS of the first access unit after the splice point. |
