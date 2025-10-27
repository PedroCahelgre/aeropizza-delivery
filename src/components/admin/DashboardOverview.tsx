'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Users, ShoppingCart } from 'lucide-react'

interface OverviewData {
  totalOrders: number
  totalRevenue: number
  totalUsers: number
  todayOrders: number
}

export default function DashboardOverview() {
  const [data, setData] = useState<OverviewData>({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    todayOrders: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats')
      if (response.ok) {
        const stats = await response.json()
        setData(stats)
      }
    } catch (error) {
      console.error('Error fetching overview data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-black/60 rounded mb-2"></div>
            <div className="h-8 bg-black/60 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/60 backdrop-blur-md border border-yellow-400/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-400/80">Total de Pedidos</p>
                <p className="text-2xl font-bold text-white">{data.totalOrders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/60 backdrop-blur-md border border-yellow-400/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-400/80">Receita Total</p>
                <p className="text-2xl font-bold text-white">R$ {data.totalRevenue.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/60 backdrop-blur-md border border-yellow-400/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-400/80">Clientes</p>
                <p className="text-2xl font-bold text-white">{data.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/60 backdrop-blur-md border border-yellow-400/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-400/80">Pedidos Hoje</p>
                <p className="text-2xl font-bold text-white">{data.todayOrders}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/60 backdrop-blur-md border border-yellow-400/30">
        <CardHeader>
          <CardTitle className="text-yellow-400">Resumo de Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-yellow-400/80">
            <p>Sistema operando normalmente. Todos os serviços estão online.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}