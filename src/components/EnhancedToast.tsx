'use client'

import { useEffect, useState } from 'react'
import { Check, X, ShoppingCart, Heart, Star } from 'lucide-react'

interface ToastProps {
  id: string
  type: 'success' | 'error' | 'info' | 'cart'
  title: string
  description?: string
  duration?: number
  onClose: (id: string) => void
}

export default function EnhancedToast({ id, type, title, description, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => onClose(id), 300)
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />
      case 'error':
        return <X className="w-5 h-5 text-red-500" />
      case 'cart':
        return <ShoppingCart className="w-5 h-5 text-yellow-500" />
      case 'info':
        return <Star className="w-5 h-5 text-blue-500" />
      default:
        return <Check className="w-5 h-5 text-green-500" />
    }
  }

  const getBackground = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'cart':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-green-50 border-green-200'
    }
  }

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className={`
        ${getBackground()}
        border rounded-lg shadow-lg p-4 flex items-start gap-3
        backdrop-blur-sm bg-opacity-95
      `}>
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
          {description && (
            <p className="text-gray-600 text-xs mt-1">{description}</p>
          )}
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Container para múltiplos toasts
export function ToastContainer({ toasts, onClose }: { toasts: any[], onClose: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <EnhancedToast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  )
}