import React, { useState, memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  PieChart,
  Calendar,
  Filter,
  Target,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { CategoryConfig } from '@/lib/reports-utils'
import type { Report } from '@/hooks/useReports'

interface DrillDownAnalyticsProps {
  reports: Report[]
  categories: CategoryConfig[]
  selectedCategory?: string
  onCategoryChange: (categoryId: string) => void
  onBackToOverview: () => void
}

// Dados simulados para drill-down
interface DrillDownData {
  timeframe: string
  metrics: {
    totalReports: number
    totalDownloads: number
    avgGenerationTime: number
    successRate: number
    topPerformers: Array<{
      name: string
      value: number
      change: number
      icon: React.ReactNode
    }>
  }
  trendData: Array<{
    period: string
    value: number
    change: number
  }>
  insights: Array<{
    type: 'success' | 'warning' | 'info'
    title: string
    description: string
    impact: 'high' | 'medium' | 'low'
  }>
}

const DrillDownAnalytics = memo(({
  reports,
  categories,
  selectedCategory,
  onCategoryChange,
  onBackToOverview
}: DrillDownAnalyticsProps) => {
  const [timeframe, setTimeframe] = useState('month')
  const [isLoading, setIsLoading] = useState(false)

  // Filtrar relatórios por categoria selecionada
  const categoryReports = selectedCategory ? reports.filter(r => r.type === selectedCategory) : reports

  // Simular carregamento de dados
  const loadDrillDownData = async (category: string, period: string): Promise<DrillDownData> => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simular delay de API

    // Gerar dados simulados baseados na categoria
    const baseValue = selectedCategory === 'sales' ? 85 : 
                     selectedCategory === 'financial' ? 92 : 
                     selectedCategory === 'customers' ? 78 : 65

    return {
      timeframe: period,
      metrics: {
        totalReports: categoryReports.length * (Math.floor(Math.random() * 5) + 3),
        totalDownloads: categoryReports.reduce((acc, r) => acc + r.downloads, 0),
        avgGenerationTime: Math.floor(Math.random() * 180) + 60, // 60-240 segundos
        successRate: baseValue + Math.floor(Math.random() * 10) - 5,
        topPerformers: [
          {
            name: 'Relatório de Vendas Mensal',
            value: 45,
            change: 12,
            icon: <TrendingUp className="w-4 h-4 text-green-400" />
          },
          {
            name: 'Análise de Clientes VIP',
            value: 38,
            change: -3,
            icon: <TrendingDown className="w-4 h-4 text-red-400" />
          },
          {
            name: 'Performance de Produtos',
            value: 34,
            change: 8,
            icon: <TrendingUp className="w-4 h-4 text-green-400" />
          }
        ]
      },
      trendData: Array.from({ length: 12 }, (_, i) => ({
        period: `Mês ${i + 1}`,
        value: Math.floor(Math.random() * 50) + 20,
        change: Math.floor(Math.random() * 20) - 10
      })),
      insights: [
        {
          type: 'success',
          title: 'Crescimento Sustentado',
          description: 'O número de downloads aumentou 15% este mês em relação ao anterior.',
          impact: 'high'
        },
        {
          type: 'warning',
          title: 'Tempo de Geração',
          description: 'Os relatórios estão demorando mais para serem gerados. Considere otimizar.',
          impact: 'medium'
        },
        {
          type: 'info',
          title: 'Nova Funcionalidade',
          description: 'A taxa de sucesso melhorou com a nova versão do sistema de relatórios.',
          impact: 'low'
        }
      ]
    }
  }

  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null)

  React.useEffect(() => {
    if (selectedCategory) {
      loadDrillDownData(selectedCategory, timeframe).then(setDrillDownData)
    }
  }, [selectedCategory, timeframe])

  const handleRefresh = async () => {
    if (selectedCategory) {
      const data = await loadDrillDownData(selectedCategory, timeframe)
      setDrillDownData(data)
      toast({
        title: "Dados atualizados",
        description: "As informações foram atualizadas com sucesso."
      })
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'warning': return <Target className="w-4 h-4 text-yellow-400" />
      case 'info': return <Eye className="w-4 h-4 text-blue-400" />
      default: return <Eye className="w-4 h-4 text-gray-400" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500/10 border-green-500/20 text-green-400'
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
      case 'info': return 'bg-blue-500/10 border-blue-500/20 text-blue-400'
      default: return 'bg-gray-500/10 border-gray-500/20 text-gray-400'
    }
  }

  const getImpactBadgeColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400'
      case 'low': return 'bg-green-500/20 text-green-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  if (isLoading || !drillDownData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onBackToOverview}
            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold text-white">
            {selectedCategory && categories.find(c => c.id === selectedCategory)?.name} - Análise Detalhada
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-600 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-700 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const selectedCategoryData = selectedCategory ? categories.find(c => c.id === selectedCategory) : null

  return (
    <div className="space-y-6">
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onBackToOverview}
            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {selectedCategoryData?.icon}
              {selectedCategoryData?.name} - Análise Detalhada
            </h2>
            <p className="text-gray-400">Insights profundos e métricas de performance</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="week" className="text-white">7 dias</SelectItem>
              <SelectItem value="month" className="text-white">30 dias</SelectItem>
              <SelectItem value="quarter" className="text-white">90 dias</SelectItem>
              <SelectItem value="year" className="text-white">1 ano</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total de Relatórios</p>
                <p className="text-3xl font-bold text-white">{drillDownData.metrics.totalReports}</p>
                <p className="text-blue-300 text-xs mt-1">Período selecionado</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-full">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium">Total de Downloads</p>
                <p className="text-3xl font-bold text-white">{drillDownData.metrics.totalDownloads}</p>
                <p className="text-green-300 text-xs mt-1">Crescimento: +15%</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-full">
                <Download className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-600/10 border-yellow-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm font-medium">Tempo Médio (s)</p>
                <p className="text-3xl font-bold text-white">{drillDownData.metrics.avgGenerationTime}</p>
                <p className="text-yellow-300 text-xs mt-1">Para gerar relatório</p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-full">
                <Target className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Taxa de Sucesso</p>
                <p className="text-3xl font-bold text-white">{drillDownData.metrics.successRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUp className="w-3 h-3 text-purple-300" />
                  <span className="text-purple-300 text-xs">+2.3%</span>
                </div>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com análises detalhadas */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="bg-gray-900/50 border-gray-700 w-full justify-start">
          <TabsTrigger value="performance" className="text-gray-300">Performance</TabsTrigger>
          <TabsTrigger value="trends" className="text-gray-300">Tendências</TabsTrigger>
          <TabsTrigger value="insights" className="text-gray-300">Insights</TabsTrigger>
        </TabsList>

        {/* Tab de Performance */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                  Top Relatórios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {drillDownData.metrics.topPerformers.map((performer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        {performer.icon}
                        <div>
                          <p className="text-white font-medium">{performer.name}</p>
                          <p className="text-gray-400 text-sm">{performer.value} downloads</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        performer.change > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {performer.change > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>{Math.abs(performer.change)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Distribuição de Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryReports.map((report, index) => (
                    <div key={report.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 truncate">{report.name}</span>
                        <Badge className={
                          report.status === 'ready' ? 'bg-green-500/20 text-green-400' :
                          report.status === 'generating' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }>
                          {report.status === 'ready' && 'Pronto'}
                          {report.status === 'generating' && 'Gerando'}
                          {report.status === 'error' && 'Erro'}
                        </Badge>
                      </div>
                      <Progress 
                        value={report.status === 'ready' ? 100 : report.progress || 0} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab de Tendências */}
        <TabsContent value="trends" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Evolução ao Longo do Tempo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {drillDownData.trendData.map((data, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm w-16">{data.period}</span>
                    <div className="flex-1 bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(data.value / 70) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-white font-medium">{data.value}</span>
                      <div className={`flex items-center gap-1 ${
                        data.change > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {data.change > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>{Math.abs(data.change)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Insights */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {drillDownData.insights.map((insight, index) => (
              <Card key={index} className={`border ${getInsightColor(insight.type)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{insight.title}</h3>
                        <Badge className={getImpactBadgeColor(insight.impact)}>
                          {insight.impact === 'high' && 'Alto Impacto'}
                          {insight.impact === 'medium' && 'Médio Impacto'}
                          {insight.impact === 'low' && 'Baixo Impacto'}
                        </Badge>
                      </div>
                      <p className="text-gray-300 text-sm">{insight.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
})

DrillDownAnalytics.displayName = 'DrillDownAnalytics'

export default DrillDownAnalytics