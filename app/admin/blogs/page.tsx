"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Button } from "@/app/components/ui/button"
import Link from "next/link"
import { ArrowLeft, FileText, ImageIcon, Plus, Trash2, Upload } from "lucide-react"
import { toast } from "react-hot-toast"

type Blog = {
  id: number
  title: string
  slug: string
  excerpt: string | null
  coverImageUrl: string | null
  createdAt: string
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: "",
    slug: "",
    coverImageUrl: "",
    excerpt: "",
    content: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const loadBlogs = async () => {
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

  useEffect(() => {
    loadBlogs()
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      let coverUrl = form.coverImageUrl || ""
      if (file) {
        setUploading(true)
        const fd = new FormData()
        fd.append("file", file)
        fd.append("filename", file.name)
        const up = await fetch("/api/uploads/image", { method: "POST", body: fd })
        if (!up.ok) throw new Error("Image upload failed")
        const uploaded = await up.json()
        coverUrl = uploaded.url
      }
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug || undefined,
          coverImageUrl: coverUrl || undefined,
          excerpt: form.excerpt || undefined,
          content: form.content || undefined,
        }),
      })
      if (!res.ok) throw new Error("Failed to create")
      setForm({ title: "", slug: "", coverImageUrl: "", excerpt: "", content: "" })
      setFile(null)
      await loadBlogs()
      toast.success("Blog created successfully")
    } catch (e) {
      console.error(e)
      toast.error("Failed to create blog")
    } finally {
      setUploading(false)
      setSubmitting(false)
    }
  }

  const del = async (id: number) => {
    if (!confirm("Delete this blog?")) return
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      await loadBlogs()
      toast.success("Blog deleted")
    } catch (e) {
      console.error(e)
      toast.error("Failed to delete blog")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Admin</p>
            <h1 className="font-display text-3xl text-foreground sm:text-4xl">Blog Management</h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Portfolio
          </Link>
        </motion.div>

        {/* Add Blog Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 rounded-3xl border border-border bg-card/80 p-6 shadow-[0_20px_60px_-50px_rgba(0,0,0,0.4)]"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Plus className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-xl text-foreground">Create New Blog</h2>
              <p className="text-sm text-muted-foreground">Fill in the details to publish a new post</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Title
              </label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="My first blog"
                required
                className="rounded-xl border-border bg-background/70"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Slug (optional)
                </label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="my-first-blog"
                  className="rounded-xl border-border bg-background/70"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Cover Image URL (optional)
                </label>
                <Input
                  value={form.coverImageUrl}
                  onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                  placeholder="https://..."
                  className="rounded-xl border-border bg-background/70"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Or Upload Image
              </label>
              <div className="flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background/70 px-4 py-2.5 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground">
                  <Upload className="h-4 w-4" />
                  {file ? file.name : "Choose file"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                {file && (
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Excerpt (optional)
              </label>
              <Textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={3}
                placeholder="Short summary..."
                className="rounded-xl border-border bg-background/70"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Content
              </label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={10}
                placeholder="Write your blog content (Markdown supported)..."
                className="rounded-xl border-border bg-background/70 font-mono text-sm"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={submitting || uploading}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5"
              >
                {submitting || uploading ? "Publishing..." : "Publish Blog"}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Existing Blogs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-3xl border border-border bg-card/80 p-6 shadow-[0_20px_60px_-50px_rgba(0,0,0,0.4)]"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-xl text-foreground">Published Blogs</h2>
              <p className="text-sm text-muted-foreground">Manage your existing blog posts</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-48 animate-pulse rounded-lg bg-muted" />
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
                      <div className="h-4 w-20 animate-pulse rounded-lg bg-muted" />
                    </div>
                  </div>
                  <div className="h-8 w-20 animate-pulse rounded-xl bg-muted" />
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="rounded-2xl border border-border/70 bg-background/60 p-8 text-center">
              <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">No blogs published yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-4 transition hover:border-primary/30"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="font-display text-base text-foreground transition hover:text-primary"
                    >
                      {blog.title}
                    </Link>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="rounded-full bg-muted px-2 py-0.5 font-mono">{blog.slug}</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => del(blog.id)}
                    className="ml-4 rounded-xl opacity-0 transition group-hover:opacity-100"
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    Delete
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
