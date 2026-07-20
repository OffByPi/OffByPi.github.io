---
title: "GStreamer PTS and Synchronization"
tags: [tools, multimedia, gstreamer]
---
A sink's `sync` property controls whether buffers are pushed out at real-time pace (following their timestamps) or as fast as possible — it affects running time, not the `PTS` values themselves. See [[gstreamer]] for pipeline basics.

---

## What Affects PTS vs. Running Time

If a sink (or an upstream element) has `sync`/`set-timestamps` enabled, samples are released close to real time; otherwise they flow as fast as the pipeline can process them. Either way, `PTS` values on the buffers are untouched by this setting — it only changes *when* a buffer carrying a given PTS is released, not the PTS itself.

## Per-Element Notes

**`appsink`**
- `sync` — affects running time only, doesn't change PTS.

**`multiqueue`**
- `use-buffering` — no effect on PTS.
- `sync-by-running-time` — no effect on PTS.
- `use-interleave` — no effect on PTS.

**`tsdemux`**
- `ignore-pcr` — does affect PTS, by a constant offset.
