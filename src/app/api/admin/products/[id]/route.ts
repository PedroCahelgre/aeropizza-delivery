import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

// GET /api/admin/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = getAdminFromRequest(request)
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params
    
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = getAdminFromRequest(request)
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params
    const body = await request.json()
    
    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // If only updating availability
    if (body.hasOwnProperty('available')) {
      const updatedProduct = await db.product.update({
        where: { id },
        data: { available: body.available },
        include: {
          category: true
        }
      })
      return NextResponse.json(updatedProduct)
    }

    // Full update
    const { 
      name, 
      description, 
      price, 
      categoryId, 
      image, 
      available, 
      preparationTime, 
      ingredients 
    } = body

    // Check if category exists (if provided)
    if (categoryId) {
      const category = await db.category.findUnique({
        where: { id: categoryId }
      })

      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = parseFloat(price)
    if (categoryId !== undefined) updateData.categoryId = categoryId
    if (image !== undefined) updateData.image = image || null
    if (available !== undefined) updateData.available = available
    if (preparationTime !== undefined) updateData.preparationTime = parseInt(preparationTime)
    if (ingredients !== undefined) updateData.ingredients = ingredients || null

    const product = await db.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = getAdminFromRequest(request)
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params
    
    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if product is in any orders
    const orderItems = await db.orderItem.findMany({
      where: { productId: id }
    })

    if (orderItems.length > 0) {
      // Instead of deleting, mark as unavailable
      await db.product.update({
        where: { id },
        data: { available: false }
      })
      
      return NextResponse.json({ 
        message: 'Product marked as unavailable due to existing orders',
        warning: 'Product has existing orders and was marked as unavailable instead of deleted'
      })
    }

    // Delete the product
    await db.product.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
