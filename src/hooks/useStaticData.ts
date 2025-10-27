// Hook para usar dados do banco de dados
import { useState, useEffect } from 'react'
<<<<<<< HEAD
import { getStaticProducts, getStaticCategories, getStaticPixConfig } from '@/lib/static-utils'
=======
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5

export function useStaticProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Buscar produtos do banco de dados
    const fetchProducts = async () => {
      try {
<<<<<<< HEAD
        const response = await fetch('/api/db-products')
=======
        const response = await fetch('/api/products-db')
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        } else {
          // Fallback para dados estáticos em caso de erro
<<<<<<< HEAD
=======
          const { getStaticProducts } = await import('@/lib/static-utils')
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
          const staticProducts = getStaticProducts()
          setProducts(staticProducts)
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
        // Fallback para dados estáticos
<<<<<<< HEAD
=======
        const { getStaticProducts } = await import('@/lib/static-utils')
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
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