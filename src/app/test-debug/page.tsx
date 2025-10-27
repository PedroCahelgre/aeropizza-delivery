'use client'

import { useEffect, useState } from 'react'

export default function TestPage() {
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    addLog('Página carregada')
    
    // Testar API products
    fetch('/api/products')
      .then(response => {
        if (response.ok) {
          addLog('✅ API /api/products funcionou')
          return response.json()
        } else {
          addLog('❌ API /api/products falhou')
          throw new Error('API failed')
        }
      })
      .then(data => {
        addLog(`✅ Carregados ${data.length} produtos`)
      })
      .catch(error => {
        addLog(`❌ Erro: ${error.message}`)
      })

    // Testar API products-db
    fetch('/api/products-db')
      .then(response => {
        if (response.ok) {
          addLog('✅ API /api/products-db funcionou')
          return response.json()
        } else {
          addLog('❌ API /api/products-db falhou')
          throw new Error('API failed')
        }
      })
      .then(data => {
        addLog(`✅ Carregados ${data.length} produtos do DB`)
      })
      .catch(error => {
        addLog(`❌ Erro DB: ${error.message}`)
      })

    // Testar carrinho
    try {
      const cart = localStorage.getItem('aeropizza_cart')
      if (cart) {
        const parsed = JSON.parse(cart)
        addLog(`📦 Carrinho tem ${parsed.length} itens`)
      } else {
        addLog('📦 Carrinho vazio')
      }
    } catch (error) {
      addLog(`❌ Erro carrinho: ${error}`)
    }
  }, [])

  const clearCart = () => {
    localStorage.removeItem('aeropizza_cart')
    addLog('🗑️ Carrinho limpo')
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Página de Teste</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Logs do Sistema:</h2>
          <div className="bg-gray-100 rounded p-4 max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {log}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={clearCart}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Limpar Carrinho
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Ir para Home
          </button>
          <button
            onClick={() => window.location.href = '/cardapio'}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Ver Cardápio
          </button>
        </div>
      </div>
    </div>
  )
}
