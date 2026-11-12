# Shared Blocks

Read when editing a paragraph wrapped in `<!-- shared:<id> -->` …
`<!-- /shared:<id> -->` in any `skills/*/SKILL.md`, or when adding such a
block. This file is the single source of truth for every shared block; a
skill's copy must equal the canon here byte for byte (trailing whitespace
aside), and `just skills-check` fails on any divergence or on a canon id that
no skill uses. Edit the canon first, then paste it into every skill that uses
the id, in the same change.

Blocks exist because a plugin skill may not link outside its own directory:
repetition is the only way to carry one rule into several skills, and this
file makes the repetition checkable instead of silent drift.

## layer-modes

<!-- shared:layer-modes -->
This skill works in one of four modes, named by the workflow that hands over
or inferred from the request. **design**: return this layer's section of
`HARNESS.md` as prose; write nothing. **extract**: describe what the project
does today as this layer's section; write nothing. **build**: realise the
section in the project. **audit**: report where the project and the section
disagree; change nothing. A handover carries the project's Context, this
layer's section, and the parts of Invariants, Style, and File Structure
assigned to this layer; never ask again for what it carries. A build
handover that asks for the plan only stops after step 1 and returns the
files step 3 would create, change, or delete.
<!-- /shared:layer-modes -->

## design-is-the-source

<!-- shared:design-is-the-source -->
`HARNESS.md` in the project root is the design this work serves: design
intent comes from it, facts come from the code. Build what its sections say
and re-decide nothing they decide. Where a section is silent on a point the
work needs, apply the default this skill states and report it as an
assumption. When a fact in the code makes a sentence of the design
impossible to build, stop that item, report the conflict, and build the
rest.
<!-- /shared:design-is-the-source -->

## format-in-brief

<!-- shared:format-in-brief -->
**The format in brief.** A `HARNESS.md` is YAML frontmatter followed by a
Markdown body. Frontmatter: `name` and `description` are required;
`version`, `license`, and `metadata` are optional; any other top-level key
is an error. Body: free-form. It opens with one first-level heading, the title,
and an introduction with no heading of its own:
who the harness serves, what it is meant to achieve,
what it leaves unmanaged, and what always stays with a human.
The format requires no section. It recommends these second-level headings,
with exactly these English names and in this order: Context, Invariants,
Style, File Structure, Environment, Knowledge, Feedback, Gates, Authority,
Completion, Entropy, Open Questions, References.
A design of a complete harness usually covers Context and the five core
layers (Environment, Knowledge, Feedback, Gates, Authority);
a file that describes only part of a harness may leave out any of them.
The prose may
be in any language; the headings are never translated; other sections may
appear anywhere. For the full rules and the validator script, load the
skill that reads, writes, and validates `HARNESS.md`; without it, check
these rules by reading.
<!-- /shared:format-in-brief -->

## defaults-first

<!-- shared:defaults-first -->
Defaults first. Settle from the repository everything it can show (tools in
use, directories, commands, history). Ask the user, once and in one round,
only for context the repository cannot show. Then draft the complete design
with one stated default for every decision, each with its reason, and
present it for a single approval. Never interview decision by decision. A
default the user changes binds every later step; challenge a change once
when the evidence contradicts it.
<!-- /shared:defaults-first -->

## nothing-lands-before-agreement

<!-- shared:nothing-lands-before-agreement -->
Nothing lands before agreement. Create or change no file in the target
project until the user has approved the design that covers it; an inspection
step reads and reports, it never writes.
<!-- /shared:nothing-lands-before-agreement -->

## design-is-not-approval

<!-- shared:design-is-not-approval -->
An approved design authorises the files it describes and nothing else.
Publishing anything outside the repository, changing a remote setting,
deleting work, and widening what agents may do on their own are each a
separate, explicit decision by the user, taken when that step is reached.
<!-- /shared:design-is-not-approval -->

## pending-decisions

<!-- shared:pending-decisions -->
When a step is blocked on a decision only the user can make, continue with
every step that does not depend on it and add the blocked item to a pending
decisions list. Each item states: what is blocked and why; the options; the
recommended option and its reason; which finished work each option would
change. Present the list once, at the end or when nothing else can proceed,
never one question at a time.
<!-- /shared:pending-decisions -->

## management-code-ownership

<!-- shared:management-code-ownership -->
A script, hook, check, CI step, or task-runner recipe written into the target
project is the project's own management code: written for its role in the
language the project agreed to, readable first, failing with a message that
names what to fix, with no fallback that hides an unexpected error, and never
calling a script inside a skill directory. Tell the user that later fixes to
this plugin do not reach the delivered copy.
<!-- /shared:management-code-ownership -->

## deposited-files-stand-alone

<!-- shared:deposited-files-stand-alone -->
Deposited files stand alone. Nothing written into the target project names
this plugin, any of its skills or agents, or a path inside a skill
directory, and no term only this plugin defines is used there without being
defined. `HARNESS.md` and its section names may be named: the file is the
project's own.
<!-- /shared:deposited-files-stand-alone -->
