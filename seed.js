import { db } from './src/lib/db'

async function seed() {
  try {
    // Criar categorias
    const categories = await Promise.all([
      db.category.create({
        data: {
          name: 'Pizzas Tradicionais',
          description: 'Nossas pizzas clássicas',
          image: '/images/categories/tradicional.jpg'
        }
      }),
      db.category.create({
        data: {
          name: 'Pizzas Especiais',
          description: 'Combinações exclusivas',
          image: '/images/categories/especiais.jpg'
        }
      }),
      db.category.create({
        data: {
          name: 'Bebidas',
          description: 'Refrigerantes e sucos',
          image: '/images/categories/bebidas.jpg'
        }
      })
    ])

    // Criar produtos
    await Promise.all([
      // Pizzas Tradicionais
      db.product.create({
        data: {
          name: 'Margherita',
          description: 'Molho de tomate, muçarela, manjericão',
          price: 35.90,
          categoryId: categories[0].id,
          image: '/images/pizzas/margherita.jpg',
          preparationTime: 20,
          ingredients: 'Molho de tomate, queijo muçarela, manjericão fresco'
        }
      }),
      db.product.create({
        data: {
          name: 'Calabresa',
          description: 'Molho de tomate, muçarela, calabresa, cebola',
          price: 38.90,
          categoryId: categories[0].id,
          image: '/images/pizzas/calabresa.jpg',
          preparationTime: 20,
          ingredients: 'Molho de tomate, queijo muçarela, calabresa fatiada, cebola roda'
        }
      }),
      db.product.create({
        data: {
          name: 'Portuguesa',
          description: 'Molho de tomate, muçarela, presunto, ovo, cebola',
          price: 42.90,
          categoryId: categories[0].id,
          image: '/images/pizzas/portuguesa.jpg',
          preparationTime: 25,
          ingredients: 'Molho de tomate, queijo muçarela, presunto, ovo cozido, cebola, azeitona'
        }
      }),
      // Pizzas Especiais
      db.product.create({
        data: {
          name: 'Calabresa Especial',
          description: 'Molho de tomate, muçarela, calabresa especial, pimenta',
          price: 45.90,
          categoryId: categories[1].id,
          image: '/images/pizzas/calabresa-especial.jpg',
          preparationTime: 25,
          ingredients: 'Molho de tomate especial, queijo muçarela, calabresa defumada, pimenta calabresa'
        }
      }),
      db.product.create({
        data: {
          name: 'Frango com Catupiry',
          description: 'Molho de tomate, muçarela, frango desfiado, catupiry',
          price: 44.90,
          categoryId: categories[1].id,
          image: '/images/pizzas/frango-catupiry.jpg',
          preparationTime: 25,
          ingredients: 'Molho de tomate, queijo muçarela, frango desfiado temperado, catupiry'
        }
      }),
      // Bebidas
      db.product.create({
        data: {
          name: 'Coca-Cola 2L',
          description: 'Refrigerante de cola 2 litros',
          price: 12.90,
          categoryId: categories[2].id,
          image: '/images/bebidas/coca-cola-2l.jpg',
          preparationTime: 0
        }
      }),
      db.product.create({
        data: {
          name: 'Guaraná 2L',
          description: 'Refrigerante de guaraná 2 litros',
          price: 10.90,
          categoryId: categories[2].id,
          image: '/images/bebidas/guarana-2l.jpg',
          preparationTime: 0
        }
      }),
      db.product.create({
        data: {
          name: 'Suco de Laranja 500ml',
          description: 'Suco natural de laranja 500ml',
          price: 8.90,
          categoryId: categories[2].id,
          image: '/images/bebidas/suco-laranja.jpg',
          preparationTime: 5
        }
      })
    ])

    // Criar configuração PIX
    await db.pixConfig.create({
      data: {
        key: 'principal',
        pixKey: '11987654321',
        pixType: 'TELEFONE',
        recipient: 'Aero Pizza',
        active: true
      }
    })

    console.log('✅ Banco de dados populado com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error)
  } finally {
    await db.$disconnect()
  }
}

seed()