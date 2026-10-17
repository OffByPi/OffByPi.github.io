---
title: "Top Surface Pattern"
tags: [ops, 3d-printing, slicer]
created: 2026-10-17
---
For the cleanest top surface in OrcaSlicer-based slicers (Bambu Studio, Anycubic Slicer Next), set **Top surface pattern** to **Monotonic line**. It removes the stripes plain Rectilinear leaves and the excess material along the edges that plain Monotonic leaves. The setting lives under *Strength → Top/bottom shells → Top surface pattern*.

## Why the fill order shows up on the surface

Every solid-infill line slightly overlaps the line next to it. That overlap is what light reflects off, so the surface looks uniform only when every line overlaps its neighbor **from the same side** and has cooled for about the same time before the next one lands on it.

- **Rectilinear** zig-zags and lets the path planner jump between regions. Some lines overlap their left neighbor, some their right, and some go down next to a line that has already cooled. The surface looks fine head-on but shows glossy/matte stripes and patches at a grazing angle.
- **Monotonic** keeps the same zig-zag but always fills in one direction across the region, so each new line overlaps the previous one from the same side. This gets rid of most of the patchiness. The short connecting segments between lines still run along the perimeter, which piles up extra material at the edges.
- **Monotonic line** keeps the monotonic order but skips those connecting segments. Lines stop short of the perimeter and the nozzle travels between them, so there is no doubled-up material where the infill meets the walls. Trade-offs: more travel moves (slightly slower, and a stringy filament can leave zits at the line ends), and a faint seam can show where the infill meets the perimeter.

Monotonic line is a Bambu Studio addition that OrcaSlicer inherited (`FillMonotonicLineWGapFill` in the source), so PrusaSlicer only has plain Monotonic.

## Other patterns

- **Aligned Rectilinear:** every layer runs in the same direction. Rarely worth using for a top surface.
- **Concentric:** follows the outline inward. Good for round parts, but every loop leaves a seam and it fills small or irregular areas poorly.
- **Hilbert curve, Archimedean chords, Octagram spiral:** decorative textures. Slow, and chosen for how they look, not for how smooth they are.

## Caveats

- Only the topmost layer uses the top surface pattern. The solid layers under it use the internal solid infill pattern, which can show through with translucent or silk filaments.
- The pattern only fixes how lines are ordered. Under- or over-extrusion, too few top layers (aim for at least 1 mm of top shell), or a bad pressure advance value (`M900`, see [[gcode#M900 — Linear advance / pressure advance]]) will still show.
- For a flat top that has to look perfect, add **ironing** on top of Monotonic line instead of switching patterns.

## Cheatsheet

### Smooth top surface
```ini
top_surface_pattern = monotonicline
top_shell_thickness = 1
```
