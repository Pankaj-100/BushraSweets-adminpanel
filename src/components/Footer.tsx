import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Logo } from './Logo';
import { useContent } from './ContentContext';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  MessageCircle,
  Heart,
  Clock,
  Truck,
  Shield
} from 'lucide-react';

export function Footer() {
  const { content, isLoading } = useContent();
  
  // Add proper fallback for when content is not yet loaded
  if (isLoading || !content) {
    return null; // Don't render footer during loading
  }
  
  const siteSettings = content.siteSettings || {
    businessName: "Bano's Sweet Delights",
    phone: "(555) 123-4567",
    email: "hello@banossweets.com", 
    address: "123 Sweet Lane, Flavor Town, ST 12345",
    socialMedia: {
      facebook: "https://facebook.com/banossweets",
      instagram: "https://instagram.com/banossweets",
      whatsapp: "https://wa.me/15551234567"
    }
  };

  const socialLinks = [
    {
      icon: <Facebook className="h-5 w-5" />,
      href: siteSettings.socialMedia.facebook,
      label: "Facebook"
    },
    {
      icon: <Instagram className="h-5 w-5" />,
      href: siteSettings.socialMedia.instagram,
      label: "Instagram"
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      href: siteSettings.socialMedia.whatsapp,
      label: "WhatsApp"
    }
  ];

  const quickLinks = [
    { label: "Our Desserts", href: "#desserts" },
    { label: "About Chef Bano", href: "#about" },
    { label: "Serving Ideas", href: "#serving-ideas" },
    { label: "Contact Us", href: "#contact" }
  ];

  const policies = [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Refund Policy", href: "#refunds" },
    { label: "Food Safety", href: "#safety" }
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand & Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="mb-6">
                <Logo variant="light" />
              </div>
              <p className="text-background/80 mb-6 leading-relaxed">
                Authentic South Asian desserts crafted with love and tradition. 
                Made fresh daily using time-honored family recipes and premium ingredients.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-background/10 hover:bg-background/20 p-3 rounded-full transition-colors duration-300"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-background/80 hover:text-background transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 mt-0.5 text-background/60" />
                  <div className="text-background/80 text-sm leading-relaxed">
                    {siteSettings.address}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-background/60" />
                  <a 
                    href={`tel:${siteSettings.phone}`}
                    className="text-background/80 hover:text-background transition-colors duration-300"
                  >
                    {siteSettings.phone}
                  </a>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-background/60" />
                  <a 
                    href={`mailto:${siteSettings.email}`}
                    className="text-background/80 hover:text-background transition-colors duration-300"
                  >
                    {siteSettings.email}
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="mt-6">
                <div className="flex items-center space-x-3 mb-2">
                  <Clock className="h-5 w-5 text-background/60" />
                  <span className="text-background font-medium">Business Hours</span>
                </div>
                <div className="text-background/80 text-sm space-y-1 ml-8">
                  <div>Mon - Fri: 9AM - 7PM</div>
                  <div>Sat - Sun: 10AM - 6PM</div>
                </div>
              </div>
            </motion.div>

            {/* Newsletter & Policies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
              <p className="text-background/80 mb-4 text-sm">
                Subscribe to get updates on new desserts, special offers, and seasonal treats.
              </p>
              
              <div className="space-y-3 mb-6">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/60"
                />
                <Button variant="secondary" className="w-full">
                  Subscribe
                </Button>
              </div>

              {/* Policies */}
              <div>
                <h4 className="font-medium mb-3">Policies</h4>
                <ul className="space-y-2">
                  {policies.map((policy, index) => (
                    <li key={index}>
                      <a 
                        href={policy.href}
                        className="text-background/70 hover:text-background transition-colors duration-300 text-sm"
                      >
                        {policy.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

        <Separator className="bg-background/20" />

        {/* Bottom Footer */}
        <div className="py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-background/60 text-sm text-center lg:text-left"
            >
              © 2024 {siteSettings.businessName}. All rights reserved. Made with{' '}
              <Heart className="h-4 w-4 inline text-red-400" /> by Chef Bano.
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center space-x-6 text-background/60 text-sm"
            >
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Food Safety Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4" />
                <span>Free Local Delivery</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}