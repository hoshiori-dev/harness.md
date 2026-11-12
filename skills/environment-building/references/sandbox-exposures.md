# Sandbox Exposures

Read when step 1 found a credential, a privileged interface, host networking,
or log collection, or when deciding whether an exposure is cut or kept.

Each exposure ends in the section in one of two states:
**cut** (with the change that removes it) or **kept** (with the owner's reason).
The default is cut. In extract mode,
and for anything the user has not been shown,
the state is "no recorded decision", never kept.

## 1. Sensitive assets

What the agent and the scripts it runs can read or write:
credential mounts (`~/.ssh`, `~/.aws`, `~/.config/gh`, `~/.kube`,
`~/.docker/config.json`), token variables (names only),
`.env` files in the workspace,
and each token's scopes (`gh auth status` lists them).
On a host base, everything the user's account can read is in range.

Default: cut every host credential mount;
give the agent one token per outside system with the least scope the work needs.
For a token that can push to the default branch,
write the scoped-token default here and hand "push needs authorisation
in advance" to the layer that owns Authority,
which also owns default-branch protection on the hosting platform.

## 2. Host privilege

High-privilege host interfaces inside the sandbox:
the Docker socket (`/var/run/docker.sock` mounted,
or `docker` reaching the host daemon), a host root or home mount,
`--privileged`, added capabilities, the host PID or network namespace.
A mounted Docker socket is host root.

Default: cut. When the project builds images,
replace the socket with rootless Docker or a remote or VM-hosted builder.
Docker-in-Docker is no replacement:
it needs `--privileged`, so it is recorded as the same exposure.

## 3. Local and intranet reach

Whether host services (`localhost` databases,
admin consoles) or the company network are reachable
through the container's network: host networking, `host.docker.internal`,
forwarded ports, a VPN on the host.

Default: cut host networking. Where the network decision is deny by default,
the allowlist covers this exposure.

## 4. Session logs

Where each client writes its session logs
(for example `~/.claude/projects/` for Claude Code and `~/.codex/sessions/`
for Codex), and whether anyone collects them.
Logs carry every file the agent read and every command's output,
so they leak credentials and personal data more easily than any file
in the repository.

Default: logs stay where the client writes them.
Central collection is never a default:
the section records it only as the owner's explicit decision naming the store,
who reads it, the retention, and the redaction.

## 5. The owner's risk decision

The project owner weighs what automation gains
against the damage each kept exposure allows.
Approving the Environment section is that decision,
so the section has to list every kept exposure in plain words with its reason.
An exposure discovered after approval goes back to the owner
as a pending decision; it is never added to the kept list by an agent.

## When the user will not decide

Write each undecided exposure into the section as "undecided,
treated as cut until decided" and add it to the pending decisions list
with the default as the recommendation. Continue with every other decision.
