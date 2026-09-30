/**
 * A value that follows a moving target with a short catch-up.
 *
 * The scroll-driven flights (the name into the logo, section titles into the
 * navbar) are drawn from this rather than straight from the scroll position,
 * so a fast trackpad flick, which crosses a flight's whole range in a frame or
 * two, still shows the flight gliding instead of jumping to its end. Slow
 * scrolling moves the target a little each frame and the value stays right
 * with it, so it looks just as it did.
 *
 * `tau` is the time constant in seconds: the gap closes to about 5% in three
 * of them (0.085 gives a quarter-second glide).
 */
export function createChase(tau = 0.085) {
  let value: number | null = null
  let last = 0
  let resting = true

  return {
    /** Move toward `target`; returns the value to draw and whether it has arrived. */
    step(target: number, now: number) {
      if (value === null) {
        value = target
        last = now
        return { value, settled: true }
      }
      // After a rest, the first frame of a new movement counts as one frame,
      // not as all the time spent resting.
      const dt = resting ? 1 / 60 : Math.min(0.1, Math.max(0, (now - last) / 1000))
      last = now
      value += (target - value) * (1 - Math.exp(-dt / tau))
      // Close enough that nothing drawn from it can move by a visible pixel.
      if (Math.abs(target - value) < 0.004) value = target
      resting = value === target
      return { value, settled: resting }
    },
  }
}
