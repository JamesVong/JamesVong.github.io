// Adapter: PlayCanvas engine — renders the SuperSplat compressed PLY with its
// *native* gsplat handler (this is the format's home engine and the most
// mobile-tuned candidate). Engine-only init: graphics device + minimal set of
// component systems / resource handlers, plus a small orbit controller since
// CameraControls isn't part of the core engine package.
import * as pc from 'playcanvas'
import { CAMERA, compressedAsset } from '../registry.js'
import { createKeyboardState } from '../wasd.js'

export async function mount(container, { quality, onReady, onError }) {
  let disposed = false
  let app = null
  let ro = null
  let canvas = null
  const detachers = []

  try {
    canvas = document.createElement('canvas')
    // touch-action: none hands all gestures on the canvas to us instead of the
    // browser (otherwise drags scroll/refresh the page and pinches zoom the tab).
    canvas.style.cssText =
      'width:100%;height:100%;display:block;touch-action:none;' +
      '-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;'
    container.appendChild(canvas)

    const device = await pc.createGraphicsDevice(canvas, {
      deviceTypes: ['webgl2'],
      antialias: false,
    })
    if (disposed) { canvas.remove(); return makeHandle() }

    const opts = new pc.AppOptions()
    opts.graphicsDevice = device
    opts.componentSystems = [pc.CameraComponentSystem, pc.GSplatComponentSystem]
    opts.resourceHandlers = [pc.GSplatHandler]

    app = new pc.AppBase(canvas)
    app.init(opts)
    app.setCanvasFillMode(pc.FILLMODE_NONE)
    app.setCanvasResolution(pc.RESOLUTION_AUTO)

    // Camera
    const cam = new pc.Entity('camera')
    cam.addComponent('camera', {
      clearColor: new pc.Color(0.1, 0.16, 0.24),
      fov: 50,
      farClip: 1000,
      nearClip: 0.01,
    })
    app.root.addChild(cam)

    // Minimal orbit controller. Up is -Y to match this capture's orientation
    // (its vertical axis points down). Start view picked via an on-screen
    // readout while orbiting to a good framing of the space.
    const target = new pc.Vec3(-0.112, 0.257, 0.223)
    let yaw = 174.3
    let pitch = -11.5
    let distance = 3
    const applyCam = () => {
      const p = (pitch * Math.PI) / 180
      const y = (yaw * Math.PI) / 180
      cam.setPosition(
        target.x + distance * Math.cos(p) * Math.sin(y),
        target.y + distance * Math.sin(p),
        target.z + distance * Math.cos(p) * Math.cos(y),
      )
      cam.lookAt(target.x, target.y, target.z, 0, -1, 0)
    }
    applyCam()

    // Pointer interaction, tracked per pointerId so touch gestures resolve from
    // how many fingers are down rather than mouse buttons:
    //   mouse: left drag orbits, right/middle drag pans, wheel zooms
    //   touch: one finger orbits, two fingers pinch-zoom + pan
    // Capturing the pointer keeps the gesture even if a finger slides outside
    // the canvas mid-drag (otherwise the browser reclaims it as a page scroll).
    const pointers = new Map()
    let mode = null // 'orbit' | 'pan' | 'gesture'
    let lastX = 0
    let lastY = 0
    let gestureDist = 0
    let gestureMidX = 0
    let gestureMidY = 0

    const panBy = (dx, dy) => {
      // Pan the target along the camera's screen-space axes (entity right/up),
      // scaled by distance so it feels consistent at any zoom.
      const f = distance * 0.0015
      const right = cam.right
      const up = cam.up
      target.x += right.x * -dx * f + up.x * dy * f
      target.y += right.y * -dx * f + up.y * dy * f
      target.z += right.z * -dx * f + up.z * dy * f
    }
    const refreshGestureOrigin = () => {
      const [a, b] = [...pointers.values()]
      gestureDist = Math.hypot(a.x - b.x, a.y - b.y)
      gestureMidX = (a.x + b.x) / 2
      gestureMidY = (a.y + b.y) / 2
    }
    const refreshMode = () => {
      const list = [...pointers.values()]
      if (list.length >= 2) {
        mode = 'gesture'
        refreshGestureOrigin()
      } else if (list.length === 1) {
        const p = list[0]
        mode = p.type === 'mouse' && p.button !== 0 ? 'pan' : 'orbit'
        lastX = p.x
        lastY = p.y
      } else {
        mode = null
      }
    }
    const onDown = (e) => {
      canvas.setPointerCapture(e.pointerId)
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, type: e.pointerType, button: e.button })
      refreshMode()
    }
    const onUpOrCancel = (e) => {
      pointers.delete(e.pointerId)
      try { canvas.releasePointerCapture(e.pointerId) } catch (_) {}
      refreshMode()
    }
    const onMove = (e) => {
      const p = pointers.get(e.pointerId)
      if (!p || !mode) return
      p.x = e.clientX
      p.y = e.clientY

      if (mode === 'gesture') {
        const prevDist = gestureDist
        const prevMidX = gestureMidX
        const prevMidY = gestureMidY
        refreshGestureOrigin()
        if (prevDist > 0 && gestureDist > 0) {
          distance = Math.max(0.4, Math.min(20, distance * (prevDist / gestureDist)))
        }
        panBy(gestureMidX - prevMidX, gestureMidY - prevMidY)
      } else {
        const dx = p.x - lastX
        const dy = p.y - lastY
        lastX = p.x
        lastY = p.y
        if (mode === 'orbit') {
          // Up vector is -Y, which mirrors both screen axes, so both deltas are
          // added (not subtracted) to make drag direction match a normal orbit.
          yaw += dx * 0.3
          pitch = Math.max(-89, Math.min(89, pitch - dy * 0.3))
        } else {
          panBy(dx, dy)
        }
      }
      applyCam()
    }
    const onWheel = (e) => {
      e.preventDefault()
      distance = Math.max(0.4, Math.min(20, distance * (1 + Math.sign(e.deltaY) * 0.1)))
      applyCam()
    }
    const onContextMenu = (e) => e.preventDefault()
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerup', onUpOrCancel)
    canvas.addEventListener('pointercancel', onUpOrCancel)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('contextmenu', onContextMenu)
    detachers.push(() => {
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointerup', onUpOrCancel)
      canvas.removeEventListener('pointercancel', onUpOrCancel)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('contextmenu', onContextMenu)
    })

    // WASDQE: translate the orbit target along the camera's own axes (forward is
    // the look direction, so W goes forward; E/Q move along screen-up), scaled by
    // zoom distance. The camera follows since its position is derived from target.
    const kb = createKeyboardState(container)
    detachers.push(() => kb.dispose())
    const onUpdate = (dt) => {
      if (!kb.keys.size) return
      const sp = distance * 0.9 * dt
      const f = cam.forward
      const r = cam.right
      const u = cam.up
      if (kb.keys.has('KeyW')) { target.x += f.x * sp; target.y += f.y * sp; target.z += f.z * sp }
      if (kb.keys.has('KeyS')) { target.x -= f.x * sp; target.y -= f.y * sp; target.z -= f.z * sp }
      if (kb.keys.has('KeyD')) { target.x += r.x * sp; target.y += r.y * sp; target.z += r.z * sp }
      if (kb.keys.has('KeyA')) { target.x -= r.x * sp; target.y -= r.y * sp; target.z -= r.z * sp }
      if (kb.keys.has('KeyE')) { target.x += u.x * sp; target.y += u.y * sp; target.z += u.z * sp }
      if (kb.keys.has('KeyQ')) { target.x -= u.x * sp; target.y -= u.y * sp; target.z -= u.z * sp }
      applyCam()
    }
    app.on('update', onUpdate)
    detachers.push(() => app.off('update', onUpdate))

    // Splat asset (native compressed-PLY load)
    const asset = new pc.Asset('splat', 'gsplat', { url: compressedAsset(quality) })
    asset.on('error', (err) => { if (!disposed) onError?.(err) })
    asset.ready(() => {
      if (disposed) return
      const e = new pc.Entity('splat')
      e.addComponent('gsplat', { asset })
      app.root.addChild(e)
      onReady?.()
    })
    app.assets.add(asset)
    app.assets.load(asset)

    app.start()

    const resize = () => app.resizeCanvas(container.clientWidth, container.clientHeight)
    resize()
    ro = new ResizeObserver(resize)
    ro.observe(container)
  } catch (err) {
    if (!disposed) onError?.(err)
  }

  function makeHandle() {
    return {
      dispose() {
        disposed = true
        try { ro?.disconnect() } catch (_) {}
        detachers.forEach((fn) => { try { fn() } catch (_) {} })
        // app.destroy() destroys the graphics device (frees GPU resources) but
        // only drops the gl reference. Lose the context explicitly so the GPU
        // memory is reclaimed immediately rather than waiting on GC.
        const gl = canvas?.getContext('webgl2')
        if (app) { try { app.destroy() } catch (_) {} app = null }
        try { gl?.getExtension('WEBGL_lose_context')?.loseContext() } catch (_) {}
        try { canvas?.remove() } catch (_) {}
      },
    }
  }

  return makeHandle()
}
