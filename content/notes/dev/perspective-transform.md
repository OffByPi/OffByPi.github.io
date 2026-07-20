---
title: "Perspective Transform (Bird's-Eye View)"
tags: [dev, opencv, computer-vision, python]
---
`cv2.getPerspectiveTransform` computes the 3x3 homography matrix that maps 4 source points to 4 destination points, letting you warp a skewed view (e.g. a road seen at an angle) into a top-down "bird's-eye" view.

---

## Compute the Matrix

```python
import numpy as np
import cv2

src = np.float32([
    (sx1, sy1),
    (sx2, sy2),
    (sx3, sy3),
    (sx4, sy4),
])
dst = np.float32([
    (dx1, dy1),
    (dx2, dy2),
    (dx3, dy3),
    (dx4, dy4),
])

map_matrix = cv2.getPerspectiveTransform(src, dst)
```

Apply it with `cv2.warpPerspective(image, map_matrix, (width, height))`.

## The Math

Each source point `(x_i, y_i)` maps to a destination point `(x_i', y_i')` through the homogeneous matrix, with `t_i` a per-point scale factor that keeps the third coordinate normalized to 1:

$$
\begin{bmatrix}
t_i \cdot x_i' \\
t_i \cdot y_i' \\
t_i
\end{bmatrix} =
\begin{bmatrix}
a & b & c \\
d & e & f \\
g & h & j
\end{bmatrix}
\cdot
\begin{bmatrix}
x_i \\
y_i \\
1
\end{bmatrix}
\; \forall i \in \{1, 2, 3, 4\}
$$

Expanding the matrix product gives 3 equations per point:

$$
\begin{cases}
t_i \cdot x_i' = ax_i + by_i + c \\
t_i \cdot y_i' = dx_i + ey_i + f \\
t_i = gx_i + hy_i + j
\end{cases}
$$

Substituting `t_i` out turns this into the standard projective transform, non-linear in the unknowns because of the shared denominator:

$$
\begin{cases}
x_i' = \dfrac{ax_i + by_i + c}{gx_i + hy_i + j} \\[6pt]
y_i' = \dfrac{dx_i + ey_i + f}{gx_i + hy_i + j}
\end{cases}
$$

With 4 point pairs (8 equations) and 8 unknowns (`j` is fixed to 1 by convention, since the matrix is only defined up to scale), the system is fully determined — this is why `getPerspectiveTransform` requires **exactly 4 points**, no more, no less.

---

## Cheatsheet

### Compute the Matrix

```python
map_matrix = cv2.getPerspectiveTransform(src, dst)  # src, dst: np.float32 arrays of 4 points
```

### Apply the Matrix

```python
warped = cv2.warpPerspective(image, map_matrix, (width, height))
```
