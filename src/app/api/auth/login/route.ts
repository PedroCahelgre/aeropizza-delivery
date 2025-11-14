import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { signAdminToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 })
    }

    const admin = await db.admin.findUnique({
      where: { email },
      include: { user: true },
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin não encontrado' }, { status: 401 })
    }

    const ok = await bcrypt.compare(password, admin.password)
    if (!ok) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    const adminPublic = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      userId: admin.userId,
      user: admin.user ? { id: admin.user.id, email: admin.user.email, name: admin.user.name || undefined, role: admin.user.role } : undefined,
    }
    const token = signAdminToken({ id: admin.id, email: admin.email, role: admin.role })
    const res = NextResponse.json({ admin: adminPublic }, { status: 200 })
    res.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch (error) {
    console.error('Erro no login admin:', error)
    return NextResponse.json({ error: 'Erro no login' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, { status: 200 })
}
