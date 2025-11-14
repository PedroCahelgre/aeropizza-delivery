async function main() {
  const loginRes = await fetch('http://127.0.0.1:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'comerciochalegre@gmail.com', password: '87168087' })
  })
  const setCookie = loginRes.headers.get('set-cookie') || ''
  console.log('login', loginRes.status, Boolean(setCookie))

  const logoutRes = await fetch('http://127.0.0.1:3000/api/auth/logout', { method: 'POST', headers: { Cookie: setCookie } })
  console.log('logout', logoutRes.status)

  const res = await fetch('http://127.0.0.1:3000/api/admin/products')
  console.log('admin products after logout', res.status)
}

main().catch(e => { console.error(e); process.exit(1) })
