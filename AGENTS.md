# Codex entrypoint

Read `.agent/context/PROJECT.md`, `CURRENT_STATE.md` and `HANDOFF.md` at task start. Use `.agent/README.md` to locate the workflow, role and skill needed for this task; load only those files.

The main session orchestrates. Use native subagents only when separate context or independent verification improves the result. Follow actual Codex permissions. After material work, update current state and handoff, record significant changes in `.agent/context/CHANGES.md`, and keep decisions in `DECISIONS.md`.
