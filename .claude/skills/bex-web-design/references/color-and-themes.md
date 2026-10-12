# Color and intentional themes

Read when creating/changing a palette or theme. Keep approved identity and existing tokens; an interface example using Slate/Violet does not authorize recoloring a brand. Typography, spacing and elevation retain their own canonical contracts.

## Select a palette from the brief

Use approved identity colors as constraints. If the palette is open, derive the intended character from audience, voice, culture and content; compare a few coherent relationships such as tonal, adjacent-hue or contrasting accents in a real section. Review their area proportions alongside photography, type and surfaces before choosing. A palette gallery supplies possibilities, not an industry-to-color rule or validated conversion winner. [F3]

Explain which role each color serves and carry that role across the journey. Action emphasis can come from surrounding space, placement and value contrast; there is no universally best CTA hue. Do not recolor an established brand merely to match a showcase. Keep semantic feedback distinguishable from decorative accents. [F13]

Source IDs resolve in [the research record](research-sources.md#framer-guides-and-production-adaptation). Evaluate actual foreground/background pairs using the contract below. Artistic intent does not exempt informative text from contrast requirements; dark styling does not by itself establish accessibility. [F8, F20]

## Build semantic pairs, not arbitrary swatches

Map primitive colors to actual roles: canvas, content surface, raised/overlay surface; primary/secondary text; icons; subdued/strong borders; primary action and its label; focus; selected; disabled; success, warning, error and information. Give each relevant role foreground/background pairs and interaction variants. Distinguish brand accents from feedback colors; one accent need not color every icon, heading and border. Use color with grouping, text, shape or a named icon for meaning.

Create reusable tokens and variants in the project's actual theme/CSS, then inspect representative real content. A darker swatch is not automatically the correct hover treatment, and translucent tokens depend on what shows through. Preserve a coherent hierarchy while leaving the brand's signature imagery and cinematic treatment expressive.

## Contrast contract

The [WCAG text contrast criterion](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) normally requires 4.5:1, or 3:1 for qualifying large text (18pt regular or 14pt bold), with defined exceptions. Test the composited color pair, not a token name. Muted helper copy still matters; ordinary placeholder text is not exempt merely because it is faint. Do not assume every heading qualifies as large text.

For [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast), necessary visual information for controls and graphical objects normally needs 3:1 against adjacent colors, with exceptions. This does not mean every decorative border requires 3:1. Check the information that identifies a control/state, focus visibility and meaningful status icons. Disabled styling should remain understandable; a disabled exception does not justify low contrast elsewhere.

## Multiple themes only when in scope

If light/dark is requested or existing, preserve semantic role names and map each theme intentionally. Resolve layered surfaces, labels/icons, selected/feedback states, borders, focus and artwork in each; do not invert a screenshot or recycle light-theme shadows indiscriminately. Check real examples, gradients, logo assets and translucent scenes in both themes. Keep layout/type/interaction semantics coherent across them.

Choose the initial theme from the actual project policy: supported user choice, stored preference and system preference where applicable. Respect an explicit user selection; handle unavailable storage and client/server first-paint mismatch within the stack. A theme control needs a clear accessible name and state, keyboard behavior and appropriate preference persistence if requested. A one-theme brand site does not need a new switch.

For a Tailwind project, consult its installed version and [official dark-mode mechanism](https://tailwindcss.com/docs/dark-mode); do not assume a class selector or a new configuration format fits every version. Use native CSS or the existing system equally well. Inspect theme transitions without changing reading position, trapping focus or making contrast depend on motion completing.
