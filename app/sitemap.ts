import { MetadataRoute } from 'next'
import { initDb, pool } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://portfolio-sohail-gidwanis-projects.vercel.app'

  // Fetch blogs to include individual URLs
  let blogEntries: MetadataRoute.Sitemap = []
  try {
    await initDb()
    type BlogRow = { slug: string; updatedAt: string | Date | null; createdAt: string | Date | null }
    const { rows } = await pool.query<BlogRow>('SELECT slug, updated_at AS "updatedAt", created_at AS "createdAt" FROM blogs ORDER BY created_at DESC')
    blogEntries = rows.map((r: BlogRow) => {
      const last = r.updatedAt ?? r.createdAt ?? new Date()
      const lastModified = last instanceof Date ? last : new Date(last)
      return {
        url: `${baseUrl}/blogs/${r.slug}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      }
    })
  } catch {
    // If DB not available locally, skip dynamic blogs
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/#about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#experience`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#skills`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#education`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#triumphs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects/image-captioning`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects/scribeglobe`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects/tech-updates`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogEntries,
  ]
}
