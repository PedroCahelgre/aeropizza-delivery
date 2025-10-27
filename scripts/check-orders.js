const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkOrders() {
  try {
    await prisma.$connect()

    // Verificar OrderItems
    const orderItems = await prisma.orderItem.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true
          }
        },
        order: {
          select: {
            id: true,
            orderNumber: true
          }
        }
      }
    })

    console.log(`Encontrados ${orderItems.length} itens de pedido:`)
    orderItems.forEach(item => {
      console.log(`   - Pedido ${item.order.orderNumber}: ${item.product.name} (${item.product.id})`)
    })

    // Verificar produtos duplicados e seus pedidos
    const products = await prisma.product.findMany({
      include: {
        orderItems: {
          include: {
            order: {
              select: {
                orderNumber: true
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    console.log('\n📊 Produtos e seus pedidos:')
    const productGroups = {}
    products.forEach(product => {
      if (!productGroups[product.name]) {
        productGroups[product.name] = []
      }
      productGroups[product.name].push(product)
    })

    for (const [productName, productList] of Object.entries(productGroups)) {
      console.log(`\n${productName}:`)
      productList.forEach(product => {
        console.log(`   - ID: ${product.id}`)
        console.log(`     Imagem: ${product.image}`)
        console.log(`     Pedidos: ${product.orderItems.length}`)
        product.orderItems.forEach(item => {
          console.log(`       * Pedido ${item.order.orderNumber}`)
        })
      })
    }

  } catch (error) {
    console.error('Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkOrders()