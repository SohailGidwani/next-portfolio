"use client"

import { useRef, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react"

const HYSTERESIS_PX = 10
const DISMISS_VELOCITY = 0.11
const DISMISS_FRACTION = 0.5

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** Resistance above the origin: the further past the edge, the less it follows. */
const rubberband = (overshoot: number, dimension: number, constant = 0.55) =>
  (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot))

/**
 * Drag-to-dismiss for a bottom sheet.
 *
 * 1:1 downward tracking written straight to style.transform in rAF, a 10px
 * hysteresis so row taps stay taps, rubber-banding above the origin, and
 * dismissal on release velocity or past half the sheet's height. Extracted
 * from the mobile nav so every sheet dismisses with the same physics rather
 * than three near-copies drifting apart.
 *
 * Spread the returned handlers onto the sheet element and give it
 * `style={{ touchAction: "none" }}`.
 *
 * Pass `enabled: false` wherever the surface is not a bottom sheet: this
 * writes style.transform directly, which would wipe the centering transform
 * of a dialog that sits mid-screen at wider widths.
 */
export function useSheetDrag(onDismiss: () => void, enabled = true) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const drag = useRef({
    startX: 0,
    startY: 0,
    engaged: false,
    suppressClick: false,
    raf: 0,
    dy: 0,
    samples: [] as { t: number; y: number }[],
  })

  const applyTransform = () => {
    const el = sheetRef.current
    const d = drag.current
    d.raf = 0
    if (!el) return
    const h = el.getBoundingClientRect().height || 1
    const y = d.dy >= 0 ? d.dy : rubberband(d.dy, h)
    el.style.transform = `translateY(${y}px)`
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled) return
    const d = drag.current
    d.startX = event.clientX
    d.startY = event.clientY
    d.engaged = false
    d.suppressClick = false
    d.dy = 0
    d.samples = [{ t: event.timeStamp, y: event.clientY }]
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled) return
    const d = drag.current
    const el = sheetRef.current
    if (!el || d.samples.length === 0) return
    const dx = event.clientX - d.startX
    const dy = event.clientY - d.startY
    if (!d.engaged) {
      if (Math.abs(dy) < HYSTERESIS_PX || Math.abs(dy) <= Math.abs(dx)) return
      // A sheet scrolled away from its top should scroll, not drag.
      if (dy > 0 && el.scrollTop > 0) return
      d.engaged = true
      d.suppressClick = true
      el.setPointerCapture(event.pointerId)
    }
    d.dy = dy
    d.samples.push({ t: event.timeStamp, y: event.clientY })
    if (d.samples.length > 5) d.samples.shift()
    if (!d.raf) d.raf = requestAnimationFrame(applyTransform)
  }

  const onPointerEnd = () => {
    const d = drag.current
    const el = sheetRef.current
    if (d.raf) cancelAnimationFrame(d.raf)
    d.raf = 0
    const wasEngaged = d.engaged
    d.engaged = false
    if (!el || !wasEngaged) return

    const first = d.samples[0]
    const last = d.samples[d.samples.length - 1]
    const velocity =
      last && first && last.t > first.t ? (last.y - first.y) / (last.t - first.t) : 0
    const h = el.getBoundingClientRect().height || 1
    const dy = d.dy
    d.samples = []

    if (dy > 0 && (velocity > DISMISS_VELOCITY || dy > h * DISMISS_FRACTION)) {
      // Dismiss: keep travelling the way the finger sent it, then close.
      if (reducedMotion()) {
        el.style.transform = ""
        onDismiss()
        return
      }
      const exit = el.animate(
        [
          { transform: `translateY(${dy}px)`, opacity: 1 },
          { transform: `translateY(${h}px)`, opacity: 0.6 },
        ],
        {
          duration: Math.min(250, Math.max(140, (h - dy) * 0.5)),
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          fill: "forwards",
        }
      )
      const close = () => onDismiss()
      exit.finished.then(close).catch(close)
    } else {
      // Settle back on the sheet curve, from the rubber-banded position.
      const from = dy >= 0 ? dy : rubberband(dy, h)
      el.style.transform = ""
      if (!reducedMotion() && from !== 0) {
        el.animate(
          [{ transform: `translateY(${from}px)` }, { transform: "translateY(0px)" }],
          {
            duration: Math.min(350, Math.max(200, Math.abs(from) * 0.9)),
            easing: "cubic-bezier(0.32, 0.72, 0, 1)",
          }
        )
      }
    }
  }

  const onClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (drag.current.suppressClick) {
      event.preventDefault()
      event.stopPropagation()
      drag.current.suppressClick = false
    }
  }

  return {
    sheetRef,
    sheetHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
      onClickCapture,
    },
  }
}
