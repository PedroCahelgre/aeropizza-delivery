'use client'

import { useEffect, useState } from 'react'

interface CartAnimationProps {
  trigger: boolean
  onComplete?: () => void
}

export default function CartAnimation({ trigger, onComplete }: CartAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (trigger) {
      // Simular posição do clique (em um app real, viria do evento)
      const clickX = window.innerWidth / 2
      const clickY = window.innerHeight / 2
      
      setPosition({ x: clickX, y: clickY })
      setIsVisible(true)
      
      // Animar para o carrinho
      setTimeout(() => {
        const cartElement = document.querySelector('[data-cart-icon]')
        if (cartElement) {
          const rect = cartElement.getBoundingClientRect()
          setPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
        }
      }, 100)
      
      // Completar animação
      setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, 800)
    }
  }, [trigger, onComplete])

  if (!isVisible) return null

  return (
    <div
      className="fixed pointer-events-none z-50 transition-all duration-700 ease-out"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="relative">
        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-black font-bold text-sm">🍕</span>
        </div>
        <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
      </div>
    </div>
  )
}