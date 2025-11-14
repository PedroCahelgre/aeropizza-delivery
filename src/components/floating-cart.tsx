'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, X, Plus, Minus, Trash2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface FloatingCartProps {
  className?: string
}

export function FloatingCart({ className = '' }: FloatingCartProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice, getCartCount } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  const handleCheckout = () => {
    console.log('🔄 [CART] Iniciando checkout...', { items: cart.length });
    
    if (cart.length === 0) {
      console.warn('⚠️ [CART] Carrinho vazio');
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho primeiro",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log('🔄 [CART] Navegando para /agendar');
      router.push('/agendar');
      setIsOpen(false);
    } catch (error) {
      console.error('❌ [CART] Erro ao navegar:', error);
      toast({
        title: "Erro",
        description: "Erro ao prosseguir. Tente novamente.",
        variant: "destructive"
      });
    }
  }

  const itemCount = getCartCount()
  const totalPrice = getTotalPrice()

  return (
    <>
      {/* Floating Cart Button */}
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="relative h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-orange-500 hover:bg-orange-600"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          
          <SheetContent side="right" className="w-full sm:w-96 p-0 overflow-hidden bg-black/90 backdrop-blur-md border-l border-yellow-400/30">
            <SheetHeader className="p-6 pb-0">
              <SheetTitle className="text-xl font-bold text-yellow-400">Seu Carrinho</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col h-full">
              {/* 购物车内容 */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 mx-auto text-yellow-400/60 mb-4" />
                    <p className="text-yellow-400">Seu carrinho está vazio</p>
                    <p className="text-sm text-yellow-400/80 mt-2">Adicione itens deliciosos!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-black/60 rounded-lg border border-yellow-400/30 p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{item.name}</h4>
                            {item.description && (
                              <p className="text-sm text-yellow-400/80 mt-1">{item.description}</p>
                            )}
                            <p className="text-sm font-medium text-yellow-400 mt-2">
                              R$ {item.price.toFixed(2)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="h-8 w-8 p-0 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium text-white">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="h-8 w-8 p-0 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="font-semibold text-yellow-400">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 结算区域 */}
              {cart.length > 0 && (
                <div className="border-t border-yellow-400/30 bg-black/80 p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-yellow-400/80">
                      <span>Subtotal</span>
                      <span className="text-white">R$ {totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-yellow-400/80">
                      <span>Taxa de entrega</span>
                      <span className="text-white">R$ 5.00</span>
                    </div>
                    <Separator className="border-yellow-400/30" />
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-yellow-400">Total</span>
                      <span className="text-yellow-400">R$ {(totalPrice + 5).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold py-3"
                    >
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Finalizar Pedido
                      </>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className="w-full border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
                    >
                      Continuar Comprando
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}