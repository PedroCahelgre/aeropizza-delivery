import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST() {
  try {
    await db.$connect()
    
    // Create pizza category first
    const pizzaCategory = await db.category.upsert({
      where: { name: 'Pizzas Tradicionais' },
      update: {},
      create: {
        name: 'Pizzas Tradicionais',
        description: 'Pizzas tradicionais italianas'
      }
    })

    const gourmetCategory = await db.category.upsert({
      where: { name: 'Pizzas Gourmet' },
      update: {},
      create: {
        name: 'Pizzas Gourmet',
        description: 'Pizzas especiais gourmet'
      }
    })

    const drinksCategory = await db.category.upsert({
      where: { name: 'Bebidas' },
      update: {},
      create: {
        name: 'Bebidas',
        description: 'Refrigerantes e sucos'
      }
    })

    // Create products
    const products = [
      {
        name: 'Margherita',
        description: 'Molho de tomate, muçarela, manjericão fresco e azeite extra virgem',
        price: 35.90,
        categoryId: pizzaCategory.id,
        preparationTime: 20,
        ingredients: 'Molho de tomate, muçarela, manjericão fresco, azeite extra virgem'
      },
      {
        name: 'Calabresa Especial',
        description: 'Calabresa artesanal, cebola roxa, azeitona preta e queijo muçarela',
        price: 42.90,
        categoryId: pizzaCategory.id,
        preparationTime: 25,
        ingredients: 'Molho de tomate, muçarela, calabresa artesanal, cebola roxa, azeitona preta'
      },
      {
        name: 'Frango com Catupiry',
        description: 'Frango desfiado refogado, catupiry cremoso, milho verde e orégano',
        price: 44.90,
        categoryId: gourmetCategory.id,
        preparationTime: 30,
        ingredients: 'Molho de tomate, muçarela, frango desfiado, catupiry, milho verde, orégano'
      },
      {
        name: 'Coca-Cola 2L',
        description: 'Refrigerante de cola tradicional gelado 2 litros',
        price: 12.90,
        categoryId: drinksCategory.id,
        preparationTime: 0,
        ingredients: 'Refrigerante de cola, água gaseificada, açúcar, cafeína'
      }
    ]

    const createdProducts = await Promise.all(
      products.map(product => 
        db.product.create({
          data: product
        })
      )
    )

    return NextResponse.json({ 
      message: 'Products created successfully',
      count: createdProducts.length,
      products: createdProducts.map(p => ({ id: p.id, name: p.name, price: p.price }))
    })
  } catch (error) {
    console.error('Error creating products:', error)
    return NextResponse.json({ 
      error: 'Failed to create products',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await db.$disconnect()
  }
}