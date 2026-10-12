# Motion and asset composition

Read for cinematic sections, product slides, responsive art direction, or visual defects. These composition rules are library-independent. For this skill's preferred smooth-scroll layer, follow [Lenis integration](lenis-integration.md); Lenis does not replace an animation timeline or renderer.

For new designs and stronger-motion requests, first use [cinematic direction](cinematic-direction.md) to establish the signature transformation and craft target; choose [GSAP choreography](gsap-choreography.md) or [Motion integration](framer-motion-integration.md) according to the scene and project stack. The fidelity and readability rules below constrain how to finish that scene, not whether to attempt a bold scene. A technically clean static layout with incidental parallax does not satisfy the cinematic target.

## Define the composition before the effect

For each animated region record the relevant geometry: viewport/content bounds, copy safe area, focal subject or typographic emphasis, product bounds when present, relevant graphic region, layer order, and reading state. An inner frame is conditional: type-led, open-field and interface compositions need not have one. A full-bleed region can contain an inset frame when that treatment is deliberately selected; do not invent the frame merely to animate its expansion.

Separate four responsibilities where needed:

- A layout wrapper owns grid placement, centering, and responsive sizing.
- When the composition requires a clip/frame, that layer owns clipping, border radius and background fill. Frameless composition does not need a decorative clipping wrapper.
- An entrance wrapper owns appearance transforms.
- A motion layer owns scroll-linked transforms.

Avoid multiple systems writing incompatible transforms to the same node. Centering with CSS translate and then replacing the transform in a timeline can shift otherwise correctly aligned copy.

## Choreograph complete states

| State | Composition question |
| --- | --- |
| Entry | Is the preceding section finished? Is the incoming subject legible and intentionally framed? |
| Transformation | Does expansion, travel, or reveal have an obvious spatial cause? |
| Reading hold | Can the viewer read without chasing the text? Is the product fully composed? |
| Overlap | Does the outgoing text disappear or become fully covered before conflicting incoming text is readable? |
| Exit | Is there a clear handoff without an unexplained empty region? |
| Reverse | Does scrolling back reconstruct the same scene cleanly? |
| Direct anchor | Does landing inside the page show the correct slide, header offset, and readable state? |

An opaque incoming panel must cover its intended region throughout the transition. A good final frame cannot excuse ghosted headings or old copy visible during stacking. Inspect frame clips, stacking contexts, and outgoing visibility together.

