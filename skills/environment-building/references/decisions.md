# Environment Decisions

Read when running step 2 (decide mode) or auditing without an anchor document:
this file holds the layer's thickness table and all ten decisions.

## Thickness

Recommend one thickness, with the conditions that selected it:

| Thickness | The layer then is |
|---|---|
| omitted | nothing built: the agent runs where the session already runs, with what it already holds |
| light | the host or the existing environment as it is; each token and its scopes named in one sentence; the non-interactive variables exported by the task runner |
| medium | a dev container, the same file for people and agents; an environment knowledge file; hard read-only files kept by convention; the network open |
| thick | a restricted container or VM; a deny-by-default network; hard read-only files on read-only mounts; a token that cannot write to the default branch |

Thicker: nobody reviews each result;
a wrong change reaches production, customer data, or money;
the agent reads content anyone can write (issues, arbitrary pages);
it holds credentials or mistakes are costly to undo.
Thinner: a person reviews every result; the project is short-lived;
nothing sensitive is in reach;
the session already runs in an isolated environment that can be adopted.
Recommend thick when the environment is strict;
medium when a person reviews each result but the agent holds credentials
or mistakes are costly to undo, or a container is already in use;
light for a short-lived project with nothing sensitive in reach;
omitted only when, in addition, step 1 found no exposure.

## The ten decisions

Return all ten at every thickness.
One the thickness removes is returned settled as "not built",
except an exposure step 1 observed, which is always returned.

1. **Base** (depends on 2).
   An isolated environment the session already uses
   is adopted as it is; propose no replacement. Otherwise:
   strict → a dev container with decisions 5 and 8 enforced,
   because only the environment stops an agent that runs code (alternatives:
   a VM, a cloud workspace).
   A person reviews each result but the agent holds credentials or mistakes
   are costly to undo → a dev container relied on by convention,
   the same file for people and agents.
   A short-lived project with nothing sensitive in reach → the host
   with scoped tokens, each token and its scopes named.
2. **Threat rating.** Rate three facts with evidence:
   the agent reaches sensitive assets, reads content it does not control,
   and can act outward; the least trusted source it reads (trusted repository,
   reputation-guarded, open-write such as issues or arbitrary pages);
   whether a person reviews each result.
   All three against it (assets, an open-write source,
   no person) → recommend a separate restricted instance:
   its own container or VM, none of the sensitive credentials,
   no write to the default branch, results landing as a branch or draft request.
   Read [threat-model.md](threat-model.md) when rating the facts,
   when a source is neither trusted nor open-write,
   or when the user argues a strong model replaces isolation.
3. **Credentials** (depends on 1, 2). No host credential mount;
   one token per outside system with the least scope the work needs;
   on a host base, name what the user's account exposes.
4. **Host privilege** (depends on 1).
   None: no Docker socket, no `--privileged`, no host home mount.
   A project that builds images gets rootless Docker or a remote builder.
5. **Network** (depends on 1, 2). Open when a person reviews each result.
   Strict → deny by default and allow the git host,
   the package registries in use, each client's model endpoints,
   and documentation hosts the user names. Never host networking.
6. **Session logs.** They stay where each client writes them.
   Central collection is a privacy decision the owner takes explicitly (store,
   readers, retention, redaction); never recommend it.
7. **Tools** (depends on 1, 3).
   Every project command goes through the task runner.
   The hosting platform's CLI is preinstalled when the project is hosted,
   with its own token scoped to the repository;
   state what that token can and cannot change.
   No MCP server: recommend one only for a capability no command-line program
   in the environment gives,
   because every registered tool costs context on every task and widens reach.
   Name what is deliberately absent (deploy and cloud CLIs, publish credentials,
   production database clients) so an agent that misses one does not install it.
   Read [tools.md](tools.md) when the project registers or needs any tool
   beyond the task runner and the platform CLI,
   or when writing the tools decision.
8. **Control plane** (depends on 1, 2).
   Hard read-only (an agent never changes them):
   security rules, sandbox and container configuration, secret-scanning hooks,
   permission files. Soft read-only
   (changed only under the rule the Gates layer states):
   linter, type-check, test, and build configuration.
   Strict → enforce hard read-only by read-only mounts;
   otherwise by convention, saying so and naming mount enforcement
   as the step to take if agents become unattended.
   Read [control-plane.md](control-plane.md) when classifying files,
   when writing mount enforcement or the network allowlist,
   or when a client has its own sandbox setting.
9. **Non-interactive defaults.** The task runner exports `CI=true`, `PAGER=cat`,
   `GIT_PAGER=cat`, `GIT_TERMINAL_PROMPT=0`,
   and any variable the project's own tools read;
   name every command that still needs a run-once flag.
10. **Client sandbox settings** (depends on 1, 5).
    Each client's own sandbox is set consistently
    with decisions 1 and 5 and described as an aid, never as the boundary.

Read [sandbox-exposures.md](sandbox-exposures.md) when step 1 found a credential,
a privileged interface, host networking, or log collection,
or when deciding whether an exposure is cut or kept.
