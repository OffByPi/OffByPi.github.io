---
title: "Rosetta"
tags: [tools, macos, rosetta]
---
Rosetta 2 lets Apple Silicon Macs run x86_64 binaries by translating them at launch. Universal binaries bundle both architectures; other tools need to be told explicitly to target x86_64 so Rosetta can run the result.

---

## Run a Specific Architecture from a Universal Binary

`arch -x86_64 <command>` re-executes `<command>` under the x86_64 slice of a universal binary instead of the native arm64 one.

## Compile C/C++ for x86_64

- **`clang`/`gcc` directly:** add `-target x86_64-apple-darwin` to the compile command.
- **CMake:** set `CMAKE_OSX_ARCHITECTURES` at configure time.

The resulting binary runs under Rosetta on Apple Silicon.

## Compile Rust for x86_64

Add the target once, then build against it explicitly.

---

## Cheatsheet

### Run a Specific Architecture

```bash
arch -x86_64 <command>
```

### Compile C/C++ for x86_64

```bash
# clang/gcc
clang -target x86_64-apple-darwin <source.c> -o <binary>

# CMake
cmake -S . -B build -DCMAKE_OSX_ARCHITECTURES=x86_64
cmake --build build
```

### Compile Rust for x86_64

```bash
rustup target add x86_64-apple-darwin
cargo build --target x86_64-apple-darwin
```
