# Navigation architecture and behavior

Read for a new site navigation system, material architecture change, or menu defect. Preserve established routes on scoped edits. Use [landing architecture](landing-architecture.md) to establish the page role first. Source IDs resolve in [research sources](research-sources.md#framer-guides-and-production-adaptation).

## Map tasks to destinations before selecting a menu

From the supplied brief, map priority visitor tasks to real pages/anchors and group secondary destinations meaningfully. Use labels that predict the destination. Match presentation to content breadth: a few visible links, grouped disclosures, a mega panel for substantial categories, or a local index/sidebar for deep content. Breadcrumbs explain a real hierarchy. Search is conditional on an actual searchable content set. [F5]

Item counts, logo position, sticky placement and hamburger use are contextual decisions, not fixed rules. Preserve orientation and access on mobile/RTL. Footer links may repeat useful primary routes as well as contact/policy destinations; neither duplication nor removal is mandatory. Keep a main action discoverable when appropriate without crowding the available height. [F5]

Record only the decisions needed: destination map, labels/grouping, compact behavior, current location and opening/dismissal rules. Do not add a research exercise, analytics setup or new application feature to choose a menu.

## One coherent interaction model

Prefer real links for destinations and buttons for disclosures. Give distinct navigation regions useful names; expose expanded/current state. A parent that both navigates and expands needs distinguishable link/toggle actions. Typical website navigation does not require ARIA `menu`/`menubar` semantics. Preserve normal Tab access; optional arrow keys must not replace it. Escape dismisses an open disclosure and returns focus appropriately. Hidden content must leave the focus sequence. [F17]

Use the existing primitive's state model and [interaction contract](interaction-and-status.md). A mobile overlay needs the matching modal or nonmodal focus behavior, a close action, usable scrolling and cleanup on route/viewport changes. Sticky controls must not cover focused content, anchors or essential actions; keep one header-offset policy with [scroll geometry](motion-and-assets.md#scroll-geometry-and-responsive-continuity).

## Keep pointer travel into a submenu stable

For hover-capable adjacent triggers, preserve the current panel during diagonal travel into it. Consider a safe corridor or trajectory guard when accidental sibling activation is observable; intentional switching should remain responsive. Fixed delays are a tradeoff. [F2]

Use the actual panel edge/RTL placement, not the example's downward projection or constants. Guard hover switching without blocking explicit clicks. Expire idle guards without requiring further movement; clear them on exit, cancellation, resize and unmount. Preserve touch/keyboard behavior and use the project's stack. [F2]

Additional hover/focus content must remain reachable and persistent while used, and dismissible under the applicable criterion. A safe corridor does not replace these requirements. [F17]

## Inspect the affected journeys

For relevant changes, try diagonal entry toward near/far links, deliberate sibling switching, pause/reversal, leaving the navigation, keyboard open/traverse/Escape, touch activation, and a resize with the menu open. Inspect direct URLs, Back and anchor offsets when routing is affected. Observe the actual result; a pointer formula or screenshot alone cannot certify the interaction. Keep temporary geometry overlays out of delivery. These are embedded implementation checks, not a participant study.
