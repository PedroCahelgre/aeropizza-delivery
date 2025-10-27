'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Clock,
  CheckCircle,
  Package,
  Truck,
  XCircle,
  MessageCircle,
  Zap,
  ArrowRight,
  Phone,
  MapPin,
  DollarSign,
  User,
  Calendar,
  FileText
} from 'lucide-react';

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    address?: string;
  };
  items: {
    product: {
      name: string;
      category: {
        name: string;
      };
    };
    quantity: number;
    price: number;
  }[];
  note?: string;
}

interface StatusUpdateModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (orderId: string, newStatus: string, sendWhatsApp: boolean, note?: string) => Promise<void>;
  isUpdating: boolean;
}

const statusFlow = {
  pending: {
    label: 'Pendente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: <Clock className="w-5 h-5" />,
    description: 'Aguardando confirmação',
    nextStatuses: ['confirmed', 'cancelled'],
    actions: [
      { status: 'confirmed', label: 'Confirmar Pedido', color: 'bg-blue-500 hover:bg-blue-600', icon: <CheckCircle className="w-4 h-4" /> },
      { status: 'cancelled', label: 'Cancelar Pedido', color: 'bg-red-500 hover:bg-red-600', icon: <XCircle className="w-4 h-4" /> }
    ]
  },
  confirmed: {
    label: 'Confirmado',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <CheckCircle className="w-5 h-5" />,
    description: 'Pedido confirmado pelo cliente',
    nextStatuses: ['preparing', 'cancelled'],
    actions: [
      { status: 'preparing', label: 'Iniciar Preparação', color: 'bg-purple-500 hover:bg-purple-600', icon: <Package className="w-4 h-4" /> },
      { status: 'cancelled', label: 'Cancelar Pedido', color: 'bg-red-500 hover:bg-red-600', icon: <XCircle className="w-4 h-4" /> }
    ]
  },
  preparing: {
    label: 'Em Preparação',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <Package className="w-5 h-5" />,
    description: 'Pedido sendo preparado',
    nextStatuses: ['ready', 'cancelled'],
    actions: [
      { status: 'ready', label: 'Pronto para Retirada', color: 'bg-green-500 hover:bg-green-600', icon: <Truck className="w-4 h-4" /> }
    ]
  },
  ready: {
    label: 'Pronto',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: <Truck className="w-5 h-5" />,
    description: 'Pronto para entrega/retirada',
    nextStatuses: ['delivered'],
    actions: [
      { status: 'delivered', label: 'Finalizar Entrega', color: 'bg-gray-600 hover:bg-gray-700', icon: <CheckCircle className="w-4 h-4" /> }
    ]
  },
  delivered: {
    label: 'Entregue',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: <CheckCircle className="w-5 h-5" />,
    description: 'Pedido entregue com sucesso',
    nextStatuses: [],
    actions: []
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: <XCircle className="w-5 h-5" />,
    description: 'Pedido cancelado',
    nextStatuses: [],
    actions: []
  }
};

export default function StatusUpdateModal({ order, isOpen, onClose, onUpdate, isUpdating }: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [note, setNote] = useState('');
  const [sendWhatsApp, setSendWhatsApp] = useState(true);

  if (!order) return null;

  const currentStatusInfo = statusFlow[order.status as keyof typeof statusFlow];
  const selectedStatusInfo = selectedStatus ? statusFlow[selectedStatus as keyof typeof statusFlow] : null;

  const handleQuickAction = async (status: string) => {
    setSelectedStatus(status);
    await handleUpdate(status);
  };

  const handleUpdate = async (status?: string) => {
    const statusToUpdate = status || selectedStatus;
    if (!statusToUpdate) {
      toast.error('Selecione um status');
      return;
    }

    try {
      await onUpdate(order.id, statusToUpdate, sendWhatsApp, note);
      setSelectedStatus('');
      setNote('');
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${currentStatusInfo.color}`}>
              {currentStatusInfo.icon}
            </div>
            <div>
              <div className="text-xl font-bold">Atualizar Status do Pedido</div>
              <div className="text-sm text-muted-foreground">
                Pedido #{order.id.slice(-6)} • {formatDate(order.createdAt)}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Informações do Pedido */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Linha do Tempo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${currentStatusInfo.color} border-2`}>
                      {currentStatusInfo.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{currentStatusInfo.label}</div>
                      <div className="text-sm text-muted-foreground">{currentStatusInfo.description}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {formatCurrency(order.total)}
                  </Badge>
                </div>

                {/* Ações Rápidas */}
                {currentStatusInfo.actions.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-muted-foreground">Ações Rápidas</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentStatusInfo.actions.map((action) => (
                        <Button
                          key={action.status}
                          onClick={() => handleQuickAction(action.status)}
                          disabled={isUpdating}
                          className={`${action.color} text-white flex items-center gap-2 h-12`}
                        >
                          {action.icon}
                          {action.label}
                          <ArrowRight className="w-4 h-4 ml-auto" />
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informações do Cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Informações do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Nome</div>
                      <div className="font-medium">{order.customer.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Telefone</div>
                      <div className="font-medium">{order.customer.phone}</div>
                    </div>
                  </div>
                  {order.customer.address && (
                    <div className="flex items-center gap-3 sm:col-span-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Endereço</div>
                        <div className="font-medium">{order.customer.address}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Resumo do Pedido */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  Resumo do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.product.category.name} • Qtd: {item.quantity}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(item.price)}</div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">Total</span>
                      <span className="font-bold text-xl">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - Controles de Atualização */}
          <div className="space-y-6">
            {/* Seleção de Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Novo Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {Object.entries(statusFlow).map(([key, info]) => {
                    const isCurrent = key === order.status;
                    const isNext = currentStatusInfo.nextStatuses.includes(key);
                    const canSelect = !isCurrent && (isNext || order.status === 'pending' && key === 'cancelled');
                    
                    return (
                      <button
                        key={key}
                        onClick={() => canSelect && setSelectedStatus(key)}
                        disabled={!canSelect}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          isCurrent
                            ? 'border-blue-500 bg-blue-50 cursor-not-allowed'
                            : canSelect
                            ? selectedStatus === key
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isCurrent ? 'bg-blue-100 text-blue-600' : canSelect ? 'bg-gray-100' : 'bg-gray-50'}`}>
                            {info.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{info.label}</div>
                            <div className="text-sm text-muted-foreground">{info.description}</div>
                          </div>
                          {isCurrent && (
                            <Badge variant="secondary">Atual</Badge>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Observações */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Adicione uma observação sobre esta atualização..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                />
                {order.note && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Observação anterior:</div>
                    <div className="text-sm">{order.note}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* WhatsApp */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  Notificação WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="whatsapp">Enviar notificação para o cliente</Label>
                    <input
                      id="whatsapp"
                      type="checkbox"
                      checked={sendWhatsApp}
                      onChange={(e) => setSendWhatsApp(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>
                  {sendWhatsApp && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-sm text-green-800">
                        <MessageCircle className="w-4 h-4 inline mr-2" />
                        O cliente receberá uma mensagem automática sobre a atualização do status.
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="space-y-3">
              <Button
                onClick={() => handleUpdate()}
                disabled={!selectedStatus || isUpdating}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                {isUpdating ? (
                  <>Atualizando...</>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Atualizar Status
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isUpdating}
                className="w-full h-12"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}