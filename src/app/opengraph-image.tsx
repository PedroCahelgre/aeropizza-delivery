import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'

export const alt = 'AeroPizza - Sabor que voa até sua casa'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fbbf24',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            marginBottom: 20,
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          AEROPIZZA
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: 40,
          }}
        >
          Sabor que voa até sua casa
        </div>
        <div
          style={{
            display: 'flex',
            gap: 20,
          }}
        >
          <div
            style={{
              background: '#fbbf24',
              color: '#000000',
              padding: '12px 24px',
              borderRadius: 8,
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            FAZER PEDIDO
          </div>
          <div
            style={{
              border: '2px solid #fbbf24',
              color: '#fbbf24',
              padding: '12px 24px',
              borderRadius: 8,
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            VER CARDÁPIO
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}