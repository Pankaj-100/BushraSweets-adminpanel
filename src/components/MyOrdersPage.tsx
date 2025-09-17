import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Package, Clock, CheckCircle, XCircle, Eye, RefreshCw } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  date: string;
  deliveryFee: number;
  subtotal: number;
}

export function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem('customer-orders') || '[]');
    setOrders(storedOrders.sort((a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'preparing':
        return <Package className="h-4 w-4" />;
      case 'ready':
        return <CheckCircle className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
            Order History
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            My Orders
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Track your orders and view your purchase history
          </p>
          
          <div className="flex justify-center mt-6">
            <Button variant="outline" onClick={loadOrders}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Orders
            </Button>
          </div>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="text-center py-16">
              <CardContent>
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't placed any orders yet. Start exploring our delicious desserts!
                </p>
                <Button onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'desserts' }))}>
                  Browse Desserts
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Orders List */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Recent Orders</h2>
              <AnimatePresence>
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">
                              Order #{order.id.slice(-6)}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(order.date)}
                            </p>
                          </div>
                          <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items.slice(0, 2).map((item) => (
                            <div key={item.id} className="flex items-center gap-3 text-sm">
                              <div className="w-8 h-8 rounded overflow-hidden bg-muted">
                                <ImageWithFallback
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="flex-1">{item.name}</span>
                              <span className="text-muted-foreground">x{item.quantity}</span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-sm text-muted-foreground">
                              +{order.items.length - 2} more items
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-primary">
                            ${order.total.toFixed(2)}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Details */}
            <div className="lg:sticky lg:top-24 lg:h-fit">
              {selectedOrder ? (
                <motion.div
                  key={selectedOrder.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Order Details</span>
                        <Badge className={`${getStatusColor(selectedOrder.status)} flex items-center gap-1`}>
                          {getStatusIcon(selectedOrder.status)}
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-2">Order Information</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Order ID:</span>
                            <span>#{selectedOrder.id.slice(-6)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span>{formatDate(selectedOrder.date)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="capitalize">{selectedOrder.status}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-4">Items Ordered</h4>
                        <div className="space-y-3">
                          {selectedOrder.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                <ImageWithFallback
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-sm">{item.name}</h5>
                                <p className="text-xs text-muted-foreground">
                                  ${item.price.toFixed(2)} each
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-sm">x{item.quantity}</p>
                                <p className="text-xs text-muted-foreground">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${selectedOrder.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Delivery:</span>
                            <span>{selectedOrder.deliveryFee === 0 ? 'Free' : `$${selectedOrder.deliveryFee.toFixed(2)}`}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total:</span>
                            <span className="text-primary">${selectedOrder.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          {selectedOrder.status === 'pending' && "Your order is being reviewed. We'll confirm it shortly."}
                          {selectedOrder.status === 'confirmed' && "Your order has been confirmed and will be prepared soon."}
                          {selectedOrder.status === 'preparing' && "Your desserts are being lovingly prepared."}
                          {selectedOrder.status === 'ready' && "Your order is ready for pickup or delivery!"}
                          {selectedOrder.status === 'delivered' && "Your order has been delivered. Enjoy!"}
                          {selectedOrder.status === 'cancelled' && "This order has been cancelled."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card>
                  <CardContent className="text-center py-16">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select an Order</h3>
                    <p className="text-muted-foreground">
                      Click on any order to view its details
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}