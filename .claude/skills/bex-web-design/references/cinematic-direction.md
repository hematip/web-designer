# Cinematic direction and the creative quality gate

Read for every new concept/build, substantial redesign, or request to make motion more cinematic. This is the owner's explicit creative default across sites made with this skill. It is not a universal UX research finding and does not expand a narrow revision or override a different direction specified by the current user.

## Design the transformation, not a list of effects

A cinematic site makes a meaningful relationship visible through deliberate choreography: typography changes emphasis or composition, an interface reorganizes, a product/material changes context, a graphic motif resolves, or a subject connects chapters. An aperture/frame opening is one conditional mechanism, not the definition of cinematic design. Use [design diversity](design-diversity.md) to separate visual style, hero structure and scene mechanism before staging. Lenis supplies smooth timing; it cannot supply this idea. A fashionable font, a luxury palette, a rotating badge, or a sticky photo with tiny zoom is not a signature scene by itself.

Choose one strong motion thesis around a property of this brand or subject: an architectural threshold becomes the next space; a textile unfolds into a collection; a music waveform resolves into the artist's identity; a product detail expands into its use context. These are starting mechanisms, not stories or factual claims to copy into unrelated brands. A quiet, precise transformation can be striking; “cinematic” does not require frantic or constant movement.

Plan the opening composition and the transition that advances the narrative together. The opening need not contain a photograph, mask expansion or pinned scroll scene; the expressive signature can occur in the handoff or a later meaningful chapter. They may belong to one continuous scene. Give surrounding sections contrasting rhythm—movement, reading hold, release—so the signature moment has emphasis. Do not replace the page with a reel the visitor must watch to reach the product or action.

## Derive the story from the brand brief

Read the [Brand, UX and Creative Design Brief](brand-document-synthesis.md) for the proposition, slogan meaning, audience tasks/questions, source-supported proof, and creative opportunities. Turn a relevant idea into a specific change of composition or spatial relationship: what the visitor sees, what scroll transforms, and what meaning the resolved state communicates. Brand documents can inspire original motion even when they contain no animation examples. Keep source findings and creative hypotheses distinct.

Carry a narrative relationship across chapters with a recurring motif, shared subject, or meaningful handoff where useful; leave enough quiet space for reading and action. The promise can shape hierarchy and behavior as well as a hero headline. Do not repeat the slogan everywhere, invent product claims to make a scene dramatic, or add arbitrary movement to every section.

Proactively consider [continuous object storytelling](scroll-object-storytelling.md) here: can one identifiable subject change role or context across selected sections and make the proposition visible? A physical product may move into use; an interface card may become a workflow; a material or brand motif may connect origin and outcome. Choose a site-specific journey when useful, including its destination and reading holds. The subject can be 3D, DOM, SVG, imagery, or type; neither live 3D nor page-long travel is automatic. Keep brief-only work at the concept/storyboard stage and implement selected journeys during authorized builds.

## Mechanism palette — choose, combine, or invent

| Spatial mechanism | What makes it more than decoration | Mobile / reduced-motion translation |
| --- | --- | --- |
| Shared subject / layout transformation | The same object visibly moves from hero into a detail, gallery, or comparison composition; continuity replaces a cut between unrelated sections | Use shorter moves within one column; retain full product and text in static flow |
| [Continuous subject journey](scroll-object-storytelling.md) | A persistent subject passes through narrative roles across chapters and resolves into a meaningful destination; each move changes what the visitor understands | Recompose anchors and path for portrait reading; shorten travel or use coherent local handoffs; static mode preserves the subject's meaningful states |
| Pinned editorial sequence | One stable stage contains setup, transformation, readable reveal, and release; scroll distance corresponds to actual story beats | Shorten or unpin; keep an art-directed reveal or state change for motion-enabled phones, not only plain stacked cards |
| Spatial gallery or horizontal chapter | Scroll reveals a relationship between projects rather than an arbitrary sideways carousel | Offer vertical reading or explicit controls; translated panels cannot strand focus or the CTA |
| [Choreographed typography](text-motion.md) | A key phrase changes composition, creates a graphic relationship, or carries meaning into the next chapter; complete words/lines hold for reading | Preserve Persian shaping, semantic text and exact copy; adapt the movement unit and keep the complete reduced-motion message |
| Depth, camera, or material transition | Parallax layers, a camera move, or a shader exposes product form, material, scale, or setting | Use a lighter DOM/media approximation; static mode keeps the message and recognizable composition |
| Branded aperture or portal, when justified | A motif becomes a window into the product/world and opens into the next chapter; frame, subject, and title are choreographed together | Recompose around a portrait aperture with shorter travel; reduced motion shows the complete subject and chapter immediately |

