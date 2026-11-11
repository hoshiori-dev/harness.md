# Dev Container

Read when a dev container configuration exists or the session runs in a
container, and when writing one the section names as the base.

## Reading an existing one

Settle from the files, never by asking: `.devcontainer/devcontainer.json`
(or `.devcontainer.json`), any `dockerComposeFile` it names, and the
Dockerfile. Reach comes from:

- `mounts`, `workspaceMount`, and `runArgs` (`-v`, `--mount`,
  `--privileged`, `--cap-add`, `--network`);
- `forwardPorts` and compose `ports`, `network_mode`, `volumes`;
- `containerEnv` and `remoteEnv` (token variables, names only);
- features that add Docker access (`docker-outside-of-docker` mounts the
  host socket; `docker-in-docker` runs the container `--privileged`; both
  are host privilege);
- features and setup scripts that install command-line tools: these are the
  preinstalled tools of the tools decision;
- `remoteUser` and whether it has `sudo`.

Inside a running container, `/proc/self/mountinfo` shows what is actually
mounted, which differs from the file when the container predates an edit.
Report the difference.

An existing container is adopted as it is. Changes to it come only from
exposures the section cuts and enforcement the section states.

## Writing one the section names

Write the smallest configuration the section requires: an image or the
project's existing Dockerfile, a non-root `remoteUser`, the tools the
section lists, and no host credential mount. Shape:

```jsonc
{
  "name": "<project>",
  "image": "mcr.microsoft.com/devcontainers/base:<tag>",
  "features": {},
  "remoteUser": "vscode"
}
```

Pin the image tag and feature versions. Add read-only mounts and the
firewall only where the section states them. Anything the section does not
name (language toolchains beyond what the recipes need, editor extensions,
services) is contributor setup: list it as a suggestion and leave it.
