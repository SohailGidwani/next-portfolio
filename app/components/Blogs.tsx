"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"

type Blog = {
  id: number
  title: string
  slug: string
  excerpt: string | null
  coverImageUrl: string | null
  createdAt: string
}

interface BlogsProps {
  setActiveSection: (section: string) => void
}

export default function Blogs({ setActiveSection }: BlogsProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          triggerHaptic(10)
          setActiveSection("blogs")
        }
      },
      { threshold: 0.3, rootMargin: "-10% 0px -10% 0px" }
    )
    const currentRef = sectionRef.current
    if (currentRef) observer.observe(currentRef)
    return () => { if (currentRef) observer.unobserve(currentRef) }
  }, [setActiveSection])

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs?limit=3', { cache: 'no-store' })
        const data = await res.json()
        setBlogs(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  return (
    <section id="blogs" ref={sectionRef} className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Journal</p>
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Latest notes on AI, systems, and thoughtful software.
            </h2>
          </div>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            onClick={() => triggerHaptic()}
          >
            View all
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-border bg-card/80 p-6">
                <div className="h-44 rounded-2xl bg-muted shimmer" />
                <div className="mt-6 space-y-3">
                  <div className="h-6 w-3/4 rounded bg-muted shimmer" />
                  <div className="h-4 w-full rounded bg-muted shimmer" />
                  <div className="h-4 w-5/6 rounded bg-muted shimmer" />
                  <div className="h-8 w-1/2 rounded-full bg-muted shimmer mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="group flex flex-col rounded-3xl border border-border bg-card/80 shadow-[0_18px_50px_-40px_rgba(0,0,0,0.45)]"
              >
                <div className="relative h-44 overflow-hidden rounded-t-3xl bg-background/70">
                  {blog.coverImageUrl ? (
                    <Image
                      src={blog.coverImageUrl}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      No image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl text-foreground line-clamp-2">{blog.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                    {blog.excerpt || "Read more"}
                  </p>
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
                    onClick={() => triggerHaptic()}
                  >
                    Read more
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
