'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Download, Chrome, Globe, Smartphone } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export default function SimpleInstallPopup() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [browserInfo, setBrowserInfo] = useState<ReturnType<typeof getBrowserInstructions> | null>(null)

  useEffect(() => {
    const info = getBrowserInstructions()
    setBrowserInfo(info)
    // Verificar se já foi dispensado
    const wasDismissed = localStorage.getItem('install-popup-dismissed')
    if (wasDismissed) {
      return
    }

    // Capturar evento de instalação PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPopup(true)
    }

    // Mostrar popup após 3 segundos se não houver evento PWA
    const timer = setTimeout(() => {
      if (!deferredPrompt) {
        setShowPopup(true)
      }
    }, 3000)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      clearTimeout(timer)
    }
  }, [deferredPrompt])

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Instalação PWA nativa
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('App instalado com sucesso!')
        setShowPopup(false)
      }
      
      setDeferredPrompt(null)
    } else {
      // Mostrar instruções detalhadas
      setShowInstructions(true)
    }
  }

  const handleClose = () => {
    setShowPopup(false)
    setShowInstructions(false)
    localStorage.setItem('install-popup-dismissed', 'true')
  }

  const getBrowserInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (userAgent.includes('chrome')) {
      return {
        icon: <Chrome className="w-5 h-5" />,
        title: "Google Chrome",
        steps: [
          "1. Clique no ícone ⚡ ou 📱 na barra de endereço",
          "2. Clique em 'Instalar aplicativo' ou 'Install'",
          "3. Confirme a instalação",
          "4. O app aparecerá na sua área de trabalho"
        ]
      }
    } else if (userAgent.includes('safari')) {
      return {
        icon: <Smartphone className="w-5 h-5" />,
        title: "Safari (iPhone/iPad)",
        steps: [
          "1. Clique no ícone de Compartilhar 📤",
          "2. Role para baixo e clique em 'Adicionar à Tela Inicial'",
          "3. Confirme clicando em 'Adicionar'",
          "4. O app aparecerá na sua tela inicial"
        ]
      }
    } else if (userAgent.includes('firefox')) {
      return {
        icon: <Globe className="w-5 h-5" />,
        title: "Mozilla Firefox",
        steps: [
          "1. Clique no menu ☰ (três linhas)",
          "2. Selecione 'Instalar PWA' ou 'Install this site as an app'",
          "3. Confirme a instalação",
          "4. O app será instalado no seu dispositivo"
        ]
      }
    } else {
      return {
        icon: <Download className="w-5 h-5" />,
        title: "Navegador Desconhecido",
        steps: [
          "1. Procure por opções de instalação no menu do navegador",
          "2. Busque por 'Instalar como app' ou 'Add to Home Screen'",
          "3. Siga as instruções do seu navegador",
          "4. Se precisar, tente usar Chrome ou Safari"
        ]
      }
    }
  }

  if (!showPopup || !browserInfo) return null

  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-4 right-4 h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <img
                src="/logo.png"
                alt="AeroPizza Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <h3 className="text-xl font-bold text-black mb-2">Instale o AeroPizza</h3>
            <p className="text-gray-600 text-sm">Siga as instruções para seu navegador:</p>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              {browserInfo.icon}
              <h4 className="font-semibold text-black">{browserInfo.title}</h4>
            </div>
            <div className="space-y-2">
              {browserInfo.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-yellow-500 font-bold text-sm mt-0.5">{index + 1}.</span>
                  <p className="text-sm text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-xs text-yellow-800">
              <strong>Benefícios:</strong> Acesso rápido, notificações, funciona offline, experiência de app nativo!
            </p>
          </div>

          <Button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold"
          >
            Entendido
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-yellow-400 p-4 flex items-center space-x-3 max-w-sm">
        {/* Ícone - Logo AeroPizza */}
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <img
            src="/logo.png"
            alt="AeroPizza Logo"
            className="w-8 h-8 object-contain"
          />
        </div>
        
        {/* Texto */}
        <div className="flex-1">
          <h3 className="font-bold text-black text-sm">Instale nosso app!</h3>
          <p className="text-xs text-gray-600">Tenha o AeroPizza sempre à mão</p>
        </div>
        
        {/* Botões */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleInstall}
            size="sm"
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-xs px-3"
          >
            {deferredPrompt ? 'Instalar' : 'Como?'}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}