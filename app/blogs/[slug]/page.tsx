import { initDb, pool } from '@/lib/db'
import ThemeToggle from '@/app/components/ThemeToggle'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Script from 'next/script'
import ProgressiveImage from '@/app/components/ProgressiveImage'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await initDb()
  const { rows } = await pool.query('SELECT title, excerpt FROM blogs WHERE slug = $1 LIMIT 1', [params.slug])
  const blog = rows[0]
  if (!blog) return { title: 'Blog Not Found' }
  return {
    title: `${blog.title} - Blog` ,
    description: blog.excerpt || undefined,
  }
}

export default async function BlogDetail({ params }: Props) {
  await initDb()
  const { rows } = await pool.query(
    'SELECT id, title, slug, excerpt, content, cover_image_url AS "coverImageUrl", created_at AS "createdAt" FROM blogs WHERE slug = $1 LIMIT 1',
    [params.slug]
  )
  const blog = rows[0]

  if (!blog) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-200">
        <div className="container mx-auto px-4 py-20">
          <Link href="/blogs" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Link>
          <h1 className="text-3xl font-bold">Blog not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-200 transition-colors duration-300 overflow-x-hidden">
      <Script id="blogpost-ld" type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: blog.title,
            description: blog.excerpt || undefined,
            datePublished: blog.createdAt,
            dateModified: blog.createdAt,
            image: blog.coverImageUrl || undefined,
            author: { '@type': 'Person', name: 'Sohail Gidwani' },
            mainEntityOfPage: { '@type': 'WebPage', '@id': `/blogs/${blog.slug}` },
          })
        }}
      />
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-950 py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-end mb-6">
            <ThemeToggle />
          </div>
          <Link href="/blogs" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-900 dark:text-blue-400">{blog.title}</h1>
          {blog.excerpt && (
            <p className="text-xl text-gray-600 dark:text-slate-300 mb-4">{blog.excerpt}</p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {blog.coverImageUrl && (
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl mb-8">
            <ProgressiveImage src={blog.coverImageUrl} alt={blog.title} fill className="object-cover" unoptimized />
          </div>
        )}
        <article className="prose prose-lg dark:prose-invert max-w-3xl mx-auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.content || ''}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  )
}
