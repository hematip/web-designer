# Project templates

Use only the records useful to the task. For a minor edit, the change contract and a short verification note are enough. Do not turn these into mandatory forms for the user to fill out.

For a new build, maintain one evolving record across the [seven production steps](workflow.md). Extract existing inputs first and ask only about consequential gaps. User research is an input; user-testing plans, analytics requirements, and business outcome measurement are not template deliverables for this workflow.

## Current project record

```text
Project / active version:
Requested deliverable: brief | build | revision | review | deployment
Business research/brief supplied by the user / source:
Audience research/explanation supplied by the user / source:
Research findings versus stakeholder beliefs versus unknowns:
Audience / market / language:
Page role / business model / visitor intent and awareness:
Primary visitor action:
Visitor question / evidence needed to decide:
Approved source versions and what they establish:
Superseded sources:
Exact approved public copy:
Internal strategy to express visually:
Products / approved assets / supported facts:
Internal-only asset provenance, generation details and design notes (excluded from public content):
Public captions or credits, only where needed / visitor purpose or actual requirement:
Required identity motifs:
Liked / rejected references and observable reasons:
Current baseline:
Unresolved questions that materially affect the work:
Available build / media / browser / hosting capabilities:
Authorized delivery scope:
```

## Brand, UX and Creative Design Brief

Use this as the expanded current project record for document-led intake and Define, following [document synthesis](brand-document-synthesis.md). Save one living file in the internal project planning location and make it available to the user. Scale detail to the supplied material; these are analysis sections to write, not a questionnaire or approval form.

```text
Title / project / brief version / last updated / current source authority:

Executive summary:
  Focused problem and site role / offer and value proposition
  Priority audience, context and task / primary action and real handoff
  Key UX priorities / brand idea / fixed requirements / creative opportunity
  Scope and non-goals / essential dependencies / observable delivery criteria
  Readiness / decisions blocked by missing or conflicting information

Source register and coverage:
  DOC-01 | file/version/date | authority and topic | pages/sections inspected
         | text/visual review status | unreadable/unreviewed portions

Brand and audience analysis:
  Purpose / positioning / supported differentiators / exact slogan and locator
  Primary and secondary audiences / visitor, user, buyer and other relevant roles
  Tasks and context / awareness, vocabulary and domain knowledge / known motivations
  Decision criteria, questions, barriers and trust needs / supplied evidence and proof gaps
  FIND-01 | finding | evidence type | DOC-01 + page/section | implication or uncertainty

Journey and content implications:
  Entry and expected promise -> decision questions -> actual action -> service handoff
  Supplied journey evidence versus proposed task scenario / returning or alternate paths
  Existing content/system to keep, revise or create / necessary decision information
  Approved claims, assets and terms / missing material and affected sections

Inclusion, operations and feasibility:
  Language, script and reading needs / known access and situational constraints
  Responsive, keyboard/focus, assistive-technology and reduced-motion implications
  Real offer/availability/terms / minimum form inputs / meaningful interaction states
  Action destination and owner / integration, asset and content dependencies
  Stack/CMS, editing and maintenance needs / delivery and publication constraints

Define decisions:
  Focused problem: audience + context + need + known obstacle + role of this site
  Primary task and action / useful secondary paths / scope and explicit non-goals
  Essential, useful and optional requirements / reason and source / dependency
  Project-specific experience principles / creative opportunities
  Observable artifact criteria to check during construction, not outcome KPIs

Voice and UX copy:
  Stable voice traits / contextual tone / terms and forbidden or protected wording
  Source-backed rules / proposed headline, paragraph, CTA and relevant state examples

Creative interpretation:
  Fixed requirements | directional principles | open creative opportunities
  Brand meaning + visitor question -> experience intent -> proposed mechanism
  Identity, typography, imagery, hierarchy and interaction implications

Experience narrative and signature scenes:
  Page/chapter | visitor question | message/proof | relation to proposition/slogan
  Source idea -> scene purpose -> before/transformation/resolved meaning
  Reading hold and handoff / real action / mobile and reduced-motion equivalent
  If continuous object storytelling fits: subject identity and source / chapter roles
    Semantic destination / why continuity adds meaning / chosen medium

Important decisions and use:
  DEC-01 | FIND-01 | choice and rationale | affected page/component/scene | status
  Status distinguishes a proposal, selected working choice, and explicit user approval

Open questions and changes:
  Conflict/gap | affected decision | blocking or nonblocking | resolution
  New source/correction | superseded finding/decision | affected work | current version

Private production notes and public-content boundary:
  Keep source/analysis notes internal; record only actually intended public copy/credits
```

