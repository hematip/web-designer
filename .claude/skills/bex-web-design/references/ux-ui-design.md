# UX/UI design for brand storytelling

Use for new briefs/builds, substantial design changes, or a relevant review. These are decision criteria, not a fixed page structure. Source IDs resolve in [research sources](research-sources.md); dates and evidence limits are recorded there.

## Make the story help a visitor decide

Start with the visitor's intent and the real action the page can support. Make the offer understandable near the opening, even when an approved slogan is poetic. Use an explanatory line or representative example without rewriting exact approved copy. The visitor should be able to predict the primary action from its label. Essential text should not require a scroll reveal. [U1]

Use [landing architecture](landing-architecture.md) to select sections by page role, business, and visitor intent. Map them as **visitor question -> answer/evidence -> placement -> next step**. Use [UX copywriting](ux-copywriting.md) for distinct section messages, faithful action labels, and actual interaction states. Select questions from the brief and actual product rather than mechanically adding benefits, testimonials, pricing, or FAQs.

Keep main answers in the vertical reading path, with visible headings. Use clear disclosure for supporting detail; assess tabs against the task instead of banning them everywhere. Product-page research found important information was missed behind horizontal tabs. Its application to other brand pages is a design inference. [U4]

Match clickable card/image styling to the actual hit area and destination. Link products in editorial scenes only when those destinations exist and commerce is in scope. Prefer stable access to essential messages over rotating carousels; justified carousels need discoverable controls, a static alternative, and no mobile autorotation. [U2]

Pair atmosphere with material decision information. For a purchase flow, show supplied price/cost conditions and a route to applicable shipping/returns. For service pages, clarify known scope, process, and what happens after inquiry. Apply the business-specific evidence and limits in [landing architecture](landing-architecture.md); do not treat commerce research as direct evidence for all service pages. Unknown terms remain explicit gaps. [U3, L3, L4]

## Build an identifiable visual language

Use [visual direction](visual-direction.md) to resolve the treatment after the message, architecture, and representative copy. A coherent direction is required; a named style is optional. Preserve an approved existing system in scoped revisions. The audience rationale comes from the user's supplied research, not invented findings.

Use the brand's actual geometry, material, voice, and cultural context to choose a distinctive treatment. Consider how the design remains recognizable beyond the logo. Reuse a motif coherently when it contributes identity; avoid decorating every section with it. [V1, V2]

Create a small set of design decisions before scaling the page:

- **Layout and space:** use [layout and visual foundations](layout-and-visual-foundations.md) for content widths, page/grid alignment, responsive fit, semantic spacing and padding, and a concrete visual check. Do not replace composition with a list of arbitrary numeric values.
- **Hierarchy:** the focal point of each scene, heading/body relationship, content grouping, and spacing rhythm.
- **Palette:** roles for background, text, accent, interaction, and feedback; verify the combinations actually used.
- **Typography:** use [typography system](typography-system.md) to select by site purpose, audience and scripts; compare real specimens, establish semantic/visual roles and responsive tokens, then verify actual font delivery and reading conditions. A font name and an oversized hero do not constitute a type system.
- **Imagery:** subject, material, lighting, focal point, crop, and how the image explains this product or brand.
- **Components:** consistent anatomy and default/focus/active/disabled states for controls that actually exist. Add loading, empty, success, or error states when the interaction needs them.
- **Icons and surfaces:** define a main icon family and actual source assets; use surface, border, radius, and shadow roles deliberately. Follow [component sourcing](component-sourcing.md) for reusable implementation, not just visual imitation.

Expressive display type can carry personality while body copy supports reading. Do not assume that a fashionable font, extreme scale, or character distortion suits every language or audience. [V3]

For this owner's new sites, establish the [cinematic motion thesis](cinematic-direction.md) with the visual system. Layout should make the transformation possible from the start: continuity between chapters, stable text safe areas, and an expressive focal relationship. Readability does not require a conservative static split-hero layout; solve the composition rather than treating motion as optional polish. This is an explicit creative preference, not a research-derived claim about conversion.

## Choose current treatments for a reason

The following options synthesize 2025–2026 editorial sources, not proven conversion recipes.

