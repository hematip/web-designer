# Continuous object storytelling across sections

Use during narrative ideation when a recognizable subject could connect chapters, or when building/revising a subject that moves through a landing page. The owner wants this capability available proactively for any relevant site and element. Select it when the journey expresses the brief; do not wait for the user to name Three.js or ask for a floating object. Scope still governs the deliverable: a concept request gets a direction/storyboard; an authorized build gets the working journey and complete requested page.

For ideation, use the first two sections. For implementation, continue through the contract and selected rendering branch. The final case note records the observed origin of this pattern, not a template to reproduce.

## Find a narrative role for the subject

Read the existing brand/UX brief, section map, real copy, and assets. Ask internally: **what stays recognizable, what changes as the visitor learns, and where does that subject meaningfully belong at the end?** Identity may reside in form, material, color, label, silhouette, or a coherent graphic motif. Movement should reveal use, relationships, transformation, provenance, or context; visual atmosphere can also justify it when specific to the brand.

Choose a subject and span that fit the site. A journey may connect two sections, several chapters, or an entire landing page; it need not begin in the hero or end in the footer. Keep each chapter's question and evidence intact. If continuity has no useful role, choose another signature mechanism from [cinematic direction](cinematic-direction.md).

| Subject and context | Possible narrative relationship | Suitable starting representation |
| --- | --- | --- |
| Product, device, accessory, or package | Whole object -> useful detail -> real use or collection | Approved GLB when new views matter; cutout imagery for a fixed view |
| Software card, document, or interface module | Input -> meaningful workflow state -> supported outcome | Semantic DOM with a visual proxy or shared-layout transition |
| Architecture, furniture, or component | Detail -> assembly/context -> spatial relationship | Real model or layered approved renders |
| Textile, material, ingredient, or abstract motif | Origin/texture -> transformation -> application | SVG, layered imagery, procedural form, or a suitable shader |
| Editorial phrase, symbol, or brand mark | Recurring idea -> changing relationship -> resolved message | DOM/SVG, preserving language shaping and brand geometry |

These are prompts for original direction, not mandatory story arcs. Do not invent product internals, medical mechanisms, performance claims, or unsupported outcomes to justify a transformation. Preserve approved geometry, labeling, artwork, and copy. A missing exact model is an asset gap; use a faithful supported representation or identify the dependency instead of passing off generic geometry as the product.

## Storyboard the journey before choosing a library

Extend the existing scene contract rather than creating a new approval document. For each useful beat, record:

| Field | Decision |
| --- | --- |
| Meaning | Visitor question, supported answer, and the subject's role here |
| Composition | Subject location/visible size/orientation, text safe area, layer relationship |
| Progress | Entry, travel, reading hold, handoff/release, and what happens on reverse |
| Identity | Persistent properties; permitted variant/material/state changes |
| Destination | DOM anchor, local stage, another object's attachment point, or a deliberate exit |
| Adaptation | Motion-enabled phone composition; reduced-motion and asset-failure state |

Describe the before, midpoint and resolved frame concretely. Choose travel direction from the layout and reading sequence, including RTL, rather than automatically mirroring every physical rotation. Give text an actual reading interval. A spin, arc, depth move or scale change needs a compositional purpose; not every crossing needs a full turn. The subject can pass behind a panel, become part of a diagram, join a collection, land in a scene, or resolve beside the real action.

Pick the lightest representation that preserves the intended transformation. Flat art, text and interface elements often belong in DOM/SVG; perspective between layers can use a 2.5D composition. Use live 3D for meaningful changes of viewpoint, form, material, depth, or spatial interaction. Changing representation across chapters is possible but requires a deliberate visual and semantic handoff. An image cannot reveal an unseen product side faithfully without another approved view or actual geometry.

## Implementation contract

Keep the responsibilities explicit; adapt component names and architecture to the project:

```text
Semantic page and section anchors
        ↓ geometry + authoritative scroll position
Journey definition: beats, holds, paths, poses, destination
        ↓ pure target-state evaluation
One pose owner + optional secondary-motion group
        ↓
Persistent DOM/SVG layer or Three.js scene
```

- **Persistent identity:** retain one logical subject throughout the selected span. Avoid unrelated canvases/models per section that merely look similar and jump at boundaries. Multiple render surfaces are valid when intentionally coordinated and justified.
- **Layer ownership:** establish background, subject, copy/panels, navigation, and controls. A viewport overlay can use a transparent fixed canvas or a fixed DOM wrapper; a scoped sticky stage may suit a shorter journey. Reserve ordinary layout space with anchors and content wrappers. CSS sticky can provide a hold without a GSAP pin.
- **Input ownership:** keep a decorative overlay noninteractive with `pointer-events: none`. If the object has real controls, scope hit areas and provide meaningful HTML controls without covering navigation. A decorative duplicate of text/UI is not a second accessible control.
- **Progress ownership:** native scroll or one smooth-scroll owner provides position. One timeline or evaluator defines the subject's target state. One renderer displays it. Coordinate GSAP/Lenis/R3F without duplicate Lenis drivers or two writers for the same pose; see [GSAP](gsap-choreography.md) and [Three.js](threejs-integration.md).

