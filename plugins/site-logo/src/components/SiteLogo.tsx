import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
  FullSlug,
} from "@quartz-community/types"
import { pathToRoot, joinSegments } from "@quartz-community/utils/path"
import { classNames } from "@quartz-community/utils/lang"
import { i18n } from "../i18n"

const SiteLogo: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const baseDir = pathToRoot(fileData.slug as FullSlug)
  const logoSrc = joinSegments(baseDir, "static/logo-header.svg")
  const t = i18n(cfg?.locale ?? "en-US").components.siteLogo
  const title = cfg?.pageTitle ?? t.homeLabel
  return (
    <a href={baseDir} class={classNames(displayClass, "page-logo")} aria-label={title}>
      <img src={logoSrc} alt="" width="141" height="44" />
      <span class="page-logo-text">{title}</span>
    </a>
  )
}

SiteLogo.css = `
.page-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.page-logo img {
  height: 2.75rem;
  width: auto;
  flex-shrink: 0;
  display: block;
}
.page-logo-text {
  font-family: var(--headerFont);
  font-weight: 700;
  font-size: 1.3rem;
  color: var(--secondary);
  white-space: nowrap;
}
`

export default (() => SiteLogo) satisfies QuartzComponentConstructor
