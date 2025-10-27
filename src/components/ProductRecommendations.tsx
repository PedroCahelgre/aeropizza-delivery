'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Star, 
  Clock, 
  Plus, 
  Heart,
  ChefHat,
  Flame
} from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/hooks/use-toast'

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
  rating?: number
  isPopular?: boolean
}

interface ProductRecommendationsProps {
  currentCart: any[]
  products: Product[]
}

export default function ProductRecommendations({ currentCart, products }: ProductRecommendationsProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  useEffect(() => {
    generateRecommendations()
  }, [currentCart, products])

  const generateRecommendations = () => {
    if (currentCart.length === 0) {
      // Se o carrinho está vazio, mostrar os mais populares
      setRecommendations(products.filter(p => p.isPopular).slice(0, 3))
      return
    }

    // Lógica de recomendação baseada no carrinho atual
    const cartCategories = currentCart.map(item => item.category.name)
    const cartItems = currentCart.map(item => item.id)
    
    // Encontrar produtos que combinam bem
    const recommendations = products
      .filter(product => !cartItems.includes(product.id)) // Não mostrar o que já está no carrinho
      .map(product => {
        let score = 0
        
        // Se for da mesma categoria de algo no carrinho
        if (cartCategories.includes(product.category.name)) {
          score += 2
        }
        
        // Se for popular
        if (product.isPopular) {
          score += 3
        }
        
        // Se tiver boa avaliação
        if (product.rating && product.rating >= 4.5) {
          score += 2
        }
        
        // Se for bebida e tiver pizza no carrinho
        if (product.category.name === 'Bebidas' && cartCategories.includes('Pizzas')) {
          score += 4
        }
        
        // Se for sobremesa e tiver pizza no carrinho
        if (product.category.name === 'Sobremesas' && cartCategories.includes('Pizzas')) {
          score += 3
        }
        
        return { ...product, score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
    
    setRecommendations(recommendations)
  }

  const handleAddToCart = async (product: Product) => {
    if (addingToCart === product.id) return
    
    setAddingToCart(product.id)
    
    try {
      addToCart(product)
      toast({
        title: "🎯 Ótima escolha!",
        description: `${product.name} foi adicionado ao carrinho`,
        duration: 3000
      })
    } catch (error) {
      toast({
        title: "Erro ao adicionar",
        description: "Tente novamente",
        variant: "destructive"
      })
    } finally {
      setTimeout(() => setAddingToCart(null), 500)
    }
  }

  const getRecommendationTitle = () => {
    if (currentCart.length === 0) return "🔥 Mais Populares"
    if (currentCart.length === 1) return "🎯 Combina bem com seu pedido"
    return "✨ Para completar seu pedido"
  }

  const getRecommendationDescription = () => {
    if (currentCart.length === 0) return "Os queridinhos da casa!"
    if (currentCart.length === 1) return "Perfeitos para acompanhar!"
    return "Adicione estes itens para deixar seu pedido ainda melhor!"
  }

  if (recommendations.length === 0) return null

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{getRecommendationTitle()}</h3>
            <p className="text-sm text-gray-600">{getRecommendationDescription()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recommendations.map((product) => (
            <div key={product.id} className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="relative mb-3">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded flex items-center justify-center">
                    <span className="text-3xl">🍕</span>
                  </div>
                )}
                
                {product.isPopular && (
                  <Badge className="absolute top-1 left-1 bg-red-500 text-white text-xs">
                    <Flame className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
                
                {product.rating && (
                  <div className="absolute top-1 right-1 bg-black/70 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {product.rating.toFixed(1)}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{product.name}</h4>
                <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{product.preparationTime}min</span>
                  </div>
                  <span className="font-bold text-sm text-gray-900">R$ {product.price.toFixed(2)}</span>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  disabled={addingToCart === product.id}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs font-semibold"
                >
                  {addingToCart === product.id ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-1"></div>
                      Adicionando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3 mr-1" />
                      Adicionar
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}