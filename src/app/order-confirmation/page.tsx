'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
<<<<<<< HEAD
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Home, Phone, MessageCircle, Clock, MapPin, CreditCard } from 'lucide-react'
=======
import { Card, CardContent } from '@/components/ui/card'
import { Check, Phone, ArrowLeft, ShoppingBag } from 'lucide-react'
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
import Link from 'next/link'

export default function OrderConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
<<<<<<< HEAD
  const [mounted, setMounted] = useState(false)

  const orderNumber = searchParams.get('order')
  const total = searchParams.get('total')
  const payment = searchParams.get('payment')

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const handleContactWhatsApp = () => {
    const message = `Olá! Gostaria de confirmar o status do meu pedido #${orderNumber}`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/5512992515171?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
=======
  const [orderNumber, setOrderNumber] = useState('')
  const [total, setTotal] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  useEffect(() => {
    const order = searchParams.get('order')
    const totalPrice = searchParams.get('total')
    const payment = searchParams.get('payment')

    if (!order || !totalPrice) {
      router.push('/agendar')
      return
    }

    setOrderNumber(order)
    setTotal(totalPrice)
    setPaymentMethod(payment || 'Dinheiro')
  }, [searchParams, router])

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'CASH': return 'Dinheiro'
      case 'PIX': return 'Pix'
      case 'CREDIT_CARD': return 'Cartão de Crédito'
      case 'DEBIT_CARD': return 'Cartão de Débito'
      default: return method
    }
  }

  const getPaymentInstructions = (method: string) => {
    switch (method) {
      case 'PIX':
        return {
          title: 'Pagamento via Pix',
          instructions: [
            'Use a chave: 5512992515171',
            'Nome: AERO PIZZA',
            'Cidade: SAO JOSE DOS CAMPOS',
            `Identificador: ${orderNumber}`
          ]
        }
      case 'CASH':
        return {
          title: 'Pagamento na Entrega',
          instructions: [
            'Tenha o valor em dinheiro',
            'Nos entregadores levam troca',
            'Confirme o valor ao receber'
          ]
        }
      default:
        return {
          title: 'Pagamento na Entrega',
          instructions: [
            'Máquina disponível na entrega',
            'Aceitamos cartão de débito/crédito',
            'Consulte bandeiras disponíveis'
          ]
        }
    }
  }

  const paymentInfo = getPaymentInstructions(paymentMethod)

  if (!orderNumber) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    )
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
<<<<<<< HEAD
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">🍕</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AERO PIZZA</h1>
                <p className="text-xs text-gray-500">CONFIRMAÇÃO DE PEDIDO</p>
=======
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg">🍕</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">AERO PIZZA</h1>
                  <p className="text-xs text-gray-500">CONFIRMAÇÃO</p>
                </div>
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
<<<<<<< HEAD
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
=======
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pedido Confirmado!</h1>
          <p className="text-gray-600">Seu pedido foi recebido e está sendo preparado</p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-sm font-medium text-gray-500 mb-1">Número do Pedido</h2>
              <p className="text-2xl font-bold text-yellow-500">{orderNumber}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Valor Total</p>
                <p className="text-xl font-bold text-gray-900">R$ {total}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Forma de Pagamento</p>
                <p className="text-lg font-semibold text-gray-900">{getPaymentMethodName(paymentMethod)}</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">{paymentInfo.title}</h3>
              <ul className="space-y-1">
                {paymentInfo.instructions.map((instruction, index) => (
                  <li key={index} className="text-sm text-yellow-700">• {instruction}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">O que acontece agora?</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Confirmação do Pedido</p>
                  <p className="text-sm text-gray-600">Você já recebeu a confirmação no WhatsApp</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Preparo</p>
                  <p className="text-sm text-gray-600">Seu pedido está sendo preparado com cuidado</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Entrega</p>
                  <p className="text-sm text-gray-600">Entrega em até 40 minutos (dependendo da distância)</p>
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

<<<<<<< HEAD
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
            onClick={handleContactWhatsApp}
            variant="outline"
            className="border-green-500 text-green-600 hover:bg-green-50 px-8 py-3"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Falar com WhatsApp
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
=======
        {/* Contact */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Precisa de ajuda?</h3>
              <p className="text-gray-600 mb-4">Entre em contato conosco</p>
              <a
                href="tel:+5512992515171"
                className="inline-flex items-center space-x-2 bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>(12) 99251-5171</span>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="flex-1">
            <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-semibold">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Fazer Novo Pedido
            </Button>
          </Link>
          <Link href="/cardapio" className="flex-1">
            <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold">
              Ver Cardápio
            </Button>
          </Link>
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
        </div>
      </div>
    </div>
  )
}