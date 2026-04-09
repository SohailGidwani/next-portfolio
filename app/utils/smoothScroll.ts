const DURATION = 600
const NAVBAR_HEIGHT = 80

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

export function smoothScrollTo(
  target: HTMLElement | number,
  options?: { offset?: number; duration?: number }
) {
  const offset = options?.offset ?? NAVBAR_HEIGHT
  const duration = options?.duration ?? DURATION

  const targetY =
    typeof target === "number"
      ? target
      : target.getBoundingClientRect().top + window.scrollY - offset

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
