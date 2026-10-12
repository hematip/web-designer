# Layout and visual foundations

Read for a new site, substantial visual redesign, or a spacing, padding, grid, hierarchy, icon, or surface correction. This extends step 5 (resolve the visual system) and step 6 (build with embedded quality checks); it adds no research, user-testing, analytics, or measurement phase. Reuse an approved system in revisions. Source IDs resolve in [design-system sources](design-system-sources.md).

The user reports recurring weaknesses in these areas. That identifies what to strengthen, not a diagnosed defect in every existing site. Inspect the actual affected output before asserting its cause. A well-choreographed hero does not compensate for weak page composition.

## 1. Establish a small, implemented foundation

Before repeating components across a new page, resolve the useful entries below in the existing project record and actual theme/CSS variables. Do not create a large design-system deliverable unless requested. A library's defaults are a starting point, not proof of fit.

| Decision | Specify for this project |
| --- | --- |
| Layout | Content max-width, narrow reading width, page gutters, main column relationships, collapse behavior, and intentional full-bleed regions |
| Space | A limited base scale and semantic uses: inline gap, related stack, group separation, component inset, section inset |
| Hierarchy | Main message/focal subject per section, supporting copy, primary/secondary actions, and quiet metadata |
| Icon system | Actual family/source, sizes, stroke/fill treatment, alignment, meaning, and labels |
| Surfaces | Canvas, contained content, emphasized/raised content, overlays; corresponding border, radius, shadow, and contrast roles |
| Reuse | Existing primitives and sourced components; local variants and token mapping |

Connect these decisions to the [visual direction](visual-direction.md), [typography system](typography-system.md), and [component sourcing](component-sourcing.md). A brief-only task specifies the system; an implementation must use it. Semantic tokens encode intent, while primitive values supply the scale. [D1, D7]

## 2. Spacing and padding express relationships

Use the approved scale if present. Otherwise choose a compact scale suited to content density. An illustrative web starting scale is **0, 4, 8, 12, 16, 24, 32, 48, 64, 96 CSS px** (or appropriate rem equivalents). This is our optional starting point, not a universal requirement or a copied Material scale. Small optical corrections, borders, typography, and animation geometry need not be forced to these values. Atlassian itself has fractional steps within its 8px-based system; "every dimension must be divisible by eight" is not its principle. [D2]

- Separate **page margin**, **column gutter**, **container padding**, **gap within a group**, and **space between groups**. Equal numbers everywhere erase grouping.
- Make related items read as a group: a field label belongs near its field; a heading belongs closer to its own text than to the preceding section. Separation between distinct groups should communicate the boundary. Choose actual values for the real content rather than enforcing one ratio everywhere.
- Assign semantic values once, for example an icon/text gap, a card inset, and a section inset; reuse them for equivalent roles. If responsive density changes, change the role coherently rather than adding unrelated per-card exceptions.
- Give an inter-item gap one owner. Prefer the parent layout's `gap` or a consistent stack rule; avoid accidentally adding margins from both adjacent children. Remember that padding surrounds content, while gaps separate children.
- Calibrate after the real font loads. Font metrics, multiline headings, Persian line height, transparent image padding, and icon whitespace affect the perceived distance. Correct optical alignment without distorting approved assets.
- Avoid fixed heights that clip long text, oversized mobile emptiness, and arbitrary spacer blocks used to patch pinning errors. A cinematic reading hold is intentional scroll time; it is not automatically content padding.

A 4px foundation is a starting rhythm, not a restriction on every optical adjustment. Intermediate values such as 6, 20 or 40px can be named roles where content and density justify them; avoid random one-off gaps. Define compact/comfortable density only when useful, and keep responsive spacing separate from minimum hit areas.

## 3. Grid and containment before local offsets

Establish recurring alignment lines for header, section headings, text blocks, images, and footer. Use a shared container for comparable regions. Full-bleed art or an asymmetric scene may intentionally cross these lines; retain a clear relationship and a mobile equivalent.

Choose a grid for the content: a two-column editorial section, a fit-based card grid, or a larger column framework when useful. **A 12-column desktop grid and 4-column mobile grid are not mandatory.** Align major containers; internal buttons and icons use local spacing, not page columns. Atlassian makes this distinction explicitly. [D3]

For repeated cards, derive fit from usable width: `number of columns × minimum useful card width + gaps <= container width`. Change the column count when actual text, controls, or imagery no longer fit, rather than shrinking everything to preserve three columns. In CSS, use resilient Grid/Flex sizing and shrinkable text tracks (for example `minmax(0, 1fr)` where appropriate); in a visual editor use equivalent Auto Layout, resizing, and alignment rules.

Keep content in normal flow unless its role requires layering. Do not patch responsive layout with absolute positions, arbitrary negative margins, or whole-page overflow hiding. Intentional overlap is allowed, but must preserve content, focus visibility, and mobile reading order. A broken animation wrapper should be repaired at its owner, not hidden with extra padding. [D4, D5]

## 4. Build hierarchy through several cues

State what should attract attention first in each section and what supports it. Use placement, grouping, whitespace, scale/weight, contrast, and imagery together; do not solve every problem by enlarging the heading. Related sections need a recognizable rhythm without identical compositions. Keep semantic heading levels independent of visual size.

Use a consistent distinction between the main action and secondary navigation/actions. Repeated instances of the same main action are fine; several unrelated equally prominent buttons weaken priority. Quiet metadata should remain readable. Decorative icons, badges, saturated surfaces, and motion must not accidentally outrank the offer or action. Native reading order, including RTL, informs the layout; it is not a universal left-to-right rule. [D4, D5]

