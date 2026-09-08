---
title: "G-code Commands Reference"
tags: [ops, 3d-printing, gcode]
created: 2026-09-08
---
G-code is the instruction set FDM printers execute: `G` codes handle motion/positioning, `M` codes handle machine state (temperature, fans, motors), `T` codes select the active tool. This note covers the commands emitted by Anycubic Slicer Next in a typical sliced print file.

## Tool selection (T-codes)

### T0, T1, ... — Select tool/extruder
```gcode
T0 ; select extruder 0 (the first/only extruder on single-tool printers)
```
No other parameters. On a single-extruder printer this is emitted once near the start of the file for consistency with multi-tool firmware, which otherwise defaults to whatever tool was last active.

## Motion (G-codes)

### G0 — Fast (non-print) move
Same syntax as `G1`, but signals a travel move (no extrusion expected) so firmware can move at max speed.

```gcode
G0 X12 ; move 12mm on the X axis
```

### G1 — Linear move
Move the print head (and optionally extrude) in a straight line.

```gcode
G1 X127.525 Y127.525 F21000 ; move to X/Y at feedrate F (mm/min)
G1 Z0.200 ; move Z axis (layer change)
G1 E1 F3600 ; extrude/retract only, no XY movement
```

- `X`, `Y`, `Z`: target position (absolute or relative, see `G90`/`G91`).
- `E`: extruder position/amount (positive extrudes, negative retracts).
- `F`: feedrate in mm/min, sticky until changed.

### G2 / G3 — Arc move
Move in a clockwise (`G2`) or counter-clockwise (`G3`) arc.

```gcode
G2 X105 Y30 I20.5 J20.5 ; clockwise arc to (105, 30)
```
`X`/`Y`: end point. `I`/`J`: center offset from the current position (X/Y respectively). `R`: radius, as an alternative to `I`/`J`.

### G4 — Dwell
```gcode
G4 S5 ; pause 5 seconds, no motion
G4 P500 ; pause 500 milliseconds
```
`S`: seconds, `P`: milliseconds. Blocks execution with no movement or extrusion — used to hold a temperature or let something settle (drip, cool, soak) before the next command. Not emitted by Anycubic Slicer Next in `cube.gcode`, but confirmed present in the Kobra 3's Klipper source (registered in `toolhead.py`).

### G10 / G11 — Firmware retract / unretract
```gcode
G10 ; retract using the firmware's configured length/feedrate/z-hop
G11 ; unretract (prime back) the same amount
```
Optional `S1` marks it as a tool-change retract on multi-extruder setups, using a separate (usually longer) configured length. Not used in `cube.gcode` — this slicer does manual retraction instead via a plain `G1 E<negative> F<feedrate>` move (see `G1`); `G10`/`G11` are an alternative where the retract distance/speed/z-hop live in firmware config rather than being repeated on every `G1` line.

### G21 — Set units to millimeters
No parameters. Declares all subsequent coordinates as millimeters (vs. `G20` for inches).

### G28 — Home axes
```gcode
G28 ; home all axes
G28 X Y ; home only X and Y
```
Omitting axis letters homes everything.

### G90 / G91 — Positioning mode
```gcode
G90 ; absolute positioning for X/Y/Z
```
`G90` makes coordinates absolute; `G91` makes them relative to the current position. Firmwares (Marlin/Prusa) commonly keep XYZ absolute (`G90`) while switching only the extruder to relative (`M83`).

### G92 — Set position
Redefine the current position without moving, most often used to zero the extruder after a retract/prime sequence.

```gcode
G92 E0 ; treat current extruder position as 0
```

### G9111 — Custom start macro (Anycubic Kobra 3 series)
A single slicer-emitted command that bundles the printer's entire startup routine — bed/nozzle heating, bed mesh handling, homing, nozzle wipe, priming line — behind one call, customizable per printer model in Anycubic Slicer Next. Reference: [G9111 Command Customization Guide](https://wiki.anycubic.com/en/software-and-app/new-page-anycubic-slicer-beta(orca-version)/g9111-command-customization-guide).

```gcode
G9111 bedTemp=60 extruderTemp=220
```
- `bedTemp`, `extruderTemp`: target temperatures (°C) substituted into the underlying macro.

On Kobra 3 / Kobra 3 Max / Kobra S1, the macro body is built from standard moves (`G0`, `G1`, `G28 W` for corner homing) plus Klipper machine macros not covered elsewhere in this note:

