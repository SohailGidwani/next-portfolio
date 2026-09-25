import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

// The site's dark theme: near-black ground, teal-blue accent, cool greys.
const ACCENT = '#35b8d4'
const BG = '#07080b'
const FG = '#eef0f4'
const MUTED = '#878b95'
const RULE = '#1a1c22'

const headers = {
  'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
}

const TYPE_LABELS: Record<string, string> = {
  project: 'Project',
  research: 'Research paper',
  'deep-dive': 'Technical deep dive',
  blog: 'Blog post',
}

const DEFAULT_ROLE = 'Agentic AI engineer'
const DEFAULT_STATEMENT =
  'I build AI systems that hold up in production, and publish the evaluations that say whether they do.'

/**
 * The site's typefaces, fetched as static TTF instances: the image renderer
 * cannot read WOFF2 or pick a weight out of a variable font. Any failure
 * falls back to the renderer's default face rather than failing the image.
 */
async function loadFont(family: string, weight: number) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weight}`
  const css = await (await fetch(url)).text()
  const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)
  if (!src) throw new Error(`No TTF for ${family} ${weight}`)
  const res = await fetch(src[1])
  if (!res.ok) throw new Error(`Font fetch failed: ${res.status}`)
  return res.arrayBuffer()
}

async function fonts() {
  try {
    const [d, b, m] = await Promise.all([
      loadFont('Funnel Display', 800),
      loadFont('Funnel Sans', 400),
      loadFont('Funnel Sans', 500),
    ])
    return [
      { name: 'Funnel Display', data: d, weight: 800 as const, style: 'normal' as const },
      { name: 'Funnel Sans', data: b, weight: 400 as const, style: 'normal' as const },
      { name: 'Funnel Sans', data: m, weight: 500 as const, style: 'normal' as const },
    ]
  } catch {
    return undefined
  }
}

/**
 * The renderer measures each space-separated word on its own, and with
 * Funnel that left some gaps visibly wider than others ("Technical  deep").
 * A no-break space keeps the words in one measured run, and the zero-width
 * space after it is still a line-break opportunity, so text wraps as before.
 */
const even = (text: string) => text.replace(/ /g, '\u00a0\u200b')

/** The "SG." mark, with the dot in the accent, as in the favicon. */
function Mark({ size }: { size: number }) {
  return (
    <div
      style={{
        display: 'flex',
        fontFamily: 'Funnel Display',
        fontSize: `${size}px`,
        fontWeight: 800,
        letterSpacing: '-0.03em',
        color: FG,
        lineHeight: 1,
      }}
    >
      SG
      <span style={{ color: ACCENT }}>.</span>
    </div>
  )
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')
  const rawDescription = searchParams.get('description')
  const type = searchParams.get('type') ?? 'project'
  const tags = (searchParams.get('tags')?.split(',') ?? []).map((t) => t.trim()).filter(Boolean).slice(0, 5)

  if (!title) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: BG,
            padding: '72px 80px',
            fontFamily: 'Funnel Sans',
          }}
        >
          <Mark size={40} />

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: '28px', fontWeight: 500, color: ACCENT, marginBottom: '16px' }}>
              {even(DEFAULT_ROLE)}
            </div>
            <div
              style={{
                display: 'flex',
                fontFamily: 'Funnel Display',
                fontSize: '112px',
                fontWeight: 800,
                color: FG,
                lineHeight: 0.95,
                letterSpacing: '-0.035em',
              }}
            >
              {even('Sohail Gidwani')}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '30px',
                color: MUTED,
                lineHeight: 1.4,
                maxWidth: '900px',
                marginTop: '28px',
              }}
            >
              {even(DEFAULT_STATEMENT)}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              borderTop: `1px solid ${RULE}`,
              paddingTop: '20px',
              fontSize: '22px',
              color: MUTED,
            }}
          >
            sohailgidwani.app
          </div>
        </div>
      ),
      { width: 1200, height: 630, headers, fonts: await fonts() }
    )
  }

  // `type=none` for index pages, whose title already names the section.
  const typeLabel = type === 'none' ? '' : TYPE_LABELS[type] ?? TYPE_LABELS.project
  const description =
    rawDescription && rawDescription.length > 160 ? `${rawDescription.slice(0, 157)}…` : rawDescription
  const tagLine = tags.join(' · ')

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: BG,
          padding: '64px 80px',
          fontFamily: 'Funnel Sans',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', fontSize: '26px', fontWeight: 500, color: ACCENT }}>{even(typeLabel)}</div>
          <Mark size={36} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Funnel Display',
              fontSize: title.length > 36 ? '64px' : '84px',
              fontWeight: 800,
              color: FG,
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              maxWidth: '1000px',
            }}
          >
            {even(title)}
          </div>
          {description ? (
            <div
              style={{
                display: 'flex',
                fontSize: '28px',
                color: MUTED,
                lineHeight: 1.4,
                maxWidth: '980px',
                marginTop: '24px',
              }}
            >
              {even(description)}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `1px solid ${RULE}`,
            paddingTop: '20px',
            fontSize: '22px',
            color: MUTED,
          }}
        >
          <div style={{ display: 'flex' }}>{even(tagLine)}</div>
          <div style={{ display: 'flex', fontWeight: 500, color: FG }}>{even('Sohail Gidwani')}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers, fonts: await fonts() }
  )
}
