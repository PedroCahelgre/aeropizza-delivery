import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'

export const alt = 'AeroPizza Logo'
export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          border: '2px solid #fbbf24',
        }}
      >
        <div
          style={{
            color: '#fbbf24',
            fontSize: 20,
            fontWeight: 900,
          }}
        >
          A
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}