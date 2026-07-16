import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"
import { registerCondition } from "./quartz/plugins/loader/conditions"

ExternalPlugin.Explorer({
  filterFn: (node) => {
    if (!node.isFolder) return true
    const excludedFolders = ["posts", "private", "templates"]
    const topLevelFolder = node.slugSegments?.[0]
    return node.slugSegment !== "tags" && !excludedFolders.includes(topLevelFolder ?? "")
  },
})

registerCondition("is-index", (props) => props.fileData.slug === "index")

ExternalPlugin.RecentNotes({
  filter: (f) => (f.slug ?? "").startsWith("posts/"),
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
