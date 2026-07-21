---
title: "Quartz"
tags: [dev, tools, markdown, web]
---
Cheatsheet for configuring and extending `quartz` beyond the defaults. See [[quartz-installation]] for setup.

---

## Override a plugin's behavior

Call the plugin's constructor directly in `quartz.ts` instead of relying on the config-driven defaults. This lets you pass options a plugin exposes but that `quartz.config.ts` doesn't surface.

> [!warning]
> Plugin constructor calls must run **before** `loadQuartzConfig()`. Quartz resolves plugin registration at that point, so anything called after it has no effect.

```ts
import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"

ExternalPlugin.Explorer({
    filterFn: (node: { slugSegment: string }) => {
        const isBlogFolder = node.slugSegment === "posts"
        return !(isBlogFolder || node.slugSegment === "tags")
    },
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
```

