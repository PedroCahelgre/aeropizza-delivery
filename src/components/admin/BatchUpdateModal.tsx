'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  CheckSquare,
  Square,
  Zap,
  MessageCircle,
  ArrowRight,
  AlertTriangle,
  CheckCircle
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
  orderNumber?: string;
}

interface BatchUpdateModalProps {
  orders: Order[];
  isOpen: boolean;
  onClose: () => void;
  onBatchUpdate: (orderIds: string[], newStatus: string, sendWhatsApp: boolean, note?: string) => Promise<void>;
  isUpdating: boolean;
}

const statusOptions = {
  confirmed: {
    label: 'Confirmar Pedidos',
    color: 'bg-blue-500 hover:bg-blue-600',
    icon: <CheckCircle className="w-4 h-4" />,
    description: 'Confirmar todos os pedidos selecionados',
    validFrom: ['pending']
  },
  preparing: {
    label: 'Iniciar Preparação',
    color: 'bg-purple-500 hover:bg-purple-600',
    icon: <Zap className="w-4 h-4" />,
    description: 'Iniciar preparação dos pedidos',
    validFrom: ['confirmed']
  },
  ready: {
    label: 'Marcar como Prontos',
    color: 'bg-green-500 hover:bg-green-600',
    icon: <CheckCircle className="w-4 h-4" />,
    description: 'Marcar pedidos como prontos para entrega',
    validFrom: ['preparing']
  },
  delivered: {
    label: 'Finalizar Entrega',
    color: 'bg-gray-600 hover:bg-gray-700',
    icon: <CheckCircle className="w-4 h-4" />,
    description: 'Finalizar entrega dos pedidos',
    validFrom: ['ready']
  },
  cancelled: {
    label: 'Cancelar Pedidos',
    color: 'bg-red-500 hover:bg-red-600',
    icon: <AlertTriangle className="w-4 h-4" />,
    description: 'Cancelar todos os pedidos selecionados',
    validFrom: ['pending', 'confirmed', 'preparing']
  }
};

export default function BatchUpdateModal({ orders, isOpen, onClose, onBatchUpdate, isUpdating }: BatchUpdateModalProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [note, setNote] = useState('');
  const [sendWhatsApp, setSendWhatsApp] = useState(true);

  // Resetar seleções quando o modal abrir
  React.useEffect(() => {
    if (isOpen) {
      setSelectedOrders([]);
      setSelectedStatus('');
      setNote('');
      setSendWhatsApp(true);
    }
  }, [isOpen]);

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.id));
    }
  };

  const getAvailableStatuses = () => {
    if (selectedOrders.length === 0) return [];
    
    // Pegar os status dos pedidos selecionados
    const selectedOrderStatuses = orders
      .filter(order => selectedOrders.includes(order.id))
      .map(order => order.status);
    
    // Encontrar status válidos para todos os pedidos selecionados
    const validStatuses = Object.entries(statusOptions).filter(([key, option]) => {
      return selectedOrderStatuses.every(status => option.validFrom.includes(status));
    });

    return validStatuses;
  };

  const handleBatchUpdate = async () => {
    if (selectedOrders.length === 0) {
      toast.error('Selecione pelo menos um pedido');
      return;
    }

    if (!selectedStatus) {
      toast.error('Selecione uma ação');
      return;
    }

    try {
      await onBatchUpdate(selectedOrders, selectedStatus, sendWhatsApp, note);
      onClose();
    } catch (error) {
      console.error('Erro na atualização em lote:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const availableStatuses = getAvailableStatuses();
  const selectedStatusInfo = selectedStatus ? statusOptions[selectedStatus as keyof typeof statusOptions] : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold">Atualização em Lote</div>
              <div className="text-sm text-muted-foreground">
                Selecione múltiplos pedidos para atualizar
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna Esquerda - Seleção de Pedidos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Pedidos ({orders.length})</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="flex items-center gap-2"
              >
                {selectedOrders.length === orders.length ? (
                  <>
                    <Square className="w-4 h-4" />
                    Desmarcar Todos
                  </>
                ) : (
                  <>
                    <CheckSquare className="w-4 h-4" />
                    Selecionar Todos
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedOrders.includes(order.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectOrder(order.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium truncate">
                          #{order.orderNumber || order.id.slice(-6)}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {formatCurrency(order.total)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.customer.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {order.customer.phone}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedOrders.length > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-blue-800">
                      {selectedOrders.length} pedido(s) selecionado(s)
                    </div>
                    <div className="text-sm font-bold text-blue-800">
                      Total: {formatCurrency(
                        orders
                          .filter(order => selectedOrders.includes(order.id))
                          .reduce((sum, order) => sum + order.total, 0)
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Coluna Direita - Ações */}
          <div className="space-y-6">
            {/* Ações Disponíveis */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Ações Disponíveis</Label>
              
              {selectedOrders.length === 0 ? (
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-6 text-center">
                    <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <div className="text-gray-600 font-medium">
                      Selecione pedidos para ver as ações disponíveis
                    </div>
                  </CardContent>
                </Card>
              ) : availableStatuses.length === 0 ? (
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-6 text-center">
                    <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                    <div className="text-yellow-800 font-medium">
                      Os pedidos selecionados têm status diferentes e não podem ser atualizados juntos
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {availableStatuses.map(([key, option]) => (
                    <Button
                      key={key}
                      onClick={() => setSelectedStatus(key)}
                      className={`w-full h-14 ${option.color} text-white flex items-center gap-3`}
                    >
                      {option.icon}
                      <div className="text-left">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs opacity-90">{option.description}</div>
                      </div>
                      {selectedStatus === key && (
                        <CheckSquare className="w-5 h-5 ml-auto" />
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Observações */}
            {selectedStatus && (
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Observações</Label>
                <Textarea
                  placeholder="Adicione uma observação sobre esta atualização em lote..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            {/* WhatsApp */}
            {selectedStatus && (
              <div className="space-y-4">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  Notificação WhatsApp
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="whatsapp-batch">Enviar notificação para clientes</Label>
                    <input
                      id="whatsapp-batch"
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
                        {selectedOrders.length} cliente(s) receberão a notificação automática.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Botões de Ação */}
            {selectedStatus && (
              <div className="space-y-3">
                <Button
                  onClick={handleBatchUpdate}
                  disabled={isUpdating}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  {isUpdating ? (
                    <>Processando...</>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      {selectedStatusInfo?.label}
                      <ArrowRight className="w-4 h-4 ml-auto" />
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
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}