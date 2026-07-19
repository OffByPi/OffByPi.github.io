---
title: "Chezmoi Templates"
tags: [tools, cli, dotfiles]
---
Chezmoi turns a managed dotfile into a Go-template file so its content can vary per machine, using data from `.chezmoi.toml.tmpl` or built-in variables like `.chezmoi.hostname`.

---

## Converting an Existing File

```bash
# Adds the .tmpl suffix and opens it in $EDITOR
chezmoi chattr template <path-in-source-dir>

# Or target the file directly by its destination path
chezmoi chattr template ~/.gitconfig
```

> **Source path first:** if the file is already managed, find its source name with `chezmoi source-path <target>` before editing directly under `~/.local/share/chezmoi`.

## Templating Syntax

```gotemplate
{{- if eq .chezmoi.hostname "work-laptop" }}
[user]
    email = <work-email>
{{- else }}
[user]
    email = <personal-email>
{{- end }}
```

* `{{ .chezmoi.hostname }}` — current machine's hostname.
* `{{ .chezmoi.os }}` — `darwin`, `linux`, etc.
* `{{ .variable }}` — custom values defined in `.chezmoi.toml.tmpl` under `[data]`.
* `{{-` / `-}}` — trims surrounding whitespace/newlines so the rendered file stays clean.

## Custom Variables

Define custom values under `[data]` in `.chezmoi.toml.tmpl` (or `~/.config/chezmoi/chezmoi.toml` if not templated):

> **A special file, not a managed dotfile:** `.chezmoi.toml.tmpl` lives at the root of the source directory and chezmoi recognizes it by name — it isn't added with `chezmoi add` against a target path. It's rendered once during `chezmoi init` (and re-read on every run) to populate `.chezmoi.*` data and `[data]` for all other templates. Still commit it to the dotfiles repo like any other source file; it just has no corresponding target in `$HOME`.

```toml
[data]
    work_email = "<work-email>"
    personal_email = "<personal-email>"
```

Reference them in any template with a leading dot:

```gotemplate
[user]
    email = {{ .work_email }}
```

> **Prompt for values interactively:** use `promptString`/`promptBool` inside `.chezmoi.toml.tmpl` to ask once during `chezmoi init` and store the answer, instead of hardcoding it:
> ```gotemplate
> [data]
>     work_email = {{ promptString "work_email" | quote }}
> ```

## Cheatsheet

### Preview the Rendered Output

```bash
# Show what the template would produce without writing it
chezmoi execute-template < <path-to-tmpl-file>

# Diff the rendered template against the live file
chezmoi diff <target>
```

### Apply Changes

```bash
chezmoi apply <target>
```

### Reverting a Template Back to a Plain File

```bash
chezmoi chattr template- <path-in-source-dir>
```

### Making the Generated File Read-Only

Set `readonly` alongside `template` to avoid accidentally editing the rendered file instead of the source template:

```bash
chezmoi chattr template,readonly <path-in-source-dir>
```
