# Accessibility during design and construction

Use for new builds and changes affecting content, navigation, controls, state messages or motion. For a narrow edit, inspect its affected behavior. Default to the project's stated target, or WCAG 2.2 AA as a working target; this reference is not a full conformance assessment. The [WCAG standard](https://www.w3.org/TR/WCAG22/) is normative; APG patterns guide widget implementation.

## Structural and input contract

- Use real headings, landmarks, links for navigation and buttons for actions. Keep meaningful DOM order aligned with reading and keyboard order, including RTL and responsive rearrangements. Add a useful skip link for repeated navigation. Preserve accessible names and state semantics when theming imported primitives.
- Keep interactive elements keyboard operable with visible focus. Avoid positive tabindex, arbitrary div buttons and pointer-only drag actions. Hover hints also need focus/touch access; essential meaning cannot live only in a tooltip. Sticky headers, clipping and cinematic overlays must not conceal the focused control.
- Use appropriate labels, autocomplete and input types. Place required/format guidance before submission; connect hints/errors to fields, mark invalid fields appropriately and preserve entered data. A placeholder is not a label. Follow [interaction and status](interaction-and-status.md) for dialog, tabs, disclosure and asynchronous announcements.
- Name icon-only buttons at the control; hide decorative/redundant glyphs from assistive technology. Alternative text describes the image's visitor-relevant purpose, not the production process. Provide scoped captions/transcripts for meaningful media and native-equivalent controls when needed.

## Contrast, targets and reflow

Use [color and themes](color-and-themes.md) for actual rendered foreground/background pairs across states and themes, including imagery and animated frames. Do not communicate state by color alone. Keep text readable after 200% enlargement and ordinary content usable at 320 CSS px width without two-dimensional scrolling; content inherently requiring two dimensions, such as a data table, needs a deliberate local solution. Preserve mixed-script shaping and meaning when text wraps.

[Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) is a 24 by 24 CSS px AA criterion with defined spacing and other exceptions. Prefer comfortably larger touch targets where practical; 44px is a common enhanced target, not a universal AA minimum. Separate glyph size from hit area. [Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum) requires a focused component not be entirely hidden by author content; aim for the whole target to stay visible. Avoid treating the AAA focus-appearance metric as an AA rule.

## Motion and assistive technology

Provide the full message and useful controls in reduced motion. Remove or simplify nonessential travel, pinning and repeated loops rather than simply accelerating them. Do not hide semantic content behind reveal completion, announce every animation frame, duplicate split text, or leave invisible controls focusable. Follow [interface motion](interface-motion.md) and the relevant narrative/text reference; flashing and automatically moving content also need the applicable WCAG safeguards.

Inspect actual focus order, accessible names/roles/states, a relevant form/error path, responsive reading order, enlarged text and reduced-motion output during construction. Use assistive-technology inspection when available; report the scope and unavailable checks accurately. Automated findings, keyboard inspection and an accessibility-tree snapshot are complementary evidence, not proof of full screen-reader or standards coverage. Repair observed defects within scope; do not add a participant-testing phase.
