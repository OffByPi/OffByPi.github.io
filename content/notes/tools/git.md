---
title: "Git"
tags: [tools, cli, vcs]
---
`git` is a distributed version control system for tracking changes in source code during software development.

---

## Exporting a Repo Without Git Artifacts (`git archive`)

`git archive` creates a tarball/zip of a tree, without the `.git` directory.

## Exporting a Repo with History (`git bundle`)

`git bundle` packs commits, refs, and history into a single file that can be cloned or fetched from, useful for transferring a repo without network access.

## Checking Which GitHub Account SSH Will Use

`ssh -T git@github.com` prints `Hi <username>! You've successfully authenticated...` without opening a shell (`-T` disables PTY allocation). Useful to confirm which identity applies before pushing, especially with multiple keys/accounts configured — see [[ssh#Multiple Keys for the Same Host (`~/.ssh/config`)]]. Run it against a `Host` alias to check a specific account.

## Picking the Right Remote with Multiple Accounts

Point `origin` at the correct `Host` alias for the account that should own this repo (see [[ssh#Multiple Keys for the Same Host (`~/.ssh/config`)]]). For a repo that needs to push to more than one account/remote, add extras instead of overwriting `origin`. Confirm before pushing with `git remote -v` (or `ssh -T` against the alias) — pushing under the wrong account is easy to miss until the commit shows up with the wrong author on GitHub.

## Undoing an Accidental `--amend`

`git commit --amend` rewrites `HEAD`, but the previous tip is still reachable through the reflog as `HEAD@{1}` until garbage collection runs. Resetting to it with `--soft` restores the old commit while keeping the amended changes staged.

## Restoring a File from Another Branch

`git restore -s <branch> -- <file>` checks out a single file's content from another branch's tip into the working tree, without touching any other file or switching branches.

## Rewriting Author Email in Past Commits

`git filter-branch --env-filter` rewrites every commit in a range, letting you swap `GIT_AUTHOR_EMAIL`/`GIT_COMMITTER_EMAIL` when it matches an old address. `filter-branch` is deprecated upstream in favor of `git-filter-repo`, but it still works for a one-off fix on a small range. Rewriting history changes commit hashes — coordinate with anyone who has already pulled the branch before force-pushing.

## Diffing Between Branches

`git diff <branch-a>..<branch-b>` compares the tips of two branches directly (as opposed to `<branch-a>...<branch-b>`, which diffs against their common ancestor).

## Visualizing History as a Graph

`git log --graph` draws the commit DAG in ASCII, useful for seeing merges and diverging branches at a glance.

## Cheatsheet

### Export as Tarball/Zip

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

### Bundle Commits into a File

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

### Check Active SSH Identity

```bash
ssh -T git@github.com
```

### Inspect and Repoint Remotes

```bash
# Show the current remote's URL
git remote -v

# Point origin at a different Host alias
git remote set-url origin git@github.com-work:<org>/<repo>.git

# Add an additional remote instead of overwriting origin
git remote add <remote-name> git@github.com-personal:<user>/<repo>.git
git push <remote-name> <branch-name>
```

### Undo `--amend`

```bash
git reset --soft HEAD@{1}
```

### Restore a File from Another Branch

```bash
git restore -s <branch> -- <file>
```

### Rewrite Author Email in Past Commits

```bash
git filter-branch --env-filter '
if [ "$GIT_AUTHOR_EMAIL" = "<old-email>" ]; then
    export GIT_AUTHOR_EMAIL="<new-email>"
    export GIT_COMMITTER_EMAIL="<new-email>"
fi
' -- <range>
```

### Diff Between Two Branches

```bash
git diff <branch-a>..<branch-b>
```

### Show Commit Graph

```bash
git log --all --decorate --oneline --graph
```
