'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ClearCachePage() {
  const router = useRouter()

  useEffect(() => {
    // Limpar localStorage
    localStorage.removeItem('aeropizza_cart')
    console.log('✅ Carrinho limpo com sucesso!')
    
    // Redirecionar para home após 2 segundos
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Limpando cache...</h1>
        <p className="text-gray-600">Você será redirecionado em instantes</p>
      </div>
    </div>
  )
}
