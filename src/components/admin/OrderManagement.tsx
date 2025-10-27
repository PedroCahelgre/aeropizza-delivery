'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Clock, 
  CheckCircle, 
  Package, 
  Truck, 
  XCircle,
  MessageCircle,
  Eye,
  Search,
  Filter,
  Download,
  Zap,
  CheckSquare,
  Square,
  ArrowRight,
  RefreshCw,
  MoreVertical,
  Phone,
  MapPin,
  User,
  Calendar,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import StatusUpdateModal from './StatusUpdateModal';
import BatchUpdateModal from './BatchUpdateModal';
import KeyboardShortcuts, { KeyboardShortcutsHelp } from './KeyboardShortcuts';

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
  orderNumber?: string;
}

const statusMap: { [key: string]: { label: string; color: string; icon: React.ReactNode } } = {
  pending: {
    label: 'Pendente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: <Clock className="w-4 h-4" />
  },
  confirmed: {
    label: 'Confirmado',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <CheckCircle className="w-4 h-4" />
  },
  preparing: {
    label: 'Em Preparação',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <Package className="w-4 h-4" />
  },
  ready: {
    label: 'Pronto',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: <Truck className="w-4 h-4" />
  },
  delivered: {
    label: 'Entregue',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: <CheckCircle className="w-4 h-4" />
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: <XCircle className="w-4 h-4" />
  }
};

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [newStatus, setNewStatus] = useState('');
  
  // Estados para os novos modais
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        toast.error('Erro ao carregar pedidos');
      }
    } catch (error) {
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, sendWhatsApp: boolean = false, note?: string) => {
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status,
          sendWhatsAppNotification: sendWhatsApp,
          note
        }),
      });

      if (response.ok) {
        toast.success('Status atualizado com sucesso');
        fetchOrders();
        setSelectedOrder(null);
        setStatusModalOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao atualizar status');
      }
    } catch (error) {
      toast.error('Erro ao atualizar status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const batchUpdateOrders = async (orderIds: string[], status: string, sendWhatsApp: boolean = false, note?: string) => {
    setIsUpdatingStatus(true);
    try {
      const promises = orderIds.map(orderId => 
        fetch(`/api/admin/orders/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            status,
            sendWhatsAppNotification: sendWhatsApp,
            note
          }),
        })
      );

      const results = await Promise.all(promises);
      const failures = results.filter(result => !result.ok);
      
      if (failures.length === 0) {
        toast.success(`${orderIds.length} pedido(s) atualizado(s) com sucesso`);
      } else {
        toast.warning(`${orderIds.length - failures.length} atualizados, ${failures.length} falharam`);
      }
      
      fetchOrders();
      setBatchModalOpen(false);
      setSelectedOrders([]);
    } catch (error) {
      toast.error('Erro na atualização em lote');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const sendWhatsAppMessage = async (orderId: string, message: string) => {
    setIsSendingWhatsApp(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        toast.success('Mensagem WhatsApp enviada com sucesso');
        setWhatsappMessage('');
        fetchOrders();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao enviar mensagem');
      }
    } catch (error) {
      toast.error('Erro ao enviar mensagem');
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  const handleQuickStatusUpdate = (order: Order, newStatus: string) => {
    setSelectedOrder(order);
    setNewStatus(newStatus);
    updateOrderStatus(order.id, newStatus, true);
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.orderNumber && order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  // Calcular estatísticas
  const stats = {
    total: filteredOrders.length,
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    confirmed: filteredOrders.filter(o => o.status === 'confirmed').length,
    preparing: filteredOrders.filter(o => o.status === 'preparing').length,
    ready: filteredOrders.filter(o => o.status === 'ready').length,
    delivered: filteredOrders.filter(o => o.status === 'delivered').length,
    cancelled: filteredOrders.filter(o => o.status === 'cancelled').length,
    totalValue: filteredOrders.reduce((sum, order) => sum + order.total, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Pedidos</h1>
          <p className="text-muted-foreground">Gerencie todos os pedidos da pizzaria</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setBatchModalOpen(true)}
            disabled={selectedOrders.length === 0}
            className="flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            Atualização em Lote
            {selectedOrders.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {selectedOrders.length}
              </Badge>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" onClick={fetchOrders}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Confirmados</p>
                <p className="text-2xl font-bold text-blue-800">{stats.confirmed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Preparando</p>
                <p className="text-2xl font-bold text-purple-800">{stats.preparing}</p>
              </div>
              <Package className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Prontos</p>
                <p className="text-2xl font-bold text-green-800">{stats.ready}</p>
              </div>
              <Truck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Entregues</p>
                <p className="text-2xl font-bold text-gray-800">{stats.delivered}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Cancelados</p>
                <p className="text-2xl font-bold text-red-800">{stats.cancelled}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome do cliente, ID ou número do pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  {Object.entries(statusMap).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pedidos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Pedidos ({filteredOrders.length})
            {stats.totalValue > 0 && (
              <Badge variant="outline" className="ml-2">
                Total: {formatCurrency(stats.totalValue)}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="flex items-center gap-2"
            >
              {selectedOrders.length === filteredOrders.length ? (
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
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando pedidos...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum pedido encontrado com os filtros atuais.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className={`border rounded-lg p-4 space-y-4 transition-all ${
                  selectedOrders.includes(order.id) 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        className="mt-1"
                      />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            #{order.orderNumber || order.id.slice(-6)}
                          </span>
                          <Badge className={statusMap[order.status].color}>
                            {statusMap[order.status].icon}
                            <span className="ml-1">{statusMap[order.status].label}</span>
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {order.customer.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(order.createdAt)}
                            </span>
                            {order.customer.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {order.customer.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{formatCurrency(order.total)}</span>
                      
                      {/* Botões de Ação Rápida */}
                      <div className="flex items-center gap-1">
                        {order.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleQuickStatusUpdate(order, 'confirmed')}
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Confirmar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleQuickStatusUpdate(order, 'cancelled')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancelar
                            </Button>
                          </>
                        )}
                        {order.status === 'confirmed' && (
                          <Button
                            size="sm"
                            onClick={() => handleQuickStatusUpdate(order, 'preparing')}
                            className="bg-purple-500 hover:bg-purple-600 text-white"
                          >
                            <Package className="w-4 h-4 mr-1" />
                            Preparar
                          </Button>
                        )}
                        {order.status === 'preparing' && (
                          <Button
                            size="sm"
                            onClick={() => handleQuickStatusUpdate(order, 'ready')}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <Truck className="w-4 h-4 mr-1" />
                            Pronto
                          </Button>
                        )}
                        {order.status === 'ready' && (
                          <Button
                            size="sm"
                            onClick={() => handleQuickStatusUpdate(order, 'delivered')}
                            className="bg-gray-600 hover:bg-gray-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Entregue
                          </Button>
                        )}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setStatusModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Detalhes
                      </Button>
                    </div>
                  </div>
                  
                  {/* Resumo dos itens */}
                  <div className="text-sm text-muted-foreground">
                    {order.items.slice(0, 3).map((item, index) => (
                      <span key={index}>
                        {item.quantity}x {item.product.name}
                        {index < Math.min(order.items.length - 1, 2) && ', '}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span> +{order.items.length - 3} itens</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Atualização de Status */}
      <StatusUpdateModal
        order={selectedOrder}
        isOpen={statusModalOpen}
        onClose={() => {
          setStatusModalOpen(false);
          setSelectedOrder(null);
        }}
        onUpdate={updateOrderStatus}
        isUpdating={isUpdatingStatus}
      />

      {/* Modal de Atualização em Lote */}
      <BatchUpdateModal
        orders={filteredOrders.filter(order => selectedOrders.includes(order.id))}
        isOpen={batchModalOpen}
        onClose={() => {
          setBatchModalOpen(false);
          setSelectedOrders([]);
        }}
        onBatchUpdate={batchUpdateOrders}
        isUpdating={isUpdatingStatus}
      />

      {/* Atalhos de Teclado */}
      <KeyboardShortcuts
        onRefresh={fetchOrders}
        onBatchUpdate={() => selectedOrders.length > 0 && setBatchModalOpen(true)}
        onSelectAll={handleSelectAll}
        onSearch={() => {
          const searchInput = document.querySelector('input[placeholder*="Buscar"]') as HTMLInputElement;
          if (searchInput) searchInput.focus();
        }}
      />

      {/* Ajuda de Atalhos */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <KeyboardShortcutsHelp />
        </CardContent>
      </Card>
    </div>
  );
}