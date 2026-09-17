# Shared agent system

This directory is the provider-neutral source of truth for future coding projects. No product, stack or commands have been chosen yet.

## Start

1. Read [PROJECT](context/PROJECT.md), [CURRENT_STATE](context/CURRENT_STATE.md) and [HANDOFF](context/HANDOFF.md).
2. Inspect only the files relevant to the user's task. Read [WORKFLOW](workflow/WORKFLOW.md) to choose the smallest useful route.
3. Load the assigned [agent role](agents/) and only the [skill](skills/) needed for that work. Follow [tool policy](tools/TOOLS.md).
4. Check the result, update current state and handoff, and append a significant change to [CHANGES](context/CHANGES.md). Record durable design choices in [DECISIONS](context/DECISIONS.md).

The main client session is the orchestrator. Role files describe responsibilities, not executable agents. Native Claude Code, Codex and Gemini features decide whether a subagent can actually run and what tools it can use. Do not claim Markdown grants permissions, runs checks or preserves state automatically.

## Directory map

- `agents/`: orchestrator and bounded Scout, Builder, Verifier, Auditor roles.
- `skills/`: reusable, selectively loaded engineering procedures.
- `tools/TOOLS.md`: capability and permission policy; actual tools come from the client.
- `workflow/WORKFLOW.md`: task classification, delegation and completion.
- `context/`: project facts, current state, decisions, change history and handoff.

Keep the three provider entrypoints short. Share decisions and state here instead of copying them into each entrypoint or every agent prompt.
