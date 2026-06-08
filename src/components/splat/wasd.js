// Shared keyboard input for WASD camera movement, used by renderer adapters.
// Tracks which movement keys are held, gated on the viewer being visible on
// screen (not on pointer hover — moving the mouse off-canvas to type with both
// hands shouldn't stop movement) and not while typing in a field. The site has
// no text inputs, so the typing check is just defense-in-depth. Each adapter
// reads `state.keys` in its own frame loop and applies the translation in its
// engine's coordinate math.
export const MOVE_CODES = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'KeyQ'])

export function createKeyboardState(container) {
  const keys = new Set()
  let inView = false

  const isTyping = () => {
    const a = document.activeElement
    return !!a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable)
  }

  const io = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting
      if (!inView) keys.clear()
    },
    { threshold: 0.2 },
  )
  io.observe(container)

  const onKeyDown = (e) => {
    if (inView && !isTyping() && MOVE_CODES.has(e.code)) keys.add(e.code)
  }
  const onKeyUp = (e) => keys.delete(e.code)
  const onBlur = () => keys.clear()

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', onBlur)

  return {
    keys,
    dispose() {
      io.disconnect()
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      keys.clear()
    },
  }
}
