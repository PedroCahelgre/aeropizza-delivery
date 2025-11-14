import React, { useState, memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Database, 
  Mail, 
  Calendar,
  Settings,
  Check,
  X,
  Loader2
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { exportFormats } from '@/lib/reports-utils'
import type { Report } from '@/hooks/useReports'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  reports: Report[]
  onExport?: (reports: Report[], format: string, options: ExportOptions) => Promise<void>
}

export interface ExportOptions {
  format: string
  includeCharts: boolean
  includeMetadata: boolean
  sendEmail: boolean
  emailAddress?: string
  scheduleExport?: boolean
  scheduleDate?: string
  compressionEnabled: boolean
}

// Estado de exportação
interface ExportState {
  isExporting: boolean
  progress: number
  currentStep: string
  error?: string
}

const ExportModal = memo(({
  isOpen,
  onClose,
  reports,
  onExport
}: ExportModalProps) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeCharts: true,
    includeMetadata: true,
    sendEmail: false,
    compressionEnabled: true
  })
  
  const [selectedReports, setSelectedReports] = useState<string[]>([])
  const [exportState, setExportState] = useState<ExportState>({
    isExporting: false,
    progress: 0,
    currentStep: ''
  })

  const handleSelectReport = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    )
  }

  const handleSelectAll = () => {
    if (selectedReports.length === reports.length) {
      setSelectedReports([])
    } else {
      setSelectedReports(reports.map(r => r.id))
    }
  }

  const handleExport = async () => {
    if (selectedReports.length === 0) {
      toast({
        title: "Nenhum relatório selecionado",
        description: "Selecione pelo menos um relatório para exportar.",
        variant: "destructive"
      })
      return
    }

    if (exportOptions.sendEmail && !exportOptions.emailAddress) {
      toast({
        title: "Email obrigatório",
        description: "Informe um endereço de email para enviar os relatórios.",
        variant: "destructive"
      })
      return
    }

    setExportState({
      isExporting: true,
      progress: 0,
      currentStep: 'Preparando relatórios...'
    })

    try {
      const selectedReportsData = reports.filter(r => selectedReports.includes(r.id))
      
      // Simular progresso de exportação
      for (let i = 0; i <= 100; i += 10) {
        setExportState(prev => ({
          ...prev,
          progress: i,
          currentStep: i < 30 ? 'Preparando dados...' :
                     i < 60 ? 'Gerando arquivo...' :
                     i < 90 ? 'Aplicando configurações...' :
                     'Finalizando...'
        }))
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      if (onExport) {
        await onExport(selectedReportsData, exportOptions.format, exportOptions)
      }

      toast({
        title: "Exportação concluída!",
        description: `${selectedReports.length} relatório${selectedReports.length > 1 ? 's' : ''} exportado${selectedReports.length > 1 ? 's' : ''} com sucesso.`
      })

      onClose()
    } catch (error) {
      setExportState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }))
    } finally {
      setExportState({
        isExporting: false,
        progress: 0,
        currentStep: ''
      })
    }
  }

  const getFormatIcon = (format: string) => {
    const formatData = exportFormats.find(f => f.value === format)
    return formatData?.icon || <FileText className="w-4 h-4" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-yellow-400" />
            Exportar Relatórios
          </DialogTitle>
        </DialogHeader>

        {exportState.isExporting ? (
          // Estado de exportação em progresso
          <div className="py-8">
            <div className="text-center mb-6">
              <Loader2 className="w-12 h-12 animate-spin text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Exportando Relatórios</h3>
              <p className="text-gray-400">{exportState.currentStep}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Progresso</span>
                <span>{exportState.progress}%</span>
              </div>
              <Progress value={exportState.progress} className="h-2" />
            </div>
            
            {exportState.error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-red-400">
                  <X className="w-4 h-4" />
                  <span className="font-medium">Erro na exportação</span>
                </div>
                <p className="text-red-300 text-sm mt-1">{exportState.error}</p>
              </div>
            )}
          </div>
        ) : (
          // Formulário de exportação
          <div className="space-y-6">
            {/* Seleção de relatórios */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Selecionar Relatórios</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  {selectedReports.length === reports.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                </Button>
              </div>
              
              <div className="max-h-48 overflow-y-auto space-y-2">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded">
                    <Checkbox
                      id={report.id}
                      checked={selectedReports.includes(report.id)}
                      onCheckedChange={() => handleSelectReport(report.id)}
                    />
                    <Label htmlFor={report.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        {getFormatIcon(report.format)}
                        <span className="text-white text-sm">{report.name}</span>
                        <span className="text-gray-400 text-xs">({report.size})</span>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
              
              <p className="text-gray-400 text-xs mt-2">
                {selectedReports.length} de {reports.length} relatórios selecionados
              </p>
            </div>

            {/* Configurações de exportação */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Formato */}
              <div>
                <Label className="text-white mb-2 block">Formato</Label>
                <Select
                  value={exportOptions.format}
                  onValueChange={(value) => setExportOptions(prev => ({ ...prev, format: value }))}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {exportFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value} className="text-white">
                        <div className="flex items-center gap-2">
                          {format.icon}
                          {format.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Incluir gráficos */}
              <div className="space-y-3">
                <Label className="text-white">Opções</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-charts"
                      checked={exportOptions.includeCharts}
                      onCheckedChange={(checked) => 
                        setExportOptions(prev => ({ ...prev, includeCharts: !!checked }))
                      }
                    />
                    <Label htmlFor="include-charts" className="text-gray-300 text-sm">
                      Incluir gráficos
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-metadata"
                      checked={exportOptions.includeMetadata}
                      onCheckedChange={(checked) => 
                        setExportOptions(prev => ({ ...prev, includeMetadata: !!checked }))
                      }
                    />
                    <Label htmlFor="include-metadata" className="text-gray-300 text-sm">
                      Incluir metadados
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="compression"
                      checked={exportOptions.compressionEnabled}
                      onCheckedChange={(checked) => 
                        setExportOptions(prev => ({ ...prev, compressionEnabled: !!checked }))
                      }
                    />
                    <Label htmlFor="compression" className="text-gray-300 text-sm">
                      Comprimir arquivos
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Opções avançadas */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="send-email"
                  checked={exportOptions.sendEmail}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, sendEmail: !!checked }))
                  }
                />
                <Label htmlFor="send-email" className="text-white">
                  Enviar por email
                </Label>
              </div>
              
              {exportOptions.sendEmail && (
                <div>
                  <Label htmlFor="email" className="text-white mb-2 block">Endereço de email</Label>
                  <input
                    id="email"
                    type="email"
                    value={exportOptions.emailAddress || ''}
                    onChange={(e) => setExportOptions(prev => ({ 
                      ...prev, 
                      emailAddress: e.target.value 
                    }))}
                    placeholder="seu@email.com"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400"
                  />
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
              <Button
                variant="outline"
                onClick={onClose}
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleExport}
                disabled={selectedReports.length === 0}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar ({selectedReports.length})
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
})

ExportModal.displayName = 'ExportModal'

export default ExportModal