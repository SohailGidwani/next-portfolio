import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Get optional parameters for project-specific OG images
  const title = searchParams.get('title')
  const description = searchParams.get('description')
  const type = searchParams.get('type') // 'project', 'blog', or default
  const tags = searchParams.get('tags')?.split(',').slice(0, 4) || []

  // If no custom params, show default portfolio OG image
  if (!title) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            backgroundColor: '#f5efe7',
            backgroundImage:
              'radial-gradient(circle at 15% 25%, rgba(15,118,110,0.2), transparent 55%), radial-gradient(circle at 90% 80%, rgba(249,115,22,0.18), transparent 55%)',
            color: '#122524',
            padding: '64px',
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '56px',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              border: '1px solid #e7dfd6',
              borderRadius: '40px',
              padding: '56px 64px',
              boxShadow: '0 40px 100px rgba(15, 118, 110, 0.18)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                flex: 1,
              }}
            >
              <span
                style={{
                  fontSize: '20px',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#0f766e',
                  fontWeight: 600,
                }}
              >
                AI / CS Engineer
              </span>
              <h1
                style={{
                  fontSize: '72px',
                  fontWeight: 700,
                  margin: 0,
                  color: '#122524',
                  fontFamily: '"Times New Roman", serif',
                }}
              >
                Sohail Gidwani
              </h1>
              <p
                style={{
                  fontSize: '28px',
                  margin: 0,
                  color: '#516664',
                }}
              >
                Intelligent systems, full-stack engineering, and AI product design.
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '18px',
                  fontSize: '20px',
                  color: '#516664',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                }}
              >
                <span>AI Systems</span>
                <span>•</span>
                <span>Product</span>
                <span>•</span>
                <span>Research</span>
              </div>
            </div>

            <div
              style={{
                width: '220px',
                height: '220px',
                borderRadius: '72px',
                backgroundColor: '#0f766e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f8fafc',
                fontSize: '96px',
                fontFamily: '"Times New Roman", serif',
                fontWeight: 700,
                boxShadow: '0 30px 60px rgba(15,118,110,0.35)',
              }}
            >
              SG
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              inset: '24px',
              borderRadius: '36px',
              border: '1px dashed rgba(15,118,110,0.15)',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  }

  // Project/Blog specific OG image
  const typeLabel = type === 'blog' ? 'Blog Post' : 'Project'
  const typeColor = type === 'blog' ? '#f97316' : '#0f766e'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          backgroundColor: '#f5efe7',
          backgroundImage:
            'radial-gradient(circle at 15% 25%, rgba(15,118,110,0.15), transparent 55%), radial-gradient(circle at 90% 80%, rgba(249,115,22,0.12), transparent 55%)',
          color: '#122524',
          padding: '56px',
        }}
      >
        {/* Top: Type badge and author */}
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
              gap: '12px',
              backgroundColor: typeColor,
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '24px',
              fontSize: '18px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            {typeLabel}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                backgroundColor: '#0f766e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f8fafc',
                fontSize: '20px',
                fontFamily: '"Times New Roman", serif',
                fontWeight: 700,
              }}
            >
              SG
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span style={{ fontSize: '18px', fontWeight: 600, color: '#122524' }}>
                Sohail Gidwani
              </span>
              <span style={{ fontSize: '14px', color: '#516664' }}>
                sohailgidwani.app
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Title and description */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            flex: 1,
            justifyContent: 'center',
            paddingTop: '32px',
            paddingBottom: '32px',
          }}
        >
          <h1
            style={{
              fontSize: title.length > 40 ? '48px' : '56px',
              fontWeight: 700,
              margin: 0,
              color: '#122524',
              fontFamily: '"Times New Roman", serif',
              lineHeight: 1.2,
              maxWidth: '900px',
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                fontSize: '24px',
                margin: 0,
                color: '#516664',
                lineHeight: 1.5,
                maxWidth: '800px',
              }}
            >
              {description.length > 120 ? description.slice(0, 117) + '...' : description}
            </p>
          )}
        </div>

        {/* Bottom: Tags */}
        {tags.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  backgroundColor: 'rgba(15, 118, 110, 0.1)',
                  color: '#0f766e',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: 500,
                  border: '1px solid rgba(15, 118, 110, 0.2)',
                }}
              >
                {tag.trim()}
              </div>
            ))}
          </div>
        )}

        {/* Decorative border */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            inset: '20px',
            borderRadius: '32px',
            border: '1px dashed rgba(15,118,110,0.12)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
} 
