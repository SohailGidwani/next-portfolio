import { initDb, pool } from "@/lib/db"
import ThemeToggle from "@/app/components/ThemeToggle"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Metadata } from "next"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Script from "next/script"
import ProgressiveImage from "@/app/components/ProgressiveImage"

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await initDb()
  const { rows } = await pool.query("SELECT title, excerpt FROM blogs WHERE slug = $1 LIMIT 1", [params.slug])
  const blog = rows[0]
  if (!blog) return { title: "Blog Not Found" }
  return {
    title: `${blog.title} - Blog`,
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
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-20">
          <Link
            href="/blogs"
            className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to blogs
          </Link>
          <h1 className="mt-6 font-display text-3xl text-foreground">Blog not found</h1>
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

      <div className="border-b border-border bg-card/60 backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-6">
          <Link
            href="/blogs"
            className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to blogs
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl space-y-5">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Journal</p>
          <h1 className="font-display text-4xl text-foreground sm:text-5xl">{blog.title}</h1>
          {blog.excerpt && <p className="text-lg text-muted-foreground">{blog.excerpt}</p>}
        </div>

        {blog.coverImageUrl && (
          <div className="mx-auto mt-10 max-w-3xl">
            <div className="relative h-64 w-full overflow-hidden rounded-3xl shadow-2xl md:h-96">
              <ProgressiveImage src={blog.coverImageUrl} alt={blog.title} fill className="object-cover" unoptimized />
            </div>
          </div>
        )}

        <article className="prose prose-lg mx-auto mt-10 max-w-3xl dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.content || ""}</ReactMarkdown>
        </article>
      </div>
    </div>
  )
}
