const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function removeDuplicateProducts() {
  try {
    console.log('Conectando ao banco de dados...')
    await prisma.$connect()

    // Buscar todos os produtos agrupados por nome
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' }
    })

    console.log(`Encontrados ${products.length} produtos no total`)

    // Agrupar produtos por nome
    const productGroups = {}
    products.forEach(product => {
      if (!productGroups[product.name]) {
        productGroups[product.name] = []
      }
      productGroups[product.name].push(product)
    })

    // Remover duplicatas
    let removedCount = 0
    for (const [productName, productList] of Object.entries(productGroups)) {
      if (productList.length > 1) {
        console.log(`\n🔄 Processando duplicatas para: ${productName} (${productList.length} itens)`)
        
        // Manter o primeiro produto (mais antigo) e remover os outros
        const toKeep = productList[0]
        const toRemove = productList.slice(1)
        
        console.log(`   Mantendo: ${toKeep.id} (criado em ${toKeep.createdAt})`)
        
        for (const product of toRemove) {
          await prisma.product.delete({
            where: { id: product.id }
          })
          console.log(`   🗑️  Removido: ${product.id} (criado em ${product.createdAt})`)
          removedCount++
        }
      }
    }

    // Verificar resultado final
    const finalProducts = await prisma.product.findMany()
    console.log(`\n✅ Processo concluído!`)
    console.log(`📊 Produtos finais: ${finalProducts.length}`)
    console.log(`🗑️  Produtos removidos: ${removedCount}`)

    // Listar produtos finais
    console.log('\n📋 Produtos finais:')
    finalProducts.forEach(product => {
      console.log(`   - ${product.name}: ${product.image}`)
    })

  } catch (error) {
    console.error('❌ Erro ao remover duplicatas:', error)
  } finally {
    await prisma.$disconnect()
  }
}

removeDuplicateProducts()