'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  MessageCircle,
  Send,
  Phone
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const mockOrder = {
  id: '1',
  orderNumber: 'AERO123456',
  status: 'PENDING',
  customerName: 'João Silva',
  customerPhone: '5512992515171',
  deliveryType: 'DELIVERY',
  deliveryAddress: 'Rua das Pizzas, 123 - Centro, São José dos Campos',
  finalAmount: 89.90,
  items: [
    { id: '1', quantity: 1, unitPrice: 45.90, product: { name: 'Pizza Pepperoni Deluxe' } },
    { id: '2', quantity: 2, unitPrice: 12.90, product: { name: 'Coca-Cola 2L' } }
  ]
}

const statusMessages = {
  CONFIRMED: `✅ *PEDIDO CONFIRMADO - AERO PIZZA*\n\nOlá João Silva! 🍕\n\n*📋 Pedido:* AERO123456\n*⏰ Previsão:* 30-40 minutos\n*💰 Valor:* R$ 89.90\n\nSeu pedido foi confirmado e já está sendo preparado! 🎉\n\nAcompanhe o status aqui mesmo no WhatsApp! 📱\n\nAgradecemos a preferência! ❤️\nAero Pizza - Sabor que voa até sua casa!`,
  
  OUT_FOR_DELIVERY: `🚚 *SAIU PARA ENTREGA - AERO PIZZA*\n\nOlá João Silva! 🍕\n\n*📋 Pedido:* AERO123456\n*📍 Status:* SAIU PARA ENTREGA\n*⏰ Chegada prevista:* 15-20 minutos\n\nSeu pedido está a caminho! 🏃‍♂️💨\n\n*📞 Para emergências:* (12) 99251-5171\n*🏠 Endereço:* Rua das Pizzas, 123 - Centro, São José dos Campos\n\nAguardamos você! 😊\n\nAero Pizza - Sabor que voa até sua casa!`
}

export default function TestNotificationsPage() {
  const [currentStatus, setCurrentStatus] = useState('PENDING')
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const simulateStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true)
    
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setCurrentStatus(newStatus)
    
    // Se for um status que envia WhatsApp, abrir o WhatsApp
    if (newStatus === 'CONFIRMED' || newStatus === 'OUT_FOR_DELIVERY') {
      const message = statusMessages[newStatus as keyof typeof statusMessages]
      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/${mockOrder.customerPhone.replace(/\D/g, '')}?text=${encodedMessage}`
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
      }, 500)
      
      toast({
        title: "Status atualizado!",
        description: `Status alterado para ${newStatus} e mensagem enviada para o cliente!`,
      })
    } else {
      toast({
        title: "Status atualizado!",
        description: `Status alterado para ${newStatus}`,
      })
    }
    
    setIsUpdating(false)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-500',
      CONFIRMED: 'bg-blue-500',
      PREPARING: 'bg-orange-500',
      READY: 'bg-green-500',
      OUT_FOR_DELIVERY: 'bg-purple-500',
      DELIVERED: 'bg-green-600'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500'
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      PENDING: Clock,
      CONFIRMED: CheckCircle,
      PREPARING: Package,
      READY: Package,
      OUT_FOR_DELIVERY: Truck,
      DELIVERED: CheckCircle
    }
    const Icon = icons[status as keyof typeof icons] || Clock
    return <Icon className="w-4 h-4" />
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      PENDING: 'Pendente',
      CONFIRMED: 'Confirmado',
      PREPARING: 'Preparando',
      READY: 'Pronto',
      OUT_FOR_DELIVERY: 'Saiu para Entrega',
      DELIVERED: 'Entregue'
    }
    return labels[status as keyof typeof labels] || status
  }

  const getNextStatus = () => {
    const flow = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED']
    const currentIndex = flow.indexOf(currentStatus)
    return currentIndex < flow.length - 1 ? flow[currentIndex + 1] : null
  }

  const willSendWhatsApp = () => {
    const next = getNextStatus()
    return next === 'CONFIRMED' || next === 'OUT_FOR_DELIVERY'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teste de Notificações WhatsApp</h1>
          <p className="text-gray-600">Simule o fluxo de atualização de status e envio de mensagens para clientes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{mockOrder.orderNumber}</span>
                <Badge className={`${getStatusColor(currentStatus)} text-white`}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(currentStatus)}
                    <span>{getStatusLabel(currentStatus)}</span>
                  </div>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">{mockOrder.customerName}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-3 h-3" />
                    <span>{mockOrder.customerPhone}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const message = `Olá! Aqui é da Aero Pizza. Gostaríamos falar sobre seu pedido ${mockOrder.orderNumber}.`
                        const encodedMessage = encodeURIComponent(message)
                        const whatsappUrl = `https://wa.me/${mockOrder.customerPhone.replace(/\D/g, '')}?text=${encodedMessage}`
                        window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
                      }}
                      className="ml-2 h-6 px-2 text-green-600 hover:text-green-500"
                    >
                      <MessageCircle className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{mockOrder.deliveryAddress}</p>
                </div>

                <div>
                  <p className="font-medium mb-2">Itens do pedido:</p>
                  {mockOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.product.name}</span>
                      <span className="font-medium">R$ {(item.quantity * item.unitPrice).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-yellow-600">R$ {mockOrder.finalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  {getNextStatus() && (
                    <div className="flex flex-col items-end gap-2">
                      {willSendWhatsApp() && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Send className="w-3 h-3" />
                          <span>WhatsApp será enviado automaticamente</span>
                        </div>
                      )}
                      <Button
                        onClick={() => simulateStatusUpdate(getNextStatus()!)}
                        disabled={isUpdating}
                        className={`font-bold ${
                          willSendWhatsApp()
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                        }`}
                      >
                        {isUpdating ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-2"></div>
                            Atualizando...
                          </>
                        ) : (
                          <>
                            {willSendWhatsApp() && <Send className="w-3 h-3 mr-1" />}
                            Avançar para {getStatusLabel(getNextStatus()!)}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de Informações */}
          <Card>
            <CardHeader>
              <CardTitle>Como funciona o sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">📱 Notificações Automáticas</h3>
                  <p className="text-sm text-blue-800 mb-3">
                    O sistema envia mensagens WhatsApp automaticamente quando o status do pedido é atualizado para:
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Confirmado:</strong> Avisa que o pedido foi aceito e está sendo preparado</li>
                    <li>• <strong>Saiu para Entrega:</strong> Informa que o pedido está a caminho</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">✅ Benefícios</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Clientes informados em tempo real</li>
                    <li>• Reduz ligações para o restaurante</li>
                    <li>• Melhora experiência do cliente</li>
                    <li>• Aumenta confiança e satisfação</li>
                  </ul>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">🎯 Fluxo de Teste</h3>
                  <p className="text-sm text-yellow-800">
                    Clique no botão "Avançar Status" para simular a atualização. 
                    Quando chegar em "Confirmado" ou "Saiu para Entrega", 
                    o WhatsApp abrirá automaticamente com a mensagem pronta!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}