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
import { Progress } from '@/components/ui/progress';
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
  FileText,
  TrendingUp,
  TrendingDown,
  Timer,
  Star,
  AlertTriangle,
  Bell,
  Play,
  Pause,
  FastForward,
  DollarSign,
  ShoppingBag,
  Users2,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Edit
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
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
  preparationTime?: number;
  priority?: 'high' | 'normal' | 'low';
}

const statusMap: { [key: string]: { 
  label: string; 
  color: string; 
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
} } = {
  pending: {
    label: 'Pendente',
    color: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: <Clock className="w-4 h-4" />
  },
  confirmed: {
    label: 'Confirmado',
    color: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: <CheckCircle className="w-4 h-4" />
  },
  preparing: {
    label: 'Em Preparação',
    color: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: <Package className="w-4 h-4" />
  },
  ready: {
    label: 'Pronto',
    color: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: <Truck className="w-4 h-4" />
  },
  delivered: {
    label: 'Entregue',
    color: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: <CheckCircle className="w-4 h-4" />
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: <XCircle className="w-4 h-4" />
  }
};

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'total' | 'status'>('date');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week'>('today');
  
  // Estados para os novos modais
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

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
        toast({
          title: "Erro",
          description: "Erro ao carregar pedidos",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar pedidos",
        variant: "destructive"
      });
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
        toast({
          title: "Sucesso",
          description: "Status atualizado com sucesso"
        });
        fetchOrders();
        setSelectedOrder(null);
        setStatusModalOpen(false);
      } else {
        const error = await response.json();
        toast({
          title: "Erro",
          description: error.error || "Erro ao atualizar status",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive"
      });
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
        toast({
          title: "Sucesso",
          description: `${orderIds.length} pedido(s) atualizado(s) com sucesso`
        });
      } else {
        toast({
          title: "Parcial",
          description: `${orderIds.length - failures.length} atualizados, ${failures.length} falharam`,
          variant: "destructive"
        });
      }
      
      fetchOrders();
      setBatchModalOpen(false);
      setSelectedOrders([]);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro na atualização em lote",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingStatus(false);
    }
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

  const handleQuickStatusUpdate = (order: Order, newStatus: string) => {
    setSelectedOrder(order);
    updateOrderStatus(order.id, newStatus, true);
  };

  // Filtrar pedidos
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.orderNumber && order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    let matchesTime = true;
    if (timeFilter === 'today') {
      const today = new Date().toDateString();
      const orderDate = new Date(order.createdAt).toDateString();
      matchesTime = today === orderDate;
    } else if (timeFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesTime = new Date(order.createdAt) >= weekAgo;
    }
    
    return matchesSearch && matchesStatus && matchesTime;
  });

  // Ordenar pedidos
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'total':
        return b.total - a.total;
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
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

  const getOrderAge = (createdAt: string) => {
    const now = new Date();
    const orderTime = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}min`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ${diffInMinutes % 60}min`;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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
    totalValue: filteredOrders.reduce((sum, order) => sum + order.total, 0),
    avgOrderValue: filteredOrders.length > 0 ? filteredOrders.reduce((sum, order) => sum + order.total, 0) / filteredOrders.length : 0
  };

  const completionRate = stats.total > 0 ? ((stats.delivered / stats.total) * 100).toFixed(1) : '0';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header com Gradiente */}
      <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent"></div>
        <div className="relative">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Gestão de Pedidos</h1>
              <p className="text-gray-300 text-lg">Gerencie todos os pedidos da pizzaria em tempo real</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Sistema Online</span>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
                  <Activity className="w-3 h-3 mr-1" />
                  {stats.total} Pedidos Ativos
                </Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setBatchModalOpen(true)}
                disabled={selectedOrders.length === 0}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                Atualização em Lote
                {selectedOrders.length > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-yellow-500 text-black">
                    {selectedOrders.length}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm" onClick={fetchOrders} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard de Estatísticas Melhorado */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total de Pedidos</p>
                <p className="text-3xl font-bold">{stats.total}</p>
                <p className="text-blue-200 text-xs mt-1">Últimas 24h</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Pendentes</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Timer className="w-3 h-3 text-yellow-200" />
                  <span className="text-yellow-200 text-xs">Aguardando</span>
                </div>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Em Preparação</p>
                <p className="text-3xl font-bold">{stats.preparing}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Play className="w-3 h-3 text-purple-200" />
                  <span className="text-purple-200 text-xs">Cozinhando</span>
                </div>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Entregues</p>
                <p className="text-3xl font-bold">{stats.delivered}</p>
                <p className="text-green-200 text-xs mt-1">{completionRate}% taxa</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Receita Total</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-indigo-200" />
                  <span className="text-indigo-200 text-xs">Hoje</span>
                </div>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium">Ticket Médio</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.avgOrderValue)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <BarChart3 className="w-3 h-3 text-pink-200" />
                  <span className="text-pink-200 text-xs">Por pedido</span>
                </div>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Target className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros Avançados */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome do cliente, ID ou número do pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all" className="text-white">Todos os status</SelectItem>
                  {Object.entries(statusMap).map(([key, value]) => (
                    <SelectItem key={key} value={key} className="text-white">
                      <div className="flex items-center gap-2">
                        {value.icon}
                        {value.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={timeFilter} onValueChange={(value: 'all' | 'today' | 'week') => setTimeFilter(value)}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="today" className="text-white">Hoje</SelectItem>
                  <SelectItem value="week" className="text-white">Última semana</SelectItem>
                  <SelectItem value="all" className="text-white">Todos</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(value: 'date' | 'total' | 'status') => setSortBy(value)}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="date" className="text-white">Data</SelectItem>
                  <SelectItem value="total" className="text-white">Valor</SelectItem>
                  <SelectItem value="status" className="text-white">Status</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex bg-gray-800 rounded-md p-1">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3"
                >
                  <FileText className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pedidos Melhorada */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-yellow-400" />
            Pedidos Ativos ({sortedOrders.length})
            {stats.totalValue > 0 && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
                Total: {formatCurrency(stats.totalValue)}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              {selectedOrders.length === sortedOrders.length ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Desmarcar Todos
                </>
              ) : (
                <>
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Selecionar Todos
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sortedOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-400 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros ou aguardar novos pedidos.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedOrders.map((order) => (
                <Card key={order.id} className={`bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-200 ${selectedOrders.includes(order.id) ? 'ring-2 ring-yellow-500' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          className="mt-1"
                        />
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-white font-bold text-lg">
                              #{order.orderNumber || order.id.slice(-6)}
                            </span>
                            <Badge className={`${statusMap[order.status].color} border-0`}>
                              {statusMap[order.status].icon}
                              <span className="ml-1">{statusMap[order.status].label}</span>
                            </Badge>
                            {order.priority && (
                              <Badge className={`${getPriorityColor(order.priority)} text-xs`}>
                                <Star className="w-3 h-3 mr-1" />
                                Prioridade {order.priority === 'high' ? 'Alta' : order.priority === 'normal' ? 'Normal' : 'Baixa'}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-yellow-400" />
                              <span className="font-medium">{order.customer.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-400" />
                              <span>{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Timer className="w-4 h-4 text-green-400" />
                              <span className="font-medium">{getOrderAge(order.createdAt)} atrás</span>
                            </div>
                            {order.customer.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-purple-400" />
                                <span>{order.customer.phone}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-400">
                            <span className="font-medium">Itens: </span>
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
                          
                          {order.customer.address && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <MapPin className="w-4 h-4 text-red-400" />
                              <span className="truncate">{order.customer.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">{formatCurrency(order.total)}</div>
                          {order.preparationTime && (
                            <div className="text-sm text-gray-400">
                              <Timer className="w-3 h-3 inline mr-1" />
                              {order.preparationTime}min
                            </div>
                          )}
                        </div>
                        
                        {/* Botões de Ação Rápida Melhorados */}
                        <div className="flex flex-col gap-2 min-w-fit">
                          {order.status === 'pending' && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => handleQuickStatusUpdate(order, 'confirmed')}
                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Confirmar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleQuickStatusUpdate(order, 'cancelled')}
                                className="text-xs px-2 py-1"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Cancelar
                              </Button>
                            </div>
                          )}
                          {order.status === 'confirmed' && (
                            <Button
                              size="sm"
                              onClick={() => handleQuickStatusUpdate(order, 'preparing')}
                              className="bg-purple-500 hover:bg-purple-600 text-white text-xs px-2 py-1"
                            >
                              <Package className="w-3 h-3 mr-1" />
                              Preparar
                            </Button>
                          )}
                          {order.status === 'preparing' && (
                            <Button
                              size="sm"
                              onClick={() => handleQuickStatusUpdate(order, 'ready')}
                              className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1"
                            >
                              <Truck className="w-3 h-3 mr-1" />
                              Pronto
                            </Button>
                          )}
                          {order.status === 'ready' && (
                            <Button
                              size="sm"
                              onClick={() => handleQuickStatusUpdate(order, 'delivered')}
                              className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-2 py-1"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Entregue
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setDetailsModalOpen(true);
                            }}
                            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 text-xs px-2 py-1"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Detalhes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-yellow-400" />
              Detalhes do Pedido
              {selectedOrder && (
                <Badge className={`${statusMap[selectedOrder.status].color} border-0 ml-2`}>
                  #{selectedOrder.orderNumber || selectedOrder.id.slice(-6)}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Informações do Cliente */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-yellow-400 mb-3">Informações do Cliente</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Nome:</span>
                      <p className="font-medium">{selectedOrder.customer.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Telefone:</span>
                      <p className="font-medium">{selectedOrder.customer.phone}</p>
                    </div>
                    {selectedOrder.customer.address && (
                      <div className="col-span-2">
                        <span className="text-gray-400">Endereço:</span>
                        <p className="font-medium">{selectedOrder.customer.address}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Itens do Pedido */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-yellow-400 mb-3">Itens do Pedido</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                        <span>{item.quantity}x {item.product.name}</span>
                        <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-700 pt-2 mt-3">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-yellow-400">{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Observações */}
              {selectedOrder.note && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-yellow-400 mb-2">Observações</h4>
                    <p className="text-sm text-gray-300">{selectedOrder.note}</p>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setDetailsModalOpen(false)}
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  Fechar
                </Button>
                <Button 
                  onClick={() => {
                    setDetailsModalOpen(false);
                    setSelectedOrder(selectedOrder);
                    setStatusModalOpen(true);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
        orders={sortedOrders.filter(order => selectedOrders.includes(order.id))}
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
    </div>
  );
}