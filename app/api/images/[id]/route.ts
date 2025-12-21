import { NextRequest } from 'next/server'
import { initDb, pool } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await initDb()
  const resolvedParams = await params
  const id = Number(resolvedParams.id)
  if (!id || Number.isNaN(id)) {
    return new Response('Bad Request', { status: 400 })
  }
  const { rows } = await pool.query(
    'SELECT mime_type AS "mimeType", data FROM images WHERE id = $1 LIMIT 1',
    [id]
  )
  const row = rows[0]
  if (!row) return new Response('Not found', { status: 404 })

  return new Response(row.data, {
    status: 200,
    headers: {
      'Content-Type': row.mimeType || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
