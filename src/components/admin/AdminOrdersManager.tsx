import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { useGetOrdersCountQuery } from "../../store/orderApi";

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
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  useGetAllOrdersQuery, 
  useGetOrderByIdQuery, 
  useUpdateOrderStatusMutation 
} from '../../store/orderApi';

interface OrderItem {
  id: string;
  dessertName: string;
  price: number;
  quantity: number;
  itemTotal: number;
  Dessert: {
    dessertImages: string[];
    description: string;
  };
}

interface Order {
  id: string;
  subTotal: number;
  deliveryCharge: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  User: {
    name: string;
    email: string;
  };
  Address: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    instruction?: string;
  };
  OrderItems: OrderItem[];
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // API Queries and Mutations
  const { 
    data: ordersResponse, 
    isLoading, 
    error, 
    refetch 
  } = useGetAllOrdersQuery({ 
    page: currentPage, 
    limit: pageSize, 
    status: statusFilter !== 'all' ? statusFilter : '' 
  });
const { data: ordersCount, isLoading: countLoading } = useGetOrdersCountQuery();

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  // Get detailed order when selected
  const { data: detailedOrder } = useGetOrderByIdQuery(
    selectedOrder?.id || '', 
    { skip: !selectedOrder?.id }
  );

  const orders = ordersResponse?.orders || [];
  const pagination = ordersResponse?.pagination || { totalItems: 0, totalPages: 1, page: 1 };

  // Update selected order when detailed data is fetched
  useEffect(() => {
    if (detailedOrder && selectedOrder) {
      setSelectedOrder(detailedOrder.order);
    }
  }, [detailedOrder, selectedOrder]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      toast.success(`Order status updated to ${statusConfig[newStatus].label}`);
      refetch(); // Refresh the orders list
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleUpdateAdminNotes = async (orderId: string, notes: string) => {
    // Note: You'll need to add this endpoint to your API if you want to save admin notes
    toast.success('Admin notes updated (Note: Add API endpoint to persist notes)');
  };

const getStatusStats = (): {
  total: number;
  pending: number;
  confirmed: number;
  shipped: number;
  ready: number;
  preparing: number;
  delivered: number;
  cancelled: number;
} => {
  if (!ordersResponse?.orders || !ordersCount?.counts) {
    return {
      total: 0,
      pending: 0,
      confirmed: 0,
      shipped: 0,
      ready: 0,
      preparing: 0,
      delivered: 0,
      cancelled: 0
    };
  }

  // Use the counts from the ordersCount API if available
  if (ordersCount.counts) {
    return {
      total: ordersCount.counts.total,
      pending: ordersCount.counts.byStatus.pending || 0,
      confirmed: ordersCount.counts.byStatus.confirmed || 0,
      shipped: ordersCount.counts.byStatus.shipped || 0,
      ready: ordersCount.counts.byStatus.ready || 0,
      preparing: ordersCount.counts.byStatus.preparing || 0,
      delivered: ordersCount.counts.byStatus.delivered || 0,
      cancelled: ordersCount.counts.byStatus.cancelled || 0
    };
  }

  // // Fallback to calculating from orders list
  // const stats = {
  //   total: pagination.totalItems,
  //   pending: orders.filter(o => o.status === 'pending').length,
  //   confirmed: orders.filter(o => o.status === 'confirmed').length,
  //   shipped: orders.filter(o => o.status === 'shipped').length,
  //   ready: orders.filter(o => o.status === 'ready').length,
  //   delivered: orders.filter(o => o.status === 'delivered').length,
  //   cancelled: orders.filter(o => o.status === 'cancelled').length
  // };
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const stats = getStatusStats();

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Orders</h3>
          <p className="text-muted-foreground mb-4">
            Failed to load orders. Please try again.
          </p>
          <Button onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </Card>
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
          <Button onClick={refetch} variant="outline" className="flex items-center gap-2">
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
                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
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
              {/* <div className="w-full sm:w-32">
                <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Page size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="25">25 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
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
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : orders.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {statusFilter === 'all' ? 'No orders yet' : 'No orders match your filters'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {statusFilter === 'all' 
                  ? 'Orders from your website will appear here' 
                  : 'Try adjusting your filter criteria'
                }
              </p>
              <Button onClick={refetch}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Orders
              </Button>
            </Card>
          ) : (
            <>
              {orders.map((order: Order, index: number) => (
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
                    <h3 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
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
                    <span className="text-sm">{order.Address.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{order.Address.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{order.OrderItems.length} item{order.OrderItems.length !== 1 ? 's' : ''}</span>
                  </div>
                  </div>

                  <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate max-w-xs">
                    {order.Address.address}, {order.Address.city}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select
                    value={order.status}
                    onValueChange={(newStatus: string) => handleUpdateOrderStatus(order.id, newStatus as Order['status'])}
                    >
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([status, config]: [string, typeof statusConfig[keyof typeof statusConfig]]) => (
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
              ))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, pagination.totalItems)} of {pagination.totalItems} orders
                </div>
                <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i: number) => {
                  let pageNum: number;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="w-8 h-8 p-0"
                    >
                    {pageNum}
                    </Button>
                  );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
                </div>
              </div>
              )}
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Order Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order Details - #{selectedOrder.id.slice(0, 8)}</DialogTitle>
                <DialogDescription>
                  Manage order details and update status
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Order Date</Label>
                    <p className="text-sm">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge className={`${statusConfig[selectedOrder.status].color} mt-1`}>
                      {statusConfig[selectedOrder.status].label}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Payment Status</Label>
                    <Badge className="bg-gray-100 text-gray-700 mt-1">
                      {selectedOrder.paymentStatus}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Updated</Label>
                    <p className="text-sm">{formatDate(selectedOrder.updatedAt)}</p>
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h4 className="font-medium mb-3">Customer Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>Name</Label>
                      <p>{selectedOrder.Address.fullName}</p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p>{selectedOrder.Address.phone}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p>{selectedOrder?.User?.email}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Delivery Address</Label>
                      <p>
                        {selectedOrder.Address.address}<br/>
                        {selectedOrder.Address.city}, {selectedOrder.Address.zip}
                      </p>
                    </div>
                    {selectedOrder.Address.instruction && (
                      <div className="md:col-span-2">
                        <Label>Special Instructions</Label>
                        <p className="text-muted-foreground">{selectedOrder.Address.instruction}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.OrderItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {item.Dessert.dessertImages?.[0] ? (
                            <img 
                              src={item.Dessert.dessertImages[0]} 
                              alt={item.dessertName}
                              className="w-12 h-12 bg-muted rounded-md object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded-md"></div>
                          )}
                          <div>
                            <p className="font-medium">{item.dessertName}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            {item.Dessert.description && (
                              <p className="text-xs text-muted-foreground mt-1">{item.Dessert.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${item.itemTotal.toFixed(2)}</p>
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
                      <span>${selectedOrder.subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>{selectedOrder.deliveryCharge === 0 ? 'Free' : `$${selectedOrder.deliveryCharge.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between font-medium text-base pt-2 border-t">
                      <span>Total</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Admin Notes */}
                {/* <div>
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
                    onClick={() => handleUpdateAdminNotes(selectedOrder.id, selectedOrder.adminNotes || '')}
                    className="mt-2"
                  >
                    Save Notes
                  </Button>
                </div> */}

                {/* Status Update */}
                <div>
                  <Label>Update Status</Label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(newStatus:any) => handleUpdateOrderStatus(selectedOrder.id, newStatus as Order['status'])}
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