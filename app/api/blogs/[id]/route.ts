import { NextRequest, NextResponse } from 'next/server'
import { initDb, pool } from '@/lib/db'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDb()
    const id = Number(params.id)
    if (!id || Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    await pool.query('DELETE FROM blogs WHERE id = $1', [id])
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 })
  }
}

