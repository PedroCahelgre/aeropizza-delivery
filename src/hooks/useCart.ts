'use client'

import { useState, useEffect, useCallback } from 'react'

export interface CartItem {
  id: string
  name: string
  description: string
  price: number
  image?: string
  category: {
    name: string
  }
  preparationTime: number
  quantity: number
  notes: string
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])

  // Função para carregar carrinho do localStorage de forma síncrona
  const loadCartFromStorage = useCallback(() => {
    try {
      const savedCart = localStorage.getItem('aeropizza_cart')
      console.log('🔄 Carregando carrinho do localStorage:', savedCart)
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        console.log('📦 Carrinho carregado:', parsedCart)
        return parsedCart
      } else {
        console.log('📭 Nenhum carrinho salvo encontrado')
        return []
      }
    } catch (error) {
      console.error('❌ Erro ao carregar carrinho:', error)
      localStorage.removeItem('aeropizza_cart')
      return []
    }
  }, [])

  // Carregar carrinho do localStorage ao montar
  useEffect(() => {
    const savedCart = loadCartFromStorage()
    setCart(savedCart)
  }, [loadCartFromStorage])

  // Salvar carrinho no localStorage com debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        console.log('💾 Salvando carrinho no localStorage:', cart)
        if (cart.length > 0) {
          localStorage.setItem('aeropizza_cart', JSON.stringify(cart))
          console.log('✅ Carrinho salvo com sucesso')
        } else {
          localStorage.removeItem('aeropizza_cart')
          console.log('🗑️ Carrinho removido (está vazio)')
        }
      } catch (error) {
        console.error('❌ Erro ao salvar carrinho:', error)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [cart])

  const addToCart = useCallback((product: Omit<CartItem, 'quantity' | 'notes'>) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      
      let newCart
      if (existing) {
        newCart = prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newCart = [...prev, { ...product, quantity: 1, notes: '' }]
      }
      
      // Salvar imediatamente no localStorage
      try {
        localStorage.setItem('aeropizza_cart', JSON.stringify(newCart))
        console.log('💾 Carrinho salvo imediatamente após adicionar item')
      } catch (error) {
        console.error('❌ Erro ao salvar carrinho:', error)
      }
      
      return newCart
    })
  }, [])

  const updateQuantity = useCallback((productId: string, change: number) => {
    setCart(prev => 
      prev.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
        }
        return item
      }).filter(Boolean) as CartItem[]
    )
  }, [])

  const updateNotes = useCallback((productId: string, notes: string) => {
    setCart(prev => 
      prev.map(item =>
        item.id === productId ? { ...item, notes } : item
      )
    )
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const getTotalPrice = useCallback((deliveryType: 'DELIVERY' | 'PICKUP' = 'DELIVERY') => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const deliveryFee = deliveryType === 'DELIVERY' ? 8.00 : 0
    return subtotal + deliveryFee
  }, [cart])

  const getCartCount = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  // Forçar recarga do carrinho do localStorage
  const forceReloadCart = useCallback(() => {
    try {
      const savedCart = localStorage.getItem('aeropizza_cart')
      console.log('🔄 Forçando recarga do carrinho:', savedCart)
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        console.log('📦 Carrinho recarregado:', parsedCart)
        setCart(parsedCart)
        return parsedCart
      } else {
        console.log('📭 Nenhum carrinho para recarregar')
        setCart([])
        return []
      }
    } catch (error) {
      console.error('❌ Erro ao recarregar carrinho:', error)
      setCart([])
      return []
    }
  }, [])

  return {
    cart,
    addToCart,
    updateQuantity,
    updateNotes,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getCartCount,
    forceReloadCart
  }
}