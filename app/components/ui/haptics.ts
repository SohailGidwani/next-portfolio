// haptics.ts
export function triggerHaptic(duration: number = 15) {
  if (typeof window !== 'undefined' && 'vibrate' in window.navigator) {
    window.navigator.vibrate(duration);
  }
} 