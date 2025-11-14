import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const auth = getAdminFromRequest(request)
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const admins = await db.admin.findMany({
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedAdmins = admins.map(admin => ({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      createdAt: admin.createdAt.toISOString(),
      updatedAt: admin.updatedAt.toISOString(),
      user: admin.user ? {
        id: admin.user.id,
        email: admin.user.email,
        name: admin.user.name,
        role: admin.user.role
      } : undefined
    }))

    return NextResponse.json(formattedAdmins, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar administradores:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = getAdminFromRequest(request)
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (auth.email !== 'comerciochalegre@gmail.com') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const { name, email, password, role } = await request.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se já existe um admin com este email
    const existingAdmin = await db.admin.findUnique({
      where: { email }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Já existe um administrador com este email' },
        { status: 409 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar o admin
  const admin = await db.admin.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      user: {
        connectOrCreate: {
          where: { email },
          create: { email, name, role: 'ADMIN' }
        }
      }
    }
  })

    // Não retornar a senha
    const { password: _, ...adminWithoutPassword } = admin

    return NextResponse.json(adminWithoutPassword, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar administrador:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