Check stacking contexts rather than copying z-index numbers. Transforms, filters and containment on ancestors can change fixed positioning; put the persistent layer under an appropriate untransformed root when needed. An overlay outside a section is not automatically clipped by that section: design masks/occlusion explicitly. CSS layers can place HTML in front of the scene; objects within a 3D scene use their real depth relationship.

### Anchors and coordinate spaces

Use actual layout anchors for staging, framing and arrival. Name them by narrative role, such as overview, detail, assembly or result. Measure their visible bounds with the canvas/container bounds. Use the same coordinate frame for both; do not mix document positions, viewport positions, CSS pixels and drawing-buffer pixels.

For a fixed DOM layer, transform to positions relative to that layer's rectangle. For Three.js, map the desired screen point into the scene using the camera and a chosen depth/surface. A camera ray intersecting a staging plane works across camera poses; `Vector3.unproject` can also help when its depth is defined correctly. Treat a parallel/missing intersection as a geometry condition to resolve, not a position to propagate.

For the special case of a centered, unrotated perspective camera, unit zoom, and a plane parallel to the camera, this teaching sketch expresses the mapping (not a drop-in scene):

```js
const worldPerCssPixel =
  2 * Math.tan(verticalFovRadians / 2) * cameraToPlaneDistance / canvasRect.height;
const localX = anchorCenterX - canvasRect.left - canvasRect.width / 2;
const localY = anchorCenterY - canvasRect.top - canvasRect.height / 2;
const cameraPlaneX = localX * worldPerCssPixel;
const cameraPlaneY = -localY * worldPerCssPixel;
```

Do not reuse this shortcut unchanged with an orthographic/rotated camera, zoom, view offsets or another canvas geometry; use the actual projection. When an object approaches a perspective camera, decide whether its apparent screen size should grow or stay controlled. Derive scale from model bounds and intended visible dimensions at that depth, with margin for rotated bounds; do not multiply by a copied can-specific constant. Preserve an explicitly fixed product size.

Batch geometry reads before writes. Cache layout-dependent metrics and invalidate them after fonts/assets, responsive reflow, async content, container resize or pin refresh. Cache alone is insufficient for sticky, pinned or transformed anchors: model their scroll-relative behavior or measure the affected visual bounds deliberately. Avoid full-page layout reads and writes interleaved in every frame. Observe resize/layout changes without adding another set of listeners on each rebuild.

### Progress, poses and continuity

Express journey targets as a function of current progress, current geometry, selected variant and mode, so reloads, direct anchors, fast skips and reverse scroll resolve correctly. Do not depend solely on an enter event having run or increment rotation each time a scroll callback fires.

```js
// Framework-neutral design sketch; resolve geometry and render ownership in the project.
const p = clamp01((scrollPosition - beat.start) / (beat.end - beat.start));
const eased = p * p * (3 - 2 * p);
const target = evaluateJourney({ beat, progress: eased, metrics, variant, mode });
```

Handle zero-length/rebuilt ranges explicitly. Start/end positions come from the story and actual layout, not fixed magic scroll pixels or division by the entire document by default. Holds occupy a real range. Adjacent beats share an endpoint and, when travel should feel continuous, compatible direction/speed. Blend overlapping influences deliberately instead of allowing independent section callbacks to fight over the same object.

Use interpolation, authored keyframes, a Bezier/spline, or a supported timeline according to the path. A custom `useFrame` evaluator is sufficient for many journeys; GSAP can independently animate HTML. If a timeline supplies progress, let the evaluator own the object pose, or let the timeline own the pose directly; do not do both.

For rotations, define pivot and coordinate space. Quaternion interpolation suits orientation changes; a shortest-path interpolation between equivalent start/end orientations will not produce a full spin. Represent intentional turns with a continuous angle/explicit rotation track. Derive scroll-linked rotations from progress so reverse and seek remain stable.

Use delta-time damping where a soft catch-up helps. Lenis, numeric scrub and pose damping can accumulate excessive lag; choose the smoothing layers deliberately. On first load, deep-link entry, or a mode rebuild, initialize to the current meaningful pose instead of flying in from a stale/default origin. Keep optional time-based float and pointer response in a separate child group, attenuating them during reading or precise arrival. Direct progress determines the destination even when secondary motion uses time.

### Arrival in another object or layout

Define a named attachment point/marker in the destination model when possible. Compute its world position after the destination transforms are current. Convert into the moving object's parent space before assigning a local position. For exact seating, match orientation and scale as well; inspect pivots, model units, nested/nonuniform scaling and matrix updates. `localToWorld`/`worldToLocal` solve coordinate conversion, not the full narrative or a collision simulation.

Bring idle and pointer offsets to a suitable settled amplitude; precise contact usually requires zero offset. Blend or settle damping so the subject actually reaches its marker. Keep its existing scene identity if that is simplest; if reparenting is necessary, preserve the intended world pose and verify reverse transitions. Do not reparent on every frame. Reserve its place in repeated destination objects and use instancing where suitable. Animate secondary parts, such as a hinge or assembly, from the same story progress so arrival and response stay ordered during skips and reverse.

