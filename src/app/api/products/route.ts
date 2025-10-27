import { NextResponse } from 'next/server'
<<<<<<< HEAD
import { db } from '@/lib/db'
=======
import { getStaticProducts } from '@/lib/static-utils'
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5

export async function GET(request: Request) {
  try {
    // Verificar se é uma requisição válida
    const url = new URL(request.url)
    const origin = request.headers.get('origin')
    
    // Adicionar headers para prevenir cache e redirecionamento
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

<<<<<<< HEAD
    // Buscar produtos do banco de dados
    const products = await db.product.findMany({
      include: {
        category: true
      },
      where: {
        available: true
      },
      orderBy: {
        name: 'asc'
      }
    })
=======
    // Retornar produtos estáticos
    const products = getStaticProducts()
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
    
    return NextResponse.json(products, {
      status: 200,
      headers
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}