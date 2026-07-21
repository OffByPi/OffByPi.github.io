---
title: "OpenCV in Python"
tags: [dev, opencv, computer-vision, python]
---
OpenCV (`cv2`) covers video/image I/O, drawing primitives, and interactive windows for computer-vision work in Python.

## Read Video Frame by Frame

`VideoCapture.read()` returns a `(success, frame)` pair — `ret` is `False` once the video ends or the source disconnects, which is the loop's exit condition.

```python
cap = cv2.VideoCapture(video_path)
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
```

## Draw Text and Shapes

`cv2.putText` and `cv2.line` both draw directly onto a frame's pixel array and return it, so you can chain them or reassign in place.

```python
new_frame = cv2.putText(frame, text, (x, y),
                        cv2.FONT_HERSHEY_SIMPLEX, line_width,
                        (0, 255, 0), 5, lineType=cv2.LINE_AA)
```

```python
cv2.line(to_show, (x0, y0), (x1, y1), (0, 0, 255), 5)
```

## Mouse Callback

A mouse callback receives the event type and cursor position on every mouse action inside the window it's bound to — check `event` against `cv2.EVENT_*` constants to react to specific actions (click, drag, release).

```python
def mouse_callback(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        pass
```

Bind it to a named window after creating it:

```python
self.window = cv2.namedWindow('frame')
cv2.setMouseCallback('frame', self.mouse_callback)
```

## Warp Perspective

See [[perspective-transform]] for computing and applying the homography matrix.

## Plot Curves

`cv2.polylines` is OpenCV's equivalent of `matplotlib.pyplot.plot` — it needs points as an integer `(N, 2)` array rather than separate x/y sequences, and draws each element of the outer array as its own curve.

```python
# matplotlib
matplotlib.pyplot.plot(x_values, y_values, color='yellow')

# OpenCV equivalent
curve = numpy.column_stack((x_values.astype(numpy.int32), y_values.astype(numpy.int32)))
cv2.polylines(image, [curve], False, (0, 255, 255))

# multiple curves: add each as an element of the array
curve1 = numpy.column_stack((x1.astype(numpy.int32), y1.astype(numpy.int32)))
curve2 = numpy.column_stack((x2.astype(numpy.int32), y2.astype(numpy.int32)))
cv2.polylines(image, [curve1, curve2], False, (0, 255, 255))
```

More information: https://docs.opencv.org/4.x/d6/d6e/group__imgproc__draw.html

## Cheatsheet

### Video I/O
```python
cap = cv2.VideoCapture(video_path)
ret, frame = cap.read() # ret is False at end of stream
```

### Drawing
```python
cv2.putText(frame, text, (x, y), cv2.FONT_HERSHEY_SIMPLEX, line_width, (0, 255, 0), 5, lineType=cv2.LINE_AA)
cv2.line(frame, (x0, y0), (x1, y1), (0, 0, 255), 5)
cv2.polylines(image, [curve], False, (0, 255, 255)) # curve: np.int32 (N, 2) array
```

### Mouse callback
```python
cv2.namedWindow('frame')
cv2.setMouseCallback('frame', mouse_callback) # mouse_callback(event, x, y, flags, param)
```
