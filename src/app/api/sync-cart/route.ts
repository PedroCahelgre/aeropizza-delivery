import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    await db.$connect()
    
    const { cartItems } = await request.json()
    
    if (!cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json({ error: 'Invalid cart items' }, { status: 400 })
    }

    // Buscar todos os produtos do banco de dados
    const dbProducts = await db.product.findMany({
      include: {
        category: {
          select: { name: true }
        }
      }
    })

    // Criar mapa de produtos por nome para encontrar correspondências
    const productMap = new Map()
    dbProducts.forEach(product => {
      productMap.set(product.name.toLowerCase(), product)
    })

    // Sincronizar itens do carrinho
    const synchronizedCart = []
    const notFoundProducts = []

    for (const cartItem of cartItems) {
      const dbProduct = productMap.get(cartItem.name.toLowerCase())
      
      if (dbProduct) {
        synchronizedCart.push({
          id: dbProduct.id,
          name: dbProduct.name,
          description: dbProduct.description,
          price: dbProduct.price,
          image: dbProduct.image,
          category: {
            name: dbProduct.category.name
          },
          preparationTime: dbProduct.preparationTime,
          quantity: cartItem.quantity,
          notes: cartItem.notes || ''
        })
      } else {
        notFoundProducts.push(cartItem.name)
      }
    }

    return NextResponse.json({
      synchronizedCart,
      notFoundProducts,
      success: true,
      message: synchronizedCart.length > 0 
        ? 'Cart synchronized successfully' 
        : 'No products found in database'
    })

  } catch (error) {
    console.error('Error syncing cart:', error)
    return NextResponse.json({ 
      error: 'Failed to sync cart',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await db.$disconnect()
  }
}
