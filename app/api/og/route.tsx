import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
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
