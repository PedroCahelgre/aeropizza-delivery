import React, { Component, ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

// Error Boundary especializado para relatórios
export class ReportsErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Reports Error Boundary capturou um erro:', error, errorInfo)
    
    // Log do erro para monitoramento
    this.setState({
      error,
      errorInfo
    })

    // Callback personalizado se fornecido
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Fallback customizado se fornecido
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <Card className="bg-gray-900 border-red-500/20 max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <CardTitle className="text-white">
                Oops! Algo deu errado
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-400 text-sm">
                Ocorreu um erro inesperado no sistema de relatórios. Nossa equipe foi notificada automaticamente.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left bg-gray-800 p-4 rounded-lg text-xs">
                  <summary className="text-red-400 cursor-pointer mb-2">
                    Detalhes do erro (desenvolvimento)
                  </summary>
                  <pre className="text-gray-300 overflow-auto">
                    {this.state.error.message}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
                <Button
                  onClick={() => window.location.href = '/'}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Ir ao Início
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook para error boundaries em componentes funcionais
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const handleError = React.useCallback((error: Error) => {
    console.error('Erro capturado:', error)
    setError(error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { handleError, resetError }
}

// Componente para erros específicos de relatórios
export const ReportErrorFallback = ({ 
  error, 
  resetError 
}: { 
  error: Error
  resetError: () => void 
}) => {
  const isNetworkError = error.message.includes('fetch') || error.message.includes('network')
  const isParsingError = error.message.includes('JSON') || error.message.includes('parse')

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2">
              {isNetworkError && 'Erro de Conexão'}
              {isParsingError && 'Erro de Dados'}
              {!isNetworkError && !isParsingError && 'Erro no Relatório'}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {isNetworkError && 'Não foi possível carregar os dados do servidor. Verifique sua conexão e tente novamente.'}
              {isParsingError && 'Os dados retornados não estão no formato esperado. Contate o suporte técnico.'}
              {!isNetworkError && !isParsingError && error.message}
            </p>
            <div className="flex gap-3">
              <Button
                size="sm"
                onClick={resetError}
                variant="outline"
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
              <Button
                size="sm"
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Recarregar Página
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}