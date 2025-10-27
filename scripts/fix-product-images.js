const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Mapeamento de produtos para imagens
const productImages = {
  'Margherita': '/pizzas/margherita.jpg',
  'Calabresa Especial': '/pizzas/calabresa.jpg',
  'Portuguesa Tradicional': '/pizzas/portuguesa.jpg',
  'Frango com Catupiry': '/pizzas/frango-catupiry.jpg',
  'Quatro Queijos Gourmet': '/pizzas/quatro-queijos.jpg',
  'Pepperoni Deluxe': '/pizzas/pepperoni.jpg',
  'Vegetariana Especial': '/pizzas/vegetariana.jpg',
  'Pizza Chocolate': '/pizzas/chocolate.jpg',
  'Coca-Cola 2L': '/bebidas/coca-cola.jpg',
  'Suco de Laranja Natural 500ml': '/bebidas/suco-laranja.jpg'
}

async function fixProductImages() {
  try {
    console.log('Conectando ao banco de dados...')
    await prisma.$connect()

    // Buscar todos os produtos
    const products = await prisma.product.findMany()
    console.log(`Encontrados ${products.length} produtos`)

    // Atualizar cada produto com sua imagem correspondente
    for (const product of products) {
      const imageUrl = productImages[product.name]
      
      if (imageUrl) {
        await prisma.product.update({
          where: { id: product.id },
          data: { image: imageUrl }
        })
        console.log(`✅ Produto "${product.name}" atualizado com imagem: ${imageUrl}`)
      } else {
        console.log(`⚠️  Nenhuma imagem encontrada para o produto: ${product.name}`)
      }
    }

    // Remover produtos duplicados (se houver)
    const duplicateProducts = await prisma.product.groupBy({
      by: ['name'],
      having: {
        id: {
          _count: {
            gt: 1
          }
        }
      }
    })

    if (duplicateProducts.length > 0) {
      console.log('\n🔄 Removendo produtos duplicados...')
      
      for (const duplicate of duplicateProducts) {
        const productsToDelete = await prisma.product.findMany({
          where: { name: duplicate.name },
          orderBy: { createdAt: 'asc' },
          take: 1 // Manter o mais antigo
        })

        if (productsToDelete.length > 1) {
          // Deletar todos exceto o primeiro (mais antigo)
          const toDelete = productsToDelete.slice(1)
          for (const product of toDelete) {
            await prisma.product.delete({
              where: { id: product.id }
            })
            console.log(`🗑️  Produto duplicado removido: ${product.name} (${product.id})`)
          }
        }
      }
    }

    console.log('\n✅ Atualização de imagens concluída com sucesso!')

  } catch (error) {
    console.error('❌ Erro ao atualizar imagens:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixProductImages()