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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          color: '#fff',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              margin: '0 0 20px 0',
              background: 'linear-gradient(45deg, #fff, #888)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Sohail Gidwani
          </h1>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 'normal',
              margin: '0 0 40px 0',
              color: '#888',
            }}
          >
            AI/ML Software Developer
          </h2>
          <div
            style={{
              display: 'flex',
              gap: '20px',
              fontSize: '24px',
              color: '#aaa',
            }}
          >
            <span>Python</span>
            <span>•</span>
            <span>React</span>
            <span>•</span>
            <span>Node.js</span>
            <span>•</span>
            <span>TensorFlow</span>
          </div>
          <p
            style={{
              fontSize: '20px',
              margin: '40px 0 0 0',
              color: '#666',
            }}
          >
            Mumbai, India
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
} 