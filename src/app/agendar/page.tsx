'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Clock, 
  Plus, 
  ShoppingCart,
  MapPin,
  Phone
} from 'lucide-react'
import Link from 'next/link'
<<<<<<< HEAD
=======
import { useCart } from '@/hooks/useCart'
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
import { useToast } from '@/hooks/use-toast'
import { getStaticProducts } from '@/lib/static-utils'
import { Toaster } from '@/components/ui/toaster'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image?: string
  category: {
    name: string
  }
  preparationTime: number
  available: boolean
}

export default function AgendarPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
<<<<<<< HEAD
  const [cartItems, setCartItems] = useState<any[]>([])
  
=======
  
  const { cart, addToCart, getTotalPrice, getCartCount } = useCart()
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, selectedCategory])

<<<<<<< HEAD
  const fetchProducts = async () => {
    try {
      console.log('🔄 Carregando produtos...')
      // Buscar produtos da API
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos')
      }
      const data = await response.json()
      console.log('📦 Produtos carregados:', data)
      const availableProducts = data.filter((p: Product) => p.available)
      console.log('✅ Produtos disponíveis:', availableProducts)
      setProducts(availableProducts)
      setLoading(false)
    } catch (error) {
      console.error('❌ Error loading products:', error)
      // Fallback para dados estáticos em caso de erro
      const staticData = getStaticProducts()
      const availableProducts = staticData.filter((p: Product) => p.available)
      setProducts(availableProducts)
=======
  const fetchProducts = () => {
    try {
      // Usar dados estáticos diretamente para evitar erro de API
      const data = getStaticProducts()
      setProducts(data.filter((p: Product) => p.available))
      setLoading(false)
    } catch (error) {
      console.error('Error loading products:', error)
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
      setLoading(false)
    }
  }

  const filterProducts = () => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter(p => p.category.name === selectedCategory))
    }
  }

  const handleAddToCart = (product: Product) => {
<<<<<<< HEAD
    console.log('🛒 Adicionando produto ao carrinho:', product)
    
    const cartItem = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      preparationTime: product.preparationTime,
      quantity: 1,
      notes: ''
    }
    
    console.log('📦 Item formatado para carrinho:', cartItem)
    
    try {
      setCartItems(prev => {
        const existing = prev.find(item => item.id === product.id)
        if (existing) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        } else {
          return [...prev, cartItem]
        }
      })
      
      // Also save to localStorage
      const existingCart = JSON.parse(localStorage.getItem('aeropizza_cart') || '[]')
      const existingIndex = existingCart.findIndex((item: any) => item.id === product.id)
      
      if (existingIndex >= 0) {
        existingCart[existingIndex].quantity += 1
      } else {
        existingCart.push(cartItem)
      }
      
      localStorage.setItem('aeropizza_cart', JSON.stringify(existingCart))
      
      console.log('✅ Produto adicionado com sucesso')
      toast({
        title: "Adicionado!",
        description: `${product.name} foi adicionado ao carrinho`,
        duration: 2000
      })
    } catch (error) {
      console.error('❌ Erro ao adicionar produto:', error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto",
        variant: "destructive"
      })
    }
  }

  const handleFinalizarPedido = () => {
    if (!cartItems || cartItems.length === 0) {
=======
    addToCart(product)
    toast({
      title: "Adicionado!",
      description: `${product.name} foi adicionado ao carrinho`,
      duration: 2000
    })
  }

  const handleFinalizarPedido = () => {
    if (!cart || cart.length === 0) {
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho",
        variant: "destructive"
      })
      return
    }
    router.push('/checkout')
  }

<<<<<<< HEAD
  // Load cart from localStorage on mount and migrate old product IDs
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('aeropizza_cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        
        // Check if cart has old product IDs (short strings like "1", "2", etc.)
        const hasOldIds = parsedCart.some((item: any) => 
          typeof item.id === 'string' && item.id.length <= 10 && !item.id.includes('cmh')
        )
        
        if (hasOldIds) {
          const oldItemCount = parsedCart.length
          console.log(`🔄 Detectados ${oldItemCount} itens com IDs antigos no carrinho, migrando...`)
          // Clear old cart with invalid IDs
          localStorage.removeItem('aeropizza_cart')
          setCartItems([])
          toast({
            title: "Carrinho Atualizado",
            description: `Seu carrinho continha ${oldItemCount} produto(s) desatualizado(s) e foi limpo. Por favor, adicione os produtos novamente.`,
            variant: "destructive",
            duration: 5000
          })
        } else {
          setCartItems(parsedCart)
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      localStorage.removeItem('aeropizza_cart')
      setCartItems([])
    }
  }, [toast])

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

=======
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
  const categories = Array.from(new Set(products.map(p => p.category.name)))
  const itemCount = getCartCount()
  const totalPrice = getTotalPrice()

<<<<<<< HEAD
  // Debug information
  useEffect(() => {
    console.log('🛒 Estado atual do carrinho:', cartItems)
    console.log('📊 Contagem de itens:', itemCount)
    console.log('💰 Preço total:', totalPrice)
  }, [cartItems, itemCount, totalPrice])

=======
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <img
                  src="/footer-logo.png"
                  alt="AeroPizza Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AERO PIZZA</h1>
                <p className="text-xs text-gray-500">FAZER PEDIDO</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/cardapio" className="text-gray-600 hover:text-gray-900">
                ← Ver Cardápio
              </Link>
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-600" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Produtos */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Escolha Seus Sabores</h2>
              <p className="text-gray-600">Selecione os produtos desejados</p>
            </div>

            {/* Categorias */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-yellow-400 text-black'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Todos
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-yellow-400 text-black'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Lista de Produtos */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex">
                      {/* Imagem */}
                      <div className="w-32 h-32 flex-shrink-0">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-3xl">🍕</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Informações */}
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-sm text-gray-600">{product.description}</p>
                          </div>
                          <Badge className="bg-yellow-400 text-black">
                            {product.category.name}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{product.preparationTime}min</span>
                            </div>
                            <span className="font-semibold text-lg text-gray-900">
                              R$ {product.price.toFixed(2)}
                            </span>
                          </div>
                          
                          <Button
                            onClick={() => handleAddToCart(product)}
                            className="bg-yellow-400 text-black hover:bg-yellow-500"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Carrinho */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Seu Carrinho
                  </h3>
                  
<<<<<<< HEAD
                  {cartItems && cartItems.length > 0 ? (
                    <div>
                      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                        {cartItems.map((item, index) => (
=======
                  {cart && cart.length > 0 ? (
                    <div>
                      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                        {cart.map((item, index) => (
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
                          <div key={index} className="flex justify-between items-center">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-gray-500">
                                {item.quantity}x R$ {item.price.toFixed(2)}
                              </p>
                            </div>
                            <span className="font-semibold">
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>R$ {totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Entrega:</span>
                          <span>R$ 8,00</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span>R$ {(totalPrice + 8).toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <Button
                        onClick={handleFinalizarPedido}
                        className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
                      >
                        Finalizar Pedido
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
                      <Link href="/cardapio">
                        <Button variant="outline" className="w-full">
                          Adicionar Itens
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Informações de Contato */}
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">18:00 - 23:00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">(12) 99251-5171</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Entrega em toda região</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  )
}