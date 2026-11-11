# Threat Model

Read when rating the three facts of decision 2, when a content source is
neither trusted nor open-write, or when the user argues that a strong model
replaces isolation.

## The three facts

- **Reach, input, and outward action together** describe what a successful
  prompt injection can touch and send. An agent missing any one of the
  three loses nothing material to an injection: one with no credentials
  that cannot write outside the repository may read anything. Almost every
  networked coding agent has all three (credentials, file writes, outside
  reads), so this fact only says an exposure exists; the next two grade it.
- **Source reachability** is what it costs an attacker to place content
  where the agent reads it. Trusted repository: unreachable.
  Reputation-guarded (official documentation, a major package's registry
  page, a well-known project's README): the attacker has to compromise that
  site first. Open-write (the project's issues and request comments, search
  results, arbitrary pages, an obscure dependency's README): anyone, at no
  cost. Issues and tickets also arrive as task instructions, so a malicious
  "next step" reads like a normal request.
- **A person reviews each result** means a person issues the task and every
  irreversible outward action (push, comment, release) either was
  authorised in advance or waits for that person. One review of a few
  concentrated results is the gate; approving each command is not. An
  unattended agent has no gate.

Record each fact with its evidence: the configuration line, the token
scope, or the user's answer.

## All three against the project

The agent reaches sensitive assets, reads an open-write source, and no
person reviews each result: the default is a separate restricted instance
that removes one of the three.

- Its own container or VM, not the developer's environment.
- None of the sensitive credentials; a token scoped to what the task needs
  (for issue triage: read the repository, write comments and labels).
- No write to the default branch and no change to configuration; results
  land as a branch or a draft request a person reviews.

Write it into the section as the default with this reason. A user who
changes it keeps the ordinary environment as their recorded decision, with
their reason, and the section still says which three facts hold.

## In between

Reputation-guarded sources, or open-write sources with a person reviewing
each result, are in between. Only there does each model's resistance to
injection decide how far to restrict sources or clean input:

- a model the user confirms as strongly resistant may read search results
  with no extra restriction;
- a weak model, or a small model used as a retrieval sub-agent, gets
  tighter limits at the network layer or at tool input (only allowlisted
  documentation hosts, or fetched pages reduced to text before the main
  agent reads them).

Take resistance per model named in the Context (the exact model the
environment runs, and each sub-agent model), never per vendor. When the
model is unknown, write the stricter setting as the default and list the
question as one no default can answer. Sources limited to the trusted
repository need no restriction.

## When the user argues a strong model replaces isolation

Keep the restricted instance as the default and say why once: resistance
lowers the chance of a hijack; isolation lowers the loss after one. An
agent that runs code can bypass every client-side defence once hijacked, so
the two are not substitutes. If the user still removes the instance, record
it as their decision with their reason.
