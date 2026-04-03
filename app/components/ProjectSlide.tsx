"use client"

import Image, { StaticImageData } from "next/image"
import Link from "next/link"

interface ProjectSlideProps {
  id: string
  title: string
  description: string
  tags: string[]
  image: StaticImageData
  github: string
  opacity: number
  translateY: number
}

export default function ProjectSlide({
  id,
  title,
  description,
  tags,
  image,
  github,
  opacity,
  translateY,
}: ProjectSlideProps) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center px-6"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        pointerEvents: opacity > 0.3 ? "auto" : "none",
        transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
      }}
    >
      <div className="grid w-full max-w-6xl gap-12 lg:grid-cols-[1fr_1fr] items-center">
        <div className="relative aspect-video overflow-hidden rounded-2xl glass">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/80 via-transparent to-transparent" />
        </div>

        <div className="space-y-6">
          <h3 className="font-display italic text-4xl sm:text-5xl text-white leading-tight">
            {title}
          </h3>
          <p className="font-body text-sm text-white/35 leading-relaxed max-w-md">
            {description}
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="glass rounded-full px-3 py-1 font-mono text-[10px] text-white/30"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 pt-2">
            <Link
              href={`/projects/${id}`}
              className="font-body text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors"
            >
              View Project →
            </Link>
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="font-body text-xs tracking-[0.2em] uppercase text-white/30 hover:text-white/60 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
