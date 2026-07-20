---
title: "Inkscape"
tags: [tools, inkscape, svg]
---
Vector graphics editor. Notes below cover converting a raster PNG into an editable SVG path.

## PNG to SVG

Open the PNG, then select the newly created image in the **Layers** panel.

Choose the **Trace Bitmap** tool with the image selected:

- Select **Multicolor**.
- Set **Scans** equal to the number of colors in the image.
- Enable **Remove background**.
- Enable **Stack** (creates a path for each color that can be stacked together).
- Leave every other checkbox unchecked.
- Click **Apply**.

Remove the original image from the design (optional).

Clean up each generated path with the **Node** tool, removing useless nodes. Select all traced paths, then run **Path → Combine** to merge them into a single path.

## Simplify

Traced paths can be too heavy to import into modelling tools like Fusion 360. Reduce node count with **Path → Simplify**.