- `BED_MESH_CLEAR` — disables the active bed mesh compensation, no parameters. A bed mesh is a grid of Z-height probe points used to correct each move's Z on the fly for an imperfectly flat bed; clearing it before re-homing/re-leveling avoids applying a stale mesh from a previous print during the new probing pass. Stock Klipper `bed_mesh` module, [documented](https://www.klipper3d.org/G-Codes.html#bed_mesh).
- `BED_MESH_PROFILE LOAD="default"` — restores a saved mesh profile by name (`LOAD=`/`SAVE=`/`REMOVE=`). Same stock module; `SAVE=`/`REMOVE=` additionally require a `SAVE_CONFIG` afterwards to persist.
- `CLOSE_STEALTHCHOP STEPPER=<axis>` / `OPEN_STEALTHCHOP STEPPER=<axis>`, `LEVIQ2_AUTO_ZOFFSET` (auto Z-offset via the LeviQ2 probe), and `HOME_XY` — Anycubic-specific macros with no matching module in their published [Kobra3 Klipper source](https://github.com/ANYCUBIC-3D/Kobra3) (`klipper-mcu/klippy/extras`); undocumented beyond their appearance in the wiki example.

Anycubic's own template for that macro body writes temperatures as `M140 S{first_layer_bed_temperature} I1` rather than a literal number. The `{...}` is slicer placeholder syntax: a variable the slicer substitutes with the actual profile value at slice time — it never reaches the printer. `cube.gcode` never shows this expanded form because the slicer emits the single `G9111 bedTemp=60 extruderTemp=220` call instead, with `60`/`220` already substituted; the firmware performs the same placeholder substitution internally when it expands `G9111` into that macro body. Sending an unresolved `{...}` placeholder straight to the printer (e.g. hand-editing a file before printing it over USB) is a hard failure, not a silent no-op — the firmware's parser expects a number after `S` and aborts the line with a parse error.

## Machine state (M-codes)

### M73 — Set/report print progress
```gcode
M73 P44 R0 QuietR0 SportR0 ; NormalR1.482s
```
- `P`: percent complete.
- `R`: estimated remaining time (minutes), with `Quiet`/`Sport` variants for printers with multiple fan/speed profiles.
Purely informational — used to drive the printer's display, has no effect on motion.

### M75 / M84 — Print timer / disable motors
```gcode
M75 ; start the print job timer
M84 ; disable steppers (end of print)
```

### M83 — Extruder relative mode
```gcode
M83 ; use relative distances for extrusion
```
Keeps XYZ absolute (`G90`) while the `E` axis moves relative to its current value — the standard slicer convention for extrusion.

### M104 / M140 — Set temperature (non-blocking)
```gcode
M104 S0 ; turn off temperature (hotend)
M140 S0 ; turn off heatbed
```
`S` is the target temperature in °C. Non-blocking: the printer moves on immediately without waiting to reach it (compare blocking `M109`/`M190`). Inside `G9111` start macros both also appear with a trailing `I1` (e.g. `M140 S{first_layer_bed_temperature} I1`); Anycubic's docs don't define it, and the [Kobra 3 Klipper source](https://github.com/ANYCUBIC-3D/Kobra3/blob/main/klipper-mcu/klippy/extras/heater_bed.py) shows `cmd_M140` only reads `S` — `I1` is parsed but silently ignored, effectively a no-op.

### M109 — Set hotend temperature and wait
```gcode
M109 S200 ; heat to 200°C and block until reached
```
Blocking counterpart of `M104` — used inside `G9111`-style start macros to ensure the nozzle is fully heated before homing/wiping/priming continues. Same inert `I1` parameter appears here too.

### M106 / M107 — Fan control
```gcode
M106 S0 ; set part-cooling fan speed (S: 0-255)
M107 ; turn fan off
```

### M117 — Set LCD message
```gcode
M117 ; display a status message on the printer's screen
```

### M201 / M203 / M204 / M205 — Motion limits
```gcode
M201 X20000 Y20000 Z1000 E20000 ; max acceleration per axis (mm/sec^2)
M203 X600 Y600 Z15 E600 ; max feedrate per axis (mm/sec)
M204 P20000 R20000 T20000 ; max acceleration: P=print, R=retract, T=travel
M205 X20.00 Y20.00 Z20.00 E20.00 ; jerk limits per axis (mm/sec)
```
`M204` also appears mid-print with a single axis, e.g. `M204 S500`, to temporarily override the print acceleration for a specific move (like the perimeter/skirt).

### M400 — Wait for moves to finish
No parameters. Blocks until the motion queue is empty — used before a state change (like turning off heaters) that shouldn't interrupt in-flight moves.

### M900 — Linear advance / pressure advance
```gcode
M900 K0.051 ; set pressure advance factor K
```
`K` is the pressure-advance coefficient tuned for the filament/hotend combo, compensating for pressure buildup in the extruder during acceleration.

## Cheatsheet

### Startup sequence
```gcode
M83 ; relative extrusion
G90 ; absolute XYZ
G21 ; millimeters
M900 K0.051 ; pressure advance
```

### Shutdown sequence
```gcode
M400 ; wait for moves to finish
G92 E0 ; zero extruder
M140 S0 ; heatbed off
M104 S0 ; hotend off
M107 ; fan off
M84 ; disable motors
```
