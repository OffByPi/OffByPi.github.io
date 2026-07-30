import { h } from "preact"
import { joinSegments } from "@quartz-community/utils"
import type {
  BuildCtx,
  FullSlug,
  QuartzPluginData,
  QuartzTransformerPlugin,
} from "@quartz-community/types"

function canonicalUrl(ctx: BuildCtx, fileData: QuartzPluginData): string {
  const url = new URL(`https://${ctx.cfg.configuration.baseUrl ?? "example.com"}`)
  const slug = fileData.slug as FullSlug | undefined
  return slug === undefined || slug === "404" ? url.toString() : joinSegments(url.toString(), slug)
}

export const CanonicalUrl: QuartzTransformerPlugin = () => {
  return {
    name: "CanonicalUrl",
    textTransform(_ctx, src) {
      return src
    },
    externalResources(ctx) {
      return {
        additionalHead: [
          (fileData: QuartzPluginData) =>
            h("link", { rel: "canonical", href: canonicalUrl(ctx, fileData) }),
        ],
      }
    },
  }
}

export type { QuartzTransformerPlugin } from "@quartz-community/types"
