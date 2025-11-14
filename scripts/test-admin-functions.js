async function req(url, init) {
  const res = await fetch(url, init)
  return { status: res.status, body: await res.text(), headers: res.headers }
}

async function main() {
  const productsRes = await req('http://127.0.0.1:3000/api/products')
  const products = JSON.parse(productsRes.body)
  const p = products[0]

  const userRes = await req('http://127.0.0.1:3000/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Cliente Teste', phone: '12992515171', address: 'Rua Teste, 123' })
  })
  const user = JSON.parse(userRes.body)

  const orderRes = await req('http://127.0.0.1:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: user.id,
      items: [{ productId: p.id, quantity: 1, unitPrice: p.price }],
      deliveryType: 'DELIVERY',
      paymentMethod: 'CASH',
      deliveryAddress: 'Rua Teste, 123',
      customerPhone: '12992515171',
      notes: 'Teste admin'
    })
  })
  const order = JSON.parse(orderRes.body)

  const loginRes = await req('http://127.0.0.1:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'comerciochalegre@gmail.com', password: '87168087' })
  })
  const cookie = loginRes.headers.get('set-cookie') || ''

  const adminOrders = await req('http://127.0.0.1:3000/api/admin/orders', { headers: { Cookie: cookie } })
  const ordersPayload = JSON.parse(adminOrders.body)

  const updateOrder = await req(`http://127.0.0.1:3000/api/admin/orders/${order.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({ status: 'confirmed', note: 'Aprovado' })
  })

  const toggleFalse = await req(`http://127.0.0.1:3000/api/admin/products/${p.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({ available: false })
  })
  const toggleTrue = await req(`http://127.0.0.1:3000/api/admin/products/${p.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({ available: true })
  })

  const adminsList = await req('http://127.0.0.1:3000/api/admin/admins', { headers: { Cookie: cookie } })
  const newAdminEmail = `teste_${Date.now()}@admin.com`
  const createAdmin = await req('http://127.0.0.1:3000/api/admin/admins', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({ name: 'Teste Admin', email: newAdminEmail, password: 'teste123', role: 'ADMIN' })
  })
  let deleteStatus = 0
  if (createAdmin.status === 201) {
    const created = JSON.parse(createAdmin.body)
    const del = await req(`http://127.0.0.1:3000/api/admin/admins/${created.id}`, {
      method: 'DELETE',
      headers: { Cookie: cookie }
    })
    deleteStatus = del.status
  }

  const statsRes = await req('http://127.0.0.1:3000/api/admin/dashboard/stats', { headers: { Cookie: cookie } })

  console.log(JSON.stringify({
    productsStatus: productsRes.status,
    userStatus: userRes.status,
    orderStatus: orderRes.status,
    loginStatus: loginRes.status,
    adminOrdersStatus: adminOrders.status,
    adminOrdersCount: ordersPayload.pagination ? ordersPayload.pagination.total : 0,
    updateOrderStatus: updateOrder.status,
    toggleFalseStatus: toggleFalse.status,
    toggleTrueStatus: toggleTrue.status,
    adminsListStatus: adminsList.status,
    createAdminStatus: createAdmin.status,
    deleteAdminStatus: deleteStatus,
    statsStatus: statsRes.status
  }, null, 2))
}

main().catch(e => { console.error(e); process.exit(1) })
