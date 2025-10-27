import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed do banco de dados...')

  // Limpar dados existentes
  await prisma.orderItem.deleteMany()
  await prisma.orderStatusHistory.deleteMany()
  await prisma.notificationHistory.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.user.deleteMany()

  // Criar categorias
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Pizzas Tradicionais',
        description: 'As pizzas clássicas que todos amam',
        image: '/images/categories/traditional.jpg'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Pizzas Especiais',
        description: 'Combinações exclusivas e surpreendentes',
        image: '/images/categories/special.jpg'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Bebidas',
        description: 'Refrigerantes, sucos e muito mais',
        image: '/images/categories/beverages.jpg'
      }
    })
  ])

  // Criar produtos
  const products = await Promise.all([
    // Pizzas Tradicionais
    prisma.product.create({
      data: {
        name: 'Margherita',
        description: 'Molho de tomate, muçarela, manjericão e azeite',
        price: 35.90,
        image: '/images/pizzas/margherita.jpg',
        categoryId: categories[0].id,
        preparationTime: 20,
        ingredients: 'Molho de tomate, muçarela, manjericão, azeite'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Calabresa Especial',
        description: 'Molho de tomate, muçarela, calabresa, cebola e azeitona',
        price: 42.90,
        image: '/images/pizzas/calabresa.jpg',
        categoryId: categories[0].id,
        preparationTime: 25,
        ingredients: 'Molho de tomate, muçarela, calabresa, cebola, azeitona'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Portuguesa Tradicional',
        description: 'Molho de tomate, muçarela, presunto, ovo, cebola e azeitona',
        price: 45.90,
        image: '/images/pizzas/portuguesa.jpg',
        categoryId: categories[0].id,
        preparationTime: 25,
        ingredients: 'Molho de tomate, muçarela, presunto, ovo, cebola, azeitona'
      }
    }),
    // Pizzas Especiais
    prisma.product.create({
      data: {
        name: 'AeroPizza Supreme',
        description: 'Molho especial, muçarela, calabresa, pepperoni, frango desfiado, bacon, cebola, tomate e azeitona',
        price: 58.90,
        image: '/images/pizzas/supreme.jpg',
        categoryId: categories[1].id,
        preparationTime: 30,
        ingredients: 'Molho especial, muçarela, calabresa, pepperoni, frango, bacon, cebola, tomate, azeitona'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Frango com Catupiry',
        description: 'Molho de tomate, muçarela, frango desfiado e catupiry',
        price: 48.90,
        image: '/images/pizzas/frango-catupiry.jpg',
        categoryId: categories[1].id,
        preparationTime: 25,
        ingredients: 'Molho de tomate, muçarela, frango desfiado, catupiry'
      }
    }),
    // Bebidas
    prisma.product.create({
      data: {
        name: 'Refrigerante Lata 350ml',
        description: 'Coca-Cola, Guaraná, Fanta ou Sprite',
        price: 6.90,
        image: '/images/beverages/soda.jpg',
        categoryId: categories[2].id,
        preparationTime: 0,
        ingredients: 'Refrigerante'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Suco Natural 500ml',
        description: 'Laranja, Limão, Maracujá ou Morango',
        price: 12.90,
        image: '/images/beverages/juice.jpg',
        categoryId: categories[2].id,
        preparationTime: 5,
        ingredients: 'Fruta natural, água, gelo'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Água Mineral 500ml',
        description: 'Água mineral com ou sem gás',
        price: 4.90,
        image: '/images/beverages/water.jpg',
        categoryId: categories[2].id,
        preparationTime: 0,
        ingredients: 'Água mineral'
      }
    })
  ])

  // Criar usuário admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@aeropizza.com',
      name: 'Administrador',
      role: 'ADMIN'
    }
  })

  await prisma.admin.create({
    data: {
      email: 'admin@aeropizza.com',
      password: 'admin123', // Em produção, usar hash
      name: 'Administrador',
      userId: adminUser.id
    }
  })

  // Criar usuário cliente de exemplo
  const clientUser = await prisma.user.create({
    data: {
      email: 'cliente@exemplo.com',
      name: 'Cliente Exemplo',
      phone: '11999999999',
      address: 'Rua das Pizzas, 123, São Paulo - SP',
      role: 'CLIENT'
    }
  })

  // Criar configuração PIX
  await prisma.pixConfig.create({
    data: {
      key: 'aeropizza_pix',
      pixKey: '11999999999',
      pixType: 'telefone',
      recipient: 'AeroPizza Delivery Ltda',
      active: true
    }
  })

  console.log('Seed concluído com sucesso!')
  console.log(`Categorias criadas: ${categories.length}`)
  console.log(`Produtos criados: ${products.length}`)
  console.log(`Usuários criados: 2 (1 admin, 1 cliente)`)
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })