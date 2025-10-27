import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/products - List all products for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const available = searchParams.get('available')
    
    const whereClause: any = {}
    
    if (categoryId && categoryId !== 'all') {
      whereClause.categoryId = categoryId
    }
    
    if (available !== null) {
      whereClause.available = available === 'true'
    }

    const products = await db.product.findMany({
      where: whereClause,
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching admin products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      description, 
      price, 
      categoryId, 
      image, 
      available = true, 
      preparationTime = 15, 
      ingredients 
    } = body

    // Validation
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, categoryId' },
        { status: 400 }
      )
    }

    // Check if category exists
    const category = await db.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const product = await db.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId,
        image: image || null,
        available,
        preparationTime: parseInt(preparationTime),
        ingredients: ingredients || null
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}