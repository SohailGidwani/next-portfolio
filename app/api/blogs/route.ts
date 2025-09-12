import { NextRequest, NextResponse } from 'next/server'
import { initDb, pool, slugify } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    await initDb()
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get('limit') || 0)
    const slug = searchParams.get('slug')

    if (slug) {
      const { rows } = await pool.query(
        'SELECT id, title, slug, excerpt, content, cover_image_url AS "coverImageUrl", created_at AS "createdAt" FROM blogs WHERE slug = $1 LIMIT 1',
        [slug]
      )
      if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(rows[0])
    }

    const baseQuery = 'SELECT id, title, slug, excerpt, cover_image_url AS "coverImageUrl", created_at AS "createdAt" FROM blogs ORDER BY created_at DESC'
    const { rows } = await pool.query(limit > 0 ? `${baseQuery} LIMIT $1` : baseQuery, limit > 0 ? [limit] : [])
    return NextResponse.json(rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await initDb()
    const body = await req.json()
    const title: string = (body.title || '').toString()
    const providedSlug: string | undefined = body.slug ? body.slug.toString() : undefined
    const excerpt: string | null = body.excerpt ? body.excerpt.toString() : null
    const content: string | null = body.content ? body.content.toString() : null
    const coverImageUrl: string | null = body.coverImageUrl ? body.coverImageUrl.toString() : null

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

    let finalSlug = providedSlug && providedSlug.trim() !== '' ? slugify(providedSlug) : slugify(title)

    // Ensure uniqueness by appending counter if needed
    let suffix = 0
    while (true) {
      const trySlug = suffix === 0 ? finalSlug : `${finalSlug}-${suffix}`
      const { rows } = await pool.query('SELECT 1 FROM blogs WHERE slug = $1', [trySlug])
      if (rows.length === 0) { finalSlug = trySlug; break }
      suffix++
    }

    const { rows } = await pool.query(
      `INSERT INTO blogs (title, slug, excerpt, content, cover_image_url) 
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, slug, excerpt, cover_image_url AS "coverImageUrl", created_at AS "createdAt"`,
      [title, finalSlug, excerpt, content, coverImageUrl]
    )

    return NextResponse.json(rows[0], { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 })
  }
}

