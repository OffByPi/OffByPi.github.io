// Regenerates the derived logo assets served by the site from the source logo.
//
// Sources:
//   - assets/images/logo-compact.svg — icon-only mark, untouched design source, never edit
//   - assets/images/logo.png         — full detailed logo, untouched design source, never edit
// Outputs:
//   - quartz/static/icon.png     — 512x512 favicon, rendered from the compact icon
//                                  (the full logo's fine print doesn't read at favicon size)
//   - quartz/static/og-image.png — 1200x675 default social-preview card, full logo centered
//                                  on a #0f1419 background
//
// Run with: node scripts/gen-logo-assets.mjs
//
// This is a one-off asset-generation utility for these two specific files, not a
// general image pipeline — see docs/superpowers/plans/2026-07-14-site-logo.md
// (Tasks 1 and 2) for the original design rationale.

import sharp from "sharp"

const ICON_SOURCE = "assets/images/logo-compact.svg"
const LOGO_SOURCE = "assets/images/logo.png"

async function genIcon() {
  await sharp(ICON_SOURCE).resize(512, 512).png().toFile("quartz/static/icon.png")

  console.log("wrote quartz/static/icon.png")
}

async function genOgImage() {
  const CANVAS_WIDTH = 1200
  const CANVAS_HEIGHT = 675
  const LOGO_SIZE = 500
  const BACKGROUND = "#0f1419"

  const logo = await sharp(LOGO_SOURCE).resize(LOGO_SIZE, LOGO_SIZE).toBuffer()

  await sharp({
    create: {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      channels: 3,
      background: BACKGROUND,
    },
  })
    .composite([
      {
        input: logo,
        left: Math.round((CANVAS_WIDTH - LOGO_SIZE) / 2),
        top: Math.round((CANVAS_HEIGHT - LOGO_SIZE) / 2),
      },
    ])
    .png()
    .toFile("quartz/static/og-image.png")

  console.log("wrote quartz/static/og-image.png")
}

await genIcon()
await genOgImage()
