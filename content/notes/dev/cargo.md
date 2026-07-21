---
title: "Cargo"
tags: [dev, rust, cargo, cli]
---
Cargo is Rust's build tool and package manager, wrapping `rustc` for the common build/test/publish workflow.

## Query Linked C Static Libraries

`cargo rustc` passes extra flags straight to `rustc`. `--print native-static-libs` lists the native (C) static libraries the build links against — useful when embedding a Rust static library into a C/C++ project and needing to know what else to link.

```bash
cargo rustc --lib -- --print native-static-libs
```

## Cheatsheet

```bash
cargo rustc --lib -- --print native-static-libs # list linked native static libs
```