Inspect the page at overview scale for competing focal points, then at actual size for reading. That is the agent's visual judgment, not a claim that target users understood it.

## 5. Use icons as a coherent system

Prefer a real, suitable existing icon over inventing a substitute. Select one main interface family, with deliberate stroke weight, outline/fill treatment, and a small set of role sizes. Brand logos and expressive illustrations are separate categories. Do not mix unrelated icon families merely because individual glyphs look attractive. [D6, D8-D10]

- Choose meaning first: use familiar action metaphors; retain visible text for ambiguous or important actions. Decorative icons can be omitted when they add no information.
- Import the actual component or SVG from the selected source and verify its name exists. Do not replace missing assets with emoji, Unicode lookalikes, an unrelated icon, or an imaginary import.
- Distinguish the **glyph's visible bounds**, **SVG viewport**, and **interactive target**. Increasing the glyph does not automatically make a usable target. Follow the project's accessibility criteria without forcing every glyph to the target's size.
- Inspect icon/text optical alignment, weight, and long-label wrapping. Prevent unwanted icon shrink; do not assume equal SVG boxes have equal visual mass. For Material Symbols, match optical size and weight to the intended rendering. [D8]
- Give icon-only controls an accessible name. Hide a decorative icon from assistive technology when the surrounding label already provides the meaning; do not duplicate the announcement. Tooltips do not replace a control's accessible name. [D9]
- Mirror directional meaning only where appropriate in RTL. Do not flip logos, numbers, or every symbol indiscriminately.

When Lucide fits the existing system, 16/20/24px glyph roles and a coherent stroke treatment are useful starting examples, not mandatory sizes for every family. Preserve the actual library defaults or deliberately tune them; do not shrink a glyph and its touch target together. Use semantic foreground roles from [color and themes](color-and-themes.md) for default/selected/status icons across supported themes. Verify package exports and licensing through component sourcing; Lucide is not mandatory.

## 6. Give materials and decorative assets a role

Here "materials" includes surfaces, borders, radii, shadows, translucency, textures, and graphic treatments; reusable illustrations and patterns are covered by [component sourcing](component-sourcing.md). Define what each surface means: page canvas, content grouping, emphasis, or temporary overlay. Couple its fill, border, radius, shadow, and state styles. Different z-index values do not require different shadow strengths. [D11]

Use the brand's material language deliberately. An opaque editorial layout is valid; glass, noise, gradients, 3D illustrations, and raised cards are optional. Do not put every section in a shadowed card or combine every available effect. Derive corner relationships for nested surfaces from inset and shape, then inspect them; do not blindly use the same radius on every nested box.

Translucency must retain legibility over the actual background throughout motion; provide an opaque alternative when needed. Dark surfaces may need tonal or border separation rather than stronger shadows. Apple materials explain foreground/background layering, but their native platform treatment is not a required web style or a license to copy Apple assets. [D11, D12]

Choose illustration/texture families with compatible palette, perspective, stroke/detail, and material treatment. Use them to explain or express this brand, not as arbitrary filler beside every benefit. Preserve approved product fidelity and the cinematic brief.

For equal-inset rounded rectangles, `inner radius ≈ max(0, outer radius − inset)` is a useful concentric-corner construction heuristic: equivalently, inner radius plus inset approximates outer radius when both are positive. Measure the inset between the relevant boundaries; account for borders and unequal padding. This is not a universal law for pills, arbitrary nested shapes or every adjacent component. Define restrained radius roles for controls, grouped content and overlays; reserve fully rounded pills for an intentional role and inspect the actual painted result.

## 7. Resolve a representative slice before scaling

Within the existing first construction slice, inspect enough real content to reveal the system: for example a heading/body relationship, a content-dense block, and an action with its icon and surface. Use the actual project components. There is no fixed specimen quota or mandatory separate page. A hero alone may hide repeated-card and form spacing problems.

Repair shared tokens, container rules, or primitive variants before copying the same defect across the site. Keep the signature scene early and purposeful; this check does not turn the build into a generic component showcase or a static-template-first process.

## Foundation quality gate

Apply inside construction at the desktop/mobile widths already required by the skill, including a width where the layout changes. Scope to affected components for small edits. Use actual rendering and, where useful, computed geometry/temporary grid guides together. CSS values alone cannot certify appearance.

| Inspect | Completion evidence |
| --- | --- |
| Spacing | Same roles follow the same rules; groups are distinguishable; no doubled gaps, unexplained empty zones, or text crowding |
| Grid | Comparable sections share intended edges; cards fit; deliberate full-bleed regions are controlled; no accidental overflow or lost content |
| Hierarchy | Intended focal point and action dominate; supporting content remains legible; mobile preserves meaningful order |
| Icons | Actual source assets render; family/weight/size and alignment are coherent; names, labels and interaction targets are appropriate |
| Surfaces | Layer roles are clear; contrast survives real backgrounds/states; no accidental radius/shadow mixture or obscured focus |
| Reuse | Library behavior still works after theming; missing icons or broken imports are not concealed with placeholders |

Record a material issue as **region + viewport/state + observed defect + responsible rule + correction/recheck** in the existing verification note. A tokenized but visibly poor layout fails this gate. Correct observed defects in build/fix work; report them in review-only work. No added approval round or business measurement is implied.
