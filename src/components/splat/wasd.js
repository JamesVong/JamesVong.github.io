// Shared keyboard input for WASD camera movement, used by both renderer adapters.
// Tracks which movement keys are held, but only while the pointer is over the
// viewer (so it never hijacks page typing/scrolling) and not while typing in a
// field. Each adapter reads `state.keys` in its own frame loop and applies the
// translation in its engine's coordinate math.
export const MOVE_CODES = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'KeyQ'])

export function createKeyboardState(container) {
  const keys = new Set()
  let hovered = false

  const isTyping = () => {
    const a = document.activeElement
    return !!a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable)
  }

  const onEnter = () => { hovered = true }
  const onLeave = () => { hovered = false; keys.clear() }
  const onKeyDown = (e) => {
    if (hovered && !isTyping() && MOVE_CODES.has(e.code)) keys.add(e.code)
  }
  const onKeyUp = (e) => keys.delete(e.code)
  const onBlur = () => keys.clear()

  container.addEventListener('pointerenter', onEnter)
  container.addEventListener('pointerleave', onLeave)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', onBlur)

  return {
    keys,
    dispose() {
      container.removeEventListener('pointerenter', onEnter)
      container.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      keys.clear()
    },
  }
}
