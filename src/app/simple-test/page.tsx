'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  name: string
  image?: string
}

export default function SimpleTest() {
  const [count, setCount] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products-db')
      .then(res => res.json())
      .then(data => {
        console.log('Produtos recebidos:', data)
        setProducts(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Erro:', error)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Teste de Imagens dos Produtos</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <p className="mb-4">Contador: {count}</p>
          
          <Button 
            className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold py-3 text-lg"
            onClick={() => setCount(count + 1)}
          >
            Clique aqui para testar
          </Button>
          
          <p className="mt-4 text-sm text-gray-600">
            Se este botão funcionar, o problema está na lógica do checkout.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Produtos e Imagens:</h2>
          
          {loading ? (
            <p>Carregando produtos...</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className="border p-4 rounded">
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.image}</p>
                  
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-24 h-24 object-cover border"
                      onError={(e) => {
                        console.error(`Erro ao carregar imagem ${product.image}:`, e)
                        e.currentTarget.style.border = '2px solid red'
                      }}
                      onLoad={() => {
                        console.log(`Imagem carregada: ${product.image}`)
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                      <span>Sem img</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}