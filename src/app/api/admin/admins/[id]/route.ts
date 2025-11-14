import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { getAdminFromRequest } from '@/lib/auth'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = getAdminFromRequest(request)
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const admin = await db.admin.findUnique({
      where: { id: params.id },
      include: {
        user: true
      }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Administrador não encontrado' },
        { status: 404 }
      )
    }

    const formattedAdmin = {
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
    }

    return NextResponse.json(formattedAdmin, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar administrador:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = getAdminFromRequest(request)
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (auth.email !== 'comerciochalegre@gmail.com') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const { name, email, role, password } = await request.json()

    // Verificar se o admin existe
    const existingAdmin = await db.admin.findUnique({
      where: { id: params.id }
    })

    if (!existingAdmin) {
      return NextResponse.json(
        { error: 'Administrador não encontrado' },
        { status: 404 }
      )
    }

    // Não permitir editar o admin master
    if (existingAdmin.email === 'comerciochalegre@gmail.com') {
      return NextResponse.json(
        { error: 'Não é possível editar o administrador master' },
        { status: 403 }
      )
    }

    // Verificar se o email já existe (exceto para o próprio admin)
    if (email && email !== existingAdmin.email) {
      const emailExists = await db.admin.findUnique({
        where: { email }
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Já existe um administrador com este email' },
          { status: 409 }
        )
      }
    }

    const updateData: any = {}
    
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (role) updateData.role = role
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const updatedAdmin = await db.admin.update({
      where: { id: params.id },
      data: updateData
    })

    const { password: _, ...adminWithoutPassword } = updatedAdmin

    return NextResponse.json(adminWithoutPassword, { status: 200 })
  } catch (error) {
    console.error('Erro ao atualizar administrador:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = getAdminFromRequest(request)
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (auth.email !== 'comerciochalegre@gmail.com') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    // Verificar se o admin existe
    const existingAdmin = await db.admin.findUnique({
      where: { id: params.id }
    })

    if (!existingAdmin) {
      return NextResponse.json(
        { error: 'Administrador não encontrado' },
        { status: 404 }
      )
    }

    // Não permitir excluir o admin master
    if (existingAdmin.email === 'comerciochalegre@gmail.com') {
      return NextResponse.json(
        { error: 'Não é possível excluir o administrador master' },
        { status: 403 }
      )
    }

    await db.admin.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Administrador removido com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao excluir administrador:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
