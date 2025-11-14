import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const isApiAdmin = req.nextUrl.pathname.startsWith('/api/admin')
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
  const token = req.cookies.get('admin_session')?.value
  if (!token) {
    if (isApiAdmin) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    if (isAdminPage) {
      const url = req.nextUrl.clone()
      url.pathname = '/login-admin'
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