### Appearance, loading and controls

Retain geometry while changing an approved variant where the physical form is shared. Preload likely next assets; keep a loading/error state that preserves useful content. A material/texture crossfade may preserve continuity better than remounting the model. A WebGL `onBeforeCompile` customization is one option; check the installed renderer/API rather than treating it as portable to every Three.js backend. Preserve color management, UV alignment and label legibility. For shape-changing variants, plan a supported transition instead of silently stretching packaging.

Use light and grounding/shadows to connect the subject to the composition. Repeated objects can share resources or be instanced. Follow the existing [Three.js lifecycle, performance and fallback guidance](threejs-integration.md); a smooth-scroll library does not guarantee a fast scene.

For tuning complex journeys, expose a small development control panel or configuration: anchor offsets, screen-size intent, orientation/pivot, depth, path control points, beat/hold ranges and damping. Store exportable project parameters with clear units and responsive modes. Keep visitor-facing controls separate from development tools; do not rely on developer localStorage defaults for the shipped composition. A query-driven panel is optional, not a requirement to expose debugging on every public site.

## Adaptation and completion evidence

Recompose the path for narrow screens rather than shrinking the desktop coordinates. Protect reading and CTA areas; shorten travel, remove unnecessary pins, or choose local chapter handoffs when a viewport-wide journey becomes intrusive. Preserve the narrative relationship in the motion-enabled phone version.

Reduced motion and loading/GPU/asset failure need complete static or restrained compositions with the same information. Preserve meaningful anchor navigation when pin ranges change. Semantic content remains HTML; avoid a page-blocking model loader. These requirements come from the skill's existing accessibility and progressive-enhancement policy, not from the reference site's exact implementation.

Inside the normal construction pass, verify the chosen journey:

- Subject identity and approved artwork survive before/midpoint/resolved states and variant changes.
- Crossings, holds and the final destination express the chapter meaning and leave copy/actions readable.
- Forward/reverse, quick skipping, reload at mid-scroll and direct-anchor entry do not produce duplicate subjects, jumps or stale poses.
- Resize, font/content reflow, narrow/mobile composition and reduced-motion changes rebuild geometry coherently.
- Arrival matches the actual destination coordinate space; occlusion, pivots and secondary motion remain intentional.
- Failure and teardown/remount leave usable content without duplicate canvases, drivers, listeners or leaked owned resources.

Inspect actual motion as well as still frames and run relevant project checks. Do not claim observed smoothness, complete fidelity, successful model loading or measured performance from a source-code sketch alone. Keep the storyboard, tuned config and material evidence in the existing project record. This adds no research, analytics or post-launch phase.

## Origin case: Takdane, inspected 2026-09-29

The live [Takdane page](https://takdane.netlify.app/) and its delivered assets demonstrated a reusable relationship: one shared transparent fixed canvas carries a product from the opening into a product frame, through a story section, and into a shelf inside a 3D fridge. HTML anchors connect layout to the scene. The can journey is calculated in R3F frame updates with interpolation/damping; GSAP handles separate HTML effects, Lenis smooths scroll, and CSS sticky creates holds. Texture blending changes flavor without replacing the subject. The fridge destination is converted from local to world coordinates, and repeated shelf cans use instancing.

Observed software included Three.js r172, Next.js 14.2.35, GSAP/ScrollTrigger 3.15.0 and Lenis 1.3.26; these are dated evidence, not dependency pins for future projects. The two GLB files had no animation clips. A `?tune` view exposed can/fridge pose controls. Those findings support runtime choreography; they do not establish access to the original repository, the author's whole toolchain, or universal suitability of its loading/mobile choices.

Keep the architecture and method of reasoning. Design new subjects, chapter meanings, destinations, parameters and source assets for each brief. Do not carry over the can, fridge, textures, branding, fixed camera values, thresholds, complete turns, or loading overlay automatically. Publicly served assets are evidence, not blanket permission to reuse them.

Evidence: [page code](https://takdane.netlify.app/_next/static/chunks/app/page-fea02c78a12c62c6.js), [scene code](https://takdane.netlify.app/_next/static/chunks/653.c715372618dd64d2.js), [CSS](https://takdane.netlify.app/_next/static/css/53e25498b4c8a366.css), [can GLB](https://takdane.netlify.app/takdane/models/soda_can.glb), [fridge GLB](https://takdane.netlify.app/takdane/models/fridge.glb). Build-hashed links may change; this note preserves the verified findings without requiring the old deployment to stay online.

API references checked 2026-09-29: [Vector3 projection/unprojection](https://threejs.org/docs/pages/Vector3.html), [Object3D coordinate conversion](https://threejs.org/docs/pages/Object3D.html), [ray-plane intersection](https://threejs.org/docs/pages/Ray.html), [MathUtils interpolation/damping](https://threejs.org/docs/pages/MathUtils.html). Use the existing [Three.js](threejs-integration.md), [GSAP](gsap-choreography.md), and [Lenis](lenis-integration.md) references for compatible installed APIs and ownership; this guide supplies the narrative-to-implementation connection.
