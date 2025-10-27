// Teste automatizado do fluxo de carrinho
// Execute este script no console do navegador em http://localhost:3000/agendar

async function testCartFlow() {
    console.log('🧪 Iniciando teste automatizado do carrinho...')
    
    try {
        // 1. Verificar se a página está carregada
        console.log('📄 Verificando se a página está carregada...')
        if (typeof window === 'undefined') {
            throw new Error('Janela não encontrada')
        }
        
        // 2. Limpar carrinho existente
        console.log('🗑️ Limpando carrinho existente...')
        localStorage.removeItem('aeropizza_cart')
        
        // 3. Carregar produtos da API
        console.log('📦 Carregando produtos da API...')
        const productsResponse = await fetch('/api/products')
        if (!productsResponse.ok) {
            throw new Error(`Falha ao carregar produtos: ${productsResponse.status}`)
        }
        
        const products = await productsResponse.json()
        console.log('✅ Produtos carregados:', products.length, 'itens')
        
        if (products.length === 0) {
            throw new Error('Nenhum produto encontrado')
        }
        
        // 4. Simular adição ao carrinho
        console.log('🛒 Simulando adição ao carrinho...')
        const firstProduct = products[0]
        console.log('🍕 Produto selecionado:', firstProduct.name)
        
        // Simular o carrinho no formato esperado
        const cartItem = {
            id: firstProduct.id,
            name: firstProduct.name,
            description: firstProduct.description,
            price: firstProduct.price,
            image: firstProduct.image,
            category: firstProduct.category,
            preparationTime: firstProduct.preparationTime,
            quantity: 1,
            notes: ''
        }
        
        // Salvar no localStorage
        const cart = [cartItem]
        localStorage.setItem('aeropizza_cart', JSON.stringify(cart))
        console.log('💾 Carrinho salvo no localStorage:', cart)
        
        // 5. Verificar se o carrinho foi salvo
        console.log('🔍 Verificando carrinho salvo...')
        const savedCart = localStorage.getItem('aeropizza_cart')
        if (!savedCart) {
            throw new Error('Carrinho não foi salvo no localStorage')
        }
        
        const parsedCart = JSON.parse(savedCart)
        console.log('✅ Carrinho recuperado:', parsedCart)
        
        // 6. Testar redirecionamento
        console.log('🔗 Testando redirecionamento para checkout...')
        window.location.href = '/checkout'
        
        console.log('🎉 Teste concluído com sucesso!')
        
    } catch (error) {
        console.error('❌ Erro no teste:', error)
        console.log('📋 Informações para depuração:')
        console.log('- URL atual:', window.location.href)
        console.log('- localStorage:', localStorage.getItem('aeropizza_cart'))
        console.log('- User agent:', navigator.userAgent)
    }
}

// Função para testar API de usuários
async function testUserAPI() {
    console.log('👤 Testando API de usuários...')
    
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Teste Automatizado',
                phone: '12992515171',
                email: 'teste@automatizado.com',
                address: 'Rua Teste, 123'
            })
        })
        
        if (!response.ok) {
            throw new Error(`Falha na API de usuários: ${response.status}`)
        }
        
        const user = await response.json()
        console.log('✅ Usuário criado:', user)
        return user
        
    } catch (error) {
        console.error('❌ Erro na API de usuários:', error)
        throw error
    }
}

// Função para testar API de pedidos
async function testOrderAPI(userId) {
    console.log('📦 Testando API de pedidos...')
    
    try {
        const cart = JSON.parse(localStorage.getItem('aeropizza_cart') || '[]')
        if (cart.length === 0) {
            throw new Error('Carrinho vazio')
        }
        
        const orderData = {
            userId: userId,
            items: cart.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                unitPrice: item.price,
                notes: item.notes
            })),
            deliveryType: 'DELIVERY',
            paymentMethod: 'CASH',
            deliveryAddress: 'Rua Teste, 123',
            customerPhone: '12992515171',
            notes: 'Pedido de teste automatizado'
        }
        
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        })
        
        if (!response.ok) {
            throw new Error(`Falha na API de pedidos: ${response.status}`)
        }
        
        const order = await response.json()
        console.log('✅ Pedido criado:', order)
        return order
        
    } catch (error) {
        console.error('❌ Erro na API de pedidos:', error)
        throw error
    }
}

// Executar testes
console.log('🚀 Iniciando suite de testes automatizados...')
console.log('Execute: testCartFlow() para testar o fluxo completo')
console.log('Execute: testUserAPI() para testar API de usuários')
console.log('Execute: testOrderAPI(userId) para testar API de pedidos')

// Exportar funções para uso manual
window.testCartFlow = testCartFlow;
window.testUserAPI = testUserAPI;
window.testOrderAPI = testOrderAPI;

console.log('✅ Funções de teste carregadas! Use testCartFlow() para começar.');