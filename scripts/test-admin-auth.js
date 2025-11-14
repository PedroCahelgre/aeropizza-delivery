async function main() {
  const loginRes = await fetch('http://127.0.0.1:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'comerciochalegre@gmail.com', password: '87168087' })
  })
  const setCookie = loginRes.headers.get('set-cookie') || ''
  const body = await loginRes.text()
  console.log('login status', loginRes.status)
  console.log('set-cookie exists', Boolean(setCookie))
  console.log('login body', body)

  const res = await fetch('http://127.0.0.1:3000/api/admin/products', {
    headers: { Cookie: setCookie }
  })
  console.log('products status', res.status)
  console.log('products body', await res.text())
}

main().catch(e => { console.error(e); process.exit(1) })
