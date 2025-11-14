import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

type AdminTokenPayload = {
  id: string
  email: string
  role: string
}

const secret = process.env.NEXTAUTH_SECRET || 'dev_secret'

export function signAdminToken(payload: AdminTokenPayload) {
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

export function verifyAdminToken(token: string) {
  try {
    return jwt.verify(token, secret) as AdminTokenPayload
  } catch {
    return null
  }
}

export function getAdminFromRequest(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value
  if (!token) return null
  return verifyAdminToken(token)
}
