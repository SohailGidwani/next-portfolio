"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import ThemeToggle from "@/app/components/ThemeToggle"
import { ArrowLeft, Home } from "lucide-react"
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
        const res = await fetch('/api/blogs', { cache: 'no-store' })
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
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-200 transition-colors duration-300 overflow-x-hidden">
      <Script id="blogs-ld" type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Blogs',
          description: 'Articles and posts by Sohail Gidwani',
          url: '/blogs'
        })
      }} />
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-950 py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
              <Home className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Link>
            <ThemeToggle />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-blue-900 dark:text-blue-400">Blogs</h1>
            <p className="text-xl text-gray-600 dark:text-slate-300">Articles and posts on things I build and learn.</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center text-gray-500 dark:text-slate-400">Loading...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-slate-400">No blogs yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, index) => (
              <motion.div key={blog.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-600">
                <div className="relative h-48 bg-gray-100 dark:bg-slate-700">
                  {blog.coverImageUrl ? (
                    <Image src={blog.coverImageUrl} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{blog.title}</h3>
                  <p className="text-gray-600 dark:text-slate-300 line-clamp-3 min-h-[3.5rem]">{blog.excerpt || 'Read more'}</p>
                  <Link href={`/blogs/${blog.slug}`} className="inline-flex items-center mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    Read more
                    <ArrowLeft className="w-0 h-0 opacity-0 -ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
