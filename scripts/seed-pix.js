const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Verificar se já existe configuração PIX
    const existingPix = await prisma.pixConfig.findFirst({
      where: { key: 'aeropizza_pix' }
    });

    if (!existingPix) {
      // Criar configuração PIX padrão
      const pixConfig = await prisma.pixConfig.create({
        data: {
          key: 'aeropizza_pix',
          pixKey: '5512992515171',
          pixType: 'telefone',
          recipient: 'Aero Pizza',
          active: true
        }
      });
      
      console.log('✅ Configuração PIX criada:', pixConfig);
    } else {
      console.log('✅ Configuração PIX já existe:', existingPix);
    }

    // Verificar se há categorias
    const categoriesCount = await prisma.category.count();
    if (categoriesCount === 0) {
      console.log('⚠️ Nenhuma categoria encontrada no banco');
    } else {
      console.log(`✅ Encontradas ${categoriesCount} categorias`);
    }

    // Verificar se há produtos
    const productsCount = await prisma.product.count();
    if (productsCount === 0) {
      console.log('⚠️ Nenhum produto encontrado no banco');
    } else {
      console.log(`✅ Encontrados ${productsCount} produtos`);
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();