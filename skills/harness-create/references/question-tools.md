# Question tools by client

Read when unsure which tool asks the user in this client.
Use the tool only when it is listed among the tools available in this turn;
otherwise ask the round's questions in one numbered message,
each with its recommended answer.
Facts below were checked on 2026-11-20 against Claude Code 2.1.322,
Codex CLI 0.167.1, and Antigravity CLI 1.5.5.

| Client | Tool | What one call can ask | Where it is unavailable |
|---|---|---|---|
| Claude Code | `AskUserQuestion` | 1 to 4 questions, 2 to 4 options each, single or multiple choice; the user can always type an answer of their own | subagents; sessions that cannot prompt the user |
| Codex | `request_user_input` | 1 to 3 questions, 2 to 3 options each, single choice only; the client adds a free-text choice | outside plan mode unless the user enabled it for the default mode; `codex exec`; subagents |
| Antigravity | `ask_question` | one or more questions, at least 2 options each, optional multiple choice; the client adds a write-in, so add no "Other" option | headless runs, where the agent has to settle the choice itself |

Rules for every client:

- Put a round's questions in as few calls as the limits allow,
  in the order of the decision tree.
- Put the recommended option first and say in its text that it is recommended;
  give the reason in the option's description.
- A question must be understandable on its own:
  the user may see only the question, not the message before it.
- A decision with more options than the tool allows is asked with the
  strongest options listed, and the user's own answer covers the rest.
- A multiple-choice decision in a client without multiple choice
  is asked as one question per independent choice.
- In a run that cannot ask at all, decide nothing that was the user's:
  list those decisions as open in the plan and stop before writing.
