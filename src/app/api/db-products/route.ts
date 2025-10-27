import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    await db.$connect()
    
    const products = await db.product.findMany({
<<<<<<< HEAD
      where: { available: true },
      include: {
        category: true
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    return NextResponse.json(products)
=======
      select: {
        id: true,
        name: true,
        price: true
      }
    })
    
    return NextResponse.json({ 
      products: products,
      count: products.length
    })
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch products',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await db.$disconnect()
  }
}