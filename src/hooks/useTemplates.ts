import { useState, useCallback } from 'react'

export interface ReportTemplate {
  id: string
  name: string
  category: string
  description: string
  icon: string
  estimatedTime: string
  complexity: 'simple' | 'medium' | 'advanced'
  fields: Array<{
    name: string
    type: string
    required: boolean
    options?: string[]
    placeholder?: string
  }>
  preview: string
  features: string[]
}

export const useTemplates = () => {
  const [templates] = useState<ReportTemplate[]>([
    {
      id: '1',
      name: 'Relatório de Vendas Completo',
      category: 'Vendas',
      description: 'Template abrangente para análise de vendas com métricas de performance',
      icon: 'BarChart3',
      estimatedTime: '3-5 minutos',
      complexity: 'medium',
      fields: [
        { name: 'Período Inicial', type: 'date', required: true, placeholder: 'Selecione a data inicial' },
        { name: 'Período Final', type: 'date', required: true, placeholder: 'Selecione a data final' },
        { name: 'Categoria', type: 'select', required: false, options: ['Todas', 'Pizzas', 'Bebidas', 'Sobremesas'], placeholder: 'Todas as categorias' },
        { name: 'Formatos', type: 'select', required: true, options: ['PDF', 'Excel', 'CSV'], placeholder: 'Selecione o formato' },
        { name: 'Incluir Gráficos', type: 'checkbox', required: false, placeholder: 'Sim' }
      ],
      preview: 'Vendas por período, categoria, produto com gráficos de tendência',
      features: ['Gráficos de linha e barras', 'Comparação com período anterior', 'Top 10 produtos', 'Métricas de crescimento']
    },
    {
      id: '2',
      name: 'Análise Financeira Avançada',
      category: 'Financeiro',
      description: 'Template profissional para relatórios financeiros completos',
      icon: 'DollarSign',
      estimatedTime: '5-8 minutos',
      complexity: 'advanced',
      fields: [
        { name: 'Exercício', type: 'date', required: true, placeholder: '2025' },
        { name: 'Período', type: 'select', required: true, options: ['Mensal', 'Trimestral', 'Semestral', 'Anual'], placeholder: 'Selecione o período' },
        { name: 'Tipo de Análise', type: 'select', required: true, options: ['DRE Completo', 'Fluxo de Caixa', 'Balanço Patrimonial', 'Indicadores'], placeholder: 'Tipo de análise' },
        { name: 'Comparação', type: 'checkbox', required: false, placeholder: 'Incluir período anterior' },
        { name: 'Detalhamento', type: 'select', required: false, options: ['Sintético', 'Analítico'], placeholder: 'Nível de detalhamento' }
      ],
      preview: 'DRE, fluxo de caixa, indicadores de liquidez e rentabilidade',
      features: ['DRE detalhado', 'Fluxo de caixa', 'Indicadores financeiros', 'Gráficos de evolução', 'Benchmarks']
    },
    {
      id: '3',
      name: 'Relatório de Clientes',
      category: 'Clientes',
      description: 'Análise completa de comportamento e segmentação de clientes',
      icon: 'Users',
      estimatedTime: '2-4 minutos',
      complexity: 'simple',
      fields: [
        { name: 'Período', type: 'date', required: true, placeholder: 'Último mês' },
        { name: 'Segmento', type: 'select', required: false, options: ['Todos', 'VIP', 'Novos', 'Inativos', 'Frequentes'], placeholder: 'Todos os clientes' },
        { name: 'Métricas', type: 'multiselect', required: false, options: ['Frequência', 'Ticket Médio', 'Lifetime Value', 'Satisfação'], placeholder: 'Selecione as métricas' },
        { name: 'Agrupar por', type: 'select', required: false, options: ['Região', 'Idade', 'Categoria', 'Status'], placeholder: 'Agrupamento' }
      ],
      preview: 'Segmentação, frequência, ticket médio, churn rate',
      features: ['Segmentação automática', 'Cohort analysis', 'Churn rate', 'NPS', 'RFM analysis']
    },
    {
      id: '4',
      name: 'Performance de Produtos',
      category: 'Produtos',
      description: 'Análise detalhada da performance de cada produto no cardápio',
      icon: 'Package',
      estimatedTime: '3-5 minutos',
      complexity: 'medium',
      fields: [
        { name: 'Período', type: 'date', required: true },
        { name: 'Categoria de Produto', type: 'select', required: false, options: ['Todas', 'Pizzas', 'Bebidas', 'Sobremesas'] },
        { name: 'Métricas', type: 'multiselect', required: true, options: ['Vendas', 'Margem', 'Rotação', 'Sazonalidade'] },
        { name: 'Ranking', type: 'select', required: false, options: ['Top 10', 'Top 20', 'Todos'], placeholder: 'Top 10' }
      ],
      preview: 'Ranking de produtos, margem, rotação, análise sazonal',
      features: ['Ranking de vendas', 'Análise de margem', 'Produtos sazonais', 'Substitutos', 'Complementares']
    },
    {
      id: '5',
      name: 'Relatório de Marketing Digital',
      category: 'Marketing',
      description: 'Análise completa de campanhas digitais com ROI e conversões',
      icon: 'Megaphone',
      estimatedTime: '4-6 minutos',
      complexity: 'advanced',
      fields: [
        { name: 'Período', type: 'date', required: true },
        { name: 'Canais', type: 'multiselect', required: true, options: ['Instagram', 'Facebook', 'Google Ads', 'WhatsApp', 'Email'] },
        { name: 'Métricas', type: 'multiselect', required: true, options: ['ROI', 'CPA', 'CTR', 'Conversões', 'Impressões'] },
        { name: 'Detalhamento', type: 'select', required: false, options: ['Por campanha', 'Por canal', 'Por criativo'] }
      ],
      preview: 'ROI por canal, CTR, conversões, attribution model',
      features: ['ROI por canal', 'Attribution model', 'Funnel analysis', 'A/B tests', 'Cost analysis']
    }
  ])

  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)

  const selectTemplate = useCallback((template: ReportTemplate | null) => {
    setSelectedTemplate(template)
  }, [])

  const getTemplatesByCategory = useCallback((category: string) => {
    if (category === 'all') return templates
    return templates.filter(template => template.category === category)
  }, [templates])

  const getTemplatesByComplexity = useCallback((complexity: 'simple' | 'medium' | 'advanced') => {
    return templates.filter(template => template.complexity === complexity)
  }, [templates])

  const validateTemplateFields = useCallback((template: ReportTemplate, formData: Record<string, any>) => {
    const requiredFields = template.fields.filter(field => field.required)
    const missingFields: string[] = []

    requiredFields.forEach(field => {
      if (!formData[field.name] || formData[field.name].toString().trim() === '') {
        missingFields.push(field.name)
      }
    })

    return {
      isValid: missingFields.length === 0,
      missingFields
    }
  }, [])

  return {
    templates,
    selectedTemplate,
    selectTemplate,
    getTemplatesByCategory,
    getTemplatesByComplexity,
    validateTemplateFields
  }
}