Do not create a trace row for every pixel or require multiple complete concepts. Omit irrelevant fields and mark material unknowns; do not fill gaps with fabricated audience detail. Compare alternatives only where they resolve a real choice. The brief remains available on task resumption and evolves with the implementation; exact claims and requirements can always be checked in their original source.

## Brief for one concept

```text
Concept name:
Brand identity constraints / selected visual treatment and rationale:
Named style, only if useful / alternatives considered only if unresolved:
Visitor feeling and narrative premise:
Relevant brief findings / value proposition or slogan meaning / creative opportunity:
Hero: dominant structure, subject/type/media roles, headline, initial reading/action state
Reference evidence: URL/date/observed viewport-state -> useful relationship -> excluded elements -> original adaptation
Open directions: premise/composition/mechanism differences -> fit/tradeoff -> selected reason
If an aperture or prior mechanism repeats: brief-specific reason or explicit user choice
Identity: palette roles, typography relationships, recurring motif treatment
Typography: selected family/roles and alternative considered / business and language fit:
Real-content specimen / source, web license and file availability / fallback:
Imagery: source plan, human context, product fidelity requirements
Story: section order and role of each section
Coverage: decision-critical answers / conditional sections omitted / missing evidence
Copy: voice / approved exact text / representative headline, benefit and CTA
Product presentation: order, hierarchy, composition, variant differentiation
Motion: central mechanism, reading holds, handoffs, mobile adaptation
If a subject crosses chapters: identity -> changing roles -> meaningful destination
  Path/anchors, occlusion and copy safe areas / representation and static equivalent
Signature thesis: before -> transformation -> resolved composition; why this belongs to the brand
Scene control: trigger / timeline beats / scroll range / pin release / neighboring handoff
Implementation where relevant: chosen engine and reason / actual package and version / node-property owners / single scroll driver / cleanup and reduced-motion behavior
Interaction: primary action, product details, navigation, media controls
Responsive art direction and reduced-motion treatment:
What makes this distinct from available prior/rejected concepts: premise / hero structure / type-media relationship / mechanism / page rhythm (not only colors/images):
Planned visual and functional verification evidence:
Known gaps / assumptions:
Selected treatment: source or brand evidence / purpose / mobile-static fallback:
```

When two versions are requested, compare the choices that establish meaningful differences; preserve dimensions fixed by the request:

| Dimension | Concept A | Concept B |
| --- | --- | --- |
| Hero premise | Define | State difference or shared constraint |
| Narrative order | Define | State difference or shared constraint |
| Product staging | Define | State difference or shared constraint |
| Transition mechanism | Define | State difference or shared constraint |
| Emotional rhythm | Define | State difference or shared constraint |

This is a comparison aid, not permission to invent two designs when the user asked for a single small edit.

## Visual foundation and reuse record

Use for a new system or substantive foundation correction. A narrow edit needs only affected fields. These are internal implementation decisions, not another questionnaire for the user.

```text
Existing system to preserve / current visual direction:
Content max-width / reading width / page gutters:
Grid relationships / minimum useful content widths / responsive collapse:
Base spacing scale / semantic inline, stack, group, inset, section roles:
Primary focal point and action / supporting emphasis:
Icon family and source / size, stroke or fill / labels and target behavior:
Canvas, content, emphasis and overlay surfaces / border, radius, shadow roles:
Semantic foreground/background pairs and states / supported themes or single-theme scope:
Relevant control transitions / focus, keyboard and disclosure behavior:
Actual async operations / loading, success, failure, cancellation and recovery:
Functional motion roles / reduced-motion equivalents / prototype versus real integration:
Actual sourced components/assets / package version or file source / notices:
Local token or theme mapping / reusable variants / deliberate exceptions:
Representative rendered slice / observed desktop, constrained and mobile states:
Defect -> responsible rule -> correction -> affected-state recheck:
```

Route applicable topics through [interface foundations](prototype-foundations.md). Follow [layout and visual foundations](layout-and-visual-foundations.md) and [component sourcing](component-sourcing.md). Do not treat token presence as visual approval or a Figma kit as already functioning code.

## Typography decision record

Use when selecting or substantially revising a type system, not for every wording edit. The [typography system](typography-system.md) reference defines the criteria. This is an internal working record, not a form the user must fill out.

