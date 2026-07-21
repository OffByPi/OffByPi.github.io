---
title: "lnav"
tags: [tools, cli, logs]
---
`lnav` is a terminal log file viewer that auto-detects common log formats, merges multiple files into a single timestamp-ordered view, and lets you query log data with SQL.

---

## Merged Timeline View

Point it at several files (or a directory) and it interleaves every line across all of them by timestamp into one scrollable view — no manual correlation needed when debugging an issue that spans, say, an app log and a syslog.

## Tailing

Tailing is the default mode, not an opt-in flag: every file passed in is followed live and merged into the same timestamp-ordered view as new lines arrive. Scrolling up to inspect history pauses auto-scroll until you jump back to the bottom, so incoming lines don't yank you away mid-read. It also tails piped input, e.g. `journalctl -f | lnav`.

## Querying Logs with SQL

Each recognized log format is exposed as a SQLite virtual table (e.g. syslog lines become the `syslog_log` table), with parsed fields like `log_time`, `log_level`, and `log_body` as columns. Press `;` to drop into a SQL prompt and `SELECT` against that table instead of piping through `grep`/`awk` — this also unlocks aggregation (`GROUP BY log_level, COUNT(*)` for an error/warning tally) and joins across multiple loaded formats on a shared timestamp, which plain text tools can't do.

## Source Filename Visibility

The source filename isn't a fixed column — it's revealed by horizontal scrolling. At the start of the message text, scrolling left cycles hidden → shortened filename → full path; scrolling right cycles back, useful when multiple files are tailed together and you need to see (or hide again) which file a line came from.

## Format Detection and Pretty-Printing

Common formats (syslog, Apache/nginx access logs, journald, JSON logs, etc.) are recognized automatically and colorized by level. Structured lines (e.g. JSON) can be expanded into a pretty-printed detail view.

---

## Cheatsheet

### Open Files

```bash
lnav <file1> <file2>       # tail and merge multiple files into one timeline
lnav <directory>           # open every log file in a directory
journalctl -f | lnav       # tail piped input
```

### Navigate

```keymap
/<regex>   # search
n / N      # next / previous search match
e / E      # next / previous error
w / W      # next / previous warning
G          # jump to bottom, resume auto-scroll while tailing
h / l      # (at start of line) cycle filename: hidden -> short -> full path, and back
q          # quit
```

### Query with SQL

```sql
;SELECT log_time, log_body FROM syslog_log WHERE log_level = 'error';
```

### List Available Tables

```sql
;SELECT name FROM sqlite_master WHERE type='table';
```

Or press `;` then `Tab` on an empty query to browse via autocomplete.

### Filter Lines

```keymap
:filter-in <regex>       # show only matching lines
:filter-out <regex>      # hide matching lines
:delete-filter <regex>   # remove a filter by its pattern
```

`TAB` shifts focus into the visual filter editor: `Space` toggles a filter on/off, `Enter` edits it, `Shift+D` deletes it, `t` flips it between IN/OUT. `Ctrl+R` clears every filter at once.

### Toggle Views

```keymap
i   # histogram of log volume over time
p   # pretty-print / detail view of the selected line
?   # full keybinding help
```
