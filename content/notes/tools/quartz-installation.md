---
title: Quartz installation instructions
tags:
  - dev
  - tools
  - markdown
  - web
---
Instructions to install `quartz` locally.

---

## Installation instructions

### 1. Clone the repository

```bash
git clone https://github.com/jackyzha0/quartz.git <target_directory>
cd <target_directory>
```

### 2. Install the dependencies

```bash
npm install
```

### 3. Run interactive initialisation

```bash
npx quartz create
```

It will ask for a starting template, here you can choose from:
1. **Default**: a clean `quartz` setup with sensible defaults, such as search, explorer, etc.
2. **Obsidian**: it mimics `obsidian` app visuals.
3. **TTRPG**: is a layout optimized for RPG games.
4. **Blog**: Removes *wiki style* functionality to have a cleaner blog layout

It will ask how to initialize the content:
1. **Empty Quartz**: no default content.
2. **Copy an existing folder**: will copy a content folder.
3. **Symlink an existing folder**: will symlink the content of an existing folder.

It will ask how quartz should resolve links:
1. Shortest paths.
2. Absolute paths.
3. Relative paths.

It will ask the base URL for your site.

### 4. Check the installation

The following command will spawn a development server on `http://localhost:8080`.

```bash
npx quartz build --serve
```

### 5. Set your git remote

Rename current origin to be `upstream`:
```bash
git remote rename origin vendor
```

Add your actual remote as origin:
```bash
git remote add origin <your_remote_repository>
```

Commit initialisation changes:
```bash
git add "."
git commit -m "chore: initialized quartz"
```

> Remember to take note of the current branch name, you'll need it for updating Quartz.

Push the current branch to your remote:
```bash
git branch -m main
git push -u origin main
```