// Registry of swappable Gaussian-splat renderers.
//
// Each entry lazily imports an adapter module that conforms to a single
// contract so the viewer can mount any of them interchangeably:
//
//   export async function mount(container, { quality, onReady, onError })
//     -> Promise<{ dispose(): void }>
//
//   container : a dedicated <div> owned by the viewer (React never touches its
//               children, so each engine can append/remove its own canvas freely)
//   quality   : 'high' | 'fast'  (ignored by renderers where supportsQuality=false)
//   onReady() : called once the scene is on screen — hides the loading overlay
//   onError(e): called on a fatal load/render failure — shows the error overlay
//
// Adding a library = add one adapter file + one entry here. Nothing else changes.

export const RENDERERS = [
  {
    id: 'playcanvas',
    label: 'PlayCanvas',
    note: 'native compressed-PLY engine',
    supportsQuality: true,
    load: () => import('./renderers/playcanvas.js'),
  },
]

export const DEFAULT_RENDERER = 'playcanvas'

export const getRenderer = (id) =>
  RENDERERS.find((r) => r.id === id) || RENDERERS[0]

// Shared scene framing, kept in one place so every adapter starts from the same
// viewpoint and the comparison is apples-to-apples. Camera up is -Y because of
// how this scene was captured (its vertical axis points down).
export const CAMERA = {
  up: [0, -1, 0],
  position: [-0.149, -0.218, -2.992],
  lookAt: [-0.176, 0.256, -0.390],
}

// Compressed PLYs (SuperSplat format). 'high' carries SH; 'fast' is stripped.
export const compressedAsset = (quality) =>
  quality === 'high' ? '/ckpt_last.compressed.ply' : '/ckpt_last_lower.compressed.ply'
