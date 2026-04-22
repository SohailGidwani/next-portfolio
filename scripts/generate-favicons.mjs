import sharp from 'sharp'
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

// Rasterization-safe SVG:
// - dy="0.35em" instead of dominant-baseline="central" (librsvg on macOS ignores it)
// - Period is intentionally rendered white first (correct centering), then erased
//   with a bg rect, then replaced with a real <circle> — librsvg's fallback sans-serif
//   renders the period glyph as a square, not a circle. Coordinates measured from
//   actual pixel output: amber center (202, 157), period size ~14.5×14px in 256px space.
const RASTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="48" fill="#0f0f0e"/>
  <text
    x="128" y="128"
    dy="0.35em"
    text-anchor="middle"
    font-family="sans-serif"
    font-size="104"
    font-weight="800"
    letter-spacing="-2"
    fill="#f0efe9"
  >SG.</text>
  <rect x="183" y="138" width="42" height="38" fill="#0f0f0e"/>
  <circle cx="202" cy="157" r="8" fill="#b85c0e"/>
</svg>`

async function generatePng(size) {
  return sharp(Buffer.from(RASTER_SVG)).resize(size, size).png().toBuffer()
}

function buildIco(images) {
  const n = images.length
  let dataOffset = 6 + n * 16

  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(n, 4)

  const entries = []
  const chunks = []

  for (const { data, size } of images) {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size >= 256 ? 0 : size, 0)
    entry.writeUInt8(size >= 256 ? 0 : size, 1)
    entry.writeUInt8(0, 2)
    entry.writeUInt8(0, 3)
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(dataOffset, 12)
    entries.push(entry)
    chunks.push(data)
    dataOffset += data.length
  }

  return Buffer.concat([header, ...entries, ...chunks])
}

async function main() {
  const sizes = [
    { file: 'favicon-16x16.png', size: 16 },
    { file: 'favicon-32x32.png', size: 32 },
    { file: 'apple-touch-icon.png', size: 180 },
    { file: 'android-chrome-192x192.png', size: 192 },
    { file: 'android-chrome-512x512.png', size: 512 },
  ]

  const generated = {}
  for (const { file, size } of sizes) {
    const buf = await generatePng(size)
    generated[size] = buf
    writeFileSync(join(publicDir, file), buf)
    console.log(`✓ ${file}`)
  }

  const ico = buildIco([
    { data: generated[16], size: 16 },
    { data: generated[32], size: 32 },
  ])
  writeFileSync(join(publicDir, 'favicon.ico'), ico)
  console.log('✓ favicon.ico')
}

main().catch(err => { console.error(err); process.exit(1) })
