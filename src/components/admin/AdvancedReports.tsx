'use client'

import React, { useState, useCallback, useMemo, memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Download, 
  Calendar,
  RefreshCw,
  Settings,
  HelpCircle,
  Share,
  Plus,
  Activity,
  Target,
  TrendingUp,
  CheckCircle,
  Users,
  Package,
  DollarSign,
  Megaphone,
  BarChart3
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

// Hooks customizados
import { useReports, type Report } from '@/hooks/useReports'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useTemplates, type ReportTemplate } from '@/hooks/useTemplates'

// Componentes modulares
import { LoadingStates } from './reports/LoadingStates'
import { ReportsErrorBoundary } from './reports/ErrorBoundary'
import { ReportsList } from './reports/ReportsList'
import { AdvancedFilters } from './reports/AdvancedFilters'
import ExportModal, { type ExportOptions } from './reports/ExportModal'
import ScheduleModal, { type ScheduleData } from './reports/ScheduleModal'
import DrillDownAnalytics from './reports/DrillDownAnalytics'

// Utilitários
import { 
  getTypeIcon, 
  categories,
  formatRelativeDate 
} from '@/lib/reports-utils'

// Estados da aplicação
interface AppState {
  activeTab: string
  searchQuery: string
  selectedCategory: string
  dateRange: string
  showCreateModal: boolean
  showPreviewModal: boolean
  showExportModal: boolean
  showScheduleModal: boolean
  selectedReport: Report | null
  selectedTemplate: ReportTemplate | null
  isDrillDownMode: boolean
}

