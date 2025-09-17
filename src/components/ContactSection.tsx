import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { motion } from 'motion/react';
import { useContent } from './ContentContext';
import { MapPin, Phone, Mail, Clock, Truck, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ContactSection() {
  const { content, isLoading } = useContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  // Add proper fallback for when content is not yet loaded
  if (isLoading || !content) {
    return (
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }
  
  const siteSettings = content.siteSettings || {
    businessName: "Bushra's Sweet Delights",
    phone: "(555) 123-4567", 
    email: "hello@bushrassweets.com",
    deliveryInfo: "Free delivery on orders over $50",
    socialMedia: {
      whatsapp: "https://wa.me/15551234567"
    }
  };

  const contactMethods = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      description: "Speak directly with Chef Bushra",
      value: siteSettings.phone,
      action: `tel:${siteSettings.phone}`,
      color: "bg-green-100 text-green-600"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      description: "Send us your requirements",
      value: siteSettings.email,
      action: `mailto:${siteSettings.email}`,
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "WhatsApp",
      description: "Quick responses guaranteed",
      value: "Message us instantly",
      action: siteSettings.socialMedia.whatsapp,
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Business Hours",
      description: "Our kitchen operating hours",
      value: "Mon-Fri: 9AM-7PM",
      action: "",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Delivery Info",
      description: siteSettings.deliveryInfo,
      value: "Free local delivery",
      action: "",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Here you would typically send the form data to your backend
    console.log('Contact form submitted:', formData);
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
            Get in Touch
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Contact {siteSettings.businessName}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to place an order or have questions about our desserts? 
            We're here to help make your celebration extra special.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col h-full"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
            </div>
            <div className="space-y-4 flex-1">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-1"
                >
                  <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                    <CardContent className="p-4 h-full">
                      {method.action ? (
                        <a 
                          href={method.action}
                          className="flex items-center gap-4 hover:opacity-80 transition-opacity h-full"
                        >
                          <div className={`${method.color} p-3 rounded-lg flex-shrink-0`}>
                            {method.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium mb-1">{method.title}</h4>
                            <p className="text-sm text-muted-foreground mb-1 truncate">
                              {method.description}
                            </p>
                            <p className="text-sm font-medium text-primary">
                              {method.value}
                            </p>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-center gap-4 h-full">
                          <div className={`${method.color} p-3 rounded-lg flex-shrink-0`}>
                            {method.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium mb-1">{method.title}</h4>
                            <p className="text-sm text-muted-foreground mb-1">
                              {method.description}
                            </p>
                            <p className="text-sm font-medium text-primary">
                              {method.value}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col h-full"
          >
            <Card className="border-0 shadow-lg flex-1">
              <CardContent className="p-8 h-full flex flex-col">
                <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                        className="border border-border bg-input-background focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Your phone number"
                        className="border border-border bg-input-background focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                      className="border border-border bg-input-background focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                      className="border border-border bg-input-background focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your event, requirements, or any questions you have..."
                      rows={5}
                      required
                      className="border border-border bg-input-background focus:border-primary focus:ring-1 focus:ring-primary transition-colors flex-1 resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full" size="lg">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </form>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    We typically respond within 2-4 hours during business hours. 
                    For urgent orders, please call us directly.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}