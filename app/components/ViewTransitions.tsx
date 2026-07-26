"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import { usePathname } from "next/navigation"

/** Fallback so a hung navigation can never freeze the page under a snapshot. */
const SETTLE_TIMEOUT_MS = 600

/** useLayoutEffect warns during SSR; this component still renders there. */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

type ViewTransition = { finished: Promise<void>; skipTransition: () => void }
type DocumentWithVT = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition
}

/** `/` is 0, `/projects` is 1, `/projects/portage` is 2, and so on. */
const depthOf = (pathname: string) => pathname.split("/").filter(Boolean).length

/**
 * Route transitions built on the browser's View Transitions API.
 *
 * Deliberately NOT `experimental.viewTransition` + React's <ViewTransition>:
 * that boundary fires on every Suspense reveal, so the deferred widgets on this
 * site triggered four transitions during initial hydration. Driving
 * `startViewTransition` from a click means a transition can only ever happen in
 * response to a real navigation, which is the guarantee we actually want.
 *
 * One delegated listener covers every internal link, so no component has to opt
 * in and no new link can be forgotten.
 */
export default function ViewTransitions() {
  const pathname = usePathname()
  /** Route this navigation is heading to, or null when idle. */
  const targetRef = useRef<string | null>(null)
  /** True once the router has actually landed on that route. */
  const arrivedRef = useRef(false)
  /** Resolver handed over by the startViewTransition callback. */
  const commitRef = useRef<(() => void) | null>(null)

  /**
   * The two halves of this race can complete in either order, and both orders
   * happen in practice:
   *
   * startViewTransition does NOT run its callback synchronously; the browser
   * runs it after capturing the old state. A client-side navigation to a
   * prefetched route commits in well under that, so the route usually arrives
   * BEFORE there is any resolver to call. Registering the resolver from the
   * callback alone left nothing to fire it, and the timeout ended up pacing
   * every navigation.
   *
   * So each side records that it is ready and settles the transition if the
   * other side got there first.
   *
   * Layout effect, not passive: the browser suspends painting while it holds
   * the snapshot, and React flushes passive effects after paint, so useEffect
   * would never run at all here.
   */
  useIsomorphicLayoutEffect(() => {
    if (!targetRef.current || pathname !== targetRef.current) return
    arrivedRef.current = true
    const commit = commitRef.current
    commitRef.current = null
    commit?.()
  }, [pathname])

  useEffect(() => {
    const doc = document as DocumentWithVT

    const cleanup = () => {
      targetRef.current = null
      arrivedRef.current = false
      commitRef.current = null
      delete document.documentElement.dataset.nav
      delete document.documentElement.dataset.vtMorph
      document.querySelectorAll<HTMLElement>("[data-vt-title]").forEach((el) => {
        el.style.viewTransitionName = ""
      })
    }

    const onClick = (event: MouseEvent) => {
      // Anything that is not a plain left click keeps its native behaviour:
      // new tab, new window, download, middle click.
      if (event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = (event.target as Element | null)?.closest?.("a")
      if (!anchor) return
      if (anchor.target && anchor.target !== "_self") return
      if (anchor.hasAttribute("download")) return
      if (anchor.getAttribute("rel")?.includes("external")) return

      const href = anchor.getAttribute("href")
      if (!href || href.startsWith("#")) return

      const url = new URL(href, window.location.href)
      if (url.origin !== window.location.origin) return

      // Same page with a hash is a scroll, not a navigation: smoothScroll owns
      // it, and there is no DOM swap for the browser to animate anyway.
      if (url.pathname === window.location.pathname) return

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (!doc.startViewTransition || reduced) return

      const from = depthOf(window.location.pathname)
      const to = depthOf(url.pathname)
      // Siblings at the same depth crossfade: sliding sideways would imply a
      // hierarchy that does not exist.
      document.documentElement.dataset.nav = to > from ? "forward" : to < from ? "back" : "fade"

      // Morph the tapped card's title into the destination heading. Only the
      // clicked card is named: a duplicate view-transition-name in a single
      // snapshot makes the browser skip the whole transition.
      const title = anchor.parentElement?.querySelector<HTMLElement>("[data-vt-title]")
      if (title) {
        title.style.viewTransitionName = "vt-title"
        document.documentElement.dataset.vtMorph = "title"
      }

      targetRef.current = url.pathname
      arrivedRef.current = false

      // No preventDefault: Next's Link handler still runs and performs the
      // navigation, so every onClick along the way (haptics, closing the mobile
      // nav sheet) keeps working. This only brackets it with a snapshot.
      const transition = doc.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            // The route may already have committed while the browser was
            // capturing; if so there is nothing to wait for.
            if (arrivedRef.current) {
              resolve()
              return
            }
            let done = false
            const settle = () => {
              if (done) return
              done = true
              window.clearTimeout(timer)
              commitRef.current = null
              resolve()
            }
            const timer = window.setTimeout(settle, SETTLE_TIMEOUT_MS)
            commitRef.current = settle
          })
      )

      transition.finished.finally(cleanup)
    }

    // Capture phase: React attaches its listeners at the root container, so a
    // bubble-phase listener here would run only after Next's Link had already
    // called preventDefault and begun navigating.
    document.addEventListener("click", onClick, true)
    return () => {
      document.removeEventListener("click", onClick, true)
      cleanup()
    }
  }, [])

  return null
}
