import { 
  CheckCircle, 
  RefreshCw, 
  Activity, 
  XCircle, 
  Clock, 
  FileText,
  DollarSign,
  TrendingUp,
  Users,
  Package,
  Megaphone,
  Settings,
  FileSpreadsheet,
  Database,
  AlertTriangle
} from 'lucide-react'

// Mapeamento de ícones
export const getTypeIcon = (type: string) => {
  switch (type) {
    case 'financial': return <DollarSign className="w-5 h-5 text-green-400" />
    case 'sales': return <TrendingUp className="w-5 h-5 text-blue-400" />
    case 'customers': return <Users className="w-5 h-5 text-purple-400" />
    case 'products': return <Package className="w-5 h-5 text-orange-400" />
    case 'marketing': return <Megaphone className="w-5 h-5 text-pink-400" />
    case 'operations': return <Settings className="w-5 h-5 text-yellow-400" />
    default: return <FileText className="w-5 h-5 text-gray-400" />
  }
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'ready': return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0'
    case 'generating': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0'
    case 'processing': return 'bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0'
    case 'error': return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0'
    case 'scheduled': return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0'
    default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0'
  }
}

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'ready': return <CheckCircle className="w-4 h-4" />
    case 'generating': return <RefreshCw className="w-4 h-4 animate-spin" />
    case 'processing': return <Activity className="w-4 h-4 animate-pulse" />
    case 'error': return <XCircle className="w-4 h-4" />
    case 'scheduled': return <Clock className="w-4 h-4" />
    default: return <FileText className="w-4 h-4" />
  }
}

export const getFormatIcon = (format: string) => {
  switch (format) {
    case 'pdf': return <FileText className="w-4 h-4 text-red-400" />
    case 'excel': return <FileSpreadsheet className="w-4 h-4 text-green-400" />
    case 'csv': return <Database className="w-4 h-4 text-blue-400" />
    case 'json': return <FileText className="w-4 h-4 text-purple-400" />
    default: return <FileText className="w-4 h-4 text-gray-400" />
  }
}

export const getComplexityColor = (complexity: string) => {
  switch (complexity) {
    case 'simple': return 'bg-green-500/20 text-green-400 border-green-500/20'
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20'
    case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/20'
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20'
  }
}

// Categorias de relatórios
export interface CategoryConfig {
  id: string
  name: string
  color: string
  icon: React.ReactNode
}

export const categories: CategoryConfig[] = [
  { id: 'all', name: 'Todos', color: 'bg-gray-500', icon: <FileText className="w-4 h-4" /> },
  { id: 'financial', name: 'Financeiro', color: 'bg-green-500', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'sales', name: 'Vendas', color: 'bg-blue-500', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'customers', name: 'Clientes', color: 'bg-purple-500', icon: <Users className="w-4 h-4" /> },
  { id: 'products', name: 'Produtos', color: 'bg-orange-500', icon: <Package className="w-4 h-4" /> },
  { id: 'marketing', name: 'Marketing', color: 'bg-pink-500', icon: <Megaphone className="w-4 h-4" /> },
  { id: 'operations', name: 'Operações', color: 'bg-yellow-500', icon: <Settings className="w-4 h-4" /> }
]

// Utilitários para formatação
export const formatFileSize = (size: string): string => {
  return size // Já está formatado como "X.X MB"
}

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatRelativeDate = (date: string): string => {
  const now = new Date()
  const reportDate = new Date(date)
  const diffInHours = (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 1) return 'Agora mesmo'
  if (diffInHours < 24) return `${Math.floor(diffInHours)}h atrás`
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d atrás`
  return formatDate(date)
}

// Validações
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateDateRange = (startDate: Date, endDate: Date): boolean => {
  return startDate <= endDate
}

// Utilitários para exportação
export const exportFormats = [
  { value: 'pdf', label: 'PDF', icon: <FileText className="w-4 h-4" /> },
  { value: 'excel', label: 'Excel', icon: <FileSpreadsheet className="w-4 h-4" /> },
  { value: 'csv', label: 'CSV', icon: <Database className="w-4 h-4" /> }
]

// Status para agendamento
export const scheduleOptions = [
  { value: 'daily', label: 'Diário' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'yearly', label: 'Anual' }
]