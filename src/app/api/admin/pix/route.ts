import { NextResponse } from 'next/server'
import { getStaticPixConfig } from '@/lib/static-utils'

export async function GET() {
  try {
    const pixConfig = getStaticPixConfig()
    return NextResponse.json(pixConfig)
  } catch (error) {
    console.error('Error fetching PIX config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PIX config' },
      { status: 500 }
    )
  }
}