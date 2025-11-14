'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Home, Phone, MessageCircle, Clock, MapPin, CreditCard, Check, ShoppingBag, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function OrderConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [whatsappOpened, setWhatsappOpened] = useState(false)
  const [showManualButton, setShowManualButton] = useState(false)
  const redirectAttempted = useRef(false)

  const orderNumber = searchParams.get('order')
  const total = searchParams.get('total')
  const payment = searchParams.get('payment')

  useEffect(() => {
    setMounted(true)
  }, [])

  // SOLUÇÃO ROBUSTA: Redirecionamento automático para WhatsApp
  useEffect(() => {
    if (!mounted || redirectAttempted.current) return

    // Recuperar dados do redirecionamento do sessionStorage
    const redirectData = sessionStorage.getItem('whatsapp_redirect')
    
    if (redirectData) {
      try {
        const { url, timestamp } = JSON.parse(redirectData)
        
        // Verificar se o timestamp não está muito antigo (5 minutos)
        const isRecent = Date.now() - timestamp < 5 * 60 * 1000
        
        if (isRecent && url) {
          console.log('🚀 Iniciando redirecionamento automático para WhatsApp')
          redirectAttempted.current = true
          
          // ESTRATÉGIA 1: Tentar window.location.href primeiro (mais confiável)
          setTimeout(() => {
            console.log('📱 Tentativa 1: window.location.href')
            try {
              window.location.href = url
              setWhatsappOpened(true)
              
              // Se após 3 segundos ainda estiver na página, mostrar botão manual
              setTimeout(() => {
                if (!whatsappOpened) {
                  console.log('⚠️ Redirecionamento pode ter falhado, mostrando botão manual')
                  setShowManualButton(true)
                }
              }, 3000)
            } catch (error) {
              console.error('❌ Erro na Tentativa 1:', error)
              tryAlternativeMethod(url)
            }
          }, 500)
          
          // Limpar sessionStorage após usar
          sessionStorage.removeItem('whatsapp_redirect')
        } else {
          console.log('⏰ Dados de redirecionamento expirados ou inválidos')
          setShowManualButton(true)
        }
      } catch (error) {
        console.error('❌ Erro ao processar dados de redirecionamento:', error)
        setShowManualButton(true)
      }
    } else {
      console.log('ℹ️ Nenhum dado de redirecionamento encontrado')
      // Mostrar botão manual após 2 segundos
      setTimeout(() => setShowManualButton(true), 2000)
    }
  }, [mounted, whatsappOpened])

  // ESTRATÉGIA 2: Método alternativo com window.open
  const tryAlternativeMethod = (url: string) => {
    console.log('📱 Tentativa 2: window.open')
    try {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
      
      if (newWindow) {
        setWhatsappOpened(true)
        console.log('✅ WhatsApp aberto com sucesso via window.open')
      } else {
        console.warn('⚠️ window.open bloqueado')
        setShowManualButton(true)
      }
    } catch (error) {
      console.error('❌ Erro na Tentativa 2:', error)
      setShowManualButton(true)
    }
  }

  if (!mounted) {
    return null
  }

  if (!orderNumber || !total) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Informações do pedido não encontradas</h2>
          <Link href="/">
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
              Voltar para o início
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const getPaymentMethodText = (method: string | null) => {
    switch (method) {
      case 'CASH':
        return 'Dinheiro'
      case 'PIX':
        return 'PIX'
      case 'CREDIT_CARD':
        return 'Cartão de Crédito'
      case 'DEBIT_CARD':
        return 'Cartão de Débito'
      default:
        return 'Não especificado'
    }
  }

  const handleNewOrder = () => {
    // Limpar qualquer carrinho residual
    localStorage.removeItem('aeropizza_cart')
    router.push('/agendar')
  }

  // FUNÇÃO MELHORADA: Abrir WhatsApp manualmente
  const handleContactWhatsApp = () => {
    const message = `Olá! Gostaria de confirmar o status do meu pedido #${orderNumber}`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/5512992515171?text=${encodedMessage}`
    
    console.log('📱 Abrindo WhatsApp manualmente')
    
    // Tentar múltiplos métodos
    try {
      // Método 1: location.href (mais confiável)
      window.location.href = whatsappUrl
      setWhatsappOpened(true)
    } catch (error) {
      console.error('❌ Erro no método 1, tentando método 2')
      try {
        // Método 2: window.open
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
        setWhatsappOpened(true)
      } catch (error2) {
        console.error('❌ Erro no método 2, tentando método 3')
        // Método 3: criar elemento <a> e clicar
        const link = document.createElement('a')
        link.href = whatsappUrl
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setWhatsappOpened(true)
      }
    }
  }

  // FUNÇÃO NOVA: Abrir WhatsApp com pedido completo
  const handleOpenWhatsAppWithOrder = () => {
    const redirectData = sessionStorage.getItem('whatsapp_redirect')
    
    if (redirectData) {
      try {
        const { url } = JSON.parse(redirectData)
        console.log('📱 Abrindo WhatsApp com dados do pedido')
        
        // Tentar múltiplos métodos
        try {
          window.location.href = url
          setWhatsappOpened(true)
        } catch (error) {
          try {
            window.open(url, '_blank', 'noopener,noreferrer')
            setWhatsappOpened(true)
          } catch (error2) {
            const link = document.createElement('a')
            link.href = url
            link.target = '_blank'
            link.rel = 'noopener noreferrer'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setWhatsappOpened(true)
          }
        }
      } catch (error) {
        console.error('❌ Erro ao processar dados:', error)
        handleContactWhatsApp()
      }
    } else {
      handleContactWhatsApp()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">🍕</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AERO PIZZA</h1>
                <p className="text-xs text-gray-500">CONFIRMAÇÃO DE PEDIDO</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Pedido Confirmado!
          </h2>
          <p className="text-lg text-gray-600">
            Seu pedido foi realizado com sucesso e já está sendo preparado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Card de Resumo do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Resumo do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Número do Pedido:</span>
                <span className="font-bold text-lg text-yellow-600">{orderNumber}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Valor Total:</span>
                <span className="font-bold text-lg text-green-600">R$ {total}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Forma de Pagamento:</span>
                <span className="font-medium">{getPaymentMethodText(payment)}</span>
              </div>

              {payment === 'PIX' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Informações para PIX:</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p><strong>Chave PIX:</strong> 5512992515171</p>
                    <p><strong>Nome:</strong> AERO PIZZA</p>
                    <p><strong>Cidade:</strong> SAO JOSE DOS CAMPOS</p>
                    <p><strong>Identificador:</strong> {orderNumber}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card de Próximos Passos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                Próximos Passos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-yellow-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Confirmação via WhatsApp</p>
                  <p className="text-sm text-gray-600">Você receberá uma mensagem de confirmação</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-yellow-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Preparo do Pedido</p>
                  <p className="text-sm text-gray-600">Tempo médio de 20-30 minutos</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-yellow-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Envio/Retirada</p>
                  <p className="text-sm text-gray-600">Seu pedido será entregue ou ficará pronto para retirada</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações Importantes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" />
              Informações Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm"><strong>Telefone:</strong> (12) 99251-5171</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm"><strong>Horário:</strong> 18:00 - 23:00</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span className="text-sm"><strong>Pagamento:</strong> Na entrega/retirada</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm"><strong>Entrega:</strong> Toda região</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerta de Redirecionamento */}
        {!whatsappOpened && showManualButton && (
          <Card className="mb-8 border-green-500 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <MessageCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-green-900 mb-2">
                    📱 Abrir WhatsApp para Confirmar Pedido
                  </h3>
                  <p className="text-green-800 mb-4">
                    Clique no botão abaixo para abrir o WhatsApp e enviar os detalhes do seu pedido.
                    Isso é necessário para confirmarmos o recebimento.
                  </p>
                  <Button
                    onClick={handleOpenWhatsAppWithOrder}
                    className="bg-green-600 text-white hover:bg-green-700 w-full sm:w-auto"
                    size="lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Abrir WhatsApp Agora
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Indicador de Sucesso */}
        {whatsappOpened && (
          <Card className="mb-8 border-green-500 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-bold text-green-900">
                    ✅ WhatsApp Aberto com Sucesso!
                  </h3>
                  <p className="text-green-800 text-sm">
                    Envie a mensagem no WhatsApp para confirmar seu pedido.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleNewOrder}
            className="bg-yellow-400 text-black hover:bg-yellow-500 px-8 py-3"
          >
            <Home className="w-4 h-4 mr-2" />
            Fazer Novo Pedido
          </Button>
          
          <Button
            onClick={handleOpenWhatsAppWithOrder}
            className="bg-green-600 text-white hover:bg-green-700 px-8 py-3"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Abrir WhatsApp
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          
          <Link href="/">
            <Button
              variant="outline"
              className="px-8 py-3"
            >
              Voltar ao Início
            </Button>
          </Link>
        </div>

        {/* Mensagem de Agradecimento */}
        <div className="mt-12 text-center">
          <div className="inline-block p-6 bg-yellow-50 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Obrigado pelo seu pedido! 🍕
            </h3>
            <p className="text-gray-600">
              A AeroPizza agradece a preferência. Seu pedido está em boas mãos!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
