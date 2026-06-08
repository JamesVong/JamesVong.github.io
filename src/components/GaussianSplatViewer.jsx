import { useEffect, useRef, useState } from 'react'
import { getRenderer, DEFAULT_RENDERER } from './splat/registry.js'

const ExpandIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14" aria-hidden="true">
    <path d="M1 1h4V0H0v5h1V1zm10-1v1h4v4h1V0h-5zM0 11v5h5v-1H1v-4H0zm15 0h-1v4h-4v1h5v-5z" />
  </svg>
)

// iPadOS Safari reports a desktop Mac UA, so UA sniffing alone misses it —
// the touch-point check is the standard disambiguator.
const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

const CompressIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14" aria-hidden="true">
    <path d="M5 0v5H0v1h6V0H5zm5 0v6h6V5h-5V0h-1zM0 10v1h5v5h1v-6H0zm10 6h1v-5h5v-1h-6v6z" />
  </svg>
)

// Splat viewer. `library` selects a renderer from the registry; `quality` selects
// the asset detail ('high' | 'fast'). Both are controlled by the parent.
export default function GaussianSplatViewer({ library = DEFAULT_RENDERER, quality }) {
  const wrapperRef = useRef(null)
  const containerRef = useRef(null)

  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isCSSFullscreen, setIsCSSFullscreen] = useState(false)

  const fullscreen = isFullscreen || isCSSFullscreen

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement))
    }
    document.addEventListener('fullscreenchange', handler)
    document.addEventListener('webkitfullscreenchange', handler)
    return () => {
      document.removeEventListener('fullscreenchange', handler)
      document.removeEventListener('webkitfullscreenchange', handler)
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    let cancelled = false
    let handle = null
    setError(false)
    setLoading(true)

    // Fresh inner div per mount so an engine's teardown never touches
    // React-managed nodes (avoids removeChild errors when switching).
    const viewerDiv = document.createElement('div')
    viewerDiv.style.cssText = 'width:100%;height:100%;'
    containerRef.current.appendChild(viewerDiv)

    const entry = getRenderer(library)
    entry
      .load()
      .then((mod) =>
        mod.mount(viewerDiv, {
          quality,
          onReady: () => { if (!cancelled) setLoading(false) },
          onError: () => { if (!cancelled) { setError(true); setLoading(false) } },
        }),
      )
      .then((h) => {
        handle = h
        if (cancelled) handle?.dispose?.()
      })
      .catch((err) => {
        if (cancelled) return
        console.error(`Splat renderer "${library}" error:`, err)
        setError(true)
        setLoading(false)
      })

    return () => {
      cancelled = true
      try { handle?.dispose?.() } catch (_) {}
      try { viewerDiv.remove() } catch (_) {}
    }
  }, [library, quality])

  function toggleFullscreen() {
    const el = wrapperRef.current
    if (!el) return

    // iOS/iPadOS's native fullscreen overlays a system swipe-down-to-exit
    // gesture that steals downward drags from the viewer, so prefer the CSS
    // fallback there even though requestFullscreen exists on iPadOS Safari.
    const apiSupported = !isIOS() && !!(el.requestFullscreen || el.webkitRequestFullscreen)

    if (apiSupported) {
      const active = document.fullscreenElement || document.webkitFullscreenElement
      if (!active) {
        ;(el.requestFullscreen || el.webkitRequestFullscreen).call(el)
      } else {
        ;(document.exitFullscreen || document.webkitExitFullscreen).call(document)
      }
    } else {
      setIsCSSFullscreen((p) => !p)
    }
  }

  return (
    <div ref={wrapperRef} className={`splat-wrapper${isCSSFullscreen ? ' css-fullscreen' : ''}`}>
      {loading && !error && (
        <div className="splat-overlay splat-loading">
          <span className="splat-spinner" aria-hidden="true" />
          <span>Loading 3D scene…</span>
        </div>
      )}
      {error && <div className="splat-overlay">3D scene unavailable</div>}
      <div ref={containerRef} className="splat-container" />
      <div className="splat-viewer-btns">
        <button
          className="splat-viewer-btn"
          onClick={toggleFullscreen}
          title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {fullscreen ? <CompressIcon /> : <ExpandIcon />}
        </button>
      </div>
    </div>
  )
}
