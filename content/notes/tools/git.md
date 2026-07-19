---
title: "Git"
tags: [tools, cli, vcs]
---
`git` is a distributed version control system for tracking changes in source code during software development.

---

## Cheatsheet

### Exporting a Repo Without Git Artifacts (`git archive`)

`git archive` creates a tarball/zip of a tree, without the `.git` directory.

```bash
# Export the current HEAD as a tarball
git archive --format=tar --output=<archive-name>.tar HEAD

# Export as a compressed tarball
git archive --format=tar.gz --output=<archive-name>.tar.gz HEAD

# Export as a zip
git archive --format=zip --output=<archive-name>.zip HEAD

# Export a specific branch/tag/commit
git archive --format=tar.gz --output=<archive-name>.tar.gz <branch-or-tag-or-commit>

# Export only a subdirectory
git archive --format=tar.gz --output=<archive-name>.tar.gz HEAD -- <subdir>

# Export and pipe straight into extraction elsewhere
git archive HEAD | tar -x -C <dest-dir>
```

### Exporting a Repo with History (`git bundle`)

`git bundle` packs commits, refs, and history into a single file that can be cloned or fetched from, useful for transferring a repo without network access.

```bash
# Bundle the whole repo (all branches/tags)
git bundle create <bundle-name>.bundle --all

# Bundle a single branch
git bundle create <bundle-name>.bundle <branch-name>

# Bundle only commits not yet on main (incremental transfer)
git bundle create <bundle-name>.bundle main..<branch-name>

# Verify a bundle is valid and can be applied to the current repo
git bundle verify <bundle-name>.bundle

# Clone a new repo from a bundle
git clone <bundle-name>.bundle <dest-dir>

# Fetch from a bundle into an existing repo
git fetch <bundle-name>.bundle <branch-name>:<local-branch-name>
```

### Checking Which GitHub Account SSH Will Use

```bash
ssh -T git@github.com
```

Prints `Hi <username>! You've successfully authenticated...` without opening a shell (`-T` disables PTY allocation). Useful to confirm which identity applies before pushing, especially with multiple keys/accounts configured — see [[ssh#Multiple Keys for the Same Host (`~/.ssh/config`)]]. Run it against a `Host` alias to check a specific account: `ssh -T git@github.com-work`.

### Picking the Right Remote with Multiple Accounts

```bash
# Show the current remote's URL
git remote -v
```

Point `origin` at the correct `Host` alias for the account that should own this repo (see [[ssh#Multiple Keys for the Same Host (`~/.ssh/config`)]]):

```bash
git remote set-url origin git@github.com-work:<org>/<repo>.git
```

For a repo that needs to push to more than one account/remote, add extras instead of overwriting `origin`:

```bash
git remote add <remote-name> git@github.com-personal:<user>/<repo>.git
git push <remote-name> <branch-name>
```

Confirm before pushing with `git remote -v` (or `ssh -T` against the alias above) — pushing under the wrong account is easy to miss until the commit shows up with the wrong author on GitHub.
