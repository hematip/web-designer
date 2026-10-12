# Review and release

Use this for scoped revisions, restoring earlier work, visual QA, and deployment. Scale checks to the change and the project's existing requirements; do not add a ceremonial approval process.

In the [AI production workflow](workflow.md), these checks are part of constructing and delivering the artifact. They do not create a separate user-testing, analytics, business outcome measurement, or post-launch optimization phase. Keep required project software checks and visual/playback inspection. Client acceptance means feedback from the requesting user; it is distinct from studies with end users and is not an automatic approval checkpoint.

## Protect a baseline

Before a meaningful change, identify a recoverable state using the workspace's version-control or snapshot convention. Record what is actually accepted and what remains an experiment. Protect unrelated edits; avoid broad resets or overwriting a sibling version.

For a restoration request, locate evidence of the requested historical state. If the exact baseline is unavailable, identify the closest evidenced state and disclose what would need reconstruction. Never describe an approximate rebuild as an exact restoration.

A compact ledger is enough:

| State | Purpose |
| --- | --- |
| Current source authority | Which documents and copy are authoritative now |
| Accepted baseline | Commit, snapshot, or exact file set used for comparison |
| Active request | Requested delta and affected region |
| Protected decisions | Accepted imagery, motion, proportions, or layout outside the delta |
| Superseded decisions | Older instructions no longer active, with the replacing instruction |
| Verification | What was checked and the actual result |
| Release | Local/preview/production state and verified destination |

Do not put credentials or private account data in portable handoffs. Store source provenance appropriate to the working project, and export only information the user intends to share.

## Diagnose screenshot feedback

1. Locate the actual page, section, viewport, and motion state. A screenshot can show a transition rather than the settled design.
2. Compare visible content bounds: image file padding, actual product silhouette, text block height, frame edge, and neighboring section boundaries.
3. Identify the responsible property or system: layout, clip, stacking, asset alpha, scale, pin spacing, or stale scroll measurements.
4. Make the smallest coherent correction, preserving accepted behavior.
5. Reproduce the state in the browser and compare it with the supplied feedback.

An annotated gray rectangle may indicate containment, not a demand for a permanent thick gray border. Resolve from the user's words and later corrections. Do not turn an annotation into an unrelated style decision.

## Verification matrix

For a new landing page, cover the complete visitor journey. For a small edit, cover the affected region, its entry/exit, and any shared style or scroll logic changed.

