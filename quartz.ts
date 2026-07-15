import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"

const EXCLUDED_EXPLORER_FOLDERS = ["posts", "private", "templates"]

ExternalPlugin.Explorer({
  filterFn: (node) => {
    if (!node.isFolder) return true
    const topLevelFolder = node.slugSegments?.[0]
    return !EXCLUDED_EXPLORER_FOLDERS.includes(topLevelFolder ?? "")
  },
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
