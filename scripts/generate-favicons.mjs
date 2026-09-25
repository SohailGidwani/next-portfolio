import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

// The mark is public/favicon.svg, with "SG." already outlined as paths from
// Funnel Display. Rasterizing that one file keeps every size identical to the
// SVG favicon: the old inline <text> version depended on whatever sans-serif
// librsvg found, which never matched the site's typeface.
const MARK_SVG = readFileSync(join(publicDir, 'favicon.svg'))

// The light-theme mark: the same outlines on the light ground, with the
// light theme's ultramarine for the dot. The site swaps the tab icons to
// these when its toggle is set to light (app/components/FaviconSync.tsx).
// Home-screen icons stay dark: those are fixed when the site is installed.
const LIGHT_SVG = Buffer.from(
  MARK_SVG.toString()
    .replace('fill="#07080b"', 'fill="#f6f7f9"')
    .replace('fill="#eef0f4"', 'fill="#101114"')
    .replace('fill="#35b8d4"', 'fill="#1938d7"')
)

async function generatePng(size, svg = MARK_SVG) {
  return sharp(svg).resize(size, size).png().toBuffer()
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

  // Light tab icons: every rel="icon" the layout declares has a light twin
  // at the same path with "favicon" read as "favicon-light".
  writeFileSync(join(publicDir, 'favicon-light.svg'), LIGHT_SVG)
  console.log('✓ favicon-light.svg')
  const light16 = await generatePng(16, LIGHT_SVG)
  const light32 = await generatePng(32, LIGHT_SVG)
  writeFileSync(join(publicDir, 'favicon-light-16x16.png'), light16)
  writeFileSync(join(publicDir, 'favicon-light-32x32.png'), light32)
  console.log('✓ favicon-light-16x16.png, favicon-light-32x32.png')
  writeFileSync(join(publicDir, 'favicon-light.ico'), buildIco([
    { data: light16, size: 16 },
    { data: light32, size: 32 },
  ]))
  console.log('✓ favicon-light.ico')
}

main().catch(err => { console.error(err); process.exit(1) })
