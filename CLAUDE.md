# Claude Code entrypoint

Read `.agent/context/PROJECT.md`, `CURRENT_STATE.md` and `HANDOFF.md` first. Use `.agent/README.md` to load only the relevant workflow, role and skill; do not import the entire directory at startup.

The main session orchestrates. Use available native subagents only when useful, with Claude Code permissions governing tools. Update shared state, handoff and significant history after material work.
