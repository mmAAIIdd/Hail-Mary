# Workflow

1. Read current context and the user's request. Identify acceptance criteria, affected files, risk and unknowns.
2. Choose the smallest route:

| Task | Route |
| --- | --- |
| Trivial | Main session implements and runs focused checks |
| Standard | Builder, then independent Verifier when it adds confidence |
| Complex or unfamiliar | Scout, Builder, Verifier |
| High risk | Scout, Builder, Verifier, read-only Auditor |

The main session orchestrates every route. A role can be carried out by the main session when a separate subagent adds no value. Do not spawn multiple agents merely because roles exist.

Delegate with only `GOAL / ACCEPTANCE CRITERIA / RELEVANT FILES / CONSTRAINTS / NECESSARY PRIOR RESULT`. Ask for a concise evidence-based result, not a transcript. Use any capable available model; do not bind roles to providers or hardcode model IDs.

If review finds a blocker, make one focused correction and recheck. Stop after at most two review/fix cycles and report an unresolved issue. Complete only after relevant validation and an accurate handoff.
