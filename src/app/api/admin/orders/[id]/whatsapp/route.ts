import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { message, customMessage } = body

    // Buscar pedido
    const order = await db.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    const zai = await ZAI.create();

    // Construir mensagem
    let whatsappMessage = customMessage || `🍕 *AeroPizza - Mensagem sobre seu Pedido*\n\n`;
    
    if (!customMessage) {
      whatsappMessage += `Olá, ${order.user.name || 'Cliente'}!\n\n`;
      whatsappMessage += `Referente ao seu pedido #${order.id.slice(-6)}:\n\n`;
      
      if (message) {
        whatsappMessage += `${message}\n\n`;
      }
      
      // Adicionar resumo do pedido
      whatsappMessage += `*Resumo do pedido:*\n`;
      order.items.forEach((item: any, index: number) => {
        whatsappMessage += `${index + 1}. ${item.product.name} - R$ ${item.totalPrice.toFixed(2)}\n`;
      });
      
      whatsappMessage += `\n*Total:* R$ ${order.finalAmount.toFixed(2)}\n\n`;
      whatsappMessage += `Atenciosamente,\nEquipe AeroPizza 🍕`;
    }

    // Formatar número de telefone
    let phoneNumber = order.user.phone || order.customerPhone;
    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      phoneNumber = phoneNumber?.replace(/\D/g, '') || '';
      if (phoneNumber.length === 11) {
        phoneNumber = '+55' + phoneNumber;
      }
    }

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Número de telefone não disponível' },
        { status: 400 }
      );
    }

    // Enviar mensagem via ZAI WhatsApp
    const response = await zai.functions.invoke('send_whatsapp', {
      phone_number: phoneNumber,
      message: whatsappMessage
    });

    // Salvar log da mensagem no pedido
    const logMessage = `[WhatsApp enviado em ${new Date().toLocaleString('pt-BR')}]: ${customMessage || message || 'Mensagem padrão'}`;
    await db.order.update({
      where: { id },
      data: {
        notes: (order.notes || '') + '\n' + logMessage
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Mensagem WhatsApp enviada com sucesso',
      response: response
    });

  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem WhatsApp' },
      { status: 500 }
    );
  }
}