When a purposeful visitor-facing caption or control exists, keep it in the visible safe area through changing rounded corners and clips. This is a placement rule, not a requirement to invent a caption. Follow the [public-content boundary](ux-copywriting.md#public-content-and-internal-production-notes): image origin, generation notes, and inspiration records do not automatically become visible labels. Keep essential labels readable; intended decorative labels may appear once sufficient space exists. For material motion, retain midpoint and settled evidence as described in [review and release](review-and-release.md).

## Product fidelity and size

Inspect the approved image on white and on a contrasting background. A white bottle with a white photographic background requires a precise cutout or mask; a white-to-transparent blend can also erase the bottle body.

- Preserve original label pixels and packaging geometry wherever possible.
- Use genuine alpha or a precise silhouette mask when required. A CSS contour is appropriate only if it accurately follows the source at all intended scales; do not guess a generic bottle shape.
- Never apply `mix-blend-mode: multiply`, opacity, or a translucent mask to an opaque bottle merely to remove its white backdrop.
- Check colored graphics behind the cap, shoulder, label, and base. None should show through opaque packaging.
- Preserve the source aspect ratio. A fixed width plus fixed height, stretching grid item, flex shrink, or parent scale can defeat an apparently correct `object-fit` rule.
- Separate the visible packshot bounds from transparent padding in the file. Align the actual bottle and the copy's visual center.

If fixed sizing is requested, keep an explicit size token within the specified responsive range. On narrower screens, rearrange, stack, or give the composition more height first. A physically impossible fit needs a deliberate constrained fallback, not overflow hidden through the bottle.

Record whether an image is documentary, a product/project render, or atmospheric artwork in the internal asset record. Evaluate its meaning in the actual page context before choosing public wording: generated atmosphere does not need an automatic production caption, and invented imagery must not stand in for evidence of a real project, property, person, or result. Resolve a misleading use through the asset, presentation, or necessary clarification; do not simply conceal the distinction.

Image generators are useful for lifestyle scenes and approved edits. They may alter lettering, cap shape, or proportions. Inspect the output against the reference before accepting it as a product asset. If exact fidelity cannot be achieved with available tools, retain the approved source and adapt presentation.

## Pattern placement contract

Write down these choices before implementation:

| Property | Decision to record |
| --- | --- |
| Product mapping | Which original artwork belongs to each variant? |
| Containment | Whole section, inner frame, or product-art group? |
| Edge | Which bottom/side edge must the artwork touch? |
| Scale | Native aspect ratio; intended visible extent relative to product |
| Crop | Permitted or prohibited; which part can leave the frame? |
| Opacity | Original or explicitly approved fade |
| Layer order | Behind product, clear of copy, clipped by the correct frame |
| Responsive | How containment and alignment adapt without distortion |

Avoid `background-size: cover` when the complete pattern composition must remain visible. In revisions, preserve approved crop, repetition, scale, and opacity unless the requested delta changes them. In an authorized new concept, choose and record those treatments within the brand constraints; routine art direction does not need a separate approval question. For artwork with a white ground, use an exact matching ground, a suitable transparent source, or a tested blend on the decorative pattern layer alone. A pattern-only blend must not affect the product or copy.

When the user asks for a pattern flush with an inner frame, padding on the text group must not inset the pattern too. Clip the artwork at the frame boundary, independently of text spacing.

## Human depth, lighting, and video

Layer separation must preserve spatial believability. Foreground fruit can move more than the scene; a person's cutout must not float independently of hands, furniture, contact shadows, or the surrounding light. Use the unified photo if separating the subject introduces artifacts without useful visible depth.

For video, distinguish a landscape source from a landscape container. Filling a wide viewport with vertical footage is a crop; it does not create a native landscape composition. Check whether the face, hands, and product survive the crop. Obtain a properly composed source when necessary, or explicitly use an acceptable alternate presentation.

For a full-viewport expansion, animate the media frame from an intentional starting geometry to its final composition. Place overlay copy inside the correct visual boundary and reveal it only when there is room to read. Prevent the previous section from leaking into the settled viewport.

Preserve footage clarity. First use negative space, copy placement, a restrained local scrim, or a small text shadow to solve contrast. Avoid a blanket haze that changes the whole film. Inspect contrast on multiple frames, not only the poster.

Use muted inline autoplay only when it works in the host/browser, with a poster fallback and accessible controls. Respect reduced motion, pause offscreen playback when appropriate, and avoid loading all large media eagerly. A short loop needs a natural start/end relationship; shortening a film is an editorial choice, not merely changing a duration label.

## SVG as a narrative material

Choose SVG for suitable icons, diagrams, line illustration or an approved vector brand motif. A path reveal can explain a process, connect chapters or develop a sourced brand idea; it need not become another image-frame opening. Preserve approved logo geometry and keep meaningful text in semantic, script-safe content. Vector format is not proof of low rendering cost. [F11]

Use the existing animation engine: CSS for simple state transitions, Motion or GSAP when orchestration needs them, or native vector effects when the actual builder provides them. Do not introduce a legacy Framer Animator dependency from an article example. With native SVG, retain an intentional `viewBox`/aspect ratio and verify stroke clipping at responsive sizes. `pathLength` can normalize path-distance calculations for stroke dashes; a stroke reveal and morphing between path shapes are separate operations. Verify the chosen engine's API and shape compatibility before morphing. [F19]

For repeated inline SVGs, keep gradient/mask/clip IDs unique. Decorative SVGs should not receive focus or duplicate accessible names; informative diagrams need an accessible name or adjacent equivalent explanation. Design a complete static/reduced-motion state, scope loops to visible/relevant content and use the existing cleanup/ownership rules. Inspect actual paint cost when complex filters, large masks or many paths are involved. No mandatory animation library or always-on loop follows from choosing SVG.

Source IDs resolve in [the research record](research-sources.md#framer-guides-and-production-adaptation).

## Live 3D composition

Use [Three.js integration](threejs-integration.md) for suitable spatial scenes, model interaction, lighting/materials, or shaders. These fidelity and composition rules still apply: preserve actual product geometry, labeling, proportions, and opacity; stage the canvas around the page grid and HTML copy. Verify the rendered asset and intermediate camera states. The specialist reference covers compatible dependencies, render/animation ownership, loading, mobile cost, fallback, and cleanup.

## Scroll geometry and responsive continuity

When Lenis is involved, use the integration reference's single clock, navigation, reduced-motion, and cleanup rules. Smooth scrolling must preserve the composition and interaction contracts below.

When pinned sections or motion modes change, document height and anchor positions may change. Refresh the animation system's measurements and the smooth-scroll system's limits before restoring position. Stale scroll limits can clamp the visitor to the wrong section.

Use one consistent anchor-offset policy. CSS `scroll-margin`, smooth-scroll offsets, and manual calculations can accidentally apply the header offset twice. Check direct hash entry and in-page navigation separately.

Full viewport height alone does not repair a broken handoff. Check pin spacing, negative margins, clipping, image focal position, and the ownership of scale/translate. Keep accepted aperture or frame-opening behavior while correcting geometry.

For mobile, art-direct rather than merely shrink: choose a suitable crop or alternate portrait image, move copy away from faces and products, simplify a horizontal journey to a readable vertical sequence when needed, and preserve meaningful progress. Reduced-motion mode must expose all content in a logical order, not leave panels offscreen or invisible.
