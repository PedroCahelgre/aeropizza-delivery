import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'

export const alt = 'AeroPizza - Sabor que voa até sua casa'
export const size = {
  width: 192,
  height: 192,
}

export const contentType = 'image/png'

export default async function AppleIcon() {
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
          borderRadius: '22%',
          border: '3px solid #fbbf24',
        }}
      >
        <div
          style={{
            color: '#fbbf24',
            fontSize: 72,
            fontWeight: 900,
            marginBottom: 8,
          }}
        >
          A
        </div>
        <div
          style={{
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          PIZZA
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}