import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    await db.$connect()
    
    const products = await db.product.findMany({
      include: {
        category: {
          select: { name: true }
        }
      },
      where: {
        available: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Formatar para compatibilidade com frontend
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: {
        name: product.category.name
      },
      preparationTime: product.preparationTime,
      available: product.available,
      ingredients: product.ingredients
    }))

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch products',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await db.$disconnect()
  }
}
