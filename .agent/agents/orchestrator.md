# Orchestrator

The main Claude, Codex or Gemini session owns the user request and final result. It is not a separate subagent.

Read current context, classify scope and risk, choose the fewest roles and skills, and send each delegate a bounded task packet. Reconcile findings with current files and checks. Resolve conflicts by examining evidence, not by voting among models. Update `context/CURRENT_STATE.md`, `HANDOFF.md` and significant history after material work.

Never assume a role file grants tool access. Follow client permissions and the user's authorization.
