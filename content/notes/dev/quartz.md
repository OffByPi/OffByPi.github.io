---
title: Quartz Setup
tags:
  - dev
  - quartz
---

Notes on how this digital garden is built, configured, and deployed.

## Configuration

Layout and plugins are declared in `quartz.config.yaml`; anything that needs a real
JS predicate (filters, sorters, custom conditions) is layered on top in `quartz.ts`.

## Build

Build once:

```bash
./quartz/bootstrap-cli.mjs build
```

Build and serve locally with live reload:

```bash
./quartz/bootstrap-cli.mjs build --serve
```
