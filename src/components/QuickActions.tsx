'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Zap, 
  Clock, 
  Star, 
  TrendingUp, 
  Heart,
  Repeat,
  Share2,
  Phone
} from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/hooks/use-toast'

interface QuickActionsProps {
  onQuickAdd?: (items: any[]) => void
}

export default function QuickActions({ onQuickAdd }: QuickActionsProps) {
  const { addToCart, clearCart, cart } = useCart()
  const { toast } = useToast()
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null)

  const quickCombos = [
    {
      id: 'combo-casal',
      name: 'Combo Casal',
      description: '2 pizzas grandes + 2 refrigerantes',
      price: 89.90,
      items: [
        { name: 'Pizza Margherita', price: 42.90 },
        { name: 'Pizza Calabresa', price: 44.90 },
        { name: 'Coca-Cola 2L', price: 12.90 },
        { name: 'Guaraná 2L', price: 10.90 }
      ],
      icon: Heart,
      color: 'from-pink-500 to-red-500',
      discount: 25,
      preparationTime: 35
    },
    {
      id: 'combo-familia',
      name: 'Combo Família',
      description: '3 pizzas grandes + 3 refrigerantes',
      price: 129.90,
      items: [
        { name: 'Pizza Pepperoni', price: 46.90 },
        { name: 'Pizza Portuguesa', price: 45.90 },
        { name: 'Pizza Mussarela', price: 39.90 },
        { name: 'Coca-Cola 2L', price: 12.90 },
        { name: 'Guaraná 2L', price: 10.90 },
        { name: 'Fanta Laranja 2L', price: 10.90 }
      ],
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      discount: 30,
      preparationTime: 40
    },
    {
      id: 'combo-rapido',
      name: 'Combo Rápido',
      description: '1 pizza + 1 refrigerante (entrega prioritária)',
      price: 54.90,
      items: [
        { name: 'Pizza Mussarela', price: 39.90 },
        { name: 'Coca-Cola 2L', price: 12.90 }
      ],
      icon: Zap,
      color: 'from-blue-500 to-purple-500',
      discount: 15,
      preparationTime: 25
    }
  ]

  const handleQuickAddCombo = async (combo: any) => {
    if (isActionLoading) return
    
    setIsActionLoading(combo.id)
    
    try {
      // Adicionar itens do combo ao carrinho
      for (const item of combo.items) {
        await addToCart({
          id: `${combo.id}-${item.name}`,
          name: item.name,
          price: item.price,
          category: { name: 'Pizzas' },
          description: 'Item do combo',
          preparationTime: combo.preparationTime,
          available: true
        })
      }
      
      toast({
        title: `🎉 ${combo.name} adicionado!`,
        description: `Economia de R$ ${((combo.items.reduce((sum: number, item: any) => sum + item.price, 0) - combo.price)).toFixed(2)}`,
        duration: 4000
      })
      
    } catch (error) {
      toast({
        title: "Erro ao adicionar combo",
        description: "Tente novamente",
        variant: "destructive"
      })
    } finally {
      setTimeout(() => setIsActionLoading(null), 1000)
    }
  }

  const handleRepeatOrder = () => {
    // Simular repetição do último pedido
    toast({
      title: "🔄 Último pedido repetido!",
      description: "Seus itens favoritos foram adicionados ao carrinho",
      duration: 3000
    })
  }

  const handleShareCart = () => {
    if (cart.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens antes de compartilhar",
        variant: "destructive"
      })
      return
    }
    
    const cartText = cart.map(item => `${item.quantity}x ${item.name}`).join('\n')
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const message = `🍕 Meu carrinho Aero Pizza:\n\n${cartText}\n\nTotal: R$ ${total.toFixed(2)}`
    
    if (navigator.share) {
      navigator.share({
        title: 'Meu Carrinho Aero Pizza',
        text: message
      })
    } else {
      navigator.clipboard.writeText(message)
      toast({
        title: "📋 Carrinho copiado!",
        description: "Compartilhe com seus amigos",
        duration: 3000
      })
    }
  }

  const handleQuickCall = () => {
    window.open('tel:+5512992515171', '_self')
  }

  return (
    <div className="space-y-6">
      {/* Combos Rápidos */}
      <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">⚡ Combos Rápidos</h3>
              <p className="text-sm text-gray-600">Economize tempo e dinheiro!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickCombos.map((combo) => {
              const Icon = combo.icon
              const originalPrice = combo.items.reduce((sum: number, item: any) => sum + item.price, 0)
              const savings = originalPrice - combo.price
              
              return (
                <div key={combo.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all hover:scale-105">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 bg-gradient-to-r ${combo.color} rounded-full flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 line-through">R$ {originalPrice.toFixed(2)}</div>
                      <div className="text-lg font-bold text-green-600">R$ {combo.price.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-gray-900 mb-1">{combo.name}</h4>
                  <p className="text-xs text-gray-600 mb-3">{combo.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{combo.preparationTime}min</span>
                    </div>
                    <div className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">
                      -{combo.discount}%
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => handleQuickAddCombo(combo)}
                    disabled={isActionLoading === combo.id}
                    className={`w-full bg-gradient-to-r ${combo.color} hover:opacity-90 text-white font-semibold text-xs`}
                  >
                    {isActionLoading === combo.id ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-1"></div>
                        Adicionando...
                      </>
                    ) : (
                      <>
                        <Zap className="w-3 h-3 mr-1" />
                        Adicionar Rápido
                      </>
                    )}
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">🚀 Ações Rápidas</h3>
              <p className="text-sm text-gray-600">Ações que agilizam seu pedido</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              onClick={handleRepeatOrder}
              className="h-auto p-4 flex flex-col gap-2 hover:bg-blue-50"
            >
              <Repeat className="w-5 h-5" />
              <span className="text-xs">Repetir Pedido</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleShareCart}
              className="h-auto p-4 flex flex-col gap-2 hover:bg-blue-50"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-xs">Compartilhar</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleQuickCall}
              className="h-auto p-4 flex flex-col gap-2 hover:bg-green-50"
            >
              <Phone className="w-5 h-5" />
              <span className="text-xs">Ligar Agora</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => clearCart()}
              className="h-auto p-4 flex flex-col gap-2 hover:bg-red-50"
            >
              <div className="w-5 h-5 flex items-center justify-center text-red-500">🗑️</div>
              <span className="text-xs">Limpar Tudo</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}