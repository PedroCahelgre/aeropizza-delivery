// Utilitário para detectar ambiente e fornecer dados adequados
import { mockProducts, mockCategories, mockPixConfig } from './mock-data'

export function isStaticMode() {
  // Detecta se estamos em modo estático (build/export)
  return typeof window === 'undefined' ? false : 
         window.location?.protocol === 'file:' || 
         process.env.NODE_ENV === 'production' && 
         !process.env.DATABASE_URL
}

export async function fetchWithFallback(url: string, mockData: any) {
  if (isStaticMode()) {
    // Em modo estático, retorna dados mock
    return {
      ok: true,
      json: async () => mockData,
      status: 200
    }
  }

  try {
    // Tenta fazer a requisição real
    const response = await fetch(url)
    if (response.ok) {
      return response
    }
  } catch (error) {
    console.warn(`Falha ao buscar ${url}, usando dados mock:`, error)
  }

  // Fallback para dados mock
  return {
    ok: true,
    json: async () => mockData,
    status: 200
  }
}

export function getStaticProducts() {
  return mockProducts
}

export function getStaticCategories() {
  return mockCategories
}

export function getStaticPixConfig() {
  return mockPixConfig
}