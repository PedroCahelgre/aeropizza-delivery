import React, { useState, memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { 
  Calendar, 
  Clock, 
  Mail, 
  Bell, 
  Settings, 
  Repeat,
  CheckCircle,
  AlertCircle,
  Save
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { scheduleOptions } from '@/lib/reports-utils'
import type { Report } from '@/hooks/useReports'

interface ScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  report?: Report | null
  onSchedule?: (scheduleData: ScheduleData) => Promise<void>
}

export interface ScheduleData {
  reportId: string
  frequency: string
  time: string
  startDate: string
  endDate?: string
  description?: string
  emailNotifications: boolean
  emailAddress?: string
  active: boolean
  conditions?: {
    minDownloads?: number
    minSize?: number
    onlyOnErrors?: boolean
  }
}

// Estado do modal
interface ScheduleState {
  isSaving: boolean
  error?: string
}

const ScheduleModal = memo(({
  isOpen,
  onClose,
  report,
  onSchedule
}: ScheduleModalProps) => {
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    reportId: report?.id || '',
    frequency: 'monthly',
    time: '09:00',
    startDate: new Date().toISOString().split('T')[0],
    description: '',
    emailNotifications: true,
    emailAddress: '',
    active: true,
    conditions: {
      minDownloads: 0,
      minSize: 0,
      onlyOnErrors: false
    }
  })

  const [state, setState] = useState<ScheduleState>({
    isSaving: false
  })

  // Atualizar dados quando o relatório mudar
  React.useEffect(() => {
    if (report) {
      setScheduleData(prev => ({
        ...prev,
        reportId: report.id,
        description: `Relatório automático: ${report.name}`
      }))
    }
  }, [report])

  const handleInputChange = (field: keyof ScheduleData, value: any) => {
    setScheduleData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleConditionChange = (field: keyof NonNullable<ScheduleData['conditions']>, value: any) => {
    setScheduleData(prev => ({
      ...prev,
      conditions: {
        ...(prev.conditions || {}),
        [field]: value
      }
    }))
  }

  const validateScheduleData = (): boolean => {
    if (!scheduleData.reportId) {
      toast({
        title: "Relatório obrigatório",
        description: "Selecione um relatório para agendar.",
        variant: "destructive"
      })
      return false
    }

    if (!scheduleData.time) {
      toast({
        title: "Horário obrigatório",
        description: "Defina um horário para o agendamento.",
        variant: "destructive"
      })
      return false
    }

    if (!scheduleData.startDate) {
      toast({
        title: "Data de início obrigatória",
        description: "Defina uma data de início para o agendamento.",
        variant: "destructive"
      })
      return false
    }

    if (scheduleData.emailNotifications && !scheduleData.emailAddress) {
      toast({
        title: "Email obrigatório",
        description: "Informe um endereço de email para receber as notificações.",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const handleSave = async () => {
    if (!validateScheduleData()) return

    setState({ isSaving: true })

    try {
      if (onSchedule) {
        await onSchedule(scheduleData)
      }

      toast({
        title: "Agendamento salvo!",
        description: `O relatório será gerado ${getFrequencyLabel(scheduleData.frequency)} às ${scheduleData.time}.`
      })

      onClose()
    } catch (error) {
      setState({
        isSaving: false,
        error: error instanceof Error ? error.message : 'Erro ao salvar agendamento'
      })
      
      toast({
        title: "Erro no agendamento",
        description: "Não foi possível salvar o agendamento. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setState({ isSaving: false })
    }
  }

  const getFrequencyLabel = (frequency: string) => {
    const option = scheduleOptions.find(opt => opt.value === frequency)
    return option?.label.toLowerCase() || frequency
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-yellow-400" />
            Agendar Relatório
            {report && <span className="text-gray-400">- {report.name}</span>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configurações básicas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Configurações de Agendamento
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Frequência */}
              <div>
                <Label className="text-white mb-2 block">Frequência</Label>
                <Select
                  value={scheduleData.frequency}
                  onValueChange={(value) => handleInputChange('frequency', value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {scheduleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-white">
                        <div className="flex items-center gap-2">
                          <Repeat className="w-4 h-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Horário */}
              <div>
                <Label className="text-white mb-2 block">Horário</Label>
                <Input
                  type="time"
                  value={scheduleData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Data de início */}
              <div>
                <Label className="text-white mb-2 block">Data de Início</Label>
                <Input
                  type="date"
                  value={scheduleData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Data de fim (opcional) */}
              <div>
                <Label className="text-white mb-2 block">Data de Fim (opcional)</Label>
                <Input
                  type="date"
                  value={scheduleData.endDate || ''}
                  onChange={(e) => handleInputChange('endDate', e.target.value || undefined)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <Label className="text-white mb-2 block">Descrição do Agendamento</Label>
              <Textarea
                value={scheduleData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descreva o propósito deste agendamento..."
                className="bg-gray-800 border-gray-700 text-white"
                rows={2}
              />
            </div>
          </div>

          {/* Notificações */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Notificações
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Notificações por email</p>
                  <p className="text-gray-400 text-sm">Receba uma notificação quando o relatório for gerado</p>
                </div>
              </div>
              <Switch
                checked={scheduleData.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
              />
            </div>

            {scheduleData.emailNotifications && (
              <div>
                <Label className="text-white mb-2 block">Endereço de Email</Label>
                <Input
                  type="email"
                  value={scheduleData.emailAddress || ''}
                  onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                  placeholder="seu@email.com"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            )}
          </div>

          {/* Condições avançadas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Condições Avançadas (opcional)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white mb-2 block">Mínimo de Downloads</Label>
                <Input
                  type="number"
                  min="0"
                  value={scheduleData.conditions?.minDownloads || 0}
                  onChange={(e) => handleConditionChange('minDownloads', parseInt(e.target.value) || 0)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-gray-400 text-xs mt-1">Gerar apenas se houver pelo menos X downloads</p>
              </div>

              <div>
                <Label className="text-white mb-2 block">Tamanho Mínimo (MB)</Label>
                <Input
                  type="number"
                  min="0"
                  value={scheduleData.conditions?.minSize || 0}
                  onChange={(e) => handleConditionChange('minSize', parseFloat(e.target.value) || 0)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-gray-400 text-xs mt-1">Gerar apenas se o relatório tiver pelo menos X MB</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-4 bg-gray-800 rounded-lg">
              <Checkbox
                id="only-errors"
                checked={scheduleData.conditions?.onlyOnErrors || false}
                onCheckedChange={(checked) => handleConditionChange('onlyOnErrors', !!checked)}
              />
              <Label htmlFor="only-errors" className="text-white">
                Gerar apenas em caso de erros ou mudanças significativas
              </Label>
            </div>
          </div>

          {/* Status do agendamento */}
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              {scheduleData.active ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <div>
                <p className="text-white font-medium">
                  {scheduleData.active ? 'Agendamento Ativo' : 'Agendamento Pausado'}
                </p>
                <p className="text-gray-400 text-sm">
                  {scheduleData.active 
                    ? 'O relatório será gerado automaticamente'
                    : 'O agendamento está temporariamente pausado'
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={scheduleData.active}
              onCheckedChange={(checked) => handleInputChange('active', checked)}
            />
          </div>

          {state.error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Erro no agendamento</span>
              </div>
              <p className="text-red-300 text-sm mt-1">{state.error}</p>
            </div>
          )}

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              disabled={state.isSaving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={state.isSaving}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
            >
              {state.isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Agendamento
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
})

ScheduleModal.displayName = 'ScheduleModal'

export default ScheduleModal