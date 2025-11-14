import React, { useMemo, memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Download, 
  Eye, 
  MoreVertical, 
  FileSearch,
  Calendar,
  User,
  Tag
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { 
  getTypeIcon, 
  getStatusColor, 
  getStatusIcon, 
  getFormatIcon, 
  formatRelativeDate 
} from '@/lib/reports-utils'
import type { Report } from '@/hooks/useReports'
import type { CategoryConfig } from '@/lib/reports-utils'

interface ReportsListProps {
  reports: Report[]
  categories: CategoryConfig[]
  searchQuery: string
  selectedCategory: string
  dateRange: string
  onReportSelect: (report: Report) => void
  onReportDownload: (reportId: string) => void
  onReportDelete: (reportId: string) => void
  onReportSchedule?: (reportId: string) => void
}

// Memoized Report Card Component
const ReportCard = memo(({ 
  report, 
  onReportSelect, 
  onReportDownload, 
  onReportDelete,
  onReportSchedule 
}: {
  report: Report
  onReportSelect: (report: Report) => void
  onReportDownload: (reportId: string) => void
  onReportDelete: (reportId: string) => void
  onReportSchedule?: (reportId: string) => void
}) => {
  return (
    <Card 
      className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-200 group"
      role="article"
      aria-label={`Relatório ${report.name}`}
    >
      <CardContent className="p-6">
        {/* Header do card */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
              aria-hidden="true"
            >
              {getTypeIcon(report.type)}
            </div>
            <div>
              <h3 
                className="text-white font-semibold text-lg group-hover:text-yellow-400 transition-colors cursor-pointer"
                onClick={() => onReportSelect(report)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onReportSelect(report)}
              >
                {report.name}
              </h3>
              <p className="text-gray-400 text-sm">{report.category}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(report.status)} text-xs`} aria-label={`Status: ${report.status}`}>
            {getStatusIcon(report.status)}
            <span className="ml-1">
              {report.status === 'ready' && 'Pronto'}
              {report.status === 'generating' && 'Gerando'}
              {report.status === 'processing' && 'Processando'}
              {report.status === 'error' && 'Erro'}
              {report.status === 'scheduled' && 'Agendado'}
            </span>
          </Badge>
        </div>
        
        {/* Descrição */}
        <p 
          className="text-gray-400 text-sm mb-4 line-clamp-2"
          aria-label={`Descrição: ${report.description}`}
        >
          {report.description}
        </p>
        
        {/* Progress bar (se estiver gerando) */}
        {report.progress !== undefined && (
          <div className="mb-4" role="progressbar" aria-valuenow={report.progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progresso</span>
              <span>{report.progress}%</span>
            </div>
            <Progress value={report.progress} className="h-2" />
          </div>
        )}
        
        {/* Métricas do arquivo */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            {getFormatIcon(report.format)}
            <span aria-label={`Formato: ${report.format.toUpperCase()}`}>{report.size}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3" aria-hidden="true" />
            <span aria-label={`${report.downloads} downloads`}>{report.downloads}</span>
          </div>
        </div>
        
        {/* Informações do autor e data */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" aria-hidden="true" />
              <span>Por: {report.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" aria-hidden="true" />
              <span>Atualizado: {formatRelativeDate(report.lastGenerated)}</span>
            </div>
          </div>
          
          {/* Ações */}
          <div className="flex items-center gap-1">
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-gray-400 hover:text-white"
              onClick={() => onReportSelect(report)}
              aria-label={`Visualizar ${report.name}`}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-gray-400 hover:text-white"
              onClick={() => onReportDownload(report.id)}
              aria-label={`Baixar ${report.name}`}
              disabled={report.status !== 'ready'}
            >
              <Download className="w-4 h-4" />
            </Button>
            {onReportSchedule && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-gray-400 hover:text-white"
                onClick={() => onReportSchedule(report.id)}
                aria-label={`Agendar ${report.name}`}
              >
                <Calendar className="w-4 h-4" />
              </Button>
            )}
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-gray-400 hover:text-white"
              onClick={() => {/* TODO: Implementar menu */}}
              aria-label={`Mais opções para ${report.name}`}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Tags */}
        {report.tags && (
          <div className="flex flex-wrap gap-1" role="list" aria-label="Tags">
            {report.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs bg-gray-800/50 border-gray-700 text-gray-400"
                role="listitem"
              >
                <Tag className="w-3 h-3 mr-1" aria-hidden="true" />
                {tag}
              </Badge>
            ))}
            {report.tags.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs bg-gray-800/50 border-gray-700 text-gray-400"
                role="listitem"
              >
                +{report.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
})

ReportCard.displayName = 'ReportCard'

// Lista de relatórios principal
export const ReportsList = memo(({
  reports,
  categories,
  searchQuery,
  selectedCategory,
  dateRange,
  onReportSelect,
  onReportDownload,
  onReportDelete,
  onReportSchedule
}: ReportsListProps) => {
  
  // Filtros computados
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = 
        report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || report.type === selectedCategory
      
      // Filtro por período
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
  }, [reports, searchQuery, selectedCategory, dateRange])

  if (filteredReports.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="text-center py-12" role="status" aria-live="polite">
          <FileSearch className="w-16 h-16 text-gray-600 mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">Nenhum relatório encontrado</h3>
          <p className="text-gray-500">
            {searchQuery || selectedCategory !== 'all' 
              ? 'Tente ajustar os filtros ou criar um novo relatório.'
              : 'Comece criando seu primeiro relatório usando um dos templates disponíveis.'
            }
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      role="list"
      aria-label={`Lista de ${filteredReports.length} relatórios`}
    >
      {filteredReports.map((report) => (
        <ReportCard
          key={report.id}
          report={report}
          onReportSelect={onReportSelect}
          onReportDownload={onReportDownload}
          onReportDelete={onReportDelete}
          onReportSchedule={onReportSchedule}
        />
      ))}
    </div>
  )
})

ReportsList.displayName = 'ReportsList'