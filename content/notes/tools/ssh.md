---
title: "SSH"
tags: [tools, cli, ssh]
---
`ssh` opens an encrypted shell to a remote host, and can also tunnel arbitrary TCP traffic between hosts.

---

## Cheatsheet

### Kill a Hung Session (`~.`)

Type on a new line (after `Enter`) when the session is frozen or unresponsive:

```text
~.
```

Terminates the connection immediately from the client side, no server cooperation needed.

### Add a Forward to a Live Session (`~C`)

```text
~C
```

Drops into an `ssh>` command line inside an already-open session, letting you add (`-L`/`-R`) or list (`-L` with no args) port forwards without reconnecting.

### Local Port Forward (`-L`)

```bash
ssh -L <local-port>:<remote-host>:<remote-port> <user>@<jump-host>
```

Makes `localhost:<local-port>` on your machine reach `<remote-host>:<remote-port>` as seen from `<jump-host>`.

### Remote Port Forward (`-R`)

```bash
ssh -R <remote-port>:<local-host>:<local-port> <user>@<remote-host>
```

Makes `<remote-host>:<remote-port>` reach back into `<local-host>:<local-port>` on your machine — exposes a local service to the remote side.

### Identity File (`-i`)

```bash
ssh -i <path-to-key> <user>@<host>
```

Forces a specific private key instead of the default `~/.ssh/id_*` lookup.

### Generate a Key Pair (`ssh-keygen`)

```bash
ssh-keygen -t ed25519 -C "<comment>"
```

Writes `<keyname>` and `<keyname>.pub` to `~/.ssh/` (defaults to `id_ed25519`). `-C` tags the public key with a comment (typically an email or hostname) so it's identifiable once copied to remote `authorized_keys` files.

### Convert Key Format (`-m`)

```bash
# OpenSSH key (public or private) -> public key in RFC4716/SSH2 format
ssh-keygen -e -m RFC4716 -f <path-to-key>

# RFC4716/SSH2 public key -> OpenSSH public key
ssh-keygen -i -m RFC4716 -f <path-to-key>.pub

# PEM private key -> OpenSSH private key
ssh-keygen -i -m PEM -f <path-to-key>.pem > <path-to-key>
```

`-e`/`-i` export/import a key in the format named by `-m` (`RFC4716`, `PEM`, or `PKCS8`) — needed when talking to tools that don't speak OpenSSH's native key format (PuTTY, some network appliances, older SSH2 implementations). `-e` **always outputs a public key**, even if fed a private key file; `-i` preserves the key type — a private key in produces a private key out, a public key in produces a public key out.

### Copy a Public Key to a Remote (`ssh-copy-id`)

```bash
ssh-copy-id -i <path-to-key>.pub <user>@<host>
```

Appends the public key to `~/.ssh/authorized_keys` on `<host>`, creating the file/directory with correct permissions if missing. Enables key-based login without manually `cat`-ing and pasting the key over.

### Multiple Keys for the Same Host (`~/.ssh/config`)

Define a separate `Host` alias per identity, each pointing at `github.com` with its own key:

```sshconfig
Host github.com-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/<personal-key>
    IdentitiesOnly yes

Host github.com-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/<work-key>
    IdentitiesOnly yes
```

Clone/remote using the alias instead of `github.com`:

```bash
git clone git@github.com-work:<org>/<repo>.git
```

For an existing repo, update the remote to swap accounts:

```bash
git remote set-url origin git@github.com-personal:<user>/<repo>.git
```

`IdentitiesOnly yes` stops SSH from offering every key in `~/.ssh/` (or the agent) before trying `IdentityFile`, which avoids hitting GitHub's failed-auth rate limit when several keys are loaded.
