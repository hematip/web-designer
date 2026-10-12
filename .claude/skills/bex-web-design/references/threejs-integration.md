# Three.js for brand websites

Use when spatial composition, a model, camera choreography, lighting/materials, particles, or a shader materially supports the visual direction. **Choose and implement Three.js autonomously within the requested website scope whenever it is a good fit; the user does not need to name it again.** A distinctive brand atmosphere is a valid reason, alongside product explanation or interaction. Preserve explicit user constraints and accepted work. Three.js is a rendering capability, not a requirement for every site and not a substitute for the complete page.

## Choose the scene and implementation

During workflow step 5, describe what live rendering contributes, the before/transformation/resolved composition, how it relates to the brand, and the mobile/reduced-motion equivalent. In step 6, resolve the riskiest asset, shader, or integration question in an early representative slice, then complete the requested site. Keep the [cinematic target](cinematic-direction.md) and [asset fidelity](motion-and-assets.md). Do not add a new approval or research phase for an ordinary tool choice.

| Situation | Starting point |
| --- | --- |
| Product viewing, spatial narrative, responsive lighting, camera movement, or a purposeful shader | Three.js with the assets and renderer suited to the scene |
| Existing vanilla JavaScript or non-React site | Integrate Three.js into the existing architecture |
| React site where a declarative scene and component lifecycle help | Three.js with compatible React Three Fiber (R3F); preserve an existing working integration |
| Flat UI, a small transition, or an effect fully expressed with DOM/CSS | Keep CSS, [Motion](framer-motion-integration.md), or [GSAP](gsap-choreography.md) as appropriate |
| A fixed view that gains little from live rendering, or an actual runtime limitation | Consider a well-composed render, image, or video while retaining the chosen creative intent |

Three.js renders the scene; GSAP/Motion may coordinate animation; Lenis may supply smooth scrolling. None of these requires installing all the others. Read only the relevant branches below.

For a subject moving between page sections, read [continuous object storytelling](scroll-object-storytelling.md). It connects narrative ideation to one persistent rendering layer, HTML anchors, progress-to-pose mapping, and docking into another model. Choose a custom frame evaluator or a compatible timeline owner; Three.js object travel does not inherently require a GSAP timeline. The subject and destination are specific to the current brief, not necessarily a package or a full-page journey.

## Dependencies and scene ownership

Inspect the current manifest, lockfile, renderer, framework, and asset pipeline. Add `three` through the project's package manager when implementing the selected scene. Import needed addons from the same installed release, for example `three/addons/loaders/GLTFLoader.js`; do not mix core, addons, or decoder files from incompatible versions. For a no-build site, use consistent version-pinned module/import-map paths and verify asset serving. See [Three.js installation](https://threejs.org/manual/pages/installation.html). Do not install packages globally or merely to update this skill.

