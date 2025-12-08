import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
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
  Search,
  Filter,
  RefreshCw,
  X,
  Loader2
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
  unitPrice: number;
  quantity: number;
  portionSize: string;
  itemTotal: number;
  Dessert: {
    dessertName: string;
    dessertImages: string[];
    description: string;
  };
}

interface Order {
  id: string;
  invoiceNumber: string;
  subTotal: number;
  deliveryCharge: number;
  gstAmount: number;
  gstPercentage: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  User: {
    name: string;
    email: string;
  };
  deliveryAddress: {
    fullName: string;
    phone: string;
    address: string;
    email: string;
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
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const prevSelectedOrderIdRef = useRef<string | null>(null);

  // API Queries and Mutations
  const { 
    data: ordersResponse, 
    isLoading, 
    error, 
    refetch 
  } = useGetAllOrdersQuery({ 
    page: currentPage, 
    limit: pageSize, 
    status: statusFilter !== 'all' ? statusFilter : '',
    search: debouncedSearchTerm
  });
  
  const { data: ordersCount, isLoading: countLoading } = useGetOrdersCountQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  // Get detailed order when modal is open and selectedOrderId is set
  const { 
    data: detailedOrderData, 
    isLoading: isDetailedLoading,
    isFetching: isDetailedFetching 
  } = useGetOrderByIdQuery(
    selectedOrderId || '', 
    { 
      skip: !selectedOrderId,
      refetchOnMountOrArgChange: true // This ensures fresh data when opening modal
    }
  );

  const orders = ordersResponse?.orders || [];
  const pagination = ordersResponse?.pagination || { totalItems: 0, totalPages: 1, page: 1 };
  const selectedOrder = detailedOrderData?.order || null;

  // Reset selectedOrderId when modal closes
  const handleDialogOpenChange = (open: boolean) => {
    setIsDetailsOpen(open);
    if (!open) {
      // Clear the selected order after a short delay to prevent flash of old data
      setTimeout(() => {
        setSelectedOrderId(null);
        prevSelectedOrderIdRef.current = null;
      }, 300);
    }
  };

  // Handle view order details
  const handleViewOrderDetails = (order: Order) => {
    // Store previous ID to track changes
    prevSelectedOrderIdRef.current = selectedOrderId;
    
    // Set new order ID
    setSelectedOrderId(order.id);
    
    // Open modal
    setIsDetailsOpen(true);
  };

  // Debounced search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

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

    if (ordersCount.counts) {
      return {
        total: ordersCount?.counts?.total || 0,
        pending: ordersCount?.counts?.byStatus?.pending || 0,
        confirmed: ordersCount?.counts?.byStatus?.confirmed || 0,
        shipped: ordersCount?.counts?.byStatus?.shipped || 0,
        ready: ordersCount?.counts?.byStatus?.ready || 0,
        preparing: ordersCount?.counts?.byStatus?.preparing || 0,
        delivered: ordersCount?.counts?.byStatus?.delivered || 0,
        cancelled: ordersCount?.counts?.byStatus?.cancelled || 0
      };
    }

    // Fallback to calculating from orders list
    const stats = {
      total: pagination.totalItems,
      pending: orders.filter((o: Order) => o.status === 'pending').length,
      confirmed: orders.filter((o: Order) => o.status === 'confirmed').length,
      shipped: 0,
      ready: orders.filter((o: Order) => o.status === 'ready').length,
      preparing: orders.filter((o: Order) => o.status === 'preparing').length,
      delivered: orders.filter((o: Order) => o.status === 'delivered').length,
      cancelled: orders.filter((o: Order) => o.status === 'cancelled').length
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        <Button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3"
        >
          Prev
        </Button>

        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
          let pageNum;
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
              onClick={() => handlePageChange(pageNum)}
              variant={pageNum === currentPage ? "default" : "outline"}
              className="px-3"
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          onClick={() => handlePageChange(Math.min(currentPage + 1, pagination.totalPages))}
          disabled={currentPage === pagination.totalPages}
          className="px-3"
        >
          Next
        </Button>
      </div>
    );
  };

  const stats = getStatusStats();
  const hasActiveFilters = searchTerm || statusFilter !== 'all';
  const isModalLoading = (isDetailedLoading || isDetailedFetching) && selectedOrderId !== null;

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
            <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
            <p className="text-muted-foreground">
              Manage and track all customer orders
            </p>
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
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </CardContent>
          </Card>
          
