// Hook para usar dados do banco de dados
import { useState, useEffect } from 'react'
import { getStaticProducts, getStaticCategories, getStaticPixConfig } from '@/lib/static-utils'

export function useStaticProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Buscar produtos do banco de dados
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products-db')
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        } else {
          const staticProducts = getStaticProducts()
          setProducts(staticProducts)
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
        // Fallback para dados estáticos
        const staticProducts = getStaticProducts()
        setProducts(staticProducts)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, loading }
}

export function useStaticCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Usar diretamente os dados estáticos
    try {
      const staticCategories = getStaticCategories()
      setCategories(staticCategories)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  return { categories, loading }
}

export function useStaticPixConfig() {
  const [pixConfig, setPixConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Usar diretamente os dados estáticos
    try {
      const staticPixConfig = getStaticPixConfig()
      setPixConfig(staticPixConfig)
    } catch (error) {
      console.error('Erro ao carregar configuração PIX:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  return { pixConfig, loading }
}
