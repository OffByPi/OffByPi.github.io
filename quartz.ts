import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"
import { registerCondition } from "./quartz/plugins/loader/conditions"

ExternalPlugin.Explorer({
  filterFn: (node) => {
    if (!node.isFolder) return true
    const excludedFolders = ["private", "templates"]
    const topLevelFolder = node.slugSegments?.[0]
    return node.slugSegment !== "tags" && !excludedFolders.includes(topLevelFolder ?? "")
  },
  mapFn: (node) => {
    const isTopLevelPostsFolder =
      node.isFolder && node.slugSegments?.length === 1 && node.slugSegments[0] === "posts"
    if (isTopLevelPostsFolder) {
      node.children = []
    }
  },
  sortFn: (a, b) => {
    const topLevelMenuOrder = ["about", "posts", "notes"]
    const aTop = a.slugSegments?.length === 1 ? topLevelMenuOrder.indexOf(a.slugSegments[0]) : -1
    const bTop = b.slugSegments?.length === 1 ? topLevelMenuOrder.indexOf(b.slugSegments[0]) : -1
    if (aTop !== -1 && bTop !== -1) return aTop - bTop

    if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
      return (a.displayName || "").localeCompare(b.displayName || "", undefined, {
        numeric: true,
        sensitivity: "base",
      })
    }
    return !a.isFolder && b.isFolder ? 1 : -1
  },
})

registerCondition("is-index", (props) => props.fileData.slug === "index")

ExternalPlugin.RecentNotes({
  filter: (f) => (f.slug ?? "").startsWith("posts/"),
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
