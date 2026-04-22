import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const AMBER = '#b85c0e'
const BG = '#0f0f0e'
const FG = '#f0efe9'
const MUTED = '#8a8980'
const BORDER = '#252420'
const CARD = '#1a1918'

const headers = {
  'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')
  const description = searchParams.get('description')
  const type = searchParams.get('type')
  const tags = searchParams.get('tags')?.split(',').slice(0, 5) || []

  if (!title) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            backgroundColor: BG,
            padding: '64px 72px',
            position: 'relative',
          }}
        >
          {/* Subtle amber glow — bottom right */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '480px',
              height: '320px',
              background: `radial-gradient(ellipse at 80% 100%, ${AMBER}18, transparent 65%)`,
              display: 'flex',
            }}
          />

          {/* Outer border */}
          <div
            style={{
              position: 'absolute',
              inset: '24px',
              border: `1px solid ${BORDER}`,
              borderRadius: '6px',
              display: 'flex',
            }}
          />

          {/* Left column */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              gap: '0px',
            }}
          >
            {/* Role label */}
            <div
              style={{
                fontSize: '13px',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: AMBER,
                fontWeight: 600,
                marginBottom: '20px',
              }}
            >
              AI / CS Engineer
            </div>

            {/* Name */}
            <div
              style={{
                fontSize: '80px',
                fontWeight: 800,
                color: FG,
                lineHeight: 1.0,
                letterSpacing: '-0.03em',
                marginBottom: '24px',
              }}
            >
              Sohail Gidwani
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: '22px',
                color: MUTED,
                lineHeight: 1.5,
                maxWidth: '560px',
                marginBottom: '40px',
              }}
            >
              Intelligent systems, full-stack engineering, and AI product design.
            </div>

            {/* Tag pills */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {['AI Systems', 'Product', 'Research'].map((tag) => (
                <div
                  key={tag}
                  style={{
                    border: `1px solid ${BORDER}`,
                    color: MUTED,
                    padding: '6px 14px',
                    borderRadius: '3px',
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    display: 'flex',
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* Right — large SG. monogram */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '260px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '140px',
                fontWeight: 800,
                letterSpacing: '-4px',
                color: FG,
                lineHeight: 1,
                opacity: 0.9,
              }}
            >
              SG
              <span style={{ color: AMBER }}>.</span>
            </div>
          </div>

          {/* Bottom URL */}
          <div
            style={{
              position: 'absolute',
              bottom: '44px',
              left: '72px',
              fontSize: '12px',
              letterSpacing: '0.12em',
              color: BORDER,
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            sohailgidwani.app
          </div>
        </div>
      ),
      { width: 1200, height: 630, headers }
    )
  }

  // Project / blog specific OG
  const typeLabel = type === 'blog' ? 'Blog Post' : 'Project'

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
          padding: '56px 64px',
          position: 'relative',
        }}
      >
        {/* Amber glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '400px',
            height: '280px',
            background: `radial-gradient(ellipse at 20% 10%, ${AMBER}14, transparent 60%)`,
            display: 'flex',
          }}
        />

        {/* Outer border */}
        <div
          style={{
            position: 'absolute',
            inset: '20px',
            border: `1px solid ${BORDER}`,
            borderRadius: '4px',
            display: 'flex',
          }}
        />

        {/* Top row: type badge + SG. monogram */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              border: `1px solid ${AMBER}60`,
              color: AMBER,
              padding: '7px 16px',
              borderRadius: '3px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            {typeLabel}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                fontSize: '22px',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                color: FG,
                display: 'flex',
              }}
            >
              SG<span style={{ color: AMBER }}>.</span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 600, color: FG }}>
                Sohail Gidwani
              </span>
              <span style={{ fontSize: '11px', color: MUTED, letterSpacing: '0.05em' }}>
                sohailgidwani.app
              </span>
            </div>
          </div>
        </div>

        {/* Middle: title + description */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            flex: 1,
            justifyContent: 'center',
            paddingTop: '32px',
            paddingBottom: '32px',
          }}
        >
          <div
            style={{
              fontSize: title.length > 40 ? '52px' : '62px',
              fontWeight: 800,
              color: FG,
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                fontSize: '22px',
                color: MUTED,
                lineHeight: 1.5,
                maxWidth: '780px',
              }}
            >
              {description.length > 120 ? description.slice(0, 117) + '…' : description}
            </div>
          )}
        </div>

        {/* Bottom: tags */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  backgroundColor: CARD,
                  border: `1px solid ${BORDER}`,
                  color: MUTED,
                  padding: '6px 14px',
                  borderRadius: '3px',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  display: 'flex',
                }}
              >
                {tag.trim()}
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    { width: 1200, height: 630, headers }
  )
}
