import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Construir filtro
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }
    if (userId) {
      where.userId = userId;
    }

    // Buscar pedidos
    const orders = await db.order.findMany({
      where,
      include: {
        user: true,
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Contar total para paginação
    const total = await db.order.count({ where });

    // Formatar dados para o frontend
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status.toLowerCase(),
      total: order.finalAmount,
      createdAt: order.createdAt,
      customer: {
        name: order.user.name || 'Cliente',
        phone: order.user.phone || order.customerPhone || '',
        address: order.deliveryAddress || ''
      },
      items: order.items.map(item => ({
        product: {
          name: item.product.name,
          category: {
            name: item.product.category.name
          }
        },
        quantity: item.quantity,
        price: item.totalPrice
      })),
      note: order.notes
    }));

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    );
  }
}