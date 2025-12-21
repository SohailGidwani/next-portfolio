// haptics.ts
let hasUserGesture = false

if (typeof window !== "undefined") {
  const markGesture = () => {
    hasUserGesture = true
  }

  window.addEventListener("pointerdown", markGesture, { once: true })
  window.addEventListener("keydown", markGesture, { once: true })
}

export function triggerHaptic(duration: number = 15) {
  if (!hasUserGesture) return
  if (typeof window !== "undefined" && "vibrate" in window.navigator) {
    window.navigator.vibrate(duration)
  }
}
