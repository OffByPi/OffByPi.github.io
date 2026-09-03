---
title: "Kanata"
tags: [tools, keyboard, cli]
created: 2026-09-03
---
`kanata` is a cross-platform keyboard remapper written in Rust, inspired by QMK/kmonad. It runs as a background process reading raw keyboard events and remaps them system-wide, independent of any specific app or OS keyboard layout setting. Config lives in a single `.kbd` file using an S-expression syntax.

## Install

```bash
brew install kanata          # macOS
```

On macOS, `kanata` also needs the Karabiner VirtualHID driver to inject keystrokes, and the binary needs Input Monitoring + Accessibility permissions (System Settings → Privacy & Security) the first time it runs.

## Config structure

A `config.kbd` file has four core sections:

* `defcfg` — global settings.
* `defsrc` — the physical key layout being remapped, listed row by row.
* `deflayer <name>` — one full layer mapped 1:1 positionally against `defsrc`. `_` means "fall through to the layer below" (base for everything else, defsrc itself for base).
* `defalias` — named actions (`@name`), referenced from a layer as `@name` at the matching `defsrc` position — an alias only takes effect once a `deflayer` places it.

Key actions used below:

* `tap-hold <tap-ms> <hold-ms> <tap-action> <hold-action>` — send `<tap-action>` on a quick press, `<hold-action>` if held past `<hold-ms>`.
* `tap-hold-release` — variant of `tap-hold` that resolves to tap as soon as another key is pressed and released before the hold timeout, making fast typing feel more responsive. This is what makes home-row mods usable at typing speed.
* `tap-hold-except-keys <tap-ms> <hold-ms> <tap> <hold> (<keys>)` — like `tap-hold-release`, but disables the hold behavior when any of `<keys>` is pressed first, to avoid misfiring on a specific bigram.
* `layer-toggle <layer>` — hold to switch to `<layer>`, release to fall back to the previous layer.

## My configuration

I run a home-row-mods layout with a symbols layer and a numpad-style numbers layer, both reachable from either hand.

```lisp
(defcfg
  process-unmapped-keys yes
)

(defsrc
  esc   f1    f2    f3   f4      f5    f6     f7      f8    f9    f10   f11  f12
  102d  1     2     3    4       5     6      7       8     9     0     -    =     bspc
  tab   q     w     e    r       t     y      u       i     o     p     [    ]     \
  caps  a     s     d    f       g     h      j       k     l     ;     '    ret
  lsft  grv   z     x    c       v     b      n       m     ,     .     /    rsft
  lctl  lalt  lmet            spc            rmet  ralt  rctl
)

(deflayer base
  _     brdn  brup  _    _       _     _      prev    pp    next  mute  vold volu
  _     _     _     _    _       _     _      _       _     _     _     _    _     _
  _     _     _     _    _       _     _      _       _     _     _     _    _     _
  @^    @A    @S    @D   @F      _     _      @J      @K    @L    @;    _    @ret
  _     @num  @nuz  _    _       _     _      _       _     _     _     _    _
  _     _     _               @spc           _     _     _
)

(defalias
  ^ (tap-hold 200 200 esc lctl)

  A (tap-hold-release 200 250 a lctl)
  S (tap-hold-except-keys 200 350 s lalt (e))
  D (tap-hold-release 200 250 d lmet)
  F (tap-hold-release 200 250 f lsft)

  J (tap-hold-release 200 250 j rsft)
  K (tap-hold-release 200 250 k rmet)
  L (tap-hold-except-keys 200 350 l ralt (i))
  ; (tap-hold-release 200 250 ; rctl)

  num (tap-hold-release 200 250 grv (layer-toggle numbers))
  nuz (tap-hold-release 200 250 z (layer-toggle numbers))
  spc (tap-hold-release 200 250 spc (layer-toggle symbols))
  ret (tap-hold-release 200 250 ret (layer-toggle symbols))
)
```

* `caps` taps `esc`, holds `lctl` — the two keys I use most from that corner, reachable without leaving home row.
* The mods mirror outward-to-inward on both hands: `a`/`;` → `lctl`/`rctl` (pinkies), `s`/`l` → `lalt`/`ralt` (ring fingers), `d`/`k` → `lmet`/`rmet` (middle fingers), `f`/`j` → `lsft`/`rsft` (index fingers).
* `s` and `l` use `tap-hold-except-keys` instead of `tap-hold-release` because `se` and `li` are common enough bigrams that the plain hold-detection would misfire mid-word — excluding `e` and `i` respectively fixes that.
* `spc`/`ret` both toggle `symbols`, and `grv`/`z` both toggle `numbers` — each layer is reachable with either thumb/pinky so I don't need to cross hands to use it.
* Function row (`f1`-`f12`) doubles as media keys on tap: brightness, playback, volume.

### Symbols layer

```lisp
(deflayer symbols
  _     f1    f2    f3   f4      f5    f6     f7      f8    f9    f10   f11  f12
  _     _     _     _    _       _     _      _       _     _     _     _    _     _
  _     S-1   S-2   S-3  S-4     S-5   S-6    S-7     S-8   S-9   S-0   S-[  S-]   S-\
  _     [     ]     S--  -       =     left   down    up    rght  S-;   S-'  _
  _     -     S-[   S-]  S-grv   +     \      lmet    S-\   S-,   S-.   S-/  _
  _     _     _               _              _     _     _
)
```

Held while typing, this trades the function row's media-key shortcuts back for plain `f1`-`f12`, puts the shifted symbols row (`!@#$%^&*()`) directly under the `qwerty` row where they're one row closer to home, and turns `h j k l` — already the mod-tap keys on `base` — into vim-style arrows (`left down up rght`) so navigation never requires the arrow cluster.

### Numbers layer

```lisp
(deflayer numbers
  _     _     _     _    _       _     _      _       _     _     _     _    _
  _     _     _     _    _       _     _      _       _     _     _     _    _     _
  _     _     _     _    _       _     S-8    7       8     9     -     _    _     _
  _     _     _     _    _       _     S-=    4       5     6     S-;   _    _
  _     _     _     _    _       _     _      0       1     2     3     .    _
  _     _     _               0              _     _     _
)
```

Held while typing, this lays out a numpad on the right hand: `7 8 9` on `u i o`, `4 5 6` on `j k l`, `1 2 3` on `m , .`, `0` on both `n` and `spc`, plus `*`, `-`, `+`, `:` alongside for arithmetic without reaching for the number row.

## Cheatsheet

```bash
kanata --cfg ~/.config/kanata/config.kbd            # run with explicit config path
kanata --cfg ~/.config/kanata/config.kbd --debug    # verbose logging for troubleshooting
```

Runs at login as a `LaunchAgent`, via [[launchctl]]'s `RunAtLoad`.