| Area | Evidence to inspect |
| --- | --- |
| Build and delivery | Required project checks pass; no missing core assets or blocking runtime errors |
| Content completeness | Delivered page matches the decision-question map; required answers, useful sections and appropriate support/policy access are present; no study passed off as a full page |
| Brand/UX brief alignment | Current source-backed requirements and audience priorities are reflected in the output; voice and proposition remain coherent; major visual/motion choices express the intended narrative. Findings and creative interpretations remain distinct; consult the [analysis brief](brand-document-synthesis.md). |
| Text choreography, when used | Exact copy and Persian shaping survive; semantic text and focus remain available; font/width changes, scroll interruption, cleanup and reduced motion work; inspect intermediate and settled typography using [text motion](text-motion.md). |
| Copy and claims | Section messages are distinct and clear; facts/conditions have sources; protected wording stays exact; no draft placeholders or invented proof |
| Public-content boundary | Inspect actual captions, badges, helper text, tooltips, accessible names, and content metadata for leaked production/source notes. Captions have a visitor purpose; required credits/clarifications remain. Correct the shared content mapping, not only CSS visibility; follow [copy rules](ux-copywriting.md#public-content-and-internal-production-notes). |
| Typography | Chosen fonts/weights actually render; hierarchy and semantics agree; Persian/mixed text is intact; mobile wraps, 200% text enlargement, applicable spacing overrides and font fallback retain content |
| Action language | Labels, hints and observed pending/error/success states match actual behavior and commitment |
| Hero | First-load meaning/action, chosen type/media hierarchy and composition; legible header in its actual context, with image/overlay/appearance checks only where those treatments exist |
| Creative differentiation | Selected premise, hero structure, type/media relationship, signature mechanism and page rhythm reflect this brief; no unjustified reuse of an opening-image-frame template. Apply [design diversity](design-diversity.md), preserving explicit approved reuse. |
| Animated scenes | Entry, midpoint, reading hold, settled state, exit, reverse scroll |
| Motion for React, when used | Correct package/imports and initial rendering; layout/presence interruptions, focus, reduced-motion adaptation, teardown/remount, and single transform ownership; follow [Motion checks](framer-motion-integration.md#embedded-construction-checks) |
| Three.js, when used | Asset/model delivery, actual camera/material composition, mobile sizing and rendering cost, loading/failure/reduced-motion behavior, page controls and scroll coexistence, and cleanup/remount; follow [3D construction checks](threejs-integration.md#cleanup-and-embedded-construction-checks) |
| Product fidelity | Original proportions, correct variant, opaque body, no label alteration, intended scale |
| Graphic containment | Pattern fits approved region, touches intended edge, no accidental fade or crop |
| Layout and spacing | Shared container edges, meaningful within/between-group gaps, coherent insets, responsive column fit, perceived copy/art alignment, no doubled gaps or accidental overflow |
| Hierarchy | Intended focal message and action remain dominant; supporting copy is readable; mobile/RTL reading order stays meaningful |
| Icons and materials | Actual coherent icon family, correct meaning/labels/targets, optical alignment; surface/radius/shadow roles and contrast hold across backgrounds and states |
| Reused components | Actual source and version/file are recorded; imports work; theming preserves semantics, focus/keyboard behavior, and relevant states |
| Navigation | Real routes/current state, logo destination, section anchors/direct hash entry, Back, footer routes, keyboard/touch and relevant diagonal submenu travel; use [navigation](navigation.md) |
| Interactive states | Menu, details/dialogs, video controls, keyboard focus, close/return behavior |
| Responsive | A representative desktop, a constrained desktop near a breakpoint, and mobile; resize during a relevant scene |
| Motion preference | Reduced-motion view remains complete, readable, and navigable |
| Media | Correct crop at relevant widths, readable overlay across frames, autoplay fallback |

Use screenshots and actual interaction as evidence. DOM geometry is helpful for measurement but does not establish aesthetic quality. A successful build says nothing about ghost text halfway through a scroll transition.

For new visual systems or relevant corrections, apply the [foundation quality gate](layout-and-visual-foundations.md#foundation-quality-gate) within this pass. Record the affected region, viewport/state, observed defect, responsible shared rule, and corrected result. Check actual rendered text and icon bounds after assets/fonts settle; a computed padding or valid token alone does not establish visual balance. Fix a shared container/token/variant when that is the cause, preserving intentional asymmetry and motion geometry.

For low-impact spacing or color edits, visual inspection is usually more useful than adding tests that mirror CSS declarations. Add or run meaningful tests for fragile behavior such as route handling, focus return, navigation, and state changes when warranted. Run existing required checks.

Use [interface foundations](prototype-foundations.md) to route applicable checks inside construction: accessibility semantics/focus, semantic color pairs and requested themes, scoped interaction/status transitions with truthful outcomes, disclosure/return behavior, responsive composition and functional motion. For asynchronous behavior inspect a real failure/recovery path where supported; for a demo record its simulation limits. Inactive or unrequested features do not need invented states. These checks do not add research, analytics or business measurement.

## Three independent verdicts

- **Functional pass:** the site works in the states actually tested.
- **Visual pass:** inspection supports the requested composition and motion treatment.
- **User acceptance:** the user explicitly accepts that direction or part of it.

Never merge these into “approved.” In the original collaboration, a pattern revision passed technical checks but was still rejected aesthetically. A rollback request remains valid after a test pass.

For complete pages and substantial content redesigns, record the [content-completeness gate](landing-architecture.md#content-completeness-gate) and [copy-quality gate](ux-copywriting.md#copy-quality-gate) as separate additional assessments. Content gaps or misleading actions remain failures even when the motion and build pass. Scope checks to the requested delta for small edits. Copy-only delivery cannot establish responsive appearance, submission success, or conversion uplift.

For new builds or cinematic redesigns, the visual verdict includes the [cinematic craft gate](cinematic-direction.md#creative-gate--separate-from-functional-pass): a visible brand-specific transformation, coordinated pacing, clean transitions, and intentional mobile/static counterparts. Record a creative shortfall even if all functional checks pass. A static editorial template plus subtle zoom does not become a cinematic pass because Lenis initialized correctly. Inspect playback and before/midpoint/resolved frames; distinguish agent assessment from the user's acceptance.

In authorized build/fix work, correct observed defects and recheck affected states. In review-only work, report findings and proposed corrections without implementing them. Once relevant checks pass, do not repeat broad testing without a new change or unresolved concern. State any real coverage limit concisely.

For material UX/UI work, apply the relevant checks in [UX/UI design](ux-ui-design.md): offer and action clarity, discoverable decision information, contrast and focus, reflow, RTL where applicable, and measured performance when in scope. These checks are not a full accessibility certification or representative user study.

For new builds or material typography work, record the [typography quality gate](typography-system.md#typography-quality-gate), including font availability versus actual rendering and any untested states. Text measurements can change after fonts load, language changes or zoom; recheck affected cinematic clips and scroll geometry. A proposed font selection is not a browser-verified implementation.

For an important animated region, retain a midpoint and settled screenshot or another appropriate visual record, plus viewport/state, observation, and verdict. Check painted labels and focus indicators at clipping boundaries, not only their DOM boxes. Mark visual status unverified when the necessary observation was not possible. A small edit needs only evidence for its affected states.

## Search and media delivery within construction

For new public marketing sites or relevant page/route changes, inspect the actual output: meaningful titles and descriptions, semantic headings, crawlable destination links, useful image alternatives, intended canonical URLs and indexing settings, sitemap destinations where applicable, and real route/redirect/404 behavior. Preserve established URLs unless a change is authorized. Production metadata must use the real deployment origin; do not silently canonicalize to localhost, a placeholder or an unrelated domain. Preview visibility follows the project's existing policy. [F15, F21]

Keep substantive content available across responsive layouts and outside animation-only/canvas representations. Do not require pointer activity or scrolling to fetch the only copy of primary content. Heading semantics serve navigation and comprehension; an arbitrary H1 count is not a proven ranking formula. Structured data, when applicable, describes actual supported public content without invented ratings or guarantees. Metadata readiness cannot guarantee indexing, rankings or conversion. [F18, F21]

Choose image format, dimensions and compression against the actual asset. Reserve layout space and defer appropriate offscreen media, but do not lazy-load the likely LCP image. Make that asset discoverable early; use priority hints selectively rather than preloading every image. Heavy video embeds and vector effects need inspection too. Reused components do not automatically guarantee browser cache savings; verify actual delivery. [F13, F22]

Use available build/render/network checks to report observed defects and limits. These are implementation responsibilities, not analytics, Search Console setup, field-data monitoring or a business outcome-measurement phase. A narrow style fix does not require a full SEO audit. Source IDs resolve in [the research record](research-sources.md#framer-guides-and-production-adaptation).

## Publish the right version

1. Confirm publishing authorization from the current task and applicable prior instructions. A local edit request alone does not necessarily authorize publishing it.
2. Resolve the intended project and production or preview target from the current request and local configuration. New versions need a deliberate separate destination unless replacement is requested.
3. Build the exact current version and inspect deployment configuration. Exclude secrets, irrelevant source archives, internal production/asset ledgers, and unneeded private documents. Inspect the rendered affected content for accidental process captions or debug/draft labels; a build pass cannot establish public-copy readiness. Preserve genuinely required notices and qualifications.
4. Use the available authenticated provider tool or CLI. Respect actual host permissions; this skill cannot bypass them.
5. Wait for a successful, ready deployment state. If it fails, inspect the actual failure and fix within scope. If user authentication is required, identify that concrete step.
6. Open the public destination and confirm the expected version, main interactions, and key assets. An HTTP 200 by itself can be a stale page or a fallback document.
7. Return the stable visitor-facing URL and accurately state what was verified. Update the handoff with the release state.

Do not claim completion based on a command being submitted, a build passing locally, or a deployment URL being printed before readiness. Never send the link to a customer or another person without authorization to message them.

## Suggested final report

Use the user's language. Lead with the result, then a short statement of relevant checks and the usable link or files. Include material limitations only when they exist. Avoid dumping implementation logs or implying the user approved a design they have not reviewed.
