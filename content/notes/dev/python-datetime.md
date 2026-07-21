---
title: "Python Datetime Handling"
tags: [dev, python, datetime, testing]
---
The `datetime` module converts between Unix timestamps, timezone-aware objects, and string formats.

`datetime.fromtimestamp` converts a float Unix timestamp into a `datetime` object using your system's local time zone by default.

```python
datetime.datetime.fromtimestamp(timestamp)
```

## Timezones

Passing a `tzinfo` object as the second argument attaches an explicit time zone to the result instead of relying on local time — this matters as soon as the code runs on a machine in a different zone than where it was written.

```python
datetime.datetime.fromtimestamp(timestamp, tz=datetime.timezone.utc)
```

For named zones (e.g. `"Europe/Rome"`) rather than a fixed UTC offset, use the standard library's `zoneinfo` (Python 3.9+):

```python
from zoneinfo import ZoneInfo
datetime.datetime.fromtimestamp(timestamp, tz=ZoneInfo("Europe/Rome"))
```

A naive `datetime` (no `tzinfo`) and an aware one are never comparable — mixing them raises `TypeError`. Prefer aware datetimes throughout a codebase to avoid that class of bug entirely.

## Converting back to a timestamp

`datetime.timestamp()` is the inverse of `fromtimestamp` — it returns a float Unix timestamp. On a naive `datetime`, it assumes local time, which silently gives the wrong value if the object actually represents another zone; call it only on aware datetimes.

```python
dt.timestamp()
```

## ISO 8601 parsing and formatting

`isoformat()` and `fromisoformat()` round-trip a `datetime` through the [[iso-8601]] string format used by most JSON APIs and logs, without needing a format string.

```python
dt.isoformat() # '2026-07-21T12:00:00+00:00'
datetime.datetime.fromisoformat("2026-07-21T12:00:00+00:00")
```

`fromisoformat` only accepts the `Z` suffix (Zulu, i.e. UTC) starting in Python 3.11 — on older versions replace it first: `fromisoformat(s.replace("Z", "+00:00"))`.

For non-ISO formats, `strftime`/`strptime` take an explicit format string:

```python
dt.strftime("%Y-%m-%d %H:%M") # datetime -> string
datetime.datetime.strptime("2026-07-21 12:00", "%Y-%m-%d %H:%M") # string -> datetime
```

## Testing time-dependent code

[freezegun](https://github.com/spulec/freezegun) freezes `datetime.now()`/`utcnow()` to a fixed point during a test, so code that depends on "now" stays deterministic. Its `freeze_time` function works both as a decorator and as a context manager, and integrates with [[pytest]].

```python
from freezegun import freeze_time

@freeze_time("2026-01-01")
def test_something():
    assert datetime.datetime.now().year == 2026
```

## Cheatsheet

### Timestamp conversion
```python
datetime.datetime.fromtimestamp(timestamp) # local time zone
datetime.datetime.fromtimestamp(timestamp, tz=datetime.timezone.utc) # UTC
datetime.datetime.fromtimestamp(timestamp, tz=ZoneInfo("Europe/Rome")) # named zone
dt.timestamp() # datetime -> float timestamp
```

### ISO 8601
```python
dt.isoformat() # datetime -> ISO string
datetime.datetime.fromisoformat(iso_string) # ISO string -> datetime
```

### Freezing time in tests
```python
@freeze_time("2026-01-01") # decorator form
with freeze_time("2026-01-01"): ... # context manager form
```
