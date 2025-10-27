import { db } from '@/lib/db';

async function createTestOrders() {
  try {
    // Criar usuários de teste
    const user1 = await db.user.upsert({
      where: { email: 'joao@cliente.com' },
      update: {},
      create: {
        email: 'joao@cliente.com',
        name: 'João Silva',
        phone: '11999998888',
        address: 'Rua das Pizzas, 123 - São Paulo, SP',
        role: 'CLIENT'
      }
    });

    const user2 = await db.user.upsert({
      where: { email: 'maria@cliente.com' },
      update: {},
      create: {
        email: 'maria@cliente.com',
        name: 'Maria Santos',
        phone: '11888889999',
        address: 'Avenida das Fatias, 456 - São Paulo, SP',
        role: 'CLIENT'
      }
    });

    // Buscar produtos
    const products = await db.product.findMany({
      take: 5
    });

    if (products.length === 0) {
      console.log('Nenhum produto encontrado. Execute primeiro o script de produtos.');
      return;
    }

    // Gerar número de pedido único
    const generateOrderNumber = () => {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `AERO${timestamp}${random}`;
    };

    // Criar pedidos de teste
    const orders = [
      {
        orderNumber: generateOrderNumber(),
        userId: user1.id,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        deliveryType: 'DELIVERY',
        totalAmount: 35.90,
        deliveryFee: 5.00,
        discountAmount: 0,
        finalAmount: 40.90,
        deliveryAddress: 'Rua das Pizzas, 123 - São Paulo, SP',
        customerPhone: '11999998888',
        items: {
          create: [
            {
              productId: products[0]?.id,
              quantity: 1,
              unitPrice: 35.90,
              totalPrice: 35.90
            }
          ]
        }
      },
      {
        orderNumber: generateOrderNumber(),
        userId: user2.id,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        deliveryType: 'DELIVERY',
        totalAmount: 78.80,
        deliveryFee: 5.00,
        discountAmount: 0,
        finalAmount: 83.80,
        deliveryAddress: 'Avenida das Fatias, 456 - São Paulo, SP',
        customerPhone: '11888889999',
        items: {
          create: [
            {
              productId: products[1]?.id,
              quantity: 1,
              unitPrice: 42.90,
              totalPrice: 42.90
            },
            {
              productId: products[2]?.id,
              quantity: 1,
              unitPrice: 35.90,
              totalPrice: 35.90
            }
          ]
        }
      },
      {
        orderNumber: generateOrderNumber(),
        userId: user1.id,
        status: 'PREPARING',
        paymentStatus: 'PAID',
        deliveryType: 'PICKUP',
        totalAmount: 45.90,
        deliveryFee: 0,
        discountAmount: 0,
        finalAmount: 45.90,
        customerPhone: '11999998888',
        items: {
          create: [
            {
              productId: products[2]?.id,
              quantity: 1,
              unitPrice: 45.90,
              totalPrice: 45.90
            }
          ]
        }
      },
      {
        orderNumber: generateOrderNumber(),
        userId: user2.id,
        status: 'READY',
        paymentStatus: 'PAID',
        deliveryType: 'PICKUP',
        totalAmount: 8.00,
        deliveryFee: 0,
        discountAmount: 0,
        finalAmount: 8.00,
        customerPhone: '11888889999',
        items: {
          create: [
            {
              productId: products[3]?.id,
              quantity: 2,
              unitPrice: 4.00,
              totalPrice: 8.00
            }
          ]
        }
      },
      {
        orderNumber: generateOrderNumber(),
        userId: user1.id,
        status: 'DELIVERED',
        paymentStatus: 'PAID',
        deliveryType: 'DELIVERY',
        totalAmount: 50.90,
        deliveryFee: 5.00,
        discountAmount: 5.00,
        finalAmount: 50.90,
        deliveryAddress: 'Rua das Pizzas, 123 - São Paulo, SP',
        customerPhone: '11999998888',
        notes: 'Cliente pediu para entregar no portão e ligar ao chegar.',
        items: {
          create: [
            {
              productId: products[4]?.id,
              quantity: 1,
              unitPrice: 50.90,
              totalPrice: 50.90
            }
          ]
        }
      }
    ];

    // Inserir pedidos
    for (const orderData of orders) {
      const order = await db.order.create({
        data: orderData,
        include: {
          items: {
            include: {
              product: true
            }
          },
          user: true
        }
      });
      console.log(`✅ Pedido criado: ${order.orderNumber} - Status: ${order.status}`);
    }

    console.log('\n🎉 Pedidos de teste criados com sucesso!');
    console.log('Agora você pode acessar /admin → Pedidos para visualizar e gerenciar.');
  } catch (error) {
    console.error('❌ Erro ao criar pedidos de teste:', error);
  }
}

createTestOrders()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));