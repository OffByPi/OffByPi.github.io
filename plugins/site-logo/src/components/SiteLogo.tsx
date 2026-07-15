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
  display: flex;
  align-items: center;
  width: 100%;
}
.page-logo img {
  height: auto;
  width: 100%;
  max-width: 10rem;
  display: block;
}
`

export default (() => SiteLogo) satisfies QuartzComponentConstructor
