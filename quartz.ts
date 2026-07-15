import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"
import { registerCondition } from "./quartz/plugins/loader/conditions"

const EXCLUDED_EXPLORER_FOLDERS = ["posts", "private", "templates"]

ExternalPlugin.Explorer({
  filterFn: (node) => {
    if (!node.isFolder) return true
    const topLevelFolder = node.slugSegments?.[0]
    return !EXCLUDED_EXPLORER_FOLDERS.includes(topLevelFolder ?? "")
  },
})

registerCondition("is-index", (props) => props.fileData.slug === "index")

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
