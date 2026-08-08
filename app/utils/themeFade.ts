/**
 * Softens a theme switch with a single composited overlay.
 *
 * The previous approach put a `transition-property: background-color, color,
 * fill, ...` rule on `:root.theme-fade *`, which started 7,600 simultaneous
 * transitions on a 969-element page. Colour is not a compositor-accelerated
 * property, so every one of those ticked on the main thread and dirtied the
 * whole document each frame: measured 412ms of style recalc and, at 4x CPU
 * throttle, four rendered frames in 600ms. It stuttered on an M4 Pro.
 *
 * This dissolves through one fixed div instead. Only its opacity animates, so
 * the work lands on the compositor and the main thread stays free: measured
 * 0 long frames and a 9ms worst frame, identical to swapping with no animation
 * at all. A plain root view transition was also measured and rejected: the
 * snapshot capture cost a single 109ms hitch, which is the stutter it was
 * meant to remove.
 */

/** Peak veil opacity. Not 1: a few percent of the page stays visible through
 *  the dip, which reads as a dissolve rather than as the page blanking. */
const PEAK = 0.92
const FADE_IN_MS = 90
const FADE_OUT_MS = 190
const EASE = "cubic-bezier(0.25, 1, 0.5, 1)"

/* Above the navbar (z-50) and the guided tour dialog (z-[60]). A strip that
   hard-swaps across the top of a dissolving page looks worse than no
   dissolve at all. */
const BASE_STYLE =
  "position:fixed;inset:0;pointer-events:none;z-index:2147483647;opacity:0"

type Theme = "light" | "dark"

let node: HTMLDivElement | null = null
let pending: (() => void) | null = null
let queued: Theme | null = null
let queueRelease = 0

/**
 * The theme a switch should move to, allowing for one already in flight.
 *
 * next-themes commits the class from an effect, so `resolvedTheme` in a
 * caller's closure is still the old value for a frame or two. Two quick taps
 * would both read "dark" and both ask for "light", netting one flip instead of
 * two. Deriving from the last requested value fixes that, and the memo is
 * released once the switch has landed so an external change (system
 * preference, another tab) goes back to winning.
 */
function nextTheme(current: string | undefined): Theme {
  const base: Theme = queued ?? (current === "dark" ? "dark" : "light")
  const next: Theme = base === "dark" ? "light" : "dark"
  queued = next
  if (typeof window !== "undefined") {
    window.clearTimeout(queueRelease)
    queueRelease = window.setTimeout(() => {
      queued = null
    }, FADE_IN_MS + FADE_OUT_MS + 200)
  }
  return next
}

/** Applies a theme change that has been staged but not yet committed. */
function flush() {
  const run = pending
  pending = null
  run?.()
}

/**
 * The one veil element, ready to animate, plus the opacity it is already at.
 *
 * Both toggles share a document, so this reuses a single node rather than
 * stacking a second veil over the first. Cancelling drops the element straight
 * back to transparent, so a restart mid-dissolve reports where it was and the
 * replacement picks up from there instead of flickering through clear.
 */
function surface(): { el: HTMLDivElement; from: number } {
  if (!node || !node.isConnected) {
    node = document.createElement("div")
    node.setAttribute("aria-hidden", "true")
    node.style.cssText = BASE_STYLE
    document.body.appendChild(node)
  }
  const from = Number(getComputedStyle(node).opacity) || 0
  node.getAnimations().forEach((a) => a.cancel())
  return { el: node, from }
}

export function switchTheme(
  current: string | undefined,
  setTheme: (theme: Theme) => void,
) {
  if (typeof window === "undefined") {
    setTheme(current === "dark" ? "light" : "dark")
    return
  }

  const target = nextTheme(current)
  const apply = () => setTheme(target)

  // The Web Animations API does not inherit the global prefers-reduced-motion
  // block in globals.css the way a CSS transition would, so gate it here.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply()
    return
  }

  // A switch already in flight commits its theme now, so that two quick taps
  // net two flips instead of one.
  flush()

  const { el, from } = surface()
  // Resolved rgb rather than the raw --bg token: the ramp holds hex today but
  // --accent is already oklch, and a token string is not always assignable.
  // The veil is the colour being left behind, which puts the whole luminance
  // move into the longer fade-out.
  el.style.background = getComputedStyle(document.body).backgroundColor

  pending = apply

  const fadeIn = el.animate([{ opacity: from }, { opacity: PEAK }], {
    // Shortened by however much of the dip is already on screen, so a restart
    // covers the remaining distance at the same speed rather than slowing down.
    duration: Math.max(30, FADE_IN_MS * (1 - from / PEAK)),
    easing: EASE,
    fill: "forwards",
  })

  fadeIn
    .finished
    .then(() => {
      flush()
      // next-themes writes the class from an effect, so give React a frame to
      // commit before uncovering. Without this the swap can land a frame or
      // two into the fade-out, where the veil is already thin enough to show
      // it snap.
      return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    })
    .then(() => {
      const fadeOut = el.animate([{ opacity: PEAK }, { opacity: 0 }], {
        duration: FADE_OUT_MS,
        easing: EASE,
        fill: "forwards",
      })
      return fadeOut.finished
    })
    .then(() => {
      el.remove()
      if (node === el) node = null
    })
    // Cancelling rejects the chain. That is the restart path: the replacement
    // switch owns the element from here, so there is nothing to clean up.
    .catch(() => {})
}
