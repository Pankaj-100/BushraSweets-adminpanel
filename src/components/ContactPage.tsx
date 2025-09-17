import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { MapPin, Phone, Mail, Clock, MessageCircle, Calendar, Car, CreditCard, Info } from 'lucide-react';
import { motion } from 'motion/react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    guestCount: '',
    budget: '',
    deliveryAddress: '',
    specialRequirements: '',
    dietaryRestrictions: '',
    preferredContact: '',
    marketingConsent: false,
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, marketingConsent: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry! We\'ll get back to you within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-4">
            📞 Get in Touch
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Contact Bushra's Sweets</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Ready to bring authentic South Asian desserts to your next celebration? 
            We're here to help you create the perfect sweet experience for any occasion.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-8">
              {/* Quick Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Quick Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">(555) 123-SWEETS</p>
                      <p className="text-sm text-muted-foreground">Main Line</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">(555) 123-4567</p>
                      <p className="text-sm text-muted-foreground">WhatsApp & SMS</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">orders@bushrasweets.com</p>
                      <p className="text-sm text-muted-foreground">Order Inquiries</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium">12:00 PM - 5:00 PM</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="text-sm text-muted-foreground">
                    <p className="flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4" />
                      Orders require 48-hour advance notice
                    </p>
                    <p>Emergency orders may be accommodated with additional fees</p>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    Delivery & Pickup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium">Service Area</p>
                      <p className="text-sm text-muted-foreground">
                        15-mile radius from San Francisco Bay Area
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium">Delivery Fee</p>
                      <p className="text-sm text-muted-foreground">
                        Free on orders $50+, otherwise $5-15 based on distance
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Tell Us About Your Event</CardTitle>
                <p className="text-muted-foreground">
                  Fill out this detailed form to help us create the perfect dessert experience for your occasion.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Event Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Event Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="eventType">Event Type *</Label>
                        <Select onValueChange={(value) => handleSelectChange('eventType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="wedding">Wedding</SelectItem>
                            <SelectItem value="birthday">Birthday Party</SelectItem>
                            <SelectItem value="corporate">Corporate Event</SelectItem>
                            <SelectItem value="festival">Festival Celebration</SelectItem>
                            <SelectItem value="family">Family Gathering</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="eventDate">Event Date *</Label>
                        <Input
                          id="eventDate"
                          name="eventDate"
                          type="date"
                          value={formData.eventDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="guestCount">Number of Guests *</Label>
                        <Select onValueChange={(value) => handleSelectChange('guestCount', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select guest count" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10-25">10-25 guests</SelectItem>
                            <SelectItem value="26-50">26-50 guests</SelectItem>
                            <SelectItem value="51-100">51-100 guests</SelectItem>
                            <SelectItem value="101-200">101-200 guests</SelectItem>
                            <SelectItem value="200+">200+ guests</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="budget">Budget Range</Label>
                        <Select onValueChange={(value) => handleSelectChange('budget', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-100">Under $100</SelectItem>
                            <SelectItem value="100-250">$100 - $250</SelectItem>
                            <SelectItem value="250-500">$250 - $500</SelectItem>
                            <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                            <SelectItem value="1000+">$1,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Delivery Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                        <Textarea
                          id="deliveryAddress"
                          name="deliveryAddress"
                          placeholder="Enter full delivery address including any specific instructions"
                          value={formData.deliveryAddress}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                        <Select onValueChange={(value) => handleSelectChange('preferredContact', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="How would you like us to reach you?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="phone">Phone Call</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="sms">Text Message</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Special Requirements */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Special Requirements</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="dietaryRestrictions">Dietary Restrictions/Allergies</Label>
                        <Textarea
                          id="dietaryRestrictions"
                          name="dietaryRestrictions"
                          placeholder="Please list any dietary restrictions, allergies, or special dietary needs"
                          value={formData.dietaryRestrictions}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialRequirements">Special Requests</Label>
                        <Textarea
                          id="specialRequirements"
                          name="specialRequirements"
                          placeholder="Any special decorating requests, custom flavors, or specific presentation needs?"
                          value={formData.specialRequirements}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Additional Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us more about your event and how we can make it special..."
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Marketing Consent */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="marketing"
                      checked={formData.marketingConsent}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="marketing" className="text-sm leading-relaxed">
                      I would like to receive occasional updates about new dessert offerings, 
                      seasonal specials, and event planning tips from Bushra's Sweets. 
                      You can unsubscribe at any time.
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <motion.div 
                    className="pt-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button type="submit" size="lg" className="w-full">
                      <Calendar className="h-5 w-5 mr-2" />
                      Submit Event Inquiry
                    </Button>
                  </motion.div>

                  <div className="text-sm text-muted-foreground text-center">
                    <p>We'll review your inquiry and get back to you within 24 hours.</p>
                    <p>For urgent requests, please call us directly at (555) 123-SWEETS.</p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}