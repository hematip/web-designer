// Kondor's frosted freeform panel shapes (brand panel grammar: one open, asymmetric organic silhouette that departs
// from its bounding box on every side; never a card, pill or symmetric blob). Paths are in objectBoundingBox units,
// so each shape scales with its content. `rest` is the settled outline; `drift` is a second outline of the same
// family with the same command structure (M + eight C), which the motion layer morphs towards as the page scrolls.
export const glassShapes = {
  // Wide, a lifted top-right bulge and an inward dip on the right (professional band).
  a: {
    rest: 'M0.05 0.22C0.07 0.07 0.25 0.03 0.45 0.04C0.62 0.05 0.7 0 0.86 0.02C0.97 0.04 1 0.16 0.98 0.32C0.96 0.46 0.92 0.56 0.95 0.7C0.98 0.86 0.9 0.98 0.72 0.97C0.54 0.96 0.4 1 0.22 0.98C0.06 0.96 0 0.86 0.02 0.7C0.03 0.54 0.03 0.38 0.05 0.22Z',
    drift: 'M0.04 0.26C0.08 0.08 0.28 0.01 0.5 0.03C0.66 0.05 0.76 0.03 0.88 0.05C0.99 0.08 0.99 0.22 0.97 0.38C0.95 0.52 0.95 0.6 0.97 0.74C0.99 0.9 0.86 0.99 0.68 0.98C0.5 0.97 0.36 0.98 0.2 0.97C0.05 0.95 0.01 0.84 0.02 0.66C0.03 0.52 0.02 0.4 0.04 0.26Z',
  },
  // Broad and calm, a soft bulge at the lower left and a notch at the top right (result panel, availability).
  b: {
    rest: 'M0.03 0.3C0.04 0.1 0.2 0.03 0.4 0.05C0.56 0.07 0.66 0.02 0.8 0.03C0.95 0.04 0.99 0.18 0.97 0.36C0.96 0.5 0.99 0.62 0.98 0.76C0.97 0.93 0.84 0.98 0.66 0.96C0.5 0.94 0.36 0.99 0.2 0.98C0.06 0.97 0.01 0.88 0.02 0.72C0.03 0.58 0.02 0.44 0.03 0.3Z',
    drift: 'M0.04 0.26C0.06 0.08 0.22 0.02 0.42 0.04C0.58 0.06 0.68 0.04 0.82 0.05C0.96 0.07 0.98 0.2 0.98 0.34C0.97 0.5 0.97 0.64 0.97 0.78C0.96 0.94 0.82 0.99 0.64 0.97C0.48 0.95 0.34 0.97 0.18 0.97C0.05 0.96 0.02 0.86 0.02 0.7C0.02 0.54 0.03 0.4 0.04 0.26Z',
  },
  // Upright, a rounded top-left shoulder and a long right side (eight-week panel, closing).
  c: {
    rest: 'M0.04 0.16C0.08 0.03 0.3 0.01 0.5 0.03C0.7 0.05 0.86 0.02 0.95 0.12C1 0.2 0.97 0.4 0.98 0.56C0.99 0.74 0.97 0.92 0.8 0.97C0.62 1 0.42 0.96 0.24 0.98C0.08 0.99 0.01 0.9 0.02 0.74C0.03 0.58 0 0.4 0.02 0.28C0.03 0.22 0.03 0.19 0.04 0.16Z',
    drift: 'M0.03 0.2C0.07 0.05 0.28 0.02 0.48 0.03C0.68 0.04 0.84 0.04 0.94 0.14C0.99 0.22 0.98 0.4 0.97 0.58C0.97 0.76 0.98 0.92 0.82 0.96C0.64 0.99 0.44 0.98 0.26 0.97C0.1 0.97 0.02 0.88 0.02 0.72C0.02 0.56 0.01 0.42 0.02 0.3C0.02 0.25 0.02 0.22 0.03 0.2Z',
  },
};
