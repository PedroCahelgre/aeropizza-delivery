'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  XCircle,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  Check
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Order {
  id: string
  orderNumber: string
  status: string
  customerName: string
  customerPhone: string
  deliveryType: string
  deliveryAddress?: string
  finalAmount: number
  items: Array<{
    id: string
    quantity: number
    unitPrice: number
    product: {
      name: string
    }
  }>
  user?: {
    name: string
    phone: string
  }
}

const statusConfig = {
  PENDING: { 
    label: 'Pendente', 
    color: 'bg-yellow-500', 
    icon: Clock,
    nextStatus: 'CONFIRMED'
  },
  CONFIRMED: { 
    label: 'Confirmado', 
    color: 'bg-blue-500', 
    icon: CheckCircle,
    nextStatus: 'PREPARING'
  },
  PREPARING: { 
    label: 'Preparando', 
    color: 'bg-orange-500', 
    icon: Package,
    nextStatus: 'READY'
  },
  READY: { 
    label: 'Pronto', 
    color: 'bg-green-500', 
    icon: Package,
    nextStatus: 'OUT_FOR_DELIVERY'
  },
  OUT_FOR_DELIVERY: { 
    label: 'Saiu para Entrega', 
    color: 'bg-purple-500', 
    icon: Truck,
    nextStatus: 'DELIVERED'
  },
  DELIVERED: { 
    label: 'Entregue', 
    color: 'bg-green-600', 
    icon: CheckCircle,
    nextStatus: null
  },
  CANCELLED: { 
    label: 'Cancelado', 
    color: 'bg-red-500', 
    icon: XCircle,
    nextStatus: null
  }
}

export default function OrderStatusManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId)
    
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        const data = await response.json()
        await fetchOrders()
        
        // Mostrar toast de sucesso
        toast({
          title: "Status atualizado!",
          description: data.message,
        })
        
        // Se a mensagem foi enviada, abrir WhatsApp
        if (data.whatsappSent && data.whatsappUrl) {
          // Abrir WhatsApp após um pequeno delay
          setTimeout(() => {
            window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer')
          }, 1000)
        }
      } else {
        throw new Error('Erro ao atualizar status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast({
        title: "Erro ao atualizar status",
        description: "Tente novamente mais tarde",
        variant: "destructive"
      })
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const openWhatsApp = (phone: string, orderNumber: string) => {
    const message = `Olá! Aqui é da Aero Pizza. Gostaríamos falar sobre seu pedido ${orderNumber}.`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const getStatusColor = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig]?.color || 'bg-gray-500'
  }

  const getStatusIcon = (status: string) => {
    const Icon = statusConfig[status as keyof typeof statusConfig]?.icon || Clock
    return <Icon className="w-4 h-4" />
  }

  const getStatusLabel = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig]?.label || status
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Gerenciar Status dos Pedidos</h2>
        <div className="flex items-center gap-2 text-sm text-yellow-400/80">
          <Check className="w-4 h-4 text-green-400" />
          <span>Notificações automáticas via WhatsApp</span>
        </div>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => {
          const nextStatus = statusConfig[order.status as keyof typeof statusConfig]?.nextStatus
          const isUpdating = updatingOrderId === order.id
          const willSendWhatsApp = nextStatus === 'CONFIRMED' || nextStatus === 'OUT_FOR_DELIVERY'
          
          return (
            <Card key={order.id} className="bg-black/60 backdrop-blur-md border border-yellow-400/30 text-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg text-yellow-400">{order.orderNumber}</CardTitle>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        <span>{getStatusLabel(order.status)}</span>
                      </div>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-yellow-400/80">
                    <span className="text-white">R$ {order.finalAmount.toFixed(2)}</span>
                    {order.deliveryType === 'DELIVERY' ? (
                      <MapPin className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <Package className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{order.user?.name || order.customerName}</p>
                      <div className="flex items-center gap-2 text-sm text-yellow-400/80">
                        <Phone className="w-3 h-3 text-yellow-500" />
                        <span>{order.user?.phone || order.customerPhone}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openWhatsApp(order.user?.phone || order.customerPhone, order.orderNumber)}
                          className="ml-2 h-6 px-2 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                        >
                          <MessageCircle className="w-3 h-3" />
                        </Button>
                      </div>
                      {order.deliveryAddress && (
                        <div className="flex items-start gap-2 text-sm text-yellow-400/80 mt-1">
                          <MapPin className="w-3 h-3 mt-0.5 text-yellow-500" />
                          <span>{order.deliveryAddress}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {nextStatus && (
                        <div className="flex flex-col items-end gap-2">
                          {willSendWhatsApp && (
                            <div className="flex items-center gap-1 text-xs text-green-400">
                              <Send className="w-3 h-3" />
                              <span>WhatsApp será enviado</span>
                            </div>
                          )}
                          <Button
                            onClick={() => updateOrderStatus(order.id, nextStatus)}
                            size="sm"
                            disabled={isUpdating}
                            className={`font-bold transition-all ${
                              willSendWhatsApp 
                                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white' 
                                : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black'
                            }`}
                          >
                            {isUpdating ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-2"></div>
                                Atualizando...
                              </>
                            ) : (
                              <>
                                {willSendWhatsApp && <Send className="w-3 h-3 mr-1" />}
                                {statusConfig[nextStatus as keyof typeof statusConfig]?.label}
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-yellow-400/80">
                    <p className="font-medium text-yellow-400 mb-1">Itens do pedido:</p>
                    {order.items.map((item, index) => (
                      <div key={item.id} className="flex justify-between text-white">
                        <span>{item.quantity}x {item.product.name}</span>
                        <span className="text-yellow-400">R$ {(item.quantity * item.unitPrice).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}