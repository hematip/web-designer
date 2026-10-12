# Interface and prototype foundations

Read this routing contract when establishing a new visual system or substantially revising one. For a small correction, read only its relevant reference and preserve accepted decisions. These capabilities support marketing websites as well as scoped product prototypes; they do not turn a landing page into an application.

## Route the twelve requested topics

| Topic | Canonical guidance | Read when |
| --- | --- | --- |
| Accessibility | [Accessibility](accessibility.md) | New builds; changes to semantics, controls, content visibility, focus or motion |
| Color | [Color and themes](color-and-themes.md) | Creating or changing palette, semantic roles or state colors |
| Icons | [Layout foundations, section 5](layout-and-visual-foundations.md#5-use-icons-as-a-coherent-system), [component sourcing](component-sourcing.md) | Selecting, importing or changing icons and icon controls |
| Interactions | [Interaction and status](interaction-and-status.md) | Implementing a scoped control or interaction |
| Light and dark mode | [Color and themes](color-and-themes.md) | Multiple themes are requested or already supported |
| Motion | [Interface motion](interface-motion.md); existing cinematic, text and engine references | Functional feedback/transitions; narrative motion uses its existing specialist contracts |
| Progressive disclosure | [Progressive disclosure](progressive-disclosure.md) | Content density, advanced options, conditional forms or layered navigation |
| Radius | [Layout foundations, section 6](layout-and-visual-foundations.md#6-give-materials-and-decorative-assets-a-role) | Defining controls, surfaces or nested geometry |
| Responsive | [Responsive layout](responsive-layout.md) | New builds or changed content/layout/interaction/motion geometry |
| Spacing | [Layout foundations, section 2](layout-and-visual-foundations.md#2-spacing-and-padding-express-relationships) | Establishing or repairing grouping, padding, gutters or density |
| System status | [Interaction and status](interaction-and-status.md) | Existing/requested asynchronous actions or meaningful state changes |
| Text | [Typography system](typography-system.md), [UX copywriting](ux-copywriting.md) | Type decisions, hierarchy, labels, messages and actual reading content |

Use existing canonical references instead of creating twelve independent skills with competing defaults. Read the relevant detail **before** making that decision; a link list alone does not improve implementation. Keep the resulting decisions in the existing visual-foundation record and real theme/primitives, not twelve new project documents.

## One implemented contract

Record only useful fields: brand/language/audience constraints; content and reading widths; role-based spacing and responsive grid; type roles; palette and foreground/background pairs; icon roles; radii/surfaces; component state transitions; focus/keyboard behavior; functional and narrative motion; supported themes; actual integration versus demonstration. Connect important choices to the living brief. Assign tokens and component variants one authority, so a reference does not create a second system.

Before repeating components, inspect a representative real-content slice with a main action, supporting text, an icon and a surface; include an existing meaningful interactive state where relevant. Verify shared rules on the full page during construction. This is neither a new research phase nor a mandatory standalone prototype deliverable.

## Defaults remain contextual

Slate neutrals, Violet accents, Inter and Lucide can form an optional product-UI starter profile when the project has no identity/system and these choices fit its content. They are not a prescribed brand palette or universal requirements. Respect supplied identity, script coverage, audience, context and existing stack. Inter is not a substitute for a verified Persian family. Maintain one coherent icon family; Lucide is one verified option.

A 4px-based spacing scale, role-based radius set and Tailwind's breakpoints are useful starting tools, not constraints on every optical dimension or layout. Keep creative composition and cinematic storytelling available. Do not impose dark mode, tables, AI generation, upload flows or extra controls on sites that do not need them.

## Construction evidence

For applicable topics, record viewport/theme/input/state, observed behavior or visual defect, responsible shared rule, correction and affected-state recheck. Mark irrelevant capabilities as out of scope rather than inventing features to satisfy a checklist. Do not infer visual quality from token presence, accessibility conformance from a checklist, or audience comprehension from an artifact inspection. Keep the owner's seven-step production scope without analytics, outcome measurement or participant studies.
