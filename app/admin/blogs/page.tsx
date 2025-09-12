"use client"

import { useEffect, useState } from 'react'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import Link from 'next/link'
import { Home, Trash2 } from 'lucide-react'

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
    title: '',
    slug: '',
    coverImageUrl: '',
    excerpt: '',
    content: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const loadBlogs = async () => {
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

  useEffect(() => { loadBlogs() }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug || undefined,
          coverImageUrl: form.coverImageUrl || undefined,
          excerpt: form.excerpt || undefined,
          content: form.content || undefined,
        }),
      })
      if (!res.ok) throw new Error('Failed to create')
      setForm({ title: '', slug: '', coverImageUrl: '', excerpt: '', content: '' })
      await loadBlogs()
      alert('Blog created')
    } catch (e) {
      console.error(e)
      alert('Failed to create blog')
    } finally {
      setSubmitting(false)
    }
  }

  const del = async (id: number) => {
    if (!confirm('Delete this blog?')) return
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      await loadBlogs()
    } catch (e) {
      console.error(e)
      alert('Failed to delete')
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-200">
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-400">Blog Admin</h1>
          <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
            <Home className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Link>
        </div>

        <Card className="mb-8 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Add Blog</CardTitle>
            <CardDescription>Fill in the details and submit to add a blog post.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid grid-cols-1 gap-4">
              <div>
                <label className="block mb-1 text-sm">Title</label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="My first blog" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm">Slug (optional)</label>
                  <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="my-first-blog" />
                </div>
                <div>
                  <label className="block mb-1 text-sm">Cover Image URL (optional)</label>
                  <Input value={form.coverImageUrl} onChange={e => setForm({ ...form, coverImageUrl: e.target.value })} placeholder="https://..." />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm">Excerpt (optional)</label>
                <Textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={3} placeholder="Short summary..." />
              </div>
              <div>
                <label className="block mb-1 text-sm">Content</label>
                <Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={10} placeholder={"Write your blog content..."} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Add Blog'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Existing Blogs</CardTitle>
            <CardDescription>Click a title to view. Delete to remove.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-gray-500 dark:text-slate-400">Loading...</div>
            ) : blogs.length === 0 ? (
              <div className="text-gray-500 dark:text-slate-400">No blogs yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-gray-200 dark:border-slate-700">
                      <th className="py-2 pr-4">Title</th>
                      <th className="py-2 pr-4">Slug</th>
                      <th className="py-2 pr-4">Created</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map(b => (
                      <tr key={b.id} className="border-b border-gray-100 dark:border-slate-800">
                        <td className="py-2 pr-4"><Link href={`/blogs/${b.slug}`} className="text-blue-600 dark:text-blue-400 hover:underline">{b.title}</Link></td>
                        <td className="py-2 pr-4 text-gray-500 dark:text-slate-400">{b.slug}</td>
                        <td className="py-2 pr-4 text-gray-500 dark:text-slate-400">{new Date(b.createdAt).toLocaleString()}</td>
                        <td className="py-2">
                          <Button variant="destructive" onClick={() => del(b.id)} className="inline-flex items-center gap-1">
                            <Trash2 className="w-4 h-4" /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

