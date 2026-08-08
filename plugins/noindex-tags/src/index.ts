import { h } from "preact"
import type { FullSlug, QuartzPluginData, QuartzTransformerPlugin } from "@quartz-community/types"

function isTagPage(fileData: QuartzPluginData): boolean {
  const slug = fileData.slug as FullSlug | undefined
  return slug === "tags" || (slug?.startsWith("tags/") ?? false)
}

export const NoindexTags: QuartzTransformerPlugin = () => {
  return {
    name: "NoindexTags",
    textTransform(_ctx, src) {
      return src
    },
    htmlPlugins() {
      return [
        () => (_tree: unknown, file: { data: Record<string, unknown> }) => {
          if (isTagPage(file.data as QuartzPluginData)) {
            file.data.noindex = true
          }
        },
      ]
    },
    externalResources() {
      return {
        additionalHead: [
          (fileData: QuartzPluginData) =>
            isTagPage(fileData) ? h("meta", { name: "robots", content: "noindex, nofollow" }) : "",
        ],
      }
    },
  }
}

export type { QuartzTransformerPlugin } from "@quartz-community/types"
