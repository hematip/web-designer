# Resolve visual direction

A website needs coherent visual decisions, but it does not need to be assigned a trend name. "Minimalism", "glassmorphism", and "brutalism" can describe treatments; none is a complete brief, a business strategy, or proof of usability. A direction can combine compatible treatments when typography, hierarchy, components, and interactions remain coherent.

## When to decide

Collect brand identity, existing design-system constraints, liked/rejected references, and any explicit style request during intake. Resolve the direction after the offer/message, architecture, and representative real copy are understood, before detailed UI and scene construction. This is step 5 of the [production workflow](workflow.md). Early visual exploration is allowed; do not freeze a treatment before understanding what it must communicate.

Preserve a settled direction for revisions. If the user has already chosen a style, implement it within the brief and resolve concrete readability or responsive problems rather than reopening preference selection. An inherited system may already answer most of this step.

For unresolved new directions or reported repetition, read [design diversity](design-diversity.md) before choosing the treatment. Separate the narrative premise, visual language, hero composition and signature motion; imagery and an opening aperture are optional. Use compact structurally different alternatives where a consequential choice is open, then select within scope.

## Separate four decisions

| Decision | Specify | Do not confuse it with |
| --- | --- | --- |
| Brand identity | Approved logo/assets, palette constraints, tone, recognizable motifs | A fashionable surface treatment |
| Visual treatment | Hierarchy, composition, density, type roles, surfaces, imagery, component states | A requirement to label every site with one named style |
| Motion language | Signature transformation, pacing/holds, transitions, interaction feedback, mobile and reduced-motion equivalents | Background fades or a smooth-scroll library alone |
| Implementation | Existing stack, asset delivery, CSS, Motion for React or GSAP/ScrollTrigger, Three.js for suitable spatial rendering, conditional Lenis or other justified tools | A visual concept or a mandatory dependency bundle |

The owner's cinematic/wow default remains in force for new sites and substantial redesigns. It describes an expressive motion ambition that can coexist with different visual treatments; it does not force every business into a dark luxury aesthetic. Keep meaningful transformation and accessible information. Read the [cinematic craft requirements](cinematic-direction.md) rather than lowering the target to incidental motion.

## Creative interpretation of brand meaning

Use the saved [analysis brief](brand-document-synthesis.md) as a source of creative ideas across composition, type, imagery, hierarchy, interfaces, and narrative motion. Separate fixed requirements from directional principles and open opportunities. An identity example is not a mandatory website template unless specified as one. Carry the proposition and slogan's meaning through the experience, with traceable major choices and original execution; do not default to literal slogan illustrations or a generic style when the brand book leaves motion unspecified.

## Choose against the brief

Evaluate a proposed direction against the brand and supplied audience context, offer/task clarity, content density, script and readability, source assets, mobile behavior, motion/access needs, and delivery constraints. The audience rationale must trace to supplied information; do not invent a finding to justify a preferred look.

When direction is genuinely unresolved, compare a small number of compact treatments with the same representative content. A hero, one information-dense section, and an action state are often enough to reveal a tradeoff; inspect their narrow-width behavior too. These are design comparisons, not participant tests or A/B experiments. Recommend a direction based on observable criteria. Do not require multiple full website builds, a fixed number of alternatives, or an extra approval when the user has delegated the choice.

Resolve the following in a short working note or existing concept record:

- Selected treatment and why it suits this brief; a named style only if useful.
- Hero composition, type/media relationship and section rhythm; references actually inspected and which relationship is adapted.
- Open alternatives considered and why the selection differs meaningfully from any available prior/rejected concept; if a mechanism repeats, its current brief-specific reason.
- Palette and type roles, spacing/alignment rhythm, component/surface rules, image treatment, and identity motifs.
- Signature thesis: before -> transformation -> meaningful resolved composition.
- Mobile composition and reduced-motion equivalent.
- Material tradeoff or missing input, if any.

Translate the selected direction into [layout and visual foundations](layout-and-visual-foundations.md): concrete spacing roles, responsive containers and grid, hierarchy, a coherent icon family, and surface/border/radius/elevation roles. Choose actual reusable components with [component sourcing](component-sourcing.md), then theme them to the brief. Brand expression belongs in composition and treatment; using a behavior primitive does not require adopting its demo page's appearance. A direction that exists only as adjectives or library names is not ready to scale.

## Apply style treatments selectively

- **Minimalism:** remove competing decoration while keeping decision-critical content, clear controls, and appropriate emphasis. Sparse content is not automatically a better user journey.
- **Glassmorphism:** specify where translucency helps layering and where opaque surfaces better protect text and controls. Inspect contrast across actual changing backgrounds; provide a simpler fallback where blur or transparency harms execution.
- **Brutalism:** use expressive typography, visible structure, or deliberate rawness while keeping predictable actions and readable content. Do not inherit confusing navigation or inaccessible controls merely to satisfy a label.

These are application judgments informed by [research sources S1-S7](research-sources.md#ai-production-workflow-adaptation), not guaranteed conversion effects or style-to-industry rules. An agent's visual inspection is not evidence from target users. Do not add user-testing, analytics, or outcome measurement phases to select the direction in this production scope.
