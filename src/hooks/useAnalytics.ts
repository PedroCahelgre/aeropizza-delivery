import { useMemo } from 'react'

export interface ChartData {
  date: string
  reports: number
  downloads: number
}

export interface CategoryPerformance {
  id: string
  name: string
  downloads: number
  percentage: number
  color: string
  icon: React.ReactNode
}

export interface AnalyticsData {
  chartData: ChartData[]
  categoryPerformance: CategoryPerformance[]
  totalPagesProcessed: number
  totalViews: number
  satisfactionRate: number
  minutesSaved: number
}

export const useAnalytics = (reports: any[], stats: any) => {
  
  // Dados do gráfico para os últimos 7 dias
  const chartData = useMemo((): ChartData[] => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return {
        date: date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
        reports: Math.floor(Math.random() * 10) + 1,
        downloads: Math.floor(Math.random() * 50) + 10
      }
    }).reverse()
    
    return last7Days
  }, [])

  // Performance das categorias
  const categoryPerformance = useMemo((): CategoryPerformance[] => {
    const categories = [
      { 
        id: 'financial', 
        name: 'Financeiro', 
        color: 'bg-green-500', 
        icon: 'DollarSign' 
      },
      { 
        id: 'sales', 
        name: 'Vendas', 
        color: 'bg-blue-500', 
        icon: 'TrendingUp' 
      },
      { 
        id: 'customers', 
        name: 'Clientes', 
        color: 'bg-purple-500', 
        icon: 'Users' 
      },
      { 
        id: 'products', 
        name: 'Produtos', 
        color: 'bg-orange-500', 
        icon: 'Package' 
      },
      { 
        id: 'marketing', 
        name: 'Marketing', 
        color: 'bg-pink-500', 
        icon: 'Megaphone' 
      },
      { 
        id: 'operations', 
        name: 'Operações', 
        color: 'bg-yellow-500', 
        icon: 'Settings' 
      }
    ]

    return categories.map(category => {
      const categoryReports = reports.filter(r => r.type === category.id)
      const downloads = categoryReports.reduce((acc, r) => acc + r.downloads, 0)
      const percentage = stats.totalDownloads > 0 ? (downloads / stats.totalDownloads) * 100 : 0
      
      return {
        ...category,
        downloads,
        percentage: Math.round(percentage)
      }
    })
  }, [reports, stats])

  // Estatísticas detalhadas
  const detailedStats = useMemo(() => {
    return {
      totalPagesProcessed: Math.round(stats.totalReports * 2.4),
      totalViews: Math.round(stats.totalDownloads * 1.8),
      satisfactionRate: Math.round(stats.successRate * 0.95),
      minutesSaved: Math.round(stats.generatingReports * 15)
    }
  }, [stats])

  return {
    chartData,
    categoryPerformance,
    detailedStats
  }
}