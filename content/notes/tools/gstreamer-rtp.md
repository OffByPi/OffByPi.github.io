---
title: "GStreamer over RTP"
tags: [tools, multimedia, rtp, rtsp, gstreamer]
---
Streaming a GStreamer pipeline over RTP means payloading an encoded (or raw) elementary stream into RTP packets on the sender, and depayloading + decoding on the receiver. See [[gstreamer]] for pipeline basics and [[gstreamer-python]] for driving pipelines from Python.

---

## H.264 over RTP

`rtph264pay`/`rtph264depay` wrap/unwrap Annex-B H.264 into RTP packets. The receiver's `caps` on `udpsrc` must match the sender's clock rate/payload type since RTP itself carries no codec metadata.

## Raw Video/Audio over RTP

`rtpvrawpay`/`rtpvrawdepay` carry uncompressed video frames directly (no encoding step) — expensive on bandwidth, useful for LAN low-latency setups. `rtpL16pay`/`rtpL16depay` do the same for uncompressed 16-bit PCM audio.

---

## Cheatsheet

### Send H.264 (gst-launch)

```bash
gst-launch-1.0 videotestsrc is-live=true pattern=smpte ! \
    video/x-raw,framerate=30/1,width=640,height=480 ! \
    x264enc ! rtph264pay config-interval=1 pt=96 ! \
    udpsink host=<host> port=<port>
```

### Send H.264 (Python)

```python
import gi

gi.require_version('Gst', '1.0')
from gi.repository import Gst, GLib

Gst.init(None)


class RTPServer:

    def __init__(self):
        self.pipeline = Gst.parse_launch(
            "videotestsrc is-live=true pattern=smpte ! video/x-raw,framerate=30/1,width=640,height=480 ! "
            "x264enc ! rtph264pay config-interval=1 pt=96 ! "
            "udpsink host=127.0.0.1 port=5000")

    def start(self):
        self.pipeline.set_state(Gst.State.PLAYING)

    def stop(self):
        self.pipeline.set_state(Gst.State.NULL)


if __name__ == '__main__':
    server = RTPServer()
    server.start()
    try:
        GLib.MainLoop().run()
    except KeyboardInterrupt:
        pass
    finally:
        server.stop()
```

### Receive H.264

```bash
gst-launch-1.0 udpsrc port=<port> caps="application/x-rtp, media=(string)video, clock-rate=(int)90000, encoding-name=(string)H264, payload=(int)96" ! \
    rtph264depay ! avdec_h264 ! videoconvert ! autovideosink
```

### Send Raw Video

```bash
gst-launch-1.0 filesrc location=<file> ! decodebin name=decoder decoder. ! \
    videoconvert ! video/x-raw, format=RGB, frame-rate=30/1 ! rtpvrawpay ! \
    udpsink host=<host> port=<port>
```

### Receive Raw Video

```bash
gst-launch-1.0 udpsrc port=<port> caps="application/x-rtp, width=(string)<width>, height=(string)<height>, sampling=(string)RGB" ! \
    rtpvrawdepay ! videoconvert ! autovideosink
```

### Send Raw Audio

```bash
gst-launch-1.0 filesrc location=<file> ! decodebin name=decoder decoder. ! \
    audioconvert ! audio/x-raw ! rtpL16pay ! "application/x-rtp" ! \
    udpsink host=<host> port=<port>
```

### Receive Raw Audio

```bash
gst-launch-1.0 udpsrc port=<port> ! "application/x-rtp,clock-rate=44100,payload=10" ! \
    rtpL16depay ! audioconvert ! queue ! autoaudiosink
```

---

## Resources

- [Working example of rtpvrawpay](https://stackoverflow.com/questions/39492658/working-example-of-rtpvrawpay-in-gstreamer)
- [Send a test video with H.264 RTP stream](https://gist.github.com/hum4n0id/cda96fb07a34300cdb2c0e314c14df0a#send-a-test-video-with-h264-rtp-stream)
- [gstreamer-examples: RTSP server](https://github.com/tamaggo/gstreamer-examples/blob/master/test_gst_rtsp_server.py)
