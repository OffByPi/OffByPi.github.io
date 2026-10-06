---
title: "Thunderbird"
tags:
  - tools
  - thunderbird
  - email
created: 2026-10-06
---
Thunderbird honors Firefox-style profile CSS: `chrome/userContent.css` styles content documents (message body, calendar event description editor), `chrome/userChrome.css` styles the application UI.

## Dark theme: calendar editor visibility

With the dark theme, the calendar event description editor can render dark text on a dark background. Override it in `userContent.css`.

Enable user styles first: Settings → General → Config Editor, then set `toolkit.legacyUserProfileCustomizations.stylesheets` to `true`. Restart Thunderbird after creating or editing the file.

---

## Cheatsheet

### Open the profile folder

Help → Troubleshooting Information → Profile Folder → Open Folder. Create `chrome/` inside it if it doesn't exist.

### `chrome/userContent.css`

```css
body {
  color: #e0e0e0 !important;
  background-color: #2b2b2b !important;
}

a:link {
  color: #8ab4f8 !important;
}

a:visited {
  color: #b39ddb !important;
}
```
