import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { X, Plus, Minus, ShoppingBag, CreditCard, Truck, Clock, MapPin, User, Phone } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    specialInstructions: ''
  });

  const handleDeliveryInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Phone number validation - only allow numbers, spaces, hyphens, and parentheses
    if (name === 'phone') {
      const phoneRegex = /^[0-9\s\-\(\)\+]*$/;
      if (!phoneRegex.test(value)) {
        return; // Don't update if invalid characters
      }
    }
    
    setDeliveryInfo(prev => ({ ...prev, [name]: value }));
  };

  const validateDeliveryInfo = () => {
    if (!deliveryInfo.fullName.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    if (!deliveryInfo.phone.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }
    // Validate phone number format
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(deliveryInfo.phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    if (!deliveryInfo.address.trim()) {
      toast.error('Please enter your delivery address');
      return false;
    }
    if (!deliveryInfo.city.trim()) {
      toast.error('Please enter your city');
      return false;
    }
    if (!deliveryInfo.zipCode.trim()) {
      toast.error('Please enter your ZIP code');
      return false;
    }
    return true;
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to place an order');
      return;
    }

    if (!validateDeliveryInfo()) {
      setShowAddressForm(true);
      return;
    }

    setIsCheckingOut(true);
    
    // Create mock order with delivery information
    const order = {
      id: Date.now().toString(),
      items: [...items],
      total: grandTotal,
      status: 'pending',
      date: new Date().toISOString(),
      deliveryFee,
      subtotal: total,
      deliveryInfo: { ...deliveryInfo }
    };

    // Store order in localStorage for demo purposes
    const existingOrders = JSON.parse(localStorage.getItem('customer-orders') || '[]');
    localStorage.setItem('customer-orders', JSON.stringify([...existingOrders, order]));

    // Simulate checkout process
    setTimeout(() => {
      toast.success('Order placed successfully! You will receive a confirmation email shortly.');
      clearCart();
      setIsCheckingOut(false);
      setShowAddressForm(false);
      onClose();
    }, 2000);
  };

  const handleSaveAddress = () => {
    if (validateDeliveryInfo()) {
      setShowAddressForm(false);
      toast.success('Address saved successfully');
    }
  };

  const deliveryFee = total >= 50 ? 0 : 8.99;
  const grandTotal = total + deliveryFee;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="flex-shrink-0 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5" />
            Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col flex-1 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">Empty Cart</h3>
                <p className="text-sm text-muted-foreground mb-4">Add delicious desserts!</p>
                <Button onClick={onClose} size="sm">Continue Shopping</Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items - Scrollable */}
              <div className="flex-1 overflow-y-auto py-3 pr-2">
                <div className="space-y-3">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="border-0 shadow-sm bg-muted/20">
                          <CardContent className="p-3">
                            <div className="flex gap-3">
                              {/* Product Image */}
                              <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                <ImageWithFallback
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              
                              {/* Product Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                  <h4 className="text-sm font-medium leading-tight truncate pr-2">
                                    {item.name}
                                  </h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive flex-shrink-0"
                                    onClick={() => removeItem(item.id)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                                
                                {/* Quantity and Price Controls */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-6 w-6 p-0 rounded-sm"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                      <Minus className="h-2 w-2" />
                                    </Button>
                                    <span className="w-6 text-center text-xs font-medium">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-6 w-6 p-0 rounded-sm"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                      <Plus className="h-2 w-2" />
                                    </Button>
                                  </div>
                                  
                                  <div className="text-right">
                                    <div className="text-sm font-medium text-primary">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Delivery Address Form */}
              <AnimatePresence>
                {showAddressForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t pt-3 mb-3"
                  >
                    <Card className="border-0 shadow-sm bg-accent/10">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Delivery Address
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-0">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="fullName" className="text-xs">Full Name *</Label>
                            <Input
                              id="fullName"
                              name="fullName"
                              value={deliveryInfo.fullName}
                              onChange={handleDeliveryInfoChange}
                              placeholder="Your name"
                              className="h-8 text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone" className="text-xs">Phone *</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={deliveryInfo.phone}
                              onChange={handleDeliveryInfoChange}
                              placeholder="(555) 123-4567"
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="address" className="text-xs">Address *</Label>
                          <Input
                            id="address"
                            name="address"
                            value={deliveryInfo.address}
                            onChange={handleDeliveryInfoChange}
                            placeholder="Street address"
                            className="h-8 text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="city" className="text-xs">City *</Label>
                            <Input
                              id="city"
                              name="city"
                              value={deliveryInfo.city}
                              onChange={handleDeliveryInfoChange}
                              placeholder="City"
                              className="h-8 text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor="zipCode" className="text-xs">ZIP *</Label>
                            <Input
                              id="zipCode"
                              name="zipCode"
                              value={deliveryInfo.zipCode}
                              onChange={handleDeliveryInfoChange}
                              placeholder="12345"
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="specialInstructions" className="text-xs">Instructions</Label>
                          <Textarea
                            id="specialInstructions"
                            name="specialInstructions"
                            value={deliveryInfo.specialInstructions}
                            onChange={handleDeliveryInfoChange}
                            placeholder="Special delivery instructions..."
                            className="text-sm resize-none"
                            rows={2}
                          />
                        </div>

                        <Button
                          size="sm"
                          onClick={handleSaveAddress}
                          className="w-full h-8"
                        >
                          Save Address
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Order Summary - Fixed at bottom */}
              <div className="flex-shrink-0 border-t pt-3 space-y-3">
                {/* Compact Info Boxes */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                    <Truck className="h-3 w-3" />
                    <span>{deliveryFee === 0 ? "Free delivery" : `$${deliveryFee.toFixed(2)} fee`}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                    <Clock className="h-3 w-3" />
                    <span>48hr notice</span>
                  </div>
                </div>

                {/* Address Summary */}
                {(deliveryInfo.fullName || deliveryInfo.address) && (
                  <div className="text-xs bg-muted/20 p-2 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Delivery
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddressForm(true)}
                        className="h-5 text-xs p-1"
                      >
                        Edit
                      </Button>
                    </div>
                    {deliveryInfo.fullName && (
                      <p className="text-muted-foreground">{deliveryInfo.fullName}</p>
                    )}
                    {deliveryInfo.address && (
                      <p className="text-muted-foreground truncate">
                        {deliveryInfo.address}
                        {deliveryInfo.city && `, ${deliveryInfo.city}`}
                      </p>
                    )}
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-base">
                    <span>Total</span>
                    <span className="text-primary">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {!showAddressForm && !(deliveryInfo.fullName && deliveryInfo.address) && (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="w-full h-8" 
                      onClick={() => setShowAddressForm(true)}
                    >
                      <MapPin className="h-3 w-3 mr-2" />
                      Add Address
                    </Button>
                  )}
                  
                  <Button 
                    size="sm"
                    className="w-full h-9"
                    onClick={handleCheckout}
                    disabled={isCheckingOut || !isAuthenticated}
                  >
                    {isCheckingOut ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-3 w-3 mr-2" />
                        {isAuthenticated ? 'Checkout' : 'Sign In'}
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full h-7 text-xs" 
                    onClick={onClose}
                  >
                    Continue Shopping
                  </Button>
                </div>

                {/* Payment Info */}
                <div className="text-center text-xs text-muted-foreground pt-1">
                  <p>Secure checkout • All major cards accepted</p>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}