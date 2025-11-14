'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, X, Plus, Minus, ArrowLeft, User, MapPin, CreditCard, DollarSign, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalPrice, getCartCount } = useCart()
  const { toast } = useToast()
  
  const [orderData, setOrderData] = useState<{
    customerName: string
    customerPhone: string
    customerEmail: string
    deliveryAddress: string
    deliveryType: 'DELIVERY' | 'PICKUP'
    paymentMethod: 'CASH' | 'PIX' | 'CREDIT_CARD'
    notes: string
  }>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    deliveryType: 'DELIVERY',
    paymentMethod: 'CASH',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    console.log('🔍 Página de checkout montada')
    
    // Verificar carrinho de forma simples e direta
    const checkCart = () => {
      const savedCart = localStorage.getItem('aeropizza_cart')
      console.log('💾 Carrinho no localStorage:', savedCart)
      
      if (!savedCart) {
        console.log('📭 Nenhum carrinho encontrado, redirecionando')
        router.push('/agendar')
        return
      }
      
      try {
        const parsedCart = JSON.parse(savedCart)
        if (parsedCart.length === 0) {
          console.log('📭 Carrinho vazio, redirecionando')
          router.push('/agendar')
        } else {
          console.log('✅ Carrinho tem itens:', parsedCart.length)
          
          // Validate product IDs - ensure they are proper database IDs
          const validCart = parsedCart.filter((item: any) => {
            const isValidId = typeof item.id === 'string' && item.id.length > 10
            if (!isValidId) {
              // Silently remove invalid items without console spam
            }
            return isValidId
          })
          
          if (validCart.length !== parsedCart.length) {
            const removedCount = parsedCart.length - validCart.length
            console.log(`🔄 Removidos ${removedCount} itens com IDs inválidos do carrinho`)
            localStorage.setItem('aeropizza_cart', JSON.stringify(validCart))
            
            if (validCart.length === 0) {
              console.log('📭 Carrinho ficou vazio após limpeza, redirecionando')
              toast({
                title: "Carrinho Atualizado",
                description: "Seu carrinho continha produtos desatualizados e foi limpo. Por favor, adicione novos produtos.",
                variant: "destructive"
              })
              router.push('/agendar')
              return
            } else {
              toast({
                title: "Carrinho Atualizado", 
                description: `Removemos ${removedCount} produto(s) desatualizado(s) do seu carrinho.`,
                duration: 3000
              })
            }
          }
        }
    } catch (error) {
        console.error('❌ Erro ao parsear carrinho:', error)
        router.push('/agendar')
      }
    }
    
    // Verificar imediatamente
    checkCart()
    
    // E verificar novamente após um pequeno delay
    const timer = setTimeout(checkCart, 100)
    
    return () => clearTimeout(timer)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (getCartCount() === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho para finalizar o pedido",
        variant: "destructive"
      })
      return
    }

    if (!orderData.customerName || !orderData.customerPhone) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome e telefone",
        variant: "destructive"
      })
      return
    }

    if (orderData.deliveryType === 'DELIVERY' && !orderData.deliveryAddress) {
      toast({
        title: "Endereço obrigatório",
        description: "Preencha o endereço para delivery",
        variant: "destructive"
      })
      return
    }

    setSubmitting(true)

    try {
      // Criar usuário
      const userResponse = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: orderData.customerName,
          email: orderData.customerEmail || `cliente_${Date.now()}@temp.com`,
          phone: orderData.customerPhone,
          address: orderData.deliveryAddress
        })
      })

      if (!userResponse.ok) {
        throw new Error('Erro ao criar usuário')
      }

      const user = await userResponse.json()
      console.log('👤 Usuário criado/encontrado:', user)

      // Criar pedido
      const orderPayload = {
        userId: user.id,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
          notes: item.notes || ''
        })),
        deliveryType: orderData.deliveryType,
        paymentMethod: orderData.paymentMethod,
        deliveryAddress: orderData.deliveryAddress,
        customerPhone: orderData.customerPhone,
        notes: orderData.notes
      }

      console.log('📦 Enviando pedido:', JSON.stringify(orderPayload, null, 2))
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      })

      if (!orderResponse.ok) {
        throw new Error('Erro ao criar pedido')
      }

      const order = await orderResponse.json()

      // Enviar para WhatsApp - SOLUÇÃO ROBUSTA E GARANTIDA
      const phoneNumber = '5512992515171'
      const totalPrice = getTotalPrice(orderData.deliveryType)
      
      let message = `*🍕 NOVO PEDIDO - AERO PIZZA*\n\n`
      message += `*📋 Nº do Pedido:* ${order.orderNumber}\n`
      message += `*📅 Data:* ${new Date().toLocaleDateString('pt-BR')}\n`
      message += `*🕒 Horário:* ${new Date().toLocaleTimeString('pt-BR')}\n\n`
      message += `*👤 Dados do Cliente:*\n`
      message += `*Nome:* ${orderData.customerName}\n`
      message += `*📞 Telefone:* ${orderData.customerPhone}\n`
      message += `*📧 Email:* ${orderData.customerEmail}\n`
      
      if (orderData.deliveryType === 'DELIVERY') {
        message += `*🏠 Endereço:* ${orderData.deliveryAddress}\n`
        message += `*🚚 Tipo:* Delivery (Taxa: R$ 8,00)\n`
      } else {
        message += `*🏪 Tipo:* Retirada no local\n`
      }
      
      message += `\n*💳 Forma de Pagamento:* ${orderData.paymentMethod === 'CASH' ? 'Dinheiro' : orderData.paymentMethod === 'PIX' ? 'Pix' : 'Cartão'}\n`
      
      // Adicionar informações do PIX se for selecionado
      if (orderData.paymentMethod === 'PIX') {
        message += `*📱 Chave PIX:* 5512992515171\n`
        message += `*🏪 Nome:* AERO PIZZA\n`
        message += `*🏙️ Cidade:* SAO JOSE DOS CAMPOS\n`
        message += `*🆔 Identificador:* ${order.orderNumber}\n`
      }
      message += `*🛒 Itens do Pedido:*\n`
      
      cart.forEach((item, index) => {
        message += `\n${index + 1}. *${item.name}* x${item.quantity}\n`
        message += `   💰 R$ ${item.price.toFixed(2)} cada = R$ ${(item.price * item.quantity).toFixed(2)}\n`
      })
      
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      message += `\n*💵 Resumo do Valor:*\n`
      message += `Subtotal: R$ ${subtotal.toFixed(2)}\n`
      if (orderData.deliveryType === 'DELIVERY') {
        message += `Taxa de Delivery: R$ 8,00\n`
      }
      message += `*🎯 TOTAL: R$ ${totalPrice.toFixed(2)}*\n\n`
      message += `*✅ Pedido confirmado! Aguardamos seu contato.*`
      
      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
      
      console.log('📱 URL do WhatsApp gerada:', whatsappUrl)
      
      // Salvar dados do pedido no sessionStorage para a página de confirmação
      sessionStorage.setItem('whatsapp_redirect', JSON.stringify({
        url: whatsappUrl,
        orderNumber: order.orderNumber,
        total: totalPrice.toFixed(2),
        payment: orderData.paymentMethod,
        timestamp: Date.now()
      }))
      
      // Limpar carrinho
      clearCart()
      
      toast({
        title: "Pedido realizado com sucesso!",
        description: `Pedido #${order.orderNumber} criado. Redirecionando para confirmação...`,
        duration: 3000
      })
      
      // Redirecionar IMEDIATAMENTE para página de confirmação
      // A página de confirmação fará o redirecionamento para o WhatsApp
      router.push(`/order-confirmation?order=${order.orderNumber}&total=${totalPrice.toFixed(2)}&payment=${orderData.paymentMethod}`)
      
    } catch (error) {
      console.error('Erro ao fazer pedido:', error)
      toast({
        title: "Erro ao fazer pedido",
        description: "Tente novamente mais tarde",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const totalPrice = getTotalPrice(orderData.deliveryType)
  const itemCount = getCartCount()

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Carrinho vazio</h2>
          <p className="text-gray-600 mb-4">Adicione itens ao carrinho para continuar</p>
          <Link href="/agendar">
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
              Voltar para o cardápio
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/agendar" className="flex items-center space-x-3">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg">🍕</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">AERO PIZZA</h1>
                  <p className="text-xs text-gray-500">FINALIZAR PEDIDO</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lado Esquerdo - Resumo do Pedido */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2 text-yellow-400" />
                  Resumo do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.map((item) => (
                  <div key={item.id} className="mb-4 pb-4 border-b last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.category.name}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <span className="font-medium">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
                
                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>R$ {getTotalPrice('PICKUP').toFixed(2)}</span>
                  </div>
                  {orderData.deliveryType === 'DELIVERY' && (
                    <div className="flex justify-between text-sm">
                      <span>Taxa de Delivery</span>
                      <span>R$ 8.00</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-yellow-400">R$ {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lado Direito - Formulário de Entrega */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-yellow-400" />
                  Dados para Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={orderData.customerName}
                      onChange={(e) => setOrderData({...orderData, customerName: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={orderData.customerPhone}
                      onChange={(e) => setOrderData({...orderData, customerPhone: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={orderData.customerEmail}
                      onChange={(e) => setOrderData({...orderData, customerEmail: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label>Tipo de Entrega</Label>
                    <RadioGroup
                      value={orderData.deliveryType}
                      onValueChange={(value) => setOrderData({...orderData, deliveryType: value as 'DELIVERY' | 'PICKUP'})}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="DELIVERY" id="delivery" />
                        <Label htmlFor="delivery" className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Delivery (+R$ 8,00)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="PICKUP" id="pickup" />
                        <Label htmlFor="pickup" className="flex items-center">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Retirada no local
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {orderData.deliveryType === 'DELIVERY' && (
                    <div>
                      <Label htmlFor="address">Endereço de Entrega *</Label>
                      <Textarea
                        id="address"
                        value={orderData.deliveryAddress}
                        onChange={(e) => setOrderData({...orderData, deliveryAddress: e.target.value})}
                        placeholder="Rua, número, bairro..."
                        required
                      />
                    </div>
                  )}

                  <div>
                    <Label>Forma de Pagamento</Label>
                    <RadioGroup
                      value={orderData.paymentMethod}
                      onValueChange={(value) => setOrderData({...orderData, paymentMethod: value as 'CASH' | 'PIX' | 'CREDIT_CARD'})}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="CASH" id="cash" />
                        <Label htmlFor="cash" className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          Dinheiro
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="CREDIT_CARD" id="credit" />
                        <Label htmlFor="credit" className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Cartão de Crédito
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="PIX" id="pix" />
                        <Label htmlFor="pix" className="flex items-center">
                          <Smartphone className="w-4 h-4 mr-2" />
                          PIX
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      value={orderData.notes}
                      onChange={(e) => setOrderData({...orderData, notes: e.target.value})}
                      placeholder="Alguma observação especial?"
                    />
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit"
                      className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold py-3 text-lg"
                      disabled={submitting}
                    >
                      {submitting ? 'Processando...' : 'Finalizar Pedido'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
