import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { 
  ShoppingBag, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package, 
  Truck, 
  User,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface Order {
  id: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  subtotal: number;
  deliveryFee: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  date: string;
  deliveryInfo: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    specialInstructions?: string;
  };
  customerNotes?: string;
  adminNotes?: string;
}

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-700', label: 'Pending', icon: Clock },
  confirmed: { color: 'bg-blue-100 text-blue-700', label: 'Confirmed', icon: CheckCircle },
  preparing: { color: 'bg-purple-100 text-purple-700', label: 'Preparing', icon: Package },
  ready: { color: 'bg-green-100 text-green-700', label: 'Ready', icon: CheckCircle },
  delivered: { color: 'bg-green-100 text-green-700', label: 'Delivered', icon: Truck },
  cancelled: { color: 'bg-red-100 text-red-700', label: 'Cancelled', icon: XCircle }
};

export function AdminOrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load orders from localStorage
  const loadOrders = () => {
    setIsLoading(true);
    try {
      const savedOrders = localStorage.getItem('customer-orders');
      const ordersData = savedOrders ? JSON.parse(savedOrders) : [];
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.deliveryInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.deliveryInfo.phone.includes(searchTerm) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('customer-orders', JSON.stringify(updatedOrders));
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    
    toast.success(`Order ${orderId} status updated to ${statusConfig[newStatus].label}`);
  };

  const updateAdminNotes = (orderId: string, notes: string) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, adminNotes: notes } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('customer-orders', JSON.stringify(updatedOrders));
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, adminNotes: notes });
    }
    
    toast.success('Admin notes updated');
  };

  const getStatusStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };
    return stats;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = getStatusStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Orders Management</h2>
            <p className="text-muted-foreground">View and manage customer orders</p>
          </div>
          <Button onClick={loadOrders} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <ShoppingBag className="h-6 w-6 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Orders</div>
            </CardContent>
          </Card>
          
          {Object.entries(statusConfig).map(([status, config]) => (
            <Card key={status}>
              <CardContent className="p-4 text-center">
                <config.icon className="h-6 w-6 mx-auto mb-2" style={{ color: config.color.split(' ')[1].replace('text-', '') }} />
                <div className="text-2xl font-bold">{stats[status as keyof typeof stats]}</div>
                <div className="text-xs text-muted-foreground">{config.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders, customers, or items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    {Object.entries(statusConfig).map(([status, config]) => (
                      <SelectItem key={status} value={status}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Orders List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4"
      >
        <AnimatePresence>
          {filteredOrders.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {orders.length === 0 
                  ? 'Orders from your website will appear here' 
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {orders.length === 0 && (
                <Button onClick={loadOrders}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Orders
                </Button>
              )}
            </Card>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={statusConfig[order.status].color}>
                          {statusConfig[order.status].label}
                        </Badge>
                        <span className="font-semibold text-lg">${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{order.deliveryInfo.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{order.deliveryInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate max-w-xs">
                          {order.deliveryInfo.address}, {order.deliveryInfo.city}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Select
                          value={order.status}
                          onValueChange={(newStatus) => updateOrderStatus(order.id, newStatus as Order['status'])}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusConfig).map(([status, config]) => (
                              <SelectItem key={status} value={status}>
                                {config.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailsOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Order Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order Details - #{selectedOrder.id}</DialogTitle>
                <DialogDescription>
                  Manage order details and update status
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Order Date</Label>
                    <p className="text-sm">{formatDate(selectedOrder.date)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge className={`${statusConfig[selectedOrder.status].color} mt-1`}>
                      {statusConfig[selectedOrder.status].label}
                    </Badge>
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h4 className="font-medium mb-3">Customer Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>Name</Label>
                      <p>{selectedOrder.deliveryInfo.fullName}</p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p>{selectedOrder.deliveryInfo.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Delivery Address</Label>
                      <p>
                        {selectedOrder.deliveryInfo.address}<br/>
                        {selectedOrder.deliveryInfo.city}, {selectedOrder.deliveryInfo.zipCode}
                      </p>
                    </div>
                    {selectedOrder.deliveryInfo.specialInstructions && (
                      <div className="md:col-span-2">
                        <Label>Special Instructions</Label>
                        <p className="text-muted-foreground">{selectedOrder.deliveryInfo.specialInstructions}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-muted rounded-md"></div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">${item.price}/each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="border-t pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>{selectedOrder.deliveryFee === 0 ? 'Free' : `$${selectedOrder.deliveryFee.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between font-medium text-base pt-2 border-t">
                      <span>Total</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <Label htmlFor="adminNotes">Admin Notes</Label>
                  <Textarea
                    id="adminNotes"
                    placeholder="Add internal notes about this order..."
                    value={selectedOrder.adminNotes || ''}
                    onChange={(e) => setSelectedOrder({...selectedOrder, adminNotes: e.target.value})}
                    rows={3}
                  />
                  <Button
                    size="sm"
                    onClick={() => updateAdminNotes(selectedOrder.id, selectedOrder.adminNotes || '')}
                    className="mt-2"
                  >
                    Save Notes
                  </Button>
                </div>

                {/* Status Update */}
                <div>
                  <Label>Update Status</Label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(newStatus) => updateOrderStatus(selectedOrder.id, newStatus as Order['status'])}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([status, config]) => (
                        <SelectItem key={status} value={status}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}