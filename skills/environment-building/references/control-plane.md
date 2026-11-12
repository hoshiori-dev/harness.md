# Control Plane

Read when classifying control-plane files,
when writing mount enforcement or the network allowlist,
when the user wants security rules unreadable by the agent,
or when a client has its own sandbox setting.

## Two phases

While the harness is being built,
a person is present and the agent edits configuration like any author.
The classification below applies once the harness is in daily use.

| Class | Typical files | Rule |
|---|---|---|
| Hard read-only | security rules, sandbox and container configuration, secret-scanning hooks, permission files | the agent never changes them; a person does |
| Soft read-only | linter rules, type-check configuration, test-framework configuration, build scripts | the agent may adjust them only under the rule the Gates layer states, or proposes the change for review |

The section lists every file of both classes by path.
The sentence that governs changing soft read-only files is written by the layer
that owns Gates; the environment knowledge file lists the soft files and points
to where that sentence lives.

## Enforcing hard read-only

Enforce when no person reviews each result or a wrong change reaches production,
customer data, or money.
Otherwise write "kept by convention" and name mount enforcement as the step
to take if the Context changes.

- Container: bind-mount each file read-only over the workspace copy
  (
  `source=${localWorkspaceFolder}/<path>,target=${containerWorkspaceFolder}/<path>,type=bind,readonly`
  in `mounts`). Root inside a container
  without `CAP_SYS_ADMIN` cannot remount it writable.
- VM or host: the files belong to another account
  and the agent's user cannot write them.

A read-only file mount makes any git operation that rewrites that file
(checkout, pull, rebase) fail with "Device or resource busy".
Changes to those files then go through a person outside the container,
which is the intent; the section says so.

## Network allowlist

Deny outbound traffic by default, then allow only the hosts the work needs:
the git host, the package registries in use, the model endpoints of each client,
and documentation hosts the user names. The section lists the hosts one by one.
In a dev container the usual mechanism is a firewall script
(iptables with an ipset of resolved addresses) run as root
at `postStartCommand`, with `runArgs` adding `--cap-add=NET_ADMIN`
and `--cap-add=NET_RAW`,
ending in a check that a blocked host is unreachable and an allowed one answers.

The agent's user must not keep unrestricted `sudo`:
root with `NET_ADMIN` can flush the rules.
Allow `sudo` for the firewall script only.

## Opaque security rules

When the user wants the rule logic unreadable by the agent,
the section adds one condition: every denial message is readable,
says it is a policy boundary and not a transient fault,
and names the alternative path or the person who decides.
Without that the agent cannot tell a refusal from a broken environment,
and it retries or looks for a way around. Opacity raises the cost of a bypass;
the floor is still the sandbox and the tokens.

## Client sandbox settings

A client's own sandbox (for example Codex `sandbox_mode`
and its network access setting) is an aid, not the boundary.
Set it consistently with the base and the network decision,
state the value and the file that holds it in the section,
and write it only into that file.
Permission lists belong to the layer that owns Authority.
