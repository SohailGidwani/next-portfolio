const MIN_DURATION = 300
const MAX_DURATION = 700
const MS_PER_PIXEL = 0.35
const NAVBAR_HEIGHT = 80

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

export function smoothScrollTo(
  target: HTMLElement | number,
  options?: { offset?: number; duration?: number }
) {
  const offset = options?.offset ?? NAVBAR_HEIGHT

  const targetY =
    typeof target === "number"
      ? target
      : target.getBoundingClientRect().top + window.scrollY - offset

  // Distance-proportional by default: short hops feel snappy, long jumps
  // neither teleport nor drag.
  const distance = Math.abs(targetY - window.scrollY)
  const duration =
    options?.duration ??
    Math.min(MAX_DURATION, Math.max(MIN_DURATION, distance * MS_PER_PIXEL))

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo({ top: targetY, behavior: "auto" })
    return
  }

  const startY = window.scrollY
  const diff = targetY - startY

  if (Math.abs(diff) < 1) return

  let start: number | null = null

  function step(timestamp: number) {
    if (!start) start = timestamp
    const elapsed = timestamp - start
    const progress = Math.min(elapsed / duration, 1)

    window.scrollTo(0, startY + diff * easeOutQuart(progress))

    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

export function smoothScrollToId(
  id: string,
  options?: { offset?: number; duration?: number }
) {
  const el = document.getElementById(id)
  if (el) smoothScrollTo(el, options)
}

export function smoothScrollToTop(options?: { duration?: number }) {
  smoothScrollTo(0, { offset: 0, ...options })
}
