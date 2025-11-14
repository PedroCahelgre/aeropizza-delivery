'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MessageCircle, CheckCircle } from 'lucide-react'

export default function TestWhatsAppPage() {
  const [testResults, setTestResults] = useState<{
    manualOpen: boolean
    popupBlocked: boolean
    urlGenerated: boolean
    error: string | null
  }>({
    manualOpen: false,
    popupBlocked: false,
    urlGenerated: false,
    error: null
  })
  const [debugInfo, setDebugInfo] = useState({ userAgent: '', vendor: '' })

  useEffect(() => {
    setDebugInfo({
      userAgent: navigator.userAgent,
      vendor: navigator.vendor,
    })
  }, [])

  const testWhatsAppRedirect = () => {
    try {
      // Gerar URL do WhatsApp
      const phoneNumber = '5512992515171'
      const message = encodeURIComponent('🍕 TESTE - AERO PIZZA\n\nEste é um teste do redirecionamento para WhatsApp.')
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
      
      setTestResults(prev => ({ ...prev, urlGenerated: true }))
      
      // Tentar abrir popup
      const whatsappWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer,width=800,height=600')
      
      if (!whatsappWindow || whatsappWindow.closed || typeof whatsappWindow.closed == 'undefined') {
        setTestResults(prev => ({ ...prev, popupBlocked: true }))
        console.warn('⚠️ Popup do WhatsApp foi bloqueado pelo navegador')
      } else {
        setTestResults(prev => ({ ...prev, manualOpen: true }))
        console.log('✅ WhatsApp aberto com sucesso em popup')
      }
      
    } catch (error) {
      setTestResults(prev => ({ ...prev, error: (error as Error).message }))
      console.error('❌ Erro ao testar WhatsApp:', error)
    }
  }

  const copyUrlToClipboard = () => {
    const phoneNumber = '5512992515171'
    const message = encodeURIComponent('🍕 TESTE - AERO PIZZA\n\nEste é um teste do redirecionamento para WhatsApp.')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    
    navigator.clipboard.writeText(whatsappUrl).then(() => {
      alert('URL copiada para a área de transferência!')
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teste de Redirecionamento WhatsApp</h1>
          <p className="text-gray-600">Página para testar se o redirecionamento para WhatsApp está funcionando</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-green-500" />
              Teste Automático
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Clique no botão abaixo para testar automaticamente o redirecionamento para WhatsApp.
              Isso tentará abrir uma nova janela com o WhatsApp.
            </p>
            <Button 
              onClick={testWhatsAppRedirect}
              className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Testar Redirecionamento WhatsApp
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-blue-500" />
              Resultados do Teste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className={`flex items-center space-x-2 ${testResults.urlGenerated ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-4 h-4 rounded-full ${testResults.urlGenerated ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>URL do WhatsApp gerada</span>
              </div>
              <div className={`flex items-center space-x-2 ${testResults.manualOpen ? 'text-green-600' : testResults.popupBlocked ? 'text-yellow-600' : 'text-gray-400'}`}>
                <div className={`w-4 h-4 rounded-full ${testResults.manualOpen ? 'bg-green-500' : testResults.popupBlocked ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                <span>
                  {testResults.manualOpen ? 'WhatsApp aberto com sucesso' : 
                   testResults.popupBlocked ? 'Popup bloqueado pelo navegador' : 
                   'Aguardando teste...'}
                </span>
              </div>
              {testResults.error && (
                <div className="flex items-center space-x-2 text-red-600">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span>Erro: {testResults.error}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Teste Manual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Se o teste automático não funcionou, você pode testar manualmente.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={copyUrlToClipboard}
                variant="outline"
                className="w-full"
              >
                Copiar URL do WhatsApp
              </Button>
              <a 
                href={`https://wa.me/5512992515171?text=${encodeURIComponent('🍕 TESTE - AERO PIZZA\n\nEste é um teste do redirecionamento para WhatsApp.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button 
                  variant="outline"
                  className="w-full border-green-500 text-green-600 hover:bg-green-50"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Abrir WhatsApp Manualmente
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações de Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
              <div><strong>User Agent:</strong> {debugInfo.userAgent || 'Não disponível'}</div>
              <div><strong>Navegador:</strong> {debugInfo.vendor || 'Não disponível'}</div>
              <div><strong>Popup Window:</strong> {typeof window !== 'undefined' && typeof window.open !== 'undefined' ? 'Suportado' : 'Não suportado'}</div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <a href="/checkout">
            <Button variant="outline">
              Voltar para Checkout
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}