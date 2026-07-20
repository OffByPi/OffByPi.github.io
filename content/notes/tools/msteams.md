---
title: "MS Teams"
tags: [tools, chat]
---
`msteams` handles external links (e.g. meeting invites) by handing them off to the default browser's protocol handler.

---

## Chrome Ask for Correct Account on Links

Restores the "Always open these types of links" checkbox in Chrome's external-protocol confirmation dialog, so opening a Teams link lets you pick which Chrome profile/account handles it instead of silently reusing the last choice.

---

## Cheatsheet

### Chrome Ask for Correct Account on Links

```bash
defaults write com.google.Chrome ExternalProtocolDialogShowAlwaysOpenCheckbox -bool true
```
