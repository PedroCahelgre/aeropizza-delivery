'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
<<<<<<< HEAD
  Clock, 
  Search, 
  Filter,
=======
  ShoppingCart, 
  Clock, 
  Search, 
  Filter,
  Plus,
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
  Star,
  MapPin,
  Phone,
  ChevronLeft,
  Home
} from 'lucide-react'
import Link from 'next/link'
<<<<<<< HEAD
=======
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5

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
  ingredients?: string
}

interface Category {
  id: string
  name: string
  active: boolean
}

export default function CardapioPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showAvailableOnly, setShowAvailableOnly] = useState(true)
<<<<<<< HEAD
=======
  const { addToCart, getCartCount } = useCart()
  const { toast } = useToast()
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchProducts()
      fetchCategories()
    }
  }, [mounted])

  const fetchProducts = async () => {
    try {
      // Tentar API do banco de dados primeiro
      const dbResponse = await fetch('/api/products-db')
      if (dbResponse.ok) {
        const data = await dbResponse.json()
        setProducts(data)
        return
      }
      
      // Fallback para API estática
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

<<<<<<< HEAD
=======
  const handleAddToCart = (product: Product) => {
    addToCart(product)
    toast({
      title: "Sucesso!",
      description: `${product.name} adicionado ao carrinho!`,
    })
  }

>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category?.id === selectedCategory || product.categoryId === selectedCategory
    const matchesAvailability = !showAvailableOnly || product.available
    
    return matchesSearch && matchesCategory && matchesAvailability
  })

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    )
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
                <p className="text-xs text-gray-500">CARDÁPIO COMPLETO</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
<<<<<<< HEAD
              <Link href="/agendar" className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors">
                Fazer Pedido
=======
              <Link href="/agendar" className="text-gray-600 hover:text-gray-900">
                ← Fazer Pedido
              </Link>
              <Link href="/agendar" className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors">
                <ShoppingCart className="w-4 h-4 inline mr-2" />
                Carrinho ({getCartCount()})
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Cardápio Completo</h2>
          <p className="text-gray-600">Explore todos os nossos produtos deliciosos</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
            className={`w-full sm:w-auto ${
              showAvailableOnly ? 'bg-yellow-400 text-black border-yellow-400' : ''
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showAvailableOnly ? 'Disponíveis' : 'Todos'}
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Product Image - 1:1 aspect ratio */}
              <div className="relative aspect-square">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl">🍕</span>
                  </div>
                )}
                
                {/* Availability Badge */}
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={product.available ? "default" : "secondary"}
                    className={`${
                      product.available
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {product.available ? "Disponível" : "Indisponível"}
                  </Badge>
                </div>

                {/* Category Badge */}
                <div className="absolute top-2 left-2">
                  <Badge className="bg-yellow-400 text-black">
                    {product.category?.name}
                  </Badge>
                </div>

                {/* Price Overlay */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded">
                  R$ {product.price.toFixed(2)}
                </div>
              </div>
              
              {/* Product Info */}
              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {product.description}
                  </p>
                </div>
                
                {/* Product Details */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{product.preparationTime}min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>4.8</span>
                  </div>
                </div>
                
<<<<<<< HEAD
                {/* Order Button */}
                <Button
                  onClick={() => window.location.href = '/agendar'}
=======
                {/* Add to Cart Button */}
                <Button
                  onClick={() => handleAddToCart(product)}
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
                  disabled={!product.available}
                  className={`w-full ${
                    product.available
                      ? "bg-yellow-400 text-black hover:bg-yellow-500"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
<<<<<<< HEAD
                  {product.available ? "Pedir" : "Indisponível"}
=======
                  <Plus className="w-4 h-4 mr-2" />
                  {product.available ? "Adicionar" : "Indisponível"}
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
                </Button>
              </CardContent>
            </Card>
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
<<<<<<< HEAD
                <span className="text-4xl">🍕</span>
=======
                <ShoppingCart className="w-12 h-12 text-gray-400" />
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-600">Tente ajustar os filtros ou buscar por outro termo</p>
            </div>
          )}
        </div>
      </div>
<<<<<<< HEAD
=======

      <Toaster />
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
    </div>
  )
}