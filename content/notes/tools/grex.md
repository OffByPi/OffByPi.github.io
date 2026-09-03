---
title: "grex"
tags: [tools, cli, regex, rust]
created: 2026-09-03
---
`grex` generates a regular expression from a set of test strings — the inverse of writing a regex by hand. Feed it example inputs and it produces a pattern that matches all of them (and only them, by default), written in Rust for speed.

## Basic Syntax

```bash
grex <string>...
grex -f <file>
```

Strings can be passed directly as arguments, read from a file (one per line) with `-f`, or piped via stdin with `-`.

## Common Options

* `-f <file>` — Read test strings from a file, one per line.
* `-i, --ignore-case` — Case-insensitive matching.
* `-r, --repetitions` — Detect repeated substrings and convert to `{min,max}` quantifiers.
* `-d, --digits` / `-D, --non-digits` — Convert Unicode digits to `\d` / non-digits to `\D`.
* `-s, --spaces` / `-S, --non-spaces` — Convert whitespace to `\s` / non-whitespace to `\S`.
* `-w, --words` / `-W, --non-words` — Convert word characters to `\w` / non-word chars to `\W`.
* `-e, --escape` — Replace non-ASCII characters with unicode escape sequences.
* `-g, --capture-groups` — Replace non-capturing groups with capturing ones.
* `--no-start-anchor` / `--no-end-anchor` / `--no-anchors` — Drop the `^` / `$` / both anchors.
* `-x, --verbose` — Nicer-looking, commented output.
* `-c, --colorize` — Syntax-highlight the resulting regex.

By default the output is anchored (`^...$`) and matches only the given test cases exactly.

## Cheatsheet

```bash
grex foo foobar foobarbaz # ^foo(?:bar(?:baz)?)?$
grex -f <file> # generate from a file, one test string per line
echo -e "a1\nb2\nc3" | grex - # generate from stdin
grex -i Foo foo FOO # (?i)^foo$
grex -r a aa aaa # collapse repeats into quantifiers, e.g. ^a{1,3}$
grex -d a1 b2 c3 # use digit class, e.g. ^[a-c]\d$
grex --no-anchors foo bar # drop ^ and $ for substring matching
```
