"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import { usePathname } from "next/navigation"

/** Fallback so a hung navigation can never freeze the page under a snapshot. */
const SETTLE_TIMEOUT_MS = 600

/** The destination half of the shared-portrait pair. */
const FIGURE_TARGET = "[data-vt-portrait-target]"

/**
 * The route a zoom last carried us into, if any.
 *
 * The return leg retraces the way in, which presupposes there was one. Below
 * the lg breakpoint the homepage print is display:none so the outbound cannot
 * zoom, while the /about print is visible at every width and would happily
 * zoom on the way back: arrive by a slide, leave by a zoom. Landing on /about
 * directly is the same story with no outbound at all.
 *
 * Module scope is the right lifetime, as it is for the print's assembly: it
 * survives client navigation and resets on a real page load.
 */
let zoomedInto: string | null = null

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
      document.querySelectorAll<HTMLElement>("[data-vt-portrait]").forEach((el) => {
        el.style.viewTransitionName = ""
      })
      delete document.documentElement.dataset.vtZoom
      document.documentElement.style.removeProperty("--vt-origin-x")
      document.documentElement.style.removeProperty("--vt-origin-y")
      // vtFigure deliberately survives this cleanup. It is what stops the
      // destination print from replaying its own entrance over a photo the
      // morph has already placed, and that rule has to outlive the transition:
      // dropping the attribute here would simply start the entrance late. The
      // next click clears it instead.
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

      // Clear the previous navigation's shared-figure name before anything can
      // claim it again. It is left set on purpose after a morph, so without
      // this the destination print would still be holding vt-portrait when the
      // next snapshot is captured, and a duplicate name makes Chrome skip the
      // whole transition rather than just the morph.
      delete document.documentElement.dataset.vtFigure

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

      // Two separate jobs, deliberately not the same flag.
      //
      // Morphing needs a print on BOTH sides: a source to name now and a
      // destination that will claim the same name. Only the homepage figure has
      // that, because only /about carries the target. Claiming the name on a
      // leg where the destination cannot answer leaves the old snapshot
      // unpaired, fading out alone at the position it came from.
      //
      // The zoom only needs a point to scale about, and both legs have one: on
      // the way out it is the print being approached, on the way back the print
      // being left behind. Splitting them is what lets the return mirror the
      // outbound path without risking an unpaired morph.
      const onScreen = (el: HTMLElement | null | undefined) =>
        !!el && el.getClientRects().length > 0

      // The homepage figure is `hidden lg:block`, so below 1024px there is no
      // source at all. Naming an unrendered element leaves the new side with
      // nothing to animate from, which shows up as the photo popping in.
      const source = document.querySelector<HTMLElement>("[data-vt-portrait]")
      const canMorph = source?.dataset.vtPortrait === url.pathname && onScreen(source)

      if (canMorph && source) {
        source.style.viewTransitionName = "vt-portrait"
        document.documentElement.dataset.vtFigure = "portrait"
      }

      const returning = document.querySelector<HTMLElement>("[data-vt-anchor]")
      const isRetrace =
        zoomedInto === window.location.pathname &&
        returning?.dataset.vtAnchor === url.pathname &&
        onScreen(returning)

      const zoomAnchor = canMorph ? source : isRetrace ? returning : null

      // Remember the way in only while it is still the way we came. Every other
      // navigation, the retrace included, leaves nothing further to mirror.
      zoomedInto = canMorph ? url.pathname : null

      if (zoomAnchor) {
        document.documentElement.dataset.vtZoom = "portrait"

        // The page pulls back toward the print and the next one grows out of
        // it, so the scale needs the print's centre as its origin. Measured
        // here rather than guessed in CSS: the figure moves with the viewport
        // width, and an origin even slightly off turns a move that is about
        // this photograph into a generic zoom.
        const box = zoomAnchor.getBoundingClientRect()
        const root = document.documentElement.style
        root.setProperty("--vt-origin-x", `${((box.left + box.width / 2) / window.innerWidth) * 100}%`)
        root.setProperty("--vt-origin-y", `${((box.top + box.height / 2) / window.innerHeight) * 100}%`)
      }

      targetRef.current = url.pathname
      arrivedRef.current = false

      // No preventDefault: Next's Link handler still runs and performs the
      // navigation, so every onClick along the way (haptics, closing the mobile
      // nav sheet) keeps working. This only brackets it with a snapshot.
      const transition = doc.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            let done = false
            const settle = () => {
              if (done) return
              done = true
              window.clearTimeout(timer)
              commitRef.current = null
              resolve()
            }

            /**
             * Arriving is not the same as having rendered the shared figure.
             * A route that misses its prefetch shows app/loading.tsx first, and
             * a snapshot taken against that skeleton finds no element holding
             * the name: the browser then pairs nothing, and the old portrait
             * fades out alone at its old position, which is worse than no morph
             * at all. So when a figure is pending, hold for it. The timeout
             * below is still the ceiling, and a plain crossfade is the fallback.
             */
            const settleWhenFigureIsReady = () => {
              if (!document.documentElement.dataset.vtFigure) {
                settle()
                return
              }
              const poll = () => {
                if (done) return
                if (document.querySelector(FIGURE_TARGET)) {
                  settle()
                  return
                }
                requestAnimationFrame(poll)
              }
              poll()
            }

            const timer = window.setTimeout(settle, SETTLE_TIMEOUT_MS)

            // The route may already have committed while the browser was
            // capturing, in which case there is no arrival left to wait on.
            if (arrivedRef.current) {
              settleWhenFigureIsReady()
              return
            }
            commitRef.current = settleWhenFigureIsReady
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
