import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const auth = getAdminFromRequest(request)
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // Buscar estatísticas básicas do dashboard
    const [totalOrders, totalUsers, todayOrders] = await Promise.all([
      db.order.count(),
      db.user.count(),
      db.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ])

    // Calcular receita total usando o campo correto
    const totalRevenue = await db.order.aggregate({
      _sum: {
        finalAmount: true
      }
    })

    const stats = {
      totalOrders,
      totalRevenue: totalRevenue._sum.finalAmount || 0,
      totalUsers,
      todayOrders
    }

    return NextResponse.json(stats, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
