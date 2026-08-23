/**
 * Has the editorial portrait already assembled itself in this page session?
 *
 * The print builds itself once: photo, amber board, registration marks, caption
 * rule, credit. That is worth watching the first time and tiresome on the
 * fourth, and it actively fights the shared-element transition, which is trying
 * to say "this is the same print, it did not move" while the frame around it
 * rebuilds from nothing.
 *
 * Module scope is exactly the lifetime wanted, with no storage API involved. It
 * survives client-side navigation, because the bundle instance is the same
 * across a route change, and resets on a real page load, because that is a new
 * document. So: assembles on first arrival, static on every traversal after.
 *
 * Never read this during render on the server. Module state there is shared
 * between requests, so one visitor could suppress another visitor's animation,
 * and the markup would disagree with the client on hydration. Both accessors
 * are browser-only for that reason, and callers read them from effects.
 */
let assembled = false

export const hasAssembled = () => typeof window !== "undefined" && assembled

export function markAssembled() {
  if (typeof window === "undefined") return
  assembled = true
}
