<<<<<<< HEAD
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, phone, address } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
=======
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, address } = body

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Nome e telefone são obrigatórios' },
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
        { status: 400 }
      )
    }

<<<<<<< HEAD
    // Verificar se usuário já existe
    const existingUser = await db.user.findUnique({
      where: { email }
=======
    // Verificar se usuário já existe pelo telefone
    const existingUser = await db.user.findFirst({
      where: { phone }
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
    })

    if (existingUser) {
      return NextResponse.json(existingUser)
    }

    // Criar novo usuário
    const user = await db.user.create({
      data: {
<<<<<<< HEAD
        email,
        name: name || null,
        phone: phone || null,
        address: address || null,
        role: 'CLIENT'
=======
        name,
        email: email || `cliente_${Date.now()}@temp.com`,
        phone,
        address: address || null,
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    )
  }
}

<<<<<<< HEAD
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar usuário' },
=======
export async function GET(request: NextRequest) {
  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar usuários' },
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
      { status: 500 }
    )
  }
}