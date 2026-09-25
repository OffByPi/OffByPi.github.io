---
title: "Python f-strings"
tags: [dev, python]
created: 2026-09-25
modified: 2026-09-25
---
f-strings evaluate expressions inline inside `{}` and format the result into the string.

```python
name = "Dani"
f"Hello, {name}"
```

## Conversion flags: `!r`, `!s`, `!a`

Append `!r`, `!s`, or `!a` before any `:format_spec` to control which conversion runs on the value before formatting, instead of the implicit `str()`.

- `!r` calls `repr()` — quotes strings, shows `None`/booleans as their literal form, and reveals type-distinguishing detail (`'1'` vs `1`).
- `!s` calls `str()` — the default, rarely needed explicitly.
- `!a` calls `ascii()` — like `!r` but escapes non-ASCII characters.

```python
value = "1"
f"{value}"   # '1'
f"{value!r}" # "'1'"
```

Use `!r` in logging and debug output: it disambiguates a string from a number and shows `None` as `None` rather than an empty-looking value.

```python
user_id = None
f"user_id={user_id!r}" # 'user_id=None'
f"user_id={user_id}"   # 'user_id=None' — same here, but not for e.g. "" vs None
```

## Numeric format specs

Common `:format_spec` flags for numbers, after the `:`:

| Flag | Effect | Example | Result |
|---|---|---|---|
| `.Nf` | fixed-point, N decimals | `f"{3.14159:.2f}"` | `'3.14'` |
| `,` | thousands separator | `f"{1234567:,}"` | `'1,234,567'` |
| `_` | thousands separator (underscore) | `f"{1234567:_}"` | `'1_234_567'` |
| `%` | multiply by 100, append `%` | `f"{0.856:.1%}"` | `'85.6%'` |
| `+` | force sign on positives | `f"{42:+}"` | `'+42'` |
| `0Nd` | zero-pad to width N | `f"{7:03d}"` | `'007'` |
| `Nd`/`N` | pad to width N (right-align) | `f"{7:5d}"` | `'    7'` |
| `<N`/`>N`/`^N` | left/right/center-align width N | `f"{7:<5}"` | `'7    '` |
| `x`/`X` | hex, lower/upper case | `f"{255:x}"` | `'ff'` |
| `b` | binary | `f"{5:b}"` | `'101'` |
| `e` | scientific notation | `f"{12345:.2e}"` | `'1.23e+04'` |

Combine flags in order `[align][sign][0][width][,/_][.precision][type]`, e.g. `f"{-3.5:+08.2f}"` → `'-0003.50'`.
