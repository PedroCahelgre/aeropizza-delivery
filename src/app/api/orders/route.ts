import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
<<<<<<< HEAD
    console.log('📦 Dados recebidos na API:', JSON.stringify(body, null, 2))
    
    const { userId, items, deliveryType, paymentMethod, deliveryAddress, customerPhone, notes } = body

    if (!userId || !items || items.length === 0) {
      console.log('❌ Validação falhou:', { userId, itemsLength: items?.length })
=======
    const { userId, items, deliveryType, paymentMethod, deliveryAddress, customerPhone, notes } = body

    if (!userId || !items || items.length === 0) {
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
      return NextResponse.json(
        { error: 'Dados do pedido incompletos' },
        { status: 400 }
      )
    }

<<<<<<< HEAD
    // Verificar se o usuário existe
    console.log('🔍 Verificando usuário:', userId)
    const existingUser = await db.user.findUnique({
      where: { id: userId }
    })
    
    if (!existingUser) {
      console.log('❌ Usuário não encontrado:', userId)
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }
    
    console.log('✅ Usuário encontrado:', existingUser.email)

    // Verificar se todos os produtos existem
    console.log('🔍 Verificando produtos...')
    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId }
      })
      if (!product) {
        console.log('❌ Produto não encontrado:', item.productId)
        return NextResponse.json(
          { error: `Produto não encontrado: ${item.productId}` },
          { status: 404 }
        )
      }
      console.log('✅ Produto encontrado:', product.name)
    }

=======
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
    // Gerar número do pedido
    const orderNumber = `AERO${Date.now().toString().slice(-6)}`

    // Calcular total
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0)
    const deliveryFee = deliveryType === 'DELIVERY' ? 8 : 0
    const total = subtotal + deliveryFee

<<<<<<< HEAD
    console.log('💰 Cálculo do pedido:', { subtotal, deliveryFee, total })

    // Criar pedido no banco de dados
=======
    // Criar pedido
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
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
<<<<<<< HEAD
        deliveryAddress: deliveryAddress ? JSON.stringify(deliveryAddress) : null,
        customerPhone,
        notes,
=======
        deliveryAddress: deliveryAddress || null,
        customerPhone,
        notes: notes || null,
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
<<<<<<< HEAD
            notes: item.notes || null
          }))
        },
        statusHistory: {
          create: {
            status: 'PENDING',
            notes: 'Pedido criado'
          }
=======
            notes: item.notes || null,
          }))
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
<<<<<<< HEAD
        statusHistory: true,
=======
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
        user: true
      }
    })

<<<<<<< HEAD
    console.log('✅ Pedido criado com sucesso:', order.orderNumber)
    return NextResponse.json(order)
  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error)
    console.error('Stack trace:', error.stack)
    return NextResponse.json(
      { error: 'Erro ao criar pedido', details: error.message },
=======
    return NextResponse.json(order)
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return NextResponse.json(
      { error: 'Erro ao criar pedido' },
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')

<<<<<<< HEAD
    const whereClause: any = {}
    
    if (status) {
      whereClause.status = status
    }
    if (userId) {
      whereClause.userId = userId
    }

    const orders = await db.order.findMany({
      where: whereClause,
=======
    const where: any = {}
    if (status) where.status = status
    if (userId) where.userId = userId

    const orders = await db.order.findMany({
      where,
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
      include: {
        items: {
          include: {
            product: true
          }
        },
<<<<<<< HEAD
        statusHistory: true,
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
=======
        user: true
      },
      orderBy: { createdAt: 'desc' }
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
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