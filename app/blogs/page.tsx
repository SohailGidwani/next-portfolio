"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import ThemeToggle from "@/app/components/ThemeToggle"
import { ArrowUpRight, Home } from "lucide-react"
import { useEffect, useState } from "react"
import Script from "next/script"

type Blog = {
  id: number
  title: string
  slug: string
  excerpt: string | null
  coverImageUrl: string | null
  createdAt: string
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs", { cache: "no-store" })
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Script
        id="blogs-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Blogs",
            description: "Articles and posts by Sohail Gidwani",
            url: "/blogs",
          }),
        }}
      />

      <div className="border-b border-border bg-card/60 backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            Back to portfolio
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Blogs</p>
          <h1 className="font-display text-4xl text-foreground sm:text-5xl">Notes, experiments, and write-ups</h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            Articles on AI, engineering, and the systems I like to build.
          </p>
        </motion.div>

        <div className="mt-10">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card/80 p-6">
                  <div className="h-40 rounded-xl bg-muted shimmer" />
                  <div className="mt-6 space-y-3">
                    <div className="h-5 w-3/4 rounded bg-muted shimmer" />
                    <div className="h-4 w-full rounded bg-muted shimmer" />
                    <div className="h-4 w-5/6 rounded bg-muted shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card/80 p-10 text-center text-sm text-muted-foreground">
              No blogs yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog, index) => (
                <Link key={blog.id} href={`/blogs/${blog.slug}`} className="block">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group flex h-full cursor-pointer flex-col rounded-3xl border border-border bg-card/80 shadow-[0_18px_50px_-40px_rgba(0,0,0,0.45)] transition hover:-translate-y-1 hover:border-primary/30"
                  >
                    <div className="relative h-48 w-full overflow-hidden rounded-t-3xl bg-background/70">
                      {blog.coverImageUrl ? (
                        <Image
                          src={blog.coverImageUrl}
                          alt={blog.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-xl text-foreground">{blog.title}</h3>
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                        {blog.excerpt || "Read more"}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        Read more
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