The table is unranked: no row is preferred by position or carried over automatically. These are examples, not required effects; keep a genuinely frame-free alternative available when direction is open, and use only the mechanism selected from the brief. Choose a visual relationship the available assets can support; no faux 3D package distortions or made-up product interiors. Prefer fewer well-directed mechanisms over unrelated effects in every section.

## Compact scene contract

For the signature scene, record the following beside the implementation or in the brief. A short table is enough; this is not a questionnaire for the user.

- **Reason:** relevant brief finding/source, which proposition or slogan meaning and visitor question this transformation communicates, and its role in the page narrative.
- **Before / transformation / resolved frame:** geometry, focal point, layer order, text safe area, and what visibly changes. Describe the actual result, not “premium animation.”
- **Trigger and pacing:** entrance-triggered playback versus a scroll-scrubbed timeline; start/end, named beats, meaningful reading holds, and how the pin releases. For scrub, scroll range controls travel time; tween durations only allocate the range.
- **Continuity:** how the scene hands off to its neighbor and reconstructs on reverse scroll, fast skipping, and direct anchor entry.
- **Interaction:** where the real CTA remains reachable; how focus and fragment navigation reach a hidden/pinned chapter if one exists.
- **Adaptations:** motion-enabled phone composition, reduced-motion composition, asset/dependency failure fallback, and owned resources to clean up.

Use [GSAP choreography](gsap-choreography.md) for complex pinned/scrubbed timelines or [Motion integration](framer-motion-integration.md) for suitable React state/layout/scroll-linked scenes; follow [motion/asset contracts](motion-and-assets.md) for fidelity. Choose the engine to deliver the scene, not to substitute for its design. Use [Three.js integration](threejs-integration.md) when models, camera/light/material behavior, or a shader strengthen the direction; a rendering layer can work with either choreography path. First map the complete requested page with [landing architecture](landing-architecture.md) and representative [UX copy](ux-copywriting.md), then resolve the [visual direction](visual-direction.md). Build the signature scene early; it is normally the first representative slice when the main action and content are settled. An unresolved interaction or dense responsive layout can warrant the first construction slice instead. This is a build-order choice, not a lower creative target or reduced deliverable: continue through the other required sections for a full-page request. Do not first finish a generic static landing page and then add a fade to each section. If imagery is still pending, develop the timing and geometry in an isolated study; do not present placeholders or that study as a finished complete page.

## Creative gate — separate from functional pass

Inspect actual playback or manually traverse the scroll sequence; three stills alone do not prove pacing. Keep before/midpoint/resolved evidence and identify the scene and viewport. Check:

1. **Visible transformation:** framing, arrangement, depth, or a shared subject's role changes substantially enough to explain from the frames. Tiny translation/zoom plus fades alone fails the cinematic target.
2. **Brand relationship:** trace this movement to the brief's brand meaning and narrative purpose; inspect whether the actual scene expresses that idea rather than merely naming it in notes. Renaming the logo should not make the whole experience interchangeable with any other template.
3. **Differentiation:** compare the premise, hero structure, type/media relationship, mechanism and page rhythm with available prior or rejected concepts using [design diversity](design-diversity.md). Correct unjustified template reuse, not merely color/image differences. Explicitly approved reuse remains valid.
4. **Choreography:** foreground, typography, frame, or neighboring scenes have a coordinated relationship and a deliberate hold, not disconnected animations that happen at once. Static content may remain visible throughout.
5. **Control and finish:** the effect resolves cleanly; reverse, quick scroll, anchor entry, keyboard focus, and mobile do not reveal blank frames, ghost text, jumps, or inaccessible controls.
6. **Art-directed adaptation:** the motion-enabled phone version retains a distinctive moment at lower cost; reduced-motion and failure modes retain meaning, composition, and access without requiring motion.

If a craft check fails during authorized build work, revise the mechanism or staging—not merely the color palette. For review-only work, report the failure without changing the site. If available assets/tools block the scene, report the concrete limitation and deliver the supported alternative without claiming the original cinematic target was achieved. Never weaken a requested effect solely to avoid implementing it; never trade away user control to inflate its intensity.

Passing this gate is an evidenced design assessment, not measured conversion lift or proof the user will feel “wow.” A user rejection supersedes the agent's aesthetic verdict. No number of technical checks substitutes for inspecting the actual experience.

## Reference use

When inspiration is needed, inspect a small number of relevant live scenes or their source, record the observed transformation, and adapt the relationship. Do not treat a thumbnail, award badge, popularity, or article title as motion evidence. If a reference cannot be played, distinguish code-based inference from observed behavior. The [source map](research-sources.md#motion-implementation-and-inspiration) contains maintained starting points; refresh current API facts when installing libraries.
