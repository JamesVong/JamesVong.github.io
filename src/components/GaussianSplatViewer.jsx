import { useEffect, useRef, useState } from 'react'

const ExpandIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14" aria-hidden="true">
    <path d="M1 1h4V0H0v5h1V1zm10-1v1h4v4h1V0h-5zM0 11v5h5v-1H1v-4H0zm15 0h-1v4h-4v1h5v-5z" />
  </svg>
)

const CompressIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14" aria-hidden="true">
    <path d="M5 0v5H0v1h6V0H5zm5 0v6h6V5h-5V0h-1zM0 10v1h5v5h1v-6H0zm10 6h1v-5h5v-1h-6v6z" />
  </svg>
)

// quality prop: 'high' | 'fast' — controlled by parent
export default function GaussianSplatViewer({ quality }) {
  const wrapperRef = useRef(null)
  const containerRef = useRef(null)
  const viewerRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    let active = true
    setLoading(true)
    setError(false)

    const splatFile = quality === 'high'
      ? '/ckpt_last.compressed.ply'
      : '/ckpt_last_lower.compressed.ply'

    // Fresh inner div each time so the viewer's dispose() never touches
    // React-managed nodes, avoiding the removeChild DOM error on switch.
    const viewerDiv = document.createElement('div')
    viewerDiv.style.cssText = 'width:100%;height:100%;'
    containerRef.current.appendChild(viewerDiv)

    ;(async () => {
      try {
        const { Viewer } = await import('@mkkellogg/gaussian-splats-3d')
        if (!active) return

        const viewer = new Viewer({
          rootElement: viewerDiv,
          selfDrivenMode: true,
          useBuiltInControls: true,
          cameraUp: [0, -1, 0],
          initialCameraPosition: [-0.149, -0.218, -2.992],
          initialCameraLookAt: [-0.176, 0.256, -0.390],
          sharedMemoryForWorkers: false,
        })

        viewerRef.current = viewer
        await viewer.addSplatScene(splatFile)
        if (active) { viewer.start(); setLoading(false) }
      } catch (err) {
        if (!active) return
        console.error('Splat viewer error:', err)
        setLoading(false)
        setError(true)
      }
    })()

    return () => {
      active = false
      if (viewerRef.current) {
        const v = viewerRef.current
        viewerRef.current = null
        // dispose() is async internally; catch both sync throws and async rejections
        try {
          Promise.resolve(v.dispose()).catch(() => {})
        } catch (_) {}
      }
      try { viewerDiv.remove() } catch (_) {}
    }
  }, [quality])

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      wrapperRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div ref={wrapperRef} className="splat-wrapper">
      {loading && !error && <div className="splat-overlay">Loading 3D scene…</div>}
      {error && <div className="splat-overlay">3D scene unavailable</div>}
      <div ref={containerRef} className="splat-container" />
      <button
        className="splat-fullscreen-btn"
        onClick={toggleFullscreen}
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? <CompressIcon /> : <ExpandIcon />}
      </button>
    </div>
  )
}
