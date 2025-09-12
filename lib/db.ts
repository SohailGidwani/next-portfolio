import { Pool } from 'pg'

function normalizeDatabaseUrl(value?: string) {
  if (!value) return undefined
  let s = value.trim()
  // If someone pasted a full psql command like: psql 'postgresql://...'
  const urlMatch = s.match(/postgres(?:ql)?:\/\/[^\s'\"]+/)
  if (urlMatch) s = urlMatch[0]
  // Remove surrounding quotes if present
  s = s.replace(/^['"]/g, '').replace(/['"]$/g, '')
  return s
}

const CONNECTION_STRING = normalizeDatabaseUrl(process.env.DATABASE_URL)

if (!CONNECTION_STRING) {
  throw new Error('DATABASE_URL is not set. Please add it to .env.local as a valid postgres URL.')
}

// Create a single pool instance for the app
export const pool = new Pool({
  connectionString: CONNECTION_STRING,
  ssl: CONNECTION_STRING.includes("neon.tech") ? { rejectUnauthorized: false } : undefined,
})

let initialized = false

export async function initDb() {
  if (initialized) return
  await pool.query(`
    CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT,
      cover_image_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);

    -- Images table to store uploaded binary data
    CREATE TABLE IF NOT EXISTS images (
      id SERIAL PRIMARY KEY,
      filename TEXT,
      mime_type TEXT NOT NULL,
      data BYTEA NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Optional FK to link blogs to an image (in addition to URL)
    ALTER TABLE blogs ADD COLUMN IF NOT EXISTS cover_image_id INTEGER REFERENCES images(id) ON DELETE SET NULL;
  `)
  initialized = true
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}
