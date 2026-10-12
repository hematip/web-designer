# Progressive disclosure for the actual task

Read when content density, advanced options, conditional forms or layered controls require a choice about what stays visible. [NN/G's guidance](https://www.nngroup.com/articles/progressive-disclosure/) distinguishes showing secondary options on demand from splitting a sequential task into steps. Use supplied audience/task findings, not invented usage frequency.

## Decide what may be deferred

Keep the real offer, primary action, decision-critical conditions, consequential costs, important warnings and current errors discoverable at the point they matter. Reveal advanced or infrequent detail with a clearly labeled path and a useful summary. Do not hide essential explanation merely to produce an attractive minimal hero, or turn every section into an accordion.

Map **audience task → visible essentials → deferred detail → labeled trigger → return/recovery** in the existing architecture or component record. A simple secondary page or native details block may be sufficient. Avoid multiple disclosure layers where a clearer structure would work. Primary actions follow task priority; secondary placement does not imply disabled behavior.

## Apply only relevant patterns

- Conditional forms reveal fields relevant to a stated choice. Preserve entered values when users go back where appropriate; explicitly decide whether hidden fields are submitted and validated. Hidden required controls must not block a user with an unreachable error. Label the change and keep focus logical.
- Advanced settings and overflow actions need meaningful labels and a summary of active nondefault choices. Do not put frequently necessary actions behind unexplained ellipses solely to save width.
- Mobile filters may move to a drawer while retaining active-filter counts, selected values and reset/apply semantics. Avoid surprise application behavior between mobile and desktop; preserve the same underlying choices.
- Drawers and dialogs are for an appropriate contained task, not a default substitute for readable content. Choose modal versus nonmodal behavior explicitly using [interaction and status](interaction-and-status.md).
- Multi-step flows are useful when a genuinely sequential task benefits; they are not automatically easier. Keep related comparison inputs together. When steps are scoped, preserve data, allow useful back/edit actions, show an honest step sequence and place validation near the responsible field/step.

Use [responsive layout](responsive-layout.md) for content placement, and real button/link semantics for the reveal. Expanding detail exposes state and maintains a sensible reading order; closing a region cannot strand focus inside hidden content. Do not require hover or a completed animation to access essential details. Inspect open/closed and return states during construction. No extra participant research, analytics or feature scope follows from selecting this pattern.
