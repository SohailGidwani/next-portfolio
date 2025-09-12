import { NextRequest, NextResponse } from 'next/server'
import { initDb, pool } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    await initDb()
    const form = await req.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const filename = (form.get('filename') as string) || file.name || 'upload'
    const mimeType = file.type || 'application/octet-stream'

    const { rows } = await pool.query(
      'INSERT INTO images (filename, mime_type, data) VALUES ($1, $2, $3) RETURNING id',
      [filename, mimeType, buffer]
    )
    const id = rows[0].id as number
    const url = `/api/images/${id}`

    return NextResponse.json({ id, url })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}

