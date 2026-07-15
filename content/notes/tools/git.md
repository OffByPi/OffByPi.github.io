---
title: Git Reference
tags:
  - tools
  - git
---

Pragmatic cheat sheet for common Git workflows.

## Remotes Management

Rename the default remote to upstream:

```bash
git remote rename origin upstream
```

Add your personal fork or actual working remote as origin:

```bash
git remote add origin <your_remote_repository>
```

Verify your current remotes configuration:

```bash
git remote -v
```
