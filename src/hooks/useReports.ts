import { useState, useCallback, useMemo } from 'react'
import { toast } from '@/hooks/use-toast'

export interface Report {
  id: string
  name: string
  type: 'financial' | 'sales' | 'customers' | 'products' | 'marketing' | 'operations'
  category: string
  description: string
  createdAt: string
  lastGenerated: string
  status: 'ready' | 'generating' | 'error' | 'scheduled' | 'processing'
  format: 'pdf' | 'excel' | 'csv' | 'json'
  size: string
  downloads: number
  schedule?: string
  author: string
  tags: string[]
  progress?: number
  data?: any
}

export interface ReportStats {
  totalReports: number
  readyReports: number
  generatingReports: number
  totalDownloads: number
  scheduledReports: number
  successRate: number
}

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      name: 'Relatório de Vendas Mensal',
      type: 'sales',
      category: 'Vendas',
      description: 'Análise completa das vendas do mês com métricas detalhadas, gráficos de performance e comparações',
      createdAt: '2025-11-01 10:30',
      lastGenerated: '2025-11-14 09:15',
      status: 'ready',
      format: 'pdf',
      size: '2.4 MB',
      downloads: 45,
      schedule: 'Mensal',
      author: 'João Silva',
      tags: ['vendas', 'mensal', 'pdf', 'performance']
    },
    {
      id: '2',
      name: 'Análise de Clientes VIP',
      type: 'customers',
      category: 'Clientes',
      description: 'Segmentação e comportamento dos clientes VIP com Lifetime Value e métricas de retenção',
      createdAt: '2025-11-10 09:15',
      lastGenerated: '2025-11-14 08:30',
      status: 'ready',
      format: 'excel',
      size: '1.8 MB',
      downloads: 23,
      author: 'Maria Santos',
      tags: ['clientes', 'VIP', 'excel', 'retenção']
    },
    {
      id: '3',
      name: 'DRE - Demonstrativo de Resultados',
      type: 'financial',
      category: 'Financeiro',
      description: 'Relatório financeiro completo com DRE, fluxo de caixa e indicadores de rentabilidade',
      createdAt: '2025-11-08 14:20',
      lastGenerated: '2025-11-14 06:00',
      status: 'generating',
      format: 'pdf',
      size: '3.1 MB',
      downloads: 67,
      schedule: 'Mensal',
      author: 'Carlos Oliveira',
      tags: ['financeiro', 'DRE', 'pdf', 'rentabilidade'],
      progress: 75
    },
    {
      id: '4',
      name: 'Performance de Produtos',
      type: 'products',
      category: 'Produtos',
      description: 'Análise detalhada da performance de cada produto com ranking de vendas e margem',
      createdAt: '2025-11-12 11:45',
      lastGenerated: '2025-11-14 07:20',
      status: 'ready',
      format: 'excel',
      size: '1.2 MB',
      downloads: 34,
      author: 'Ana Costa',
      tags: ['produtos', 'performance', 'excel', 'margem']
    },
    {
      id: '5',
      name: 'Marketing Digital - ROI',
      type: 'marketing',
      category: 'Marketing',
      description: 'Análise de campanhas digitais com ROI, conversões e métricas de engajamento',
      createdAt: '2025-11-09 16:30',
      lastGenerated: '2025-11-14 05:45',
      status: 'processing',
      format: 'pdf',
      size: '4.2 MB',
      downloads: 12,
      schedule: 'Semanal',
      author: 'Pedro Lima',
      tags: ['marketing', 'ROI', 'digital', 'conversões']
    }
  ])

  const [generating, setGenerating] = useState<string | null>(null)

  const addReport = useCallback((newReport: Report) => {
    setReports(prev => [newReport, ...prev])
  }, [])

  const updateReport = useCallback((id: string, updates: Partial<Report>) => {
    setReports(prev => prev.map(report => 
      report.id === id ? { ...report, ...updates } : report
    ))
  }, [])

  const deleteReport = useCallback((id: string) => {
    setReports(prev => prev.filter(report => report.id !== id))
  }, [])

  const generateReportFromTemplate = useCallback(async (template: any) => {
    setGenerating(template.id)
    
    try {
      // Simular geração de relatório
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const newReport: Report = {
        id: Date.now().toString(),
        name: `${template.name} - ${new Date().toLocaleDateString('pt-BR')}`,
        type: template.category.toLowerCase() as any,
        category: template.category,
        description: template.description,
        createdAt: new Date().toISOString(),
        lastGenerated: new Date().toISOString(),
        status: 'ready',
        format: 'pdf',
        size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
        downloads: 0,
        author: 'Sistema',
        tags: ['gerado', 'template', template.category.toLowerCase()]
      }
      
      addReport(newReport)
      
      toast({
        title: "Relatório Gerado",
        description: `${template.name} foi criado com sucesso!`
      })
      
      return newReport
    } catch (error) {
      toast({
        title: "Erro na Geração",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive"
      })
      throw error
    } finally {
      setGenerating(null)
    }
  }, [addReport])

  const downloadReport = useCallback((reportId: string) => {
    const report = reports.find(r => r.id === reportId)
    if (report) {
      // Simular download
      updateReport(reportId, { downloads: report.downloads + 1 })
      toast({
        title: "Download Iniciado",
        description: `Baixando ${report.name}...`
      })
    }
  }, [reports, updateReport])

  const refreshReports = useCallback(async () => {
    // Simular refresh de dados
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast({
      title: "Dados Atualizados",
      description: "Lista de relatórios foi atualizada com sucesso!"
    })
  }, [])

  // Estatísticas calculadas com useMemo para otimização
  const stats: ReportStats = useMemo(() => ({
    totalReports: reports.length,
    readyReports: reports.filter(r => r.status === 'ready').length,
    generatingReports: reports.filter(r => r.status === 'generating' || r.status === 'processing').length,
    totalDownloads: reports.reduce((acc, r) => acc + r.downloads, 0),
    scheduledReports: reports.filter(r => r.schedule).length,
    successRate: 94.2
  }), [reports])

  // Função para filtrar relatórios
  const filterReports = useCallback((
    searchQuery: string, 
    selectedCategory: string, 
    dateRange: string
  ) => {
    return reports.filter(report => {
      const matchesSearch = 
        report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || report.type === selectedCategory
      
      // Adicionar filtros de data baseados no dateRange se necessário
      const now = new Date()
      const reportDate = new Date(report.createdAt)
      const daysDiff = (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24)
      
      let matchesDateRange = true
      switch (dateRange) {
        case 'week':
          matchesDateRange = daysDiff <= 7
          break
        case 'month':
          matchesDateRange = daysDiff <= 30
          break
        case 'quarter':
          matchesDateRange = daysDiff <= 90
          break
        case 'year':
          matchesDateRange = daysDiff <= 365
          break
      }
      
      return matchesSearch && matchesCategory && matchesDateRange
    })
  }, [reports])

  return {
    reports,
    generating,
    stats,
    addReport,
    updateReport,
    deleteReport,
    generateReportFromTemplate,
    downloadReport,
    refreshReports,
    filterReports
  }
}