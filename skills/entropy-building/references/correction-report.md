# Correction Report

Read when writing what an agent does on finding drift,
when naming the drift label, or when the project has no issue tracker.

An agent that finds harness content contradicting the code
must leave a trace the next agent sees;
a remark in the conversation vanishes with the session.
The rule names three dispositions and the criterion for each:

| Disposition | Chosen when | Trace |
|---|---|---|
| Fix in the same change | the deviation is small and the correct state is certain | the commit message says what was corrected |
| Pending decisions list | the intended state is unclear, or the fix exceeds the task's authority | an item in the format the Authority section defines |
| Tracked issue | the deviation is large and not handled in this task | an issue with the one drift label |

The rule says in so many words that a conversation-only report does not count.
A project of one person with no release
in sight gets only the one drift sentence instead of the three dispositions.

## The drift label

1. Read the label namespaces the project already has (labels on the remote,
   a labels file, the platform knowledge file, the Authority section).
2. With a `type:` namespace, the default is `type:harness-drift`;
   with another namespace, a name inside it.
   With none, `type:harness-drift`,
   and the new namespace goes to the pending decisions list for the layer
   that owns Authority.
3. Write the name into the section as a default the user
   can change at the approval, then into the rule and the reclamation routine.
4. Do not create the label:
   report it as a remote item for the layer that owns Authority or for the user.

While the label is undecided, land everything else,
write the third disposition as "open an issue" with no label,
and add the label to the pending decisions list with options
(`type:harness-drift`, a name in an existing namespace,
the drift file below) and the recommendation.
Never invent a name the section does not carry.

## No issue tracker

When the project has no tracker and the user does not want one,
the third disposition becomes an entry in a tracked file, `.agents/drift.md`,
and the reclamation routine reads and empties it.
Give the reason in the section: the entry versions with the code,
so the next run and every agent see it,
while a list kept outside the repository is seen by no one.
Each entry carries the date, the file and line, the contradiction, the evidence,
and the suggested fix.
Create the file with a one-line header so the entrypoint's pointer resolves.
