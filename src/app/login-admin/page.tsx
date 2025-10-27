'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLoginPage() {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('admin', JSON.stringify(data.admin))
        router.push('/admin')
      } else {
        alert('Credenciais inválidas')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/10 to-transparent"></div>
      </div>
      
      <Card className="w-full max-w-md bg-black/80 backdrop-blur-md border border-yellow-400/30 relative z-10">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-4">
            <img
              src="https://z-cdn-media.chatglm.cn/files/909f4ebd-27a2-4328-a292-36689e519704_ChatGPT%20Image%2020_10_2025%2C%2018_45_39.png?auth_key=1792539550-13c1913589464a22920476a1039b8b9b-0-4ae7be4eab7beb51fbc6ced814ea9d7c"
              alt="AeroPizza Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <CardTitle className="text-2xl text-yellow-500">AeroPizza Admin</CardTitle>
          <p className="text-yellow-400/80">Faça login para acessar o painel</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-yellow-400">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                className="bg-black/60 border-yellow-400/30 text-white placeholder-yellow-400/60"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-yellow-400">Senha</Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="bg-black/60 border-yellow-400/30 text-white placeholder-yellow-400/60"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          
          <div className="mt-6 text-sm text-yellow-400/80">
            <p className="font-semibold mb-2 text-yellow-400">Credenciais de teste:</p>
            <p>Admin 1: comerciochalegre@gmail.com / 87168087</p>
            <p>Admin 2: aeropizza@admin.com / 12345678</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}