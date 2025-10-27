'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/hooks/useCart'

export default function TestCheckoutPage() {
  const { cart, addToCart, getCartCount, clearCart } = useCart()
  const [message, setMessage] = useState('')

  const testProduct = {
    id: 'test-1',
    name: 'Pizza Teste',
    description: 'Pizza para teste',
    price: 39.90,
    category: { name: 'Pizzas' },
    preparationTime: 25,
    image: '',
    available: true
  }

  const handleAddToCart = () => {
    addToCart(testProduct)
    setMessage('Item adicionado ao carrinho!')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleClearCart = () => {
    clearCart()
    setMessage('Carrinho limpo!')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleGoToCheckout = () => {
    if (getCartCount() > 0) {
      window.location.href = '/checkout'
    } else {
      setMessage('Adicione itens ao carrinho primeiro!')
      setTimeout(() => setMessage(''), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Teste do Checkout</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Status do Carrinho</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Itens no carrinho: {getCartCount()}</p>
            <p className="mb-4">Carrinho: {JSON.stringify(cart, null, 2)}</p>
            {message && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                {message}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ações de Teste</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleAddToCart} className="w-full">
              Adicionar Pizza Teste ao Carrinho
            </Button>
            <Button onClick={handleClearCart} variant="outline" className="w-full">
              Limpar Carrinho
            </Button>
            <Button onClick={handleGoToCheckout} className="w-full bg-green-500 hover:bg-green-600">
              Ir para Checkout {getCartCount() > 0 ? `(${getCartCount()} itens)` : '(vazio)'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instruções</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>Clique em "Adicionar Pizza Teste ao Carrinho"</li>
              <li>Verifique se o item aparece no status do carrinho</li>
              <li>Clique em "Ir para Checkout"</li>
              <li>Verifique se a página de checkout carrega com o botão "Finalizar Pedido"</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}