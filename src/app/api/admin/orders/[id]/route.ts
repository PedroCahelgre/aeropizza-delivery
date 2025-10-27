import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const order = await db.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    // Formatar dados para o frontend
    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status.toLowerCase(),
      total: order.finalAmount,
      createdAt: order.createdAt,
      customer: {
        name: order.user.name || 'Cliente',
        phone: order.user.phone || order.customerPhone || '',
        address: order.deliveryAddress || ''
      },
      items: order.items.map(item => ({
        product: {
          name: item.product.name,
          category: {
            name: item.product.category.name
          }
        },
        quantity: item.quantity,
        price: item.totalPrice
      })),
      note: order.notes
    };

    return NextResponse.json(formattedOrder);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pedido' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, note } = body

    // Validar status
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      );
    }

    // Buscar pedido atual
    const currentOrder = await db.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });

    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar pedido
    const updatedOrder = await db.order.update({
      where: { id },
      data: {
        status: status.toUpperCase(),
        updatedAt: new Date(),
        // Adicionar nota se fornecida
        ...(note && { notes: note })
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        },
        user: true
      }
    });

    // Enviar notificação WhatsApp se solicitado
    if (body.sendWhatsAppNotification) {
      try {
        await sendWhatsAppNotification(currentOrder, status, note);
      } catch (whatsappError) {
        console.error('Erro ao enviar WhatsApp:', whatsappError);
        // Não falhar a atualização se o WhatsApp falhar
      }
    }

    // Formatar dados de resposta
    const formattedOrder = {
      id: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      status: updatedOrder.status.toLowerCase(),
      total: updatedOrder.finalAmount,
      createdAt: updatedOrder.createdAt,
      customer: {
        name: updatedOrder.user.name || 'Cliente',
        phone: updatedOrder.user.phone || updatedOrder.customerPhone || '',
        address: updatedOrder.deliveryAddress || ''
      },
      items: updatedOrder.items.map(item => ({
        product: {
          name: item.product.name,
          category: {
            name: item.product.category.name
          }
        },
        quantity: item.quantity,
        price: item.totalPrice
      })),
      note: updatedOrder.notes
    };

    return NextResponse.json(formattedOrder);
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar pedido' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Verificar se pedido existe
    const order = await db.order.findUnique({
      where: { id }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    // Deletar pedido
    await db.order.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Pedido deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar pedido' },
      { status: 500 }
    );
  }
}

async function sendWhatsAppNotification(order: any, newStatus: string, note?: string) {
  try {
    const zai = await ZAI.create();

    // Mapear status para português
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendente',
      'confirmed': 'Confirmado',
      'preparing': 'Em Preparação',
      'ready': 'Pronto para Retirada',
      'delivered': 'Entregue',
      'cancelled': 'Cancelado'
    };

    const statusText = statusMap[newStatus] || newStatus;

    // Construir mensagem
    let message = `🍕 *AeroPizza - Atualização do Pedido*\n\n`;
    message += `Olá, ${order.user.name || 'Cliente'}!\n\n`;
    message += `Seu pedido #${order.id.slice(-6)} foi atualizado para: *${statusText}*\n\n`;

    // Adicionar itens do pedido
    message += `*Resumo do pedido:*\n`;
    order.items.forEach((item: any, index: number) => {
      message += `${index + 1}. ${item.product.name} - R$ ${item.totalPrice.toFixed(2)}\n`;
    });

    message += `\n*Total:* R$ ${order.finalAmount.toFixed(2)}\n\n`;

    // Adicionar nota se existir
    if (note) {
      message += `*Observação:* ${note}\n\n`;
    }

    // Adicionar instruções baseado no status
    switch (newStatus) {
      case 'confirmed':
        message += `Seu pedido foi confirmado e está sendo preparado!`;
        break;
      case 'preparing':
        message += `Seu pedido está sendo preparado com cuidado!`;
        break;
      case 'ready':
        message += `Seu pedido está pronto para retirada!`;
        break;
      case 'delivered':
        message += `Obrigado pela preferência! Volte sempre!`;
        break;
      case 'cancelled':
        message += `Seu pedido foi cancelado. Entre em contato para mais informações.`;
        break;
    }

    message += `\n\nAtenciosamente,\nEquipe AeroPizza 🍕`;

    // Formatar número de telefone
    let phoneNumber = order.user.phone || order.customerPhone;
    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      // Remover caracteres não numéricos
      phoneNumber = phoneNumber?.replace(/\D/g, '') || '';
      // Adicionar código do Brasil se não tiver
      if (phoneNumber.length === 11) {
        phoneNumber = '+55' + phoneNumber;
      }
    }

    if (!phoneNumber) {
      console.log('Sem número de telefone para enviar WhatsApp');
      return;
    }

    // Enviar mensagem via ZAI WhatsApp
    const response = await zai.functions.invoke('send_whatsapp', {
      phone_number: phoneNumber,
      message: message
    });

    console.log('WhatsApp enviado com sucesso:', response);

    // Salvar log da mensagem
    await db.order.update({
      where: { id: order.id },
      data: {
        notes: (order.notes || '') + `\n[WhatsApp enviado em ${new Date().toLocaleString('pt-BR')}]`
      }
    });

  } catch (error) {
    console.error('Erro ao enviar notificação WhatsApp:', error);
    throw error;
  }
}