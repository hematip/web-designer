# Interaction behavior and system status

Read before implementing a scoped interactive control or asynchronous operation. Design the real behavior, not just state colors. Keep the page's journey and source-backed UX writing; these capabilities do not authorize adding an application/backend to a landing page.

## One behavior contract per relevant component

Record **trigger/input → current state → transition/result → message → available next action → keyboard/focus behavior**. Apply only meaningful states: default, hover on capable pointers, visible focus, pressed, selected/expanded, disabled, pending, failure, success. Pressed is not selected; disabled is not loading; empty is not error. Match state to actual events, and prevent duplicate requests while preserving useful cancellation or navigation. Avoid hover-only essential content and avoid using opacity alone to communicate a state.

Use existing accessible primitives when suitable, preserving semantics while theming. For a prototype with simulated behavior, keep simulation explicit in the prototype/handoff; a production form cannot report sent/saved/paid without the corresponding integration succeeding. Do not bury a consequential limitation in an internal record while presenting a working service publicly.

## Controls and keyboard behavior

- Forms need labels, stable helper/error space where useful, validation at an appropriate moment, input preservation and a practical recovery path. Respect IME composition and Persian/mixed-script entry. Do not reject ordinary typing on every keystroke or erase valid fields after a server failure.
- A [modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) needs an accessible name, intentional initial focus, a contained Tab sequence, inert background and a visible close/cancel action. Support Escape as appropriate to the operation and return focus to the trigger or a logical surviving destination. A visually dimmed page is not automatically a semantic modal.
- Use [tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) only for switching related panels: tablist/tab/panel relationships, selected state and managed arrow-key focus. Automatically activate on focus only when panel display is fast; otherwise use explicit activation. Hidden panels must not leave controls in the active focus order. Ordinary page navigation remains links, not tabs.
- A [disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) toggles with a real button and exposed expanded state, or suitable native details/summary. Keep ordinary site navigation as links/disclosures. Use application-menu semantics and their corresponding keyboard model only for an actual menu widget, not every dropdown-shaped navigation panel.
- Selects, menus, switches and drawers retain their primitive's established input model; distinguish modal drawers from nonmodal complementary content. Pointer-outside dismissal cannot be the only closing method. Selected controls expose state, not just colored backgrounds.

For website menu structure, hover travel and compact navigation, use [navigation](navigation.md); keep those behaviors in the same component state model.

For lead/inquiry forms, justify each field by the next operation. Use appropriate input types/autocomplete, persistent labels, explicit required/optional status and localized examples. Defaults remain editable; do not invent location or preference. Preserve security/verification requirements. [Framer UX guidance and adaptation](research-sources.md#framer-guides-and-production-adaptation)

## Asynchronous feedback: only applicable flows

| Flow | Required meaningful behavior |
| --- | --- |
| Loading | Localize busy feedback to the affected region; preserve stable content where possible; make failure/retry possible rather than an indefinite spinner |
| Saving | Distinguish unsaved, saving, saved and failed; claim persistence only on confirmation; avoid losing dirty edits or applying a stale response |
| Success/error | Explain what happened and what to do next; success follows confirmation; errors preserve useful input and offer a real recovery action |
| Empty states | Distinguish first use, no matching results, unavailable content and failure; provide the appropriate next step without inventing data |
| Upload | Explain real size/type constraints; distinguish selected, transferring, processing, complete, failed/cancelled; validate actual outcomes, retain file identity and offer cancellation/retry where supported |
| Progress | Use determinate progress only from known completed work; otherwise use named indeterminate activity. Do not fabricate percentages or completion times |
| Optimistic changes | Only for suitable reversible operations; retain previous state, reconcile actual results and roll back/explain failure. Avoid optimistic finality for irreversible commitments |
| Background tasks | Let unaffected work continue; keep a discoverable persistent result/error where needed, rather than relying solely on a disappearing toast |
| AI generation | If actually scoped, separate queued/generating/streaming/completed/failed/cancelled, mark partial output appropriately, support real cancellation/retry and prevent old responses replacing new ones. A generator does not make its content verified evidence |

Derive copy from the brief's voice while keeping operational messages precise. Critical errors and undo/recovery actions remain available long enough to use. Guard asynchronous races and component teardown so state reflects the active request, not the last response to arrive.

Expose appropriate non-focus-taking updates through a stable polite status region; reserve interruptive alerts for urgent errors and avoid announcing each token/frame. [WCAG Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) concerns programmatic availability of status changes without requiring focus. Do not move focus merely to announce loading/saving; use deliberate focus management for dialogs or a submission error summary. Inspect actual success, failure/recovery, keyboard and interruption states inside construction; record absent integrations accurately.
