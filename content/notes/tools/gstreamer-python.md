---
title: "GStreamer Python Bindings"
tags: [tools, multimedia, python, gstreamer]
---
`PyGObject` exposes GStreamer's C API to Python through GObject introspection. See [[gstreamer]] for the pipeline concepts and [[gstreamer-rtp]] for a full streaming example built on this setup.

---

## Setup

Every script needs the version pin before importing `Gst`, and `Gst.init` before touching any GStreamer API.

```bash
pip install PyGObject
```

```python
import gi

gi.require_version('Gst', '1.0')
from gi.repository import Gst, GObject, GLib

Gst.init(None)
```

## Accessing Raw Frames from a Sample

An `appsink`'s `new-sample` callback hands you a `Gst.Sample` wrapping a `Gst.Buffer`. Mapping the buffer for read/write gives a raw byte view you can hand to NumPy (reshaped using the caps' `width`/`height`) for per-frame processing — e.g. running it through OpenCV before repackaging into a new buffer with the same PTS/DTS/duration to push downstream.

```python
buf = sample.get_buffer()
buf = buf.copy_deep()
caps = sample.get_caps()
structure = caps.get_structure(0)
width = structure.get_value('width')
height = structure.get_value('height')
segment = sample.get_segment()
info = sample.get_info()

success, map_info = buf.map(Gst.MapFlags.READ | Gst.MapFlags.WRITE)
if not success:
    raise RuntimeError("Failed to map buffer data")

arr = np.frombuffer(map_info.data, dtype=np.uint8).reshape((height, width, 4)).copy()
arr = cv2.putText(arr, 'VDF has been here ;)', (150, 150),
                  cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

new_buf = Gst.Buffer.new_allocate(None, arr.nbytes, None)
new_buf.fill(0, arr.tobytes())
new_buf.pts = buf.pts
new_buf.dts = buf.dts
new_buf.duration = buf.duration
sample = Gst.Sample.new(new_buf, caps, segment, info)

buf.unmap(map_info)
```

---

## Resources

- [Frame access gist](https://gist.github.com/patrickelectric/443645bb0fd6e71b34c504d20d475d5a?permalink_comment_id=3671344)
