# Decisions

## 2026-09-19 — Roadmap is a first-class journey with versioned local progress

The personal roadmap has its own navigation destination after recommendations. It reuses the saved admissions response rather than making a second AI request, and it exposes the questionnaire facts that shaped the plan. Completion state is local to the exact profile and generated-plan version so changed answers never inherit stale progress. A valid task must name its profile evidence or missing datum, respect prerequisites and available time, and leave a measurable result; unsupported admission requirements remain verification tasks rather than facts.

## 2026-09-19 — Planner is local and acceptance rate is source-gated

Favorites, checklist progress, user notes and calendar dates are stored per profile in localStorage; they do not imply account sync, background push notifications or cross-device persistence. A reminder is shown inside the product for the nearest incomplete dated task. Acceptance rate is displayed only when grounded retrieval provides an official URL and explicit scope (`program` or `university`); otherwise it is “not published/found”. This statistic remains separate from the low-confidence personalized admission estimate.

## 2026-09-19 — Activities are tailored per proposed university

Do not present one generic extracurricular list as suitable for every application. Each proposed university receives 2–3 actions tied to its program and the applicant's interests, current experience and available time. Each action explains the signal it can demonstrate, a feasible 30-day start and honest evidence to retain. These are strategy suggestions, not official university requirements unless an official source explicitly supports that claim. The global roadmap targets the accepted preferred university or otherwise the best-fit recommendation.

## 2026-09-18 — Preferred university is evaluated, not endorsed

The user's preferred university is optional and is treated as an admissions hypothesis. It may enter the six recommendations only when its bachelor level and geography fit the questionnaire; the desire itself must not increase fit or admission-chance estimates. The roadmap uses five explicit stages with measurable checkpoints so progress can be reviewed before moving forward. The timeline continues beyond submission to status requests, financing and final choice.

## 2026-09-19 — Admissions Atlas visual language

Use Inspo archive recommendation `split-studio` as composition guidance, not as a template. Keep Hail Mary’s existing Liter font, map, cardless admissions workspace and evidence-aware copy. Add warm paper `#F7F3EA`, ink `#1F2420`, terracotta `#D6552E`, beige rules and sage geography surfaces. Use typography, thin rules and a three-part hero ledger as the differentiator; avoid card mosaics, gradients and heavy shadows.

## 2026-09-18 — Campus images require entity provenance

Do not ask the language model to invent or guess a campus-photo URL. Resolve the university name to an exact Wikidata entity, use its P18 structured image claim, and display Wikimedia Commons author, license and source metadata. If resolution or metadata validation fails, show no image. This reduces false campus attribution but does not implement the hackathon case's complete photo verification and deduplication pipeline.


## 2026-09-18 — Local history storage and response sensitivity

Cookies cannot reliably hold a full AI answer and would send its contents with site requests. Store only up to five opaque IDs and timestamps in a SameSite=Lax cookie; keep the complete plans in browser localStorage and clear both on profile reset. This is same-browser history, not account sync. Hash the entire validated admissions profile for the Worker cache so all meaningful edits miss the previous plan. Do not force a different university list for an irrelevant edit; require explanation tied to changed facts instead.


## 2026-09-18 — Optional detailed applicant context

Detailed grades, exam status and extracurricular history are optional so applicants can honestly leave unknowns blank. User corrections are stored with the local profile and sent without name/surname to the Worker; they are data, not instructions to override output or source rules. Every saved correction invalidates the previous local recommendation plan. Current-source claims remain disallowed in model-only mode.


## 2026-09-18 — Source claims in model-only mode

Without online retrieval, Gemini output cannot be treated as verified evidence. The API clears generated source URLs and unknown financial/deadline facts in model-only mode; the frontend also applies this rule when reading legacy production responses. University links remain explicitly labelled as unverified addresses. The product must show uncertainty instead of inventing citations or presenting estimated admission percentages as statistical probabilities. A paid grounding mode or independent official-source ingestion is needed before claiming fully verified current admissions facts.

## 2026-09-18 — Chance estimates and factual provenance

The user requested a percentage for each university. It is displayed only as an illustrative, non-calibrated assessment based on known questionnaire fields, separate from `fit_score`. Because the form does not capture precise grades, exam scores or documents, the API forces low confidence. University deadlines and factual roadmap requirements have individual source fields; absent URLs trigger an explicit verification notice rather than an implied source. Model-only output must never be described as web-verified. The admissions profile redesign does not imply completion of the separate LOCUS CASE 01 visual-campus requirements.

## 2026-09-17 — Shared provider-neutral layout

The future project uses one `.agent/` directory for roles, skills, tool policy, workflow and durable context. Root Claude, Codex and Gemini files only bootstrap into it. This prevents copies of the same instructions from drifting across models.

The main session orchestrates. Subagents are optional and selected by task complexity. Actual tools, sandboxing and permissions remain native to each client.

## 2026-09-17 — Phase 1: Minimalist Frontend Architecture & Grounded Diagnostic Rule Engine

1. **Frontend-First Scope**: Per user requirement, Phase 1 delivers a clean, responsive UI covering Landing, 8-step Profile Questionnaire, and Grounded Diagnosis (deferring universities catalog, comparison matrix, roadmap, and AI assistant backend to subsequent iterations).
2. **Deterministic Diagnostic Engine**: Strengths and Gaps must NEVER be hallucinated or generated by an ungrounded LLM. The diagnostic engine maps specific facts (GPA threshold, IELTS/TOEFL status, olympiads, extracurricular count, budget constraints) directly to admissions criteria.
3. **Clean Design Philosophy**: Strict adherence to professional minimalism — no glowing purple cards, no random sparkle AI icons, no cluttered dashboards. Clean typography, subtle borders, high information density with collapsible explainability modals.
4. **State Persistence**: A validated, versioned `localStorage` profile preserves the completed questionnaire across reloads.

## 2026-09-17 — Short applicant questionnaire

The applicant flow uses four focused steps and collects only the data currently needed for the first recommendation pass. Categorical answers are used for class, performance, timeline, Foundation, budget, scholarships, financial aid and permission to work; free text is limited to identity, interests, main subject and custom countries.

The stored profile contains only answers collected by the current four-step questionnaire. Derived exact grades, exam results and other unasked fields are excluded so the result cannot present them as user evidence.

## 2026-09-18 — Remove demo and retire the old profile schema

The public product has one entry path: the user completes the questionnaire. Demo presets and their UI controls are removed.

The profile schema is versioned as `hail_mary_profile_v2` and contains only fields collected by the current form. Known old storage keys are deleted during initialization so a previously saved preset cannot reopen.

## 2026-09-18 — Grounded recommendations behind a server API

The browser never receives the Gemini key. GitHub Pages calls a Cloudflare Worker that validates a minimized profile without the applicant's name, invokes Gemini 3.6 Flash with a strict JSON schema, validates the response and caches it for six hours. The Worker falls back to stable Flash Lite models when the primary model is overloaded.

Google Search grounding is controlled by `ENABLE_GOOGLE_SEARCH`. It remains disabled while the Gemini project is on the free tier because the provider does not expose Search grounding there. Model-only results carry an explicit warning to verify costs, deadlines and requirements on official sites.

Recommendations provide six options across ambitious, balanced and more realistic categories. The score means fit with known questionnaire facts and never represents admission probability. Current costs, deadlines and rules remain linked to official sources for user verification.
