import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, items, deliveryType, paymentMethod, deliveryAddress, customerPhone, notes } = body

    if (!userId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Dados do pedido incompletos' },
        { status: 400 }
      )
    }

    const existingUser = await db.user.findUnique({ where: { id: userId } })
    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }
    for (const item of items) {
      const product = await db.product.findUnique({ where: { id: item.productId } })
      if (!product) {
        return NextResponse.json(
          { error: `Produto não encontrado: ${item.productId}` },
          { status: 404 }
        )
      }
    }
    // Gerar número do pedido
    const orderNumber = `AERO${Date.now().toString().slice(-6)}`

    // Calcular total
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0)
    const deliveryFee = deliveryType === 'DELIVERY' ? 8 : 0
    const total = subtotal + deliveryFee

    // Criar pedido
    const order = await db.order.create({
      data: {
        orderNumber,
        userId,
        status: 'PENDING',
        paymentMethod,
        deliveryType,
        totalAmount: total,
        finalAmount: total,
        deliveryFee,
        deliveryAddress: deliveryAddress || null,
        customerPhone,
        notes: notes || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
            notes: item.notes || null,
          }))
        },
        statusHistory: {
          create: {
            status: 'PENDING',
            notes: 'Pedido criado'
          }
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        statusHistory: true,
        user: true
      }
    })
    return NextResponse.json(order)
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return NextResponse.json(
      { error: 'Erro ao criar pedido' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')

    const where: any = {}
    if (status) where.status = status
    if (userId) where.userId = userId

    const orders = await db.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true
          }
        },
        statusHistory: true,
        user: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    )
  }
}
