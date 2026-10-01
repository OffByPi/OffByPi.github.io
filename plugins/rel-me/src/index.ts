import { h } from "preact"
import type { QuartzTransformerPlugin } from "@quartz-community/types"

export interface RelMeOptions {
  links: string[]
}

export const RelMe: QuartzTransformerPlugin<RelMeOptions> = (opts) => {
  const links = opts?.links ?? []
  return {
    name: "RelMe",
    textTransform(_ctx, src) {
      return src
    },
    externalResources() {
      return {
        additionalHead: links.map((href) => () => h("link", { rel: "me", href })),
      }
    },
  }
}

export type { QuartzTransformerPlugin } from "@quartz-community/types"
