'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function InstrucoesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🍕 AeroPizza - Instruções de Teste</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>✅ Problema Resolvido!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                O botão "Finalizar Pedido" foi corrigido e agora deve aparecer corretamente na página de checkout.
              </p>
              <p className="text-sm text-gray-600">
                Foram feitas as seguintes melhorias:
              </p>
              <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                <li>Verificação completa da lógica do carrinho</li>
                <li>Estilização aprimorada do botão</li>
                <li>Remoção de logs de debug desnecessários</li>
                <li>Validação melhorada do formulário</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🧪 Como Testar o Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3">
                <li>
                  <strong>Adicionar itens ao carrinho:</strong>
                  <div className="ml-6 mt-1">
                    <Link href="/agendar">
                      <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
                        Ir para Cardápio
                      </Button>
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      Adicione algumas pizzas ou bebidas ao carrinho
                    </p>
                  </div>
                </li>
                
                <li>
                  <strong>Finalizar pedido:</strong>
                  <div className="ml-6 mt-1">
                    <p className="text-sm text-gray-600">
                      Clique no botão "Finalizar Pedido" no carrinho
                    </p>
                  </div>
                </li>
                
                <li>
                  <strong>Preencher dados:</strong>
                  <div className="ml-6 mt-1">
                    <p className="text-sm text-gray-600">
                      Preencha nome, telefone e escolha delivery/retirada
                    </p>
                  </div>
                </li>
                
                <li>
                  <strong>Confirmar pedido:</strong>
                  <div className="ml-6 mt-1">
                    <p className="text-sm text-gray-600">
                      O botão "Finalizar Pedido" deve estar visível e funcional
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔗 Links Úteis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    🏠 Página Inicial
                  </Button>
                </Link>
                <Link href="/agendar">
                  <Button variant="outline" className="w-full">
                    🍕 Fazer Pedido
                  </Button>
                </Link>
                <Link href="/cardapio">
                  <Button variant="outline" className="w-full">
                    📋 Cardápio Completo
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button variant="outline" className="w-full">
                    ⚙️ Painel Admin
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📝 Informações do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Status:</strong> ✅ Online
                </div>
                <div>
                  <strong>Porta:</strong> 3000
                </div>
                <div>
                  <strong>Banco:</strong> SQLite + Prisma
                </div>
                <div>
                  <strong>WhatsApp:</strong> +55 12 99251-5171
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}