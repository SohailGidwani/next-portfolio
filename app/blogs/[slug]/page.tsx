import { initDb, pool } from "@/lib/db"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Metadata } from "next"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Script from "next/script"
import ProgressiveImage from "@/app/components/ProgressiveImage"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  await initDb()
  const { rows } = await pool.query("SELECT title, excerpt FROM blogs WHERE slug = $1 LIMIT 1", [slug])
  const blog = rows[0]
  if (!blog) return { title: "Blog Not Found" }
  return {
    title: `${blog.title} - Blog`,
    description: blog.excerpt || undefined,
  }
}

export default async function BlogDetail({ params }: Props) {
  const { slug } = await params
  await initDb()
  const { rows } = await pool.query(
    'SELECT id, title, slug, excerpt, content, cover_image_url AS "coverImageUrl", created_at AS "createdAt" FROM blogs WHERE slug = $1 LIMIT 1',
    [slug]
  )
  const blog = rows[0]

  if (!blog) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-20">
          <Link
            href="/blogs"
            className="inline-flex items-center text-xs font-body font-medium uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to blogs
          </Link>
          <h1 className="mt-6 font-display italic text-3xl text-white">Blog not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Script
        id="blogpost-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: blog.title,
            description: blog.excerpt || undefined,
            datePublished: blog.createdAt,
            dateModified: blog.createdAt,
            image: blog.coverImageUrl || undefined,
            author: { "@type": "Person", name: "Sohail Gidwani" },
            mainEntityOfPage: { "@type": "WebPage", "@id": `/blogs/${blog.slug}` },
          }),
        }}
      />

      <div className="border-b border-white/[0.06] bg-white/[0.02] backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-6">
          <Link
            href="/blogs"
            className="inline-flex items-center text-xs font-body font-medium uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to blogs
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl space-y-5">
          <p className="text-[10px] font-body font-medium tracking-[0.4em] uppercase text-white/30">Journal</p>
          <h1 className="font-display italic text-4xl text-white sm:text-5xl">{blog.title}</h1>
          {blog.excerpt && <p className="font-body text-base text-white/35">{blog.excerpt}</p>}
        </div>

        {blog.coverImageUrl && (
          <div className="mx-auto mt-10 max-w-3xl">
            <div className="relative h-64 w-full overflow-hidden rounded-2xl md:h-96">
              <ProgressiveImage src={blog.coverImageUrl} alt={blog.title} fill className="object-cover" unoptimized />
            </div>
          </div>
        )}

        <article className="prose prose-lg prose-invert mx-auto mt-10 max-w-3xl prose-headings:font-display prose-headings:italic prose-headings:text-white prose-p:text-white/50 prose-a:text-white/60 prose-a:underline hover:prose-a:text-white prose-strong:text-white/70 prose-code:text-white/60 prose-pre:bg-white/[0.03] prose-pre:border prose-pre:border-white/[0.06]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.content || ""}</ReactMarkdown>
        </article>
      </div>
    </div>
  )
}
