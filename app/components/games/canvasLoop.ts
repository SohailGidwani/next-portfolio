/** Draws one frame. `t` is seconds since the scene opened, `dt` the frame step. */
export type Painter = (ctx: CanvasRenderingContext2D, t: number, dt: number) => void

/**
 * Runs a full-bleed canvas scene: sizes it for the device pixel ratio, calls
 * `setup` again whenever the canvas resizes (so scenes lay themselves out in
 * CSS pixels), and paints every frame until the returned cleanup runs. When
 * `still` (reduced motion) it paints a single settled frame at `stillAt`
 * seconds instead of looping.
 */
export function runCanvas(
  canvas: HTMLCanvasElement,
  still: boolean,
  setup: (width: number, height: number) => Painter,
  stillAt = 30,
): () => void {
  const ctx = canvas.getContext("2d")
  if (!ctx) return () => {}

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  let paint: Painter = () => {}
  let width = 0
  let height = 0

  const size = () => {
    width = canvas.clientWidth
    height = canvas.clientHeight
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    paint = setup(width, height)
  }

  const draw = (t: number, dt: number) => {
    ctx.clearRect(0, 0, width, height)
    paint(ctx, t, dt)
  }

  size()
  let raf = 0
  const start = performance.now()
  let last = start
  const frame = (now: number) => {
    // Clamped so a backgrounded tab does not jump the scene forward at once.
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    draw((now - start) / 1000, dt)
    raf = requestAnimationFrame(frame)
  }

  if (still) draw(stillAt, 0)
  else raf = requestAnimationFrame(frame)

  const observer = new ResizeObserver(() => {
    size()
    if (still) draw(stillAt, 0)
  })
  observer.observe(canvas)

  return () => {
    cancelAnimationFrame(raf)
    observer.disconnect()
  }
}

export const rand = (min: number, max: number) => min + Math.random() * (max - min)
export const pick = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)]
export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
/** Ease-out cubic on 0..1, for things growing in. */
export const grow = (p: number) => 1 - Math.pow(1 - clamp(p, 0, 1), 3)
