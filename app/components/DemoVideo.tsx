"use client"

import { useEffect, useRef, useState } from "react"

/**
 * A looping screen recording, in place of an animated GIF.
 *
 * GIF is the worst possible container for a 34-second terminal capture: it
 * cannot be optimized by next/image (which is why the original shipped
 * `unoptimized`), and it has no codec worth the name. The same recording as
 * H.264 is a quarter of the size with no visible loss on this content.
 *
 * A bare `<video autoplay loop>` ignores prefers-reduced-motion, so autoplay
 * is decided here: reduced motion gets the poster frame plus real controls,
 * which is the accessible equivalent rather than nothing at all.
 */
export default function DemoVideo({
  src,
  poster,
  label,
}: {
  src: string
  poster: string
  /** Describes the recording for anyone who cannot see it. */
  label: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")

    // Play only while on screen. On the deep dive this recording sits many
    // screens down, and starting it on mount pulled the whole file before a
    // reader had any chance of seeing it.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !query.matches) void video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.25 }
    )
    observer.observe(video)

    const onPreferenceChange = () => {
      setReduced(query.matches)
      if (query.matches) video.pause()
    }
    onPreferenceChange()
    query.addEventListener("change", onPreferenceChange)

    return () => {
      observer.disconnect()
      query.removeEventListener("change", onPreferenceChange)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      className="h-auto w-full"
      poster={poster}
      // autoPlay is intentionally absent: the effect above starts playback
      // only when motion is welcome, so the server markup stays neutral.
      loop
      muted
      playsInline
      // Nothing is fetched until the recording scrolls into view; the poster
      // holds the space in the meantime.
      preload="none"
      controls={reduced}
      aria-label={label}
    >
      <source src={src} type="video/mp4" />
      {label}
    </video>
  )
}
