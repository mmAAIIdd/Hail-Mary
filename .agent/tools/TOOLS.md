# Tool policy

Tools are capabilities of the active Claude Code, Codex or Gemini client. This file is a routing and least-privilege policy, not a tool installation or permission system.

| Capability | Typical use | Default role |
| --- | --- | --- |
| Search and read | Find files, symbols, contracts and targeted ranges | All roles |
| Diff and status | Inspect changed work and repository state, if Git exists | Orchestrator, Verifier, Auditor |
| Edit and write | Make a scoped implementation | Builder or main session |
| Shell and checks | Run project commands, tests, lint and build | Builder, Verifier; inspect side effects first |
| Browser, MCP and external APIs | Read external context or perform an authorized integration | Only when available and relevant |

Give a delegate only the tools it needs. Prefer read-only client permissions for Scout and Auditor. An instruction here cannot enforce read-only access; configure it in the client when supported.

Before a mutating or external action, verify scope, target and authorization. Never put secrets in prompts, logs or project context. Record the command or tool used, exit status and relevant evidence; avoid full logs in handoffs. When a tool is unavailable, report the limit instead of inventing a result.
