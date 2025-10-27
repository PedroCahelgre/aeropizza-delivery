// Dados mock para produtos em modo estático
export const mockProducts = [
  {
    id: '1',
    name: 'Margherita',
    description: 'Molho de tomate, muçarela, manjericão fresco e azeite extra virgem',
    price: 35.90,
    image: '/pizzas/margherita.jpg',
    category: {
      name: 'Pizzas Tradicionais'
    },
    preparationTime: 20,
    available: true,
    ingredients: 'Molho de tomate, muçarela, manjericão fresco, azeite extra virgem'
  },
  {
    id: '2',
    name: 'Calabresa Especial',
    description: 'Calabresa artesanal, cebola roxa, azeitona preta e queijo muçarela',
    price: 42.90,
    image: '/pizzas/calabresa.jpg',
    category: {
      name: 'Pizzas Tradicionais'
    },
    preparationTime: 25,
    available: true,
    ingredients: 'Molho de tomate, muçarela, calabresa artesanal, cebola roxa, azeitona preta'
  },
  {
    id: '3',
    name: 'Portuguesa Tradicional',
    description: 'Presunto de qualidade, muçarela, ovo cozido, cebola e azeitona',
    price: 45.90,
    image: '/pizzas/portuguesa.jpg',
    category: {
      name: 'Pizzas Tradicionais'
    },
    preparationTime: 25,
    available: true,
    ingredients: 'Molho de tomate, muçarela, presunto, ovo cozido, cebola, azeitona preta'
  },
  {
    id: '4',
    name: 'Frango com Catupiry',
    description: 'Frango desfiado refogado, catupiry cremoso, milho verde e orégano',
    price: 44.90,
    image: '/pizzas/frango-catupiry.jpg',
    category: {
      name: 'Pizzas Gourmet'
    },
    preparationTime: 30,
    available: true,
    ingredients: 'Molho de tomate, muçarela, frango desfiado, catupiry, milho verde, orégano'
  },
  {
    id: '5',
    name: 'Quatro Queijos Gourmet',
    description: 'Muçarela, parmesão, gorgonzola e provolone com toque de noz moscada',
    price: 48.90,
    image: '/pizzas/quatro-queijos.jpg',
    category: {
      name: 'Pizzas Gourmet'
    },
    preparationTime: 28,
    available: true,
    ingredients: 'Molho branco, muçarela, parmesão, gorgonzola, provolone, noz moscada'
  },
  {
    id: '6',
    name: 'Pepperoni Deluxe',
    description: 'Dupla de pepperoni, queijo cheddar extra e pimenta calabresa',
    price: 46.90,
    image: '/pizzas/pepperoni.jpg',
    category: {
      name: 'Pizzas Gourmet'
    },
    preparationTime: 25,
    available: true,
    ingredients: 'Molho de tomate, muçarela, pepperoni duplo, cheddar, pimenta calabresa'
  },
  {
    id: '7',
    name: 'Vegetariana Especial',
    description: 'Pimentões coloridos, cogumelos frescos, tomate cereja, azeitona e rúcula',
    price: 41.90,
    image: '/pizzas/vegetariana.jpg',
    category: {
      name: 'Pizzas Gourmet'
    },
    preparationTime: 22,
    available: true,
    ingredients: 'Molho de tomate, muçarela, pimentões, cogumelos, tomate cereja, azeitona, rúcula'
  },
  {
    id: '8',
    name: 'Pizza Chocolate',
    description: 'Base de chocolate, nutella, morangos frescos, chantilly e raspas de chocolate',
    price: 38.90,
    image: '/pizzas/chocolate.jpg',
    category: {
      name: 'Pizzas Gourmet'
    },
    preparationTime: 15,
    available: true,
    ingredients: 'Base de chocolate, nutella, morangos frescos, chantilly, raspas de chocolate'
  },
  {
    id: '9',
    name: 'Coca-Cola 2L',
    description: 'Refrigerante de cola tradicional gelado 2 litros',
    price: 12.90,
    image: '/bebidas/coca-cola.jpg',
    category: {
      name: 'Bebidas'
    },
    preparationTime: 0,
    available: true,
    ingredients: 'Refrigerante de cola, água gaseificada, açúcar, cafeína'
  },
  {
    id: '10',
    name: 'Suco de Laranja Natural 500ml',
    description: 'Suco natural de laranja espremido na hora, sem conservantes',
    price: 8.90,
    image: '/bebidas/suco-laranja.jpg',
    category: {
      name: 'Bebidas'
    },
    preparationTime: 5,
    available: true,
    ingredients: 'Laranja natural, água mineral, gelo, açúcar opcional'
  }
]

// Dados mock para categorias
export const mockCategories = [
  {
    id: '1',
    name: 'Pizzas Tradicionais',
    description: 'As pizzas clássicas que todos amam',
    active: true
  },
  {
    id: '2',
    name: 'Pizzas Gourmet',
    description: 'Pizzas especiais com ingredientes premium',
    active: true
  },
  {
    id: '3',
    name: 'Bebidas',
    description: 'Refrigerantes e sucos naturais',
    active: true
  }
]

// Dados mock para configuração PIX
export const mockPixConfig = {
  key: 'aeropizza_pix',
  pixKey: '12992515171',
  pixType: 'telefone',
  recipient: 'AeroPizza',
  active: true
}