// Componente principal refatorado
const AdvancedReports = memo(() => {
  // Hooks para gerenciamento de estado
  const {
    reports,
    generating,
    stats,
    generateReportFromTemplate,
    downloadReport,
    refreshReports,
    filterReports
  } = useReports()

  const {
    chartData,
    categoryPerformance,
    detailedStats
  } = useAnalytics(reports, stats)

  const {
    templates,
    selectedTemplate,
    selectTemplate,
    validateTemplateFields
  } = useTemplates()

  // Estado local da aplicação
  const [state, setState] = useState<AppState>({
    activeTab: 'dashboard',
    searchQuery: '',
    selectedCategory: 'all',
    dateRange: 'month',
    showCreateModal: false,
    showPreviewModal: false,
    showExportModal: false,
    showScheduleModal: false,
    selectedReport: null,
    selectedTemplate: null,
    isDrillDownMode: false
  })

  // Handlers otimizados com useCallback
  const updateState = useCallback((updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const handleTabChange = useCallback((tab: string) => {
    updateState({ 
      activeTab: tab,
      isDrillDownMode: false 
    })
  }, [updateState])

  const handleSearchChange = useCallback((query: string) => {
    updateState({ searchQuery: query })
  }, [updateState])

  const handleCategoryChange = useCallback((category: string) => {
    updateState({ selectedCategory: category })
  }, [updateState])

  const handleDateRangeChange = useCallback((range: string) => {
    updateState({ dateRange: range })
  }, [updateState])

  const handleResetFilters = useCallback(() => {
    updateState({
      searchQuery: '',
      selectedCategory: 'all',
      dateRange: 'month'
    })
  }, [updateState])

  const handleReportSelect = useCallback((report: Report) => {
    updateState({ selectedReport: report })
  }, [updateState])

  const handleTemplateSelect = useCallback((template: ReportTemplate) => {
    updateState({ 
      selectedTemplate: template,
      showPreviewModal: true 
    })
  }, [updateState])

  const handleGenerateReport = useCallback(async (template: ReportTemplate) => {
    try {
      await generateReportFromTemplate(template)
      updateState({ 
        showCreateModal: false,
        showPreviewModal: false,
        selectedTemplate: null
      })
    } catch (error) {
      toast({
        title: "Erro na geração",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive"
      })
    }
  }, [generateReportFromTemplate, updateState])

  const handleExportReports = useCallback(async (
    reportsToExport: Report[], 
    format: string, 
    options: ExportOptions
  ) => {
    try {
      // Simular exportação
      console.log('Exportando relatórios:', { reportsToExport, format, options })
      
      // Implementar lógica de exportação aqui
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Exportação concluída",
        description: `${reportsToExport.length} relatório(s) exportado(s) com sucesso.`
      })
    } catch (error) {
      throw new Error('Falha na exportação')
    }
  }, [])

  const handleScheduleReport = useCallback(async (scheduleData: ScheduleData) => {
    try {
      // Simular agendamento
      console.log('Agendando relatório:', scheduleData)
      
      // Implementar lógica de agendamento aqui
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Atualizar relatório com informação de agendamento
      // updateReport(scheduleData.reportId, { schedule: scheduleData.frequency })
      
      toast({
        title: "Agendamento criado",
        description: "O relatório será gerado automaticamente conforme programado."
      })
    } catch (error) {
      throw new Error('Falha no agendamento')
    }
  }, [])

  // Cálculos computados com useMemo para otimização
  const filteredReports = useMemo(() => {
    return filterReports(state.searchQuery, state.selectedCategory, state.dateRange)
  }, [reports, state.searchQuery, state.selectedCategory, state.dateRange, filterReports])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (state.searchQuery) count++
    if (state.selectedCategory !== 'all') count++
    if (state.dateRange !== 'month') count++
    return count
  }, [state.searchQuery, state.selectedCategory, state.dateRange])

  const isLoading = generating !== null

  return (
    <ReportsErrorBoundary>
      <div className="space-y-6 p-6">
        {/* Header Premium */}
        <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent"></div>
          <div className="relative">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-3">Centro de Relatórios Avançado</h1>
                <p className="text-gray-300 text-lg mb-4">
                  Análise profissional e relatórios executivos otimizados para sua pizzaria
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">Sistema Ativo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 text-sm font-medium">
                      {stats.readyReports} Relatórios Prontos
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 text-sm font-medium">
                      {stats.totalDownloads} Downloads Totais
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => updateState({ showCreateModal: true })}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  aria-label="Criar novo relatório"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Relatório
                </Button>
                <Button 
                  variant="outline" 
                  onClick={refreshReports}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  aria-label="Atualizar dados"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Atualizar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => updateState({ showExportModal: true })}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  aria-label="Exportar relatórios"
                  disabled={filteredReports.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  aria-label="Compartilhar relatórios"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard de Métricas */}
        <ReportsErrorBoundary fallback={<LoadingStates type="dashboard" />}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                title: 'Total de Relatórios',
                value: stats.totalReports,
                subtitle: '+12% este mês',
                icon: FileText,
                gradient: 'from-blue-500 to-blue-600',
                bgColor: 'bg-blue-500/10 border-blue-500/20'
              },
              {
                title: 'Prontos',
                value: stats.readyReports,
                subtitle: 'Disponíveis',
                icon: CheckCircle,
                gradient: 'from-green-500 to-green-600',
                bgColor: 'bg-green-500/10 border-green-500/20'
              },
              {
                title: 'Gerando',
                value: stats.generatingReports,
                subtitle: 'Em processo',
                icon: RefreshCw,
                gradient: 'from-orange-500 to-red-500',
                bgColor: 'bg-orange-500/10 border-orange-500/20'
              },
              {
                title: 'Downloads',
                value: stats.totalDownloads,
                subtitle: 'Total geral',
                icon: Download,
                gradient: 'from-purple-500 to-purple-600',
                bgColor: 'bg-purple-500/10 border-purple-500/20'
              },
              {
                title: 'Agendados',
                value: stats.scheduledReports,
                subtitle: 'Relatórios',
                icon: Calendar,
                gradient: 'from-indigo-500 to-indigo-600',
                bgColor: 'bg-indigo-500/10 border-indigo-500/20'
              },
              {
                title: 'Taxa de Sucesso',
                value: `${stats.successRate}%`,
                subtitle: 'Geração',
                icon: Target,
                gradient: 'from-pink-500 to-pink-600',
                bgColor: 'bg-pink-500/10 border-pink-500/20'
              }
            ].map((metric, index) => (
              <Card key={index} className={`border ${metric.bgColor} hover:scale-105 transition-transform duration-200`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm font-medium">{metric.title}</p>
                      <p className="text-3xl font-bold text-white">{metric.value}</p>
                      <p className="text-gray-400 text-xs mt-1">{metric.subtitle}</p>
                    </div>
                    <div className={`bg-gradient-to-br ${metric.gradient} p-3 rounded-full`}>
                      <metric.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ReportsErrorBoundary>

        {/* Tabs de Navegação */}
        <Tabs value={state.activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="bg-gray-900/50 border-gray-700 w-full justify-start">
            <TabsTrigger value="dashboard" className="text-gray-300 hover:text-white">Dashboard</TabsTrigger>
            <TabsTrigger value="reports" className="text-gray-300 hover:text-white">Meus Relatórios</TabsTrigger>
            <TabsTrigger value="templates" className="text-gray-300 hover:text-white">Templates</TabsTrigger>
            <TabsTrigger value="analytics" className="text-gray-300 hover:text-white">Analytics</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <ReportsErrorBoundary fallback={<LoadingStates type="dashboard" />}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-yellow-400" />
                      Relatórios Gerados (Últimos 7 dias)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {chartData.map((data, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <span className="text-gray-400 text-sm w-16">{data.date}</span>
                          <div className="flex-1 bg-gray-800 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(data.reports / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-medium">{data.reports}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Download className="w-5 h-5 text-blue-400" />
                      Downloads Diários
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {chartData.map((data, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <span className="text-gray-400 text-sm w-16">{data.date}</span>
                          <div className="flex-1 bg-gray-800 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(data.downloads / 60) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-medium">{data.downloads}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    Relatórios Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reports.slice(0, 5).map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                            {getTypeIcon(report.type)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{report.name}</p>
                            <p className="text-gray-400 text-sm">{formatRelativeDate(report.lastGenerated)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            report.status === 'ready' ? 'bg-green-500/20 text-green-400' :
                            report.status === 'generating' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }>
                            <RefreshCw className={`w-3 h-3 mr-1 ${report.status === 'generating' ? 'animate-spin' : ''}`} />
                            {report.status === 'ready' && 'Pronto'}
                            {report.status === 'generating' && 'Gerando'}
                            {report.status === 'processing' && 'Processando'}
                          </Badge>
                          <Button size="sm" variant="outline" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ReportsErrorBoundary>
          </TabsContent>

          {/* Meus Relatórios */}
          <TabsContent value="reports" className="space-y-6">
            <ReportsErrorBoundary>
              <AdvancedFilters
                searchQuery={state.searchQuery}
                selectedCategory={state.selectedCategory}
                dateRange={state.dateRange}
                onSearchChange={handleSearchChange}
                onCategoryChange={handleCategoryChange}
                onDateRangeChange={handleDateRangeChange}
                onReset={handleResetFilters}
                categories={categories}
                resultCount={filteredReports.length}
                activeFiltersCount={activeFiltersCount}
              />

              <ReportsErrorBoundary fallback={<LoadingStates type="reports-list" />}>
                <ReportsList
                  reports={filteredReports}
                  categories={categories}
                  searchQuery={state.searchQuery}
                  selectedCategory={state.selectedCategory}
                  dateRange={state.dateRange}
                  onReportSelect={handleReportSelect}
                  onReportDownload={downloadReport}
                  onReportDelete={(reportId) => {
                    // TODO: Implementar delete
                    console.log('Delete report:', reportId)
                  }}
                  onReportSchedule={(reportId) => {
                    const report = reports.find(r => r.id === reportId)
                    if (report) {
                      updateState({ 
                        selectedReport: report,
                        showScheduleModal: true 
                      })
                    }
                  }}
                />
              </ReportsErrorBoundary>
            </ReportsErrorBoundary>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates" className="space-y-6">
            <ReportsErrorBoundary fallback={<LoadingStates type="templates" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="bg-gray-900 border-gray-800 hover:border-yellow-500/50 transition-all duration-200 group cursor-pointer"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold group-hover:text-yellow-400 transition-colors">
                            {template.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={
                              template.complexity === 'simple' ? 'bg-green-500/20 text-green-400' :
                              template.complexity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }>
                              {template.complexity === 'simple' && 'Simples'}
                              {template.complexity === 'medium' && 'Médio'}
                              {template.complexity === 'advanced' && 'Avançado'}
                            </Badge>
                            <span className="text-gray-500 text-xs">{template.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                      <p className="text-xs text-gray-500 mb-4">{template.preview}</p>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-xs text-gray-500 font-medium">Recursos incluídos:</p>
                        {template.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-gray-400">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {template.features.length > 3 && (
                          <p className="text-xs text-gray-500">+{template.features.length - 3} recursos adicionais</p>
                        )}
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
                        disabled={isLoading}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleGenerateReport(template)
                        }}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Gerando...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Usar Template
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ReportsErrorBoundary>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <ReportsErrorBoundary fallback={<LoadingStates type="analytics" />}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                      Performance dos Relatórios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categoryPerformance.map((category) => (
                        <div key={category.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {category.icon}
                              <span className="text-white font-medium">{category.name}</span>
                            </div>
                            <span className="text-gray-400 text-sm">{category.downloads} downloads</span>
                          </div>
                          <div className="bg-gray-800 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full bg-gradient-to-r ${category.color.replace('bg-', 'from-').replace('-500', '-400')} to-${category.color.split('-')[1]}-500 transition-all duration-300`}
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      Estatísticas Detalhadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-800 rounded-lg">
                          <p className="text-2xl font-bold text-white">{detailedStats.totalPagesProcessed}</p>
                          <p className="text-gray-400 text-sm">Páginas Processadas</p>
                        </div>
                        <div className="text-center p-4 bg-gray-800 rounded-lg">
                          <p className="text-2xl font-bold text-white">{detailedStats.totalViews}</p>
                          <p className="text-gray-400 text-sm">Visualizações</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-800 rounded-lg">
                          <p className="text-2xl font-bold text-white">{detailedStats.satisfactionRate}%</p>
                          <p className="text-gray-400 text-sm">Satisfação</p>
                        </div>
                        <div className="text-center p-4 bg-gray-800 rounded-lg">
                          <p className="text-2xl font-bold text-white">{detailedStats.minutesSaved}</p>
                          <p className="text-gray-400 text-sm">Min. Economizados</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ReportsErrorBoundary>
          </TabsContent>
        </Tabs>

        {/* Modais */}
        <ExportModal
          isOpen={state.showExportModal}
          onClose={() => updateState({ showExportModal: false })}
          reports={filteredReports}
          onExport={handleExportReports}
        />

        <ScheduleModal
          isOpen={state.showScheduleModal}
          onClose={() => updateState({ showScheduleModal: false, selectedReport: null })}
          report={state.selectedReport}
          onSchedule={handleScheduleReport}
        />

        {/* Modal de Preview do Template */}
        {state.selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-900 border-gray-800 text-white max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-yellow-400" />
                    Preview do Template
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => updateState({ selectedTemplate: null, showPreviewModal: false })}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">{state.selectedTemplate.name}</h3>
                  <p className="text-gray-400">{state.selectedTemplate.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-3">Informações</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Categoria:</span>
                        <span>{state.selectedTemplate.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Complexidade:</span>
                        <Badge className={
                          state.selectedTemplate.complexity === 'simple' ? 'bg-green-500/20 text-green-400' :
                          state.selectedTemplate.complexity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }>
                          {state.selectedTemplate.complexity}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tempo Estimado:</span>
                        <span>{state.selectedTemplate.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-3">Recursos</h4>
                    <div className="space-y-2">
                      {state.selectedTemplate.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => updateState({ selectedTemplate: null, showPreviewModal: false })}
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
                    onClick={() => handleGenerateReport(state.selectedTemplate!)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ReportsErrorBoundary>
  )
})

AdvancedReports.displayName = 'AdvancedReports'

export default AdvancedReports