          {Object.entries(statusConfig).map(([status, config]) => (
            <Card key={status}>
              <CardContent className="p-4 text-center">
                <config.icon className={`h-6 w-6 mx-auto mb-2 ${config.color.split(' ')[1]}`} />
                <div className="text-2xl font-bold">{stats[status as keyof typeof stats]}</div>
                <div className="text-sm text-muted-foreground">{config.label}</div>
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
                    placeholder="Search by Order ID (Invoice Number)..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 text-base"
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
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
            </div>
            
            {/* Active Filters Indicator */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span>Active filters:</span>
                  {searchTerm && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Search: "{searchTerm}"
                      <button onClick={clearSearch} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {statusFilter !== 'all' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Status: {statusConfig[statusFilter as keyof typeof statusConfig]?.label}
                      <button 
                        onClick={() => setStatusFilter('all')} 
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllFilters}
                  className="h-8 text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}
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
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Loading orders...</p>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {hasActiveFilters ? 'No orders match your search/filters' : 'No orders yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm 
                  ? `No orders found for Order ID: "${searchTerm}"` 
                  : statusFilter !== 'all'
                  ? `No orders with status: ${statusConfig[statusFilter as keyof typeof statusConfig]?.label}`
                  : 'Orders from your website will appear here'
                }
              </p>
              {hasActiveFilters && (
                <Button onClick={clearAllFilters}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </Card>
          ) : (
            <>
              {/* Results Count */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Showing {orders.length} of {pagination.totalItems} orders
                  {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
                  {statusFilter !== 'all' && ` with status: ${statusConfig[statusFilter as keyof typeof statusConfig]?.label}`}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Page {currentPage} of {pagination.totalPages}</span>
                </div>
              </div>

              {orders.map((order: Order, index: number) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-xl">Order ID: {order.invoiceNumber}</h3>
                          <p className="text-md text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={statusConfig[order.status].color}>
                            {statusConfig[order.status].label}
                          </Badge>
                          <span className="font-semibold text-xl">${order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-lg">{order.deliveryAddress.fullName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-lg">{order.deliveryAddress.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-lg">{order.OrderItems.length} item{order.OrderItems.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate max-w-xs text-lg">
                            {order.deliveryAddress.address}, {order.deliveryAddress.city}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Select
                            value={order.status}
                            onValueChange={(newStatus: string) => handleUpdateOrderStatus(order.id, newStatus as Order['status'])}
                          >
                            <SelectTrigger className="w-40">
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
                            size="lg"
                            variant="outline"
                            onClick={() => handleViewOrderDetails(order)}
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
              {renderPagination()}
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Order Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {isModalLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading order details...</p>
              </div>
            </div>
          ) : selectedOrder ? (
            <>
              <DialogHeader>
                <DialogTitle>Order Details - Order ID: {selectedOrder.invoiceNumber}</DialogTitle>
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
                      <p>{selectedOrder.deliveryAddress.fullName}</p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p>{selectedOrder.deliveryAddress.phone}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p>{selectedOrder?.deliveryAddress?.email}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Delivery Address</Label>
                      <p>
                        {selectedOrder.deliveryAddress.address}<br/>
                        {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.zip}
                      </p>
                    </div>
                    {selectedOrder.deliveryAddress.instruction && (
                      <div className="md:col-span-2">
                        <Label>Special Instructions</Label>
                        <p className="text-muted-foreground">{selectedOrder.deliveryAddress.instruction}</p>
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
                              src={`https://bushra-sweets.ap-south-1.storage.onantryk.com/${item.Dessert.dessertImages[0]}`} 
                              alt={item.Dessert.dessertName}
                              className="w-12 h-12 bg-muted rounded-md object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded-md"></div>
                          )}
                          <div>
                            <p className="font-medium">{item.Dessert.dessertName}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            <p className="text-sm text-muted-foreground">Serving: {item.portionSize}</p>
                            {item.Dessert.description && (
                              <p className="text-xs text-muted-foreground mt-1">{item.Dessert.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="px-2 text-right">
                          <p className="font-medium">${item.itemTotal.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">${item.unitPrice}/each</p>
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
                    <div className="flex justify-between">
                      <span>GST ({selectedOrder.gstPercentage === 0 ? 'Free' : `${selectedOrder.gstPercentage.toFixed(2)}%`})</span>
                      <span>{selectedOrder.gstAmount === 0 ? 'Free' : `$${selectedOrder.gstAmount.toFixed(2)}`}</span>
                    </div>
                    
                    <div className="flex justify-between font-medium text-base pt-2 border-t">
                      <span>Total</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <Label>Update Status</Label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(newStatus: Order['status']) => 
                      handleUpdateOrderStatus(selectedOrder.id, newStatus)
                    }
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
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Package className="h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No order data available</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}