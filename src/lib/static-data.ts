// Dados estáticos para o modo de exportação
// Este arquivo contém os dados que serão usados quando as APIs não estiverem disponíveis

export const staticCategories = [
  {
    id: '1',
    name: 'Pizzas Tradicionais',
    description: 'As pizzas clássicas que todos amam',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Pizzas Gourmet',
    description: 'Pizzas especiais com ingredientes premium',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Bebidas',
    description: 'Refrigerantes e sucos naturais',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export const staticProducts = [
  {
    id: '1',
    name: 'Margherita',
    description: 'Molho de tomate, muçarela, manjericão fresco e azeite extra virgem',
    price: 35.90,
    image: '/pizzas/margherita.jpg',
    categoryId: '1',
    available: true,
    preparationTime: 20,
    ingredients: 'Molho de tomate, muçarela, manjericão fresco, azeite extra virgem',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      name: 'Pizzas Tradicionais'
    }
  },
  {
    id: '2',
    name: 'Calabresa Especial',
    description: 'Calabresa artesanal, cebola roxa, azeitona preta e queijo muçarela',
    price: 42.90,
    image: '/pizzas/calabresa.jpg',
    categoryId: '1',
    available: true,
    preparationTime: 25,
    ingredients: 'Molho de tomate, muçarela, calabresa artesanal, cebola roxa, azeitona preta',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      name: 'Pizzas Tradicionais'
    }
  },
  {
    id: '3',
    name: 'Portuguesa Tradicional',
    description: 'Presunto de qualidade, muçarela, ovo cozido, cebola e azeitona',
    price: 45.90,
    image: '/pizzas/portuguesa.jpg',
    categoryId: '1',
    available: true,
    preparationTime: 25,
    ingredients: 'Molho de tomate, muçarela, presunto, ovo cozido, cebola, azeitona preta',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      name: 'Pizzas Tradicionais'
    }
  },
  {
    id: '4',
    name: 'Frango com Catupiry',
    description: 'Frango desfiado refogado, catupiry cremoso, milho verde e orégano',
    price: 44.90,
    image: '/pizzas/frango-catupiry.jpg',
    categoryId: '2',
    available: true,
    preparationTime: 30,
    ingredients: 'Molho de tomate, muçarela, frango desfiado, catupiry, milho verde, orégano',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      name: 'Pizzas Gourmet'
    }
  },
  {
    id: '5',
    name: 'Quatro Queijos Gourmet',
    description: 'Muçarela, parmesão, gorgonzola e provolone com toque de noz moscada',
    price: 48.90,
    image: '/pizzas/quatro-queijos.jpg',
    categoryId: '2',
    available: true,
    preparationTime: 28,
    ingredients: 'Molho branco, muçarela, parmesão, gorgonzola, provolone, noz moscada',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      name: 'Pizzas Gourmet'
    }
  },
  {
    id: '6',
    name: 'Pepperoni Deluxe',
    description: 'Dupla de pepperoni, queijo cheddar extra e pimenta calabresa',
    price: 46.90,
    image: '/pizzas/pepperoni.jpg',
    categoryId: '2',
    available: true,
    preparationTime: 25,
    ingredients: 'Molho de tomate, muçarela, pepperoni duplo, cheddar, pimenta calabresa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      name: 'Pizzas Gourmet'
    }
  },
  {
    id: '7',
    name: 'Vegetariana Especial',
    description: 'Pimentões coloridos, cogumelos frescos, tomate cereja, azeitona e rúcula',
    price: 41.90,
    image: '/pizzas/vegetariana.jpg',
    categoryId: '2',
    available: true,
    preparationTime: 22,
    ingredients: 'Molho de tomate, muçarela, pimentões, cogumelos, tomate cereja, azeitona, rúcula',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      name: 'Pizzas Gourmet'
    }
  },
  {
    id: '8',
    name: 'Pizza Chocolate',
    description: 'Base de chocolate, nutella, morangos frescos, chantilly e raspas de chocolate',
    price: 38.90,
    image: '/pizzas/chocolate.jpg',
    categoryId: '2',
    available: true,
    preparationTime: 15,
    ingredients: 'Base de chocolate, nutella, morangos frescos, chantilly, raspas de chocolate',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      name: 'Pizzas Gourmet'
    }
  },
  {
    id: '9',
    name: 'Coca-Cola 2L',
    description: 'Refrigerante de cola tradicional gelado 2 litros',
    price: 12.90,
    image: '/bebidas/coca-cola.jpg',
    categoryId: '3',
    available: true,
    preparationTime: 0,
    ingredients: 'Refrigerante de cola, água gaseificada, açúcar, cafeína',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      name: 'Bebidas'
    }
  },
  {
    id: '10',
    name: 'Suco de Laranja Natural 500ml',
    description: 'Suco natural de laranja espremido na hora, sem conservantes',
    price: 8.90,
    image: '/bebidas/suco-laranja.jpg',
    categoryId: '3',
    available: true,
    preparationTime: 5,
    ingredients: 'Laranja natural, água mineral, gelo, açúcar opcional',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      name: 'Bebidas'
    }
  }
]

export const staticPixConfig = {
  id: '1',
  key: 'aeropizza_pix',
  pixKey: '12992515171',
  pixType: 'telefone',
  recipient: 'AeroPizza',
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}