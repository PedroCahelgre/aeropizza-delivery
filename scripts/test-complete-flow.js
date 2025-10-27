// Script de teste completo para o sistema de pedidos
const puppeteer = require('puppeteer');

async function testCompleteFlow() {
  console.log('🚀 Iniciando teste completo do sistema...');
  
  try {
    // Teste 1: Verificar API de produtos
    console.log('\n📋 Teste 1: Verificando API de produtos...');
    const productsResponse = await fetch('http://localhost:3000/api/products');
    const products = await productsResponse.json();
    console.log(`✅ API funcionando! Encontrados ${products.length} produtos`);
    
    if (products.length > 0) {
      console.log(`🍕 Primeiro produto: ${products[0].name} - R$ ${products[0].price}`);
    }
    
    // Teste 2: Verificar página agendar
    console.log('\n📋 Teste 2: Verificando página /agendar...');
    const pageResponse = await fetch('http://localhost:3000/agendar');
    console.log(`✅ Página /agendar status: ${pageResponse.status}`);
    
    // Teste 3: Verificar página checkout
    console.log('\n📋 Teste 3: Verificando página /checkout...');
    const checkoutResponse = await fetch('http://localhost:3000/checkout');
    console.log(`✅ Página /checkout status: ${checkoutResponse.status}`);
    
    // Teste 4: Testar API de usuários
    console.log('\n📋 Teste 4: Testando API de usuários...');
    const userPayload = {
      name: 'Teste Automatizado',
      phone: '12992515171',
      email: 'teste@automatizado.com',
      address: 'Rua Teste, 123'
    };
    
    const userResponse = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userPayload)
    });
    
    if (userResponse.ok) {
      const user = await userResponse.json();
      console.log(`✅ API de usuários funcionando! User ID: ${user.id}`);
    } else {
      console.log(`❌ Erro na API de usuários: ${userResponse.status}`);
    }
    
    // Teste 5: Testar API de pedidos
    console.log('\n📋 Teste 5: Testando API de pedidos...');
    
    // Primeiro criar usuário
    const testUserResponse = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userPayload)
    });
    
    if (testUserResponse.ok) {
      const testUser = await testUserResponse.json();
      
      const orderPayload = {
        userId: testUser.id,
        items: [
          {
            productId: products[0].id,
            quantity: 1,
            unitPrice: products[0].price,
            notes: 'Pedido de teste automatizado'
          }
        ],
        deliveryType: 'DELIVERY',
        paymentMethod: 'CASH',
        deliveryAddress: 'Rua Teste, 123',
        customerPhone: '12992515171',
        notes: 'Teste automatizado'
      };
      
      const orderResponse = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      
      if (orderResponse.ok) {
        const order = await orderResponse.json();
        console.log(`✅ API de pedidos funcionando! Pedido #${order.orderNumber}`);
      } else {
        const error = await orderResponse.text();
        console.log(`❌ Erro na API de pedidos: ${orderResponse.status} - ${error}`);
      }
    }
    
    // Teste 6: Testar API de PIX
    console.log('\n📋 Teste 6: Testando API de PIX...');
    const pixResponse = await fetch('http://localhost:3000/api/admin/pix');
    
    if (pixResponse.ok) {
      const pix = await pixResponse.json();
      console.log(`✅ API de PIX funcionando! Chave: ${pix.pixKey}`);
    } else {
      console.log(`❌ Erro na API de PIX: ${pixResponse.status}`);
    }
    
    console.log('\n🎉 Testes completados! Verifique os resultados acima.');
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
  }
}

// Executar testes
testCompleteFlow();