For R3F, verify peer compatibility before adding `@react-three/fiber`. The [installation guide](https://r3f.docs.pmnd.rs/getting-started/installation) reviewed on 2026-09-22 pairs Fiber 8 with React 18 and Fiber 9 with React 19; recheck against the actual releases. Add helpers such as Drei only when useful and compatible. Do not rewrite a working scene or upgrade React just to follow a preferred recipe. Initialize browser/GPU resources in the appropriate client lifecycle, leaving ordinary page content available during loading and server rendering.

Use the project's supported renderer. Choose WebGL/WebGPU, shader language, materials, and post-processing as a compatible set after checking the installed APIs and target browsers. A shader or pass from one rendering path is not automatically portable to another. Do not switch to an experimental or different backend merely to satisfy a trend.

## Assets, light, and composition

- Use approved or appropriately licensed models, textures, environments, and artwork; follow [component/asset sourcing](component-sourcing.md). Record the actual source. A library's license does not grant rights to every demo asset.
- For real products, preserve the supplied geometry, labels, proportions, color intent, and material opacity. Inspect model units, orientation, bounds, texture paths, and camera framing. Missing product geometry is a content gap; a generic mesh is not an exact reconstruction. Procedural abstract brand artwork is appropriate when the brief supports it.
- Prefer a suitable web asset format such as glTF/GLB. Use [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html); configure Draco, Meshopt, or KTX2 support only when the asset uses it, and verify decoder/transcoder delivery in the built site. A downloaded file is not evidence that it loads correctly.
- Resolve illumination and material response before adding bloom, transmission, particles, or other effects. Keep source color spaces consistent across [colors](https://threejs.org/docs/pages/Color.html), [textures](https://threejs.org/docs/pages/Texture.html), and renderer output; color textures and numeric data maps need different treatment. Check the selected post-processing path to avoid applying output conversion twice. Compare the rendered product and brand colors with approved references rather than assuming renderer defaults establish fidelity.
- Keep headlines, CTAs, navigation, and essential descriptions in semantic HTML. Compose the canvas with the same grid, padding, and text safe areas as the rest of the page. Decorative canvas layers must not capture intended clicks or scroll input; purposeful model controls need bounded behavior and an accessible HTML way to perform important actions.

## Rendering, animation, and scroll ownership

Use one rendering owner for each canvas. In a direct Three.js integration, use the installed renderer's `setAnimationLoop` for continuous rendering, or a deliberate on-demand strategy when the scene rests; do not also run an unrelated rendering loop for the same canvas. In R3F, let `Canvas` manage rendering and use `useFrame` for frame updates rather than creating another renderer or RAF. See [WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html) and [R3F hooks](https://r3f.docs.pmnd.rs/api/hooks).

Give each mesh, camera, material property, or uniform one animation writer. GSAP timelines may update owned Three.js values; the renderer displays them. If controls move a camera, define when they own it and when a scripted sequence takes over. Avoid a frame callback, GSAP tween, and React props all resetting the same transform. Motion's DOM components do not directly become Three.js mesh components; use a documented value bridge or a verified compatible adapter when one is needed, and remove subscriptions on teardown.

Keep [Lenis's single driver](lenis-integration.md#one-clock-and-one-scroll-owner). If GSAP already ticks Lenis, a Three.js/R3F render callback must not tick it again. If the renderer is deliberately the sole driver, use the documented custom-loop branch with the correct time units. Do not drive the page's smooth-scroll engine only from an on-demand canvas that stops rendering. Pausing offscreen canvas rendering must not stop the page's scroll driver; separate those lifecycles when necessary. Keep frame order and progress sources explicit; avoid advancing the same animation mixer from both elapsed time and scroll progress.

For R3F scenes that can rest, consider `frameloop="demand"`. Imperative camera, GSAP, or motion-value updates must request frames with `invalidate()` while active; otherwise values change without a visible render. Use `useFrame`/refs for continuous updates rather than per-frame React state. Follow [on-demand rendering](https://r3f.docs.pmnd.rs/advanced/scaling-performance); do not assume changing the mode alone integrates external animation.

## Responsive quality and fallback

Size the canvas from its actual container, reserve its space, and update the camera/projection and drawing buffer when dimensions change. Distinguish CSS size from GPU pixel dimensions, avoid double-applying pixel ratio, and set a sensible resolution/pixel budget for the scene and device. Recompose camera framing, safe areas, and object placement for mobile instead of stretching a desktop view. See [responsive rendering](https://threejs.org/manual/pages/responsive.html).

Load code and assets according to when they are needed. Keep an intentional poster or static composition visible until the scene is ready; never block the whole landing page behind a 3D loading screen. Use explicit loading/error handling, and retain usable content if a model, decoder, shader, GPU context, or browser capability fails. Remove or recover the enhancement coherently after context loss rather than leaving a blank canvas or infinite spinner.

Scale texture sizes, draw calls, shadows, post-processing, transparency, and render resolution to observed cost. Reuse geometry/materials and instance repeated objects where appropriate. Pause optional rendering offscreen or while the document is hidden; resume in a meaningful state. In a resting scene, ongoing rendering needs a reason. These are implementation choices, not universal numerical budgets or claims of guaranteed frame rate.

Respect reduced motion at first load and when the preference changes: remove optional camera travel, automatic spinning, particle drift, and scroll-driven spatial movement while retaining a complete composition and useful controls. The scene may render once or use an appropriate static asset; reduced motion does not require hiding all 3D content. Preserve reading order and direct-anchor destinations when long scroll/pin scenes simplify.

## Cleanup and embedded construction checks

Stop the owned render loop and animation callbacks before releasing resources. Dispose of scene-owned geometries, materials, textures, render targets, controls, and renderer resources as appropriate; removing an object from the scene does not free all GPU allocations. A material's disposal does not dispose its textures. Track shared ownership so one unmount cannot destroy an asset another scene still uses. See [Material disposal](https://threejs.org/docs/pages/Material.html#dispose) and [Texture disposal](https://threejs.org/docs/pages/Texture.html#dispose).

R3F manages many declaratively owned objects, but imported `primitive` objects and application-managed/shared caches need an explicit lifetime policy. Do not blindly dispose every traversed object or set `dispose={null}` everywhere. The official [R3F object lifecycle source](https://raw.githubusercontent.com/pmndrs/react-three-fiber/master/docs/API/objects.mdx) describes these exceptions. Ignore or release late loader results after unmount; clean up observers, events, animation bridges, controls, and object URLs owned by the scene.

Inside the existing construction pass, inspect the actual scene and its page integration:

- Correct asset delivery, framing, lighting, labels, material appearance, and before/midpoint/resolved composition.
- Desktop/mobile resizing, constrained widths, HTML hierarchy, pointer/keyboard access, and direct/reverse scroll behavior where applicable.
- Loading and failure fallbacks, reduced motion, visibility pause/resume, and interruption of camera or model controls.
- Teardown/remount without duplicate canvases, render loops, stale callbacks, or unintended growth in retained scene resources; required project build/runtime checks pass.

Record observed quality and unverified states through [review and release](review-and-release.md). This remains artifact inspection within construction, not a user-testing, analytics, business measurement, or post-launch monitoring phase.

Sources linked above were reviewed on **2026-09-22**. They support API/lifecycle guidance; selection heuristics, quality priorities, and workflow placement are this skill's implementation policy. Verify relevant release-specific APIs when adding or changing dependencies.
