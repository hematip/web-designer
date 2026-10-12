# Responsive layouts from content relationships

Use for new builds or changes to layout, content, controls and cinematic geometry. Preserve established breakpoints and tokens unless content exposes a defect. [Layout foundations](layout-and-visual-foundations.md) own spacing/grid rules; [typography](typography-system.md) owns actual type roles and script behavior.

## Adapt rather than shrink

Choose changes where actual content stops fitting: navigation labels collide, reading measure becomes poor, cards lose useful width or scene layers obscure text. Desktop/tablet/mobile are inspection contexts, not a mandate for three independent designs. Let flexible grids, intrinsic sizing and bounded fluid dimensions handle intermediate widths before adding breakpoints. Protect min-content behavior with sensible wrapping and grid/flex shrink rules rather than hiding page overflow.

Use the project's existing stack. For Tailwind, [responsive utilities](https://tailwindcss.com/docs/responsive-design) are mobile-first; unprefixed rules form the base, and prefixed rules apply from their breakpoint upwards. Current defaults are sm 40rem, md 48rem, lg 64rem, xl 80rem and 2xl 96rem; inspect the installed version/configuration before relying on them. They are not a universal user-device model. Container queries can make reusable components respond to their actual available space.

## Resolve the condition that changes the layout

For a material layout change, record **content failure → available-space/input condition → adaptation → retained information and action** in the existing design record. Separate page-width changes from a component's container needs; a card inside a sidebar may need its compact form on a wide display. Inspect immediately below and above a chosen threshold, then resize through intermediate widths. Avoid overlapping rules or breakpoint overrides that silently undo a shared component correction. [F1, F14]

Choose the initial design context from supplied audience/task evidence. Global traffic percentages do not dictate the starting canvas; mobile-first CSS is a separate implementation choice. `rem` or `em` alone does not make type fluid; retain the [typography rules](typography-system.md). [F8]

Width, viewport height/orientation, pointer/hover capability, and motion preference answer different questions. A wide touchscreen still needs tap access; reduced motion is a preference query, not a width breakpoint. For short landscape views, let menus scroll internally and avoid viewport-height locks that clip content. Keep keyboard behavior available at every width. [F16]

Preserve substantive information and real destinations across layouts. Recompose media, collapse secondary groups or use appropriate disclosure instead of deleting essential copy to make mobile look simpler. Important indexable content must not require a click or scroll-triggered fetch to exist; an already-rendered expandable panel is a different case. [F18]

## Scope-specific layout rules

- Define page gutters separately from component insets and section gaps. Reduce excessive empty space at constrained widths while retaining grouping and usable touch targets. Specify deliberate compact/comfortable density only when useful; do not squeeze type or controls indiscriminately.
- Determine each section's collapse/reorder/wrap behavior from its message. Keep meaningful DOM, reading and focus order; visual CSS reordering must not create a different keyboard story. Hero artwork can be recomposed/cropped differently if identity and focal subject remain faithful.
- Navigation needs real opening/closing, names, current-page state and focus handling at every supported layout. Clear overlay/scroll locks and hidden-focus conditions when resizing out of a mobile menu.
- Preserve relational meaning in tables. Use wrapping, a deliberate local horizontal scroll area or a labeled alternative presentation when appropriate; do not remove necessary columns silently. A scrollable data region must be operable and discoverable, without making the whole page scroll sideways.
- Typography uses realistic copy, readable line length and responsive roles. Check enlarged text, long labels, mixed numbers/Latin/Persian, font-loading changes and translated lengths. Do not use fixed heights or arbitrary hard line breaks to fit one screenshot.
- Provide correctly sized/cropped assets and reserve useful dimensions. On touch, avoid hover-dependent actions; retain keyboard access on every width. Use logical inline spacing and selective directional icon treatment for RTL.
- Recompute narrative anchors after layout/font changes. Define mobile/reduced-motion scene composition, not a scaled desktop pin. Preserve essential text, useful action and subject visibility at intermediate/reverse/direct-anchor states.

Inspect an appropriate desktop width, a constrained width near a real change and mobile, plus a meaningful resize with an active menu/scene where affected. Include reflow at 320 CSS px and text enlargement through the [accessibility contract](accessibility.md). Repair responsible shared layout rules rather than accumulating viewport-specific offsets. Record what was observed; do not add unrelated device simulations or a separate user-testing phase.

Source IDs resolve in [Framer research and corrections](research-sources.md#framer-guides-and-production-adaptation). Article device sizes and platform inheritance examples are illustrations; inspect the actual CSS or builder configuration used by this project.
