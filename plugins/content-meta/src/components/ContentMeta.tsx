import type {
  QuartzComponentConstructor,
  QuartzComponentProps,
  QuartzPluginData,
  ValidDateType,
} from "@quartz-community/types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { DateComponent, formatDate, getDate } from "../util/date"
import type { JSX } from "preact"
import style from "./styles/contentMeta.scss"

export interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  /**
   * Whether to display a separate "Updated on ..." entry when the
   * modified date differs from the primary displayed date
   */
  showUpdated: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showUpdated: true,
  showComma: true,
}

function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString()
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []
      const locale = cfg.locale || "en-US"
      const i18nData = i18n(locale)

      if (fileData.dates) {
        const defaultDateType =
          (fileData.defaultDateType as ValidDateType | undefined) ??
          (cfg.defaultDateType as ValidDateType | undefined)
        if (defaultDateType) {
          const dataWithDefaultDateType: QuartzPluginData = {
            ...(fileData as QuartzPluginData),
            defaultDateType,
          }
          const date = getDate(dataWithDefaultDateType)
          if (date) {
            segments.push(<DateComponent date={date} locale={locale} />)

            const modified = fileData.dates.modified
            if (options.showUpdated && modified && !isSameDay(date, modified)) {
              segments.push(
                <span>
                  {i18nData.components.contentMeta.updatedOn({
                    date: formatDate(modified, locale),
                  })}
                </span>,
              )
            }
          }
        }
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text as string)
        const displayedTime = i18nData.components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(<span>{displayedTime}</span>)
      }

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segments}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
