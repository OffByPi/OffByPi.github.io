---
title: "GStreamer"
tags: [tools, multimedia, video, gstreamer]
---
`gstreamer` builds media pipelines out of chained elements (sources, filters, sinks) connected by pads, and can be driven from the CLI (`gst-launch-1.0`) or via language bindings. See [[gstreamer-python]] for the Python API, [[gstreamer-rtp]] for streaming over RTP, and [[gstreamer-pts]] for timestamp/sync behavior.

---

## Caps Negotiation After Demuxing

Insert `h264parse`/`aacparse` right after `decodebin`/a demuxer, before the decoder. Without them, downstream elements can fail caps negotiation because the raw stream out of the demuxer doesn't carry the codec metadata (SPS/PPS, frame boundaries) a decoder needs — the parser extracts and attaches it.

## Inspecting a Pipeline Graph

Setting `GST_DEBUG_DUMP_DOT_DIR` makes GStreamer dump a `.dot` file per pipeline state change, which `graphviz` can render into a PNG showing every element and pad/caps negotiation live.

---

## Cheatsheet

### Hello World

```bash
gst-launch-1.0 videotestsrc ! autovideosink
```

### Decode a File's Video and Audio

```bash
gst-launch-1.0 filesrc location=<file> ! decodebin name=decoder \
    decoder. ! queue ! videoconvert ! autovideosink \
    decoder. ! queue ! audioconvert ! autoaudiosink
```

### Dump and Render a Pipeline Graph

```bash
export GST_DEBUG_DUMP_DOT_DIR=$(pwd)
gst-play-1.0 <uri>   # or any gst-launch-1.0 pipeline

dot -T png *.dot -o pipeline.png
```

---

## Resources

- [GStreamer tools tutorial](https://gstreamer.freedesktop.org/documentation/tutorials/basic/gstreamer-tools.html?gi-language=python)
