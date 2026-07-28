---
title: "Devcontainer GUI Apps"
tags: [tools, dev, containers, vscode, vnc]
---
Run GUI apps inside a [[devcontainer-json|devcontainer]] via a lightweight Fluxbox desktop, reachable through noVNC in a browser or any VNC client. The `desktop-lite` feature handles this without a custom Dockerfile.

```json
{
  "features": {
    "ghcr.io/devcontainers/features/desktop-lite:1": {
      "webPort": "6080",
      "vncPort": "5901"
    }
  },
  "containerEnv": {
    "VNC_RESOLUTION": "1920x1080x16"
  },
  "forwardPorts": [5901, 6080],
  "portsAttributes": {
    "6080": { "label": "Desktop (noVNC - browser)" }
  }
}
```

## Resolution

The feature defaults to `1440x768x16`, which is too short and hides the Fluxbox topbar behind fullscreen app windows. Override it with `VNC_RESOLUTION` in `containerEnv`.

## Access

* **Browser:** forward `webPort` (`6080`) and open it — noVNC serves a full VNC client as a web page, no extra software needed.
* **Native VNC client:** forward `vncPort` (`5901`) and point the client at `localhost:5901`.

With [[devpod]], both ports in `forwardPorts` reach `localhost` automatically — no manual tunnel required. Outside devpod (plain SSH-hosted container), forward them yourself as in the Cheatsheet below.

## Password

The VNC password defaults to `"vscode"` if `VNC_PASSWORD` isn't set in `containerEnv`. That's only safe when the desktop is never exposed directly — e.g. reachable solely through an [[ssh#Local Port Forward (-L)|SSH tunnel]] you open yourself, on a machine only you have access to. Set `VNC_PASSWORD` explicitly for anything more exposed.

## Cheatsheet

```bash
ssh -L 6080:localhost:6080 <user>@<remote-host>  # tunnel noVNC to the browser
ssh -L 5901:localhost:5901 <user>@<remote-host>  # tunnel to a native VNC client
```
