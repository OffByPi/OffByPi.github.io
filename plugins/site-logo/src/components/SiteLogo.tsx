import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
  FullSlug,
} from "@quartz-community/types"
import { pathToRoot, joinSegments } from "@quartz-community/utils/path"
import { classNames } from "@quartz-community/utils/lang"

const SiteLogo: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const baseDir = pathToRoot(fileData.slug as FullSlug)
  const logoSrc = joinSegments(baseDir, "static/logo.svg")
  const alt = cfg?.pageTitle ?? "Home"
  return (
    <a href={baseDir} class={classNames(displayClass, "page-logo")} aria-label={alt}>
      <img src={logoSrc} alt={alt} />
    </a>
  )
}

SiteLogo.css = `
.page-logo {
  display: inline-flex;
  align-items: center;
}
.page-logo img {
  height: 2rem;
  width: auto;
  display: block;
}
`

export default (() => SiteLogo) satisfies QuartzComponentConstructor