```text
Page purpose / audience / language and script / reading density:
Approved family constraints:
Candidates / actual specimen comparison / chosen fit and rejected tradeoff:
Source, exact files, web license / available versus proposed:
Roles: semantic element | family/fallback | weight/style | mobile/desktop size
       | line height | tracking | measure | adjacent spacing
Mixed-script, number and font-failure decisions:
Motion/layout behavior after font load, wrapping and resize:
Evidence: viewport/state | observed result | screenshot or inspection record:
Unverified states / remaining defects:
```

## Section and copy map

For a complete page or substantial content redesign, use a compact row per section. The [architecture](landing-architecture.md) and [copy](ux-copywriting.md) references define the checks; do not ask the user to fill out every field or attach a new CTA to every section.

```text
Order / section / reason for this placement:
Visitor question / one main message:
Headline / supporting copy / necessary details:
Evidence source / approved exact copy / unresolved factual gap:
Action label and actual destination or outcome, if useful:
Relevant hint / pending / error / success wording, if an interaction exists:
Status: final copy | representative direction | incomplete draft
```

## Section storyboard

```text
Section / role in the narrative:
Visitor question -> answer/evidence -> next step:
Brief finding/source -> brand meaning -> narrative role of this section or scene:
Focal subject / product / exact copy:
For text motion only: source meaning / exact phrase / unit and script / narrative role
  Trigger and progression / reading hold and handoff / settled composition
  Splitter and animation owner / actual package-version and access / semantic strategy
  Font-width-copy rebuild / mobile and reduced motion / cleanup and observed states
Source assets and focal points:
For live 3D only: purpose / actual model-texture sources / camera and material treatment / renderer and frame owner / mobile resolution strategy / loading-error-static composition / resource ownership
For continuous object travel only: subject/source and chapter roles / start and destination
  Beat ranges and holds / path and anchors / coordinate spaces, pivots and scale
  Scroll/progress/pose/render owners / depth and layer order / variant continuity
  Mobile and static destinations / tuning parameters / handoff and interruption evidence
Frame / copy safe area / pattern placement:
Entry -> transformation -> reading hold -> exit:
Visible difference between before, midpoint, and resolved frames:
Outgoing content coverage:
Reverse scroll / direct anchor behavior:
Mobile composition:
Reduced-motion equivalent:
Interaction or reason to continue:
Evidence for completion:
```

## Scoped change contract

```text
User's requested delta:
Affected section and states:
Baseline to compare or restore:
Keep unchanged:
Likely cause if repairing a defect:
Smallest coherent implementation change:
Verification states / viewports:
Publishing included in authorization? Evidence:
```

Example: “Move art to the right, copy to the left, and align their visual centers. Preserve bottle size, native aspect ratio, pattern container, and scroll transition. Check settled desktop and the stacked mobile layout.”

## Asset and pattern record

```text
Asset / product variant:
Approved source and usable resolution:
Intrinsic aspect ratio / visible-content bounds:
Allowed edits / fidelity constraints:
Pattern container and edge alignment:
Crop / fade / repeat permissions:
Product, pattern, copy layer order:
Desktop / mobile placement:
Transparency and contrast inspection:
```

## Revision and handoff entry

```text
Date / revision identifier:
Current state:
Changed:
Preserved:
Superseded instruction or experiment:
Functional checks and evidence:
Visual checks and evidence:
Foundations: spacing/grouping / grid fit / hierarchy / icon consistency / surface roles / observed corrections:
Reused components and assets: actual source/version/path / retained notices / integration limits:
Content completeness: required answers / actual section coverage / gaps
Copy quality: clarity / supported claims / faithful actions / language and state checks
Typography: selection rationale / rendered-font evidence / hierarchy / script integrity / enlargement, spacing and fallback checks / unverified states
For material motion: viewport / midpoint and settled evidence / observed verdict:
Cinematic craft verdict (new designs): signature transformation / brand relationship / choreography / adaptations / unresolved shortfall:
User acceptance: explicit | pending | rejected (state the scope)
Release: local | preview | production; verified destination if published
Known remaining work:
```

## Short handoff to another AI

```text
Continue the existing project using the attached bex-web-design.
The current baseline and source authority are recorded below.
Do not reintroduce superseded choices or redesign accepted regions incidentally.

Current project / version:
Approved brand facts and assets:
Accepted design decisions:
Latest requested change:
Relevant taste evidence:
Files or artifact access available to you:
Checks already completed:
Remaining work and authorized delivery scope:
```

Use this handoff with actual source files or accessible links. The skill contains process knowledge, not the originating projects' assets or private documentation.