| Treatment | Useful when | Adaptation and tradeoff |
| --- | --- | --- |
| Brand-specific graphics and color systems [V1] | Identity needs to be recognizable across sections | Give motifs and colors coherent roles; retain action contrast |
| Tactile imagery and culturally grounded scenes [V2] | Material, sensory qualities, or place matter | Use supported context and faithful assets; texture does not require live 3D |
| Expressive typography [V3, V4] | A headline deserves distinct voice or emphasis | Keep complete semantic text and a readable static state |
| Concise overview followed by deeper chapters [V1] | The offer has several parts | Make essentials visible and detailed paths easy to find |
| Scroll orientation [V1] | A longer story risks disorientation | Use clear chapter/progress cues without taking over scrolling |
| Editorial scale and asymmetry — design synthesis | Images and narrative justify varied emphasis | Keep a coherent grid and logical mobile reading order |

For a major chosen treatment, record its purpose, source or brand evidence, mobile/static equivalent, and cost in readability or delivery. An award is creative recognition, not proof of accessibility or commercial results. [V5] Do not add a trend because it is available in a tool.

## Persian and other RTL experiences

Set the document's real language and base direction, such as `lang="fa" dir="rtl"`. Prefer logical spacing/alignment properties; preserve explicit physical placement requested for a composition. Keep DOM reading and focus order meaningful when visual columns move. Isolate mixed-direction fragments such as Latin model names with appropriate `bdi` or direction markup. [I1]

Use real Persian specimens, including نیم‌فاصله, punctuation, numerals, a Latin product code, and longer mobile headings. Check font fallback and zoom. Preserve cursive joining and diacritics; letter-by-letter wrappers or tracking can damage shaping. Prefer whole-word/line motion when it preserves the phrase, and verify the rendered result. This implementation advice draws on a draft layout note, not a conformance standard. [I2]

For Persian font selection, pairing, number variants, optical alignment and concrete test strings, use [Persian and bilingual composition](typography-system.md#persian-and-bilingual-composition). Do not transfer Latin line-height/tracking rules or font classifications mechanically.

Localize display formatting deliberately. Keep underlying identifiers accurate; do not reverse numbers, logos, or nondirectional symbols simply because the page is RTL.

## Usability and accessibility checks

Use the project's agreed target; otherwise use WCAG 2.2 AA as a working accessibility target. These selected checks are not a full conformance audit. A compact brand page still needs real keyboard operation, semantic controls, descriptive labels, useful alternatives for images, and visible focus.

- Text contrast: normally at least 4.5:1; qualifying large text 3:1. Large means at least 18 pt regular or 14 pt bold; apply the criterion's exceptions accurately. Test text on the actual background, including changing media. [Contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- Pointer targets: meet the 24×24 CSS-pixel minimum or a documented exception, including permitted spacing. Prefer a comfortable larger hit area for primary mobile controls; 44×44 is an enhanced target, not the universal AA minimum. [Targets](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- Keep focused controls visible; sticky elements must not entirely hide them. Prefer complete visibility. Test close/Escape and focus return where relevant. [Focus](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- Check reflow at 320 CSS pixels for ordinary vertical content, applying the criterion's exceptions. Also inspect text enlargement and real long copy; a screenshot at one width is insufficient. [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- Provide a single-pointer alternative to dragging when applicable, and keyboard operation independently. [Dragging](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)

Reduced motion is this skill's design default for optional motion. The WCAG interaction-animation criterion itself is AAA, not AA. Keep meaningful content and controls usable when movement is disabled. [Motion criterion](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)

## Delivery performance and evidence

Give the main content priority: discover the hero/LCP resource early, avoid lazy-loading the LCP image, reserve media space, and defer nonessential media. [P2] Profile expensive effects rather than assuming that clip-path, blur, live 3D, or additional layers are cheap. Prefer transform/opacity where they produce the intended result; do not scale a product merely for performance. [P3]

For performance work, record device/network conditions and actual measurements. Current good field thresholds are LCP ≤2.5 s, INP ≤200 ms, and CLS ≤0.1 at the 75th percentile, assessed separately for mobile and desktop. A local lab run, synthetic click, or successful build does not establish field compliance. [P1]

For a material UX/UI decision, inspect concrete artifact criteria: is the supplied offer expressed plainly, is the required decision information discoverable, and does the intended action work as represented? Agent inspection is a heuristic assessment, not evidence that target users understand or prefer the design. Do not claim comprehension or conversion results without corresponding evidence. In this AI production workflow, do not add user-testing studies, analytics setup, or business outcome measurement as a phase or default follow-up. Retain proportionate technical and visual checks inside construction; technical profiling is distinct from tracking business outcomes.
