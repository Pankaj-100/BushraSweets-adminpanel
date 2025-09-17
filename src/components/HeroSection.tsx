import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { useContent } from './ContentContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight, Star, Heart, Sparkles, ShoppingBag, Phone } from 'lucide-react';

export function HeroSection() {
  const { content } = useContent();
  
  // Add proper fallback for when content is not yet loaded
  if (!content) {
    return (
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </section>
    );
  }
  
  const hero = content.hero || {
    title: "Bano's Sweet Delights",
    subtitle: "Handcrafted with Love & Tradition",
    ctaText: "Explore Our Desserts",
    backgroundImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop"
  };
  
  const siteSettings = content.siteSettings || {
    phone: "(555) 123-4567"
  };

  const handleOrderNow = () => {
    const productsSection = document.getElementById('featured-products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCallNow = () => {
    window.open(`tel:${siteSettings.phone}`, '_self');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 dessert-pattern opacity-30"></div>
      <div className="absolute inset-0 gradient-dessert-radial"></div>
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-10 floating-animation" style={{ animationDelay: '0s' }}>
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-secondary opacity-20"></div>
      </div>
      <div className="absolute top-40 right-20 floating-animation" style={{ animationDelay: '2s' }}>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary opacity-25"></div>
      </div>
      <div className="absolute bottom-32 left-20 floating-animation" style={{ animationDelay: '4s' }}>
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent opacity-15"></div>
      </div>
      <div className="absolute bottom-20 right-10 floating-animation" style={{ animationDelay: '1s' }}>
        <Sparkles className="w-8 h-8 text-accent opacity-40" />
      </div>
      <div className="absolute top-32 right-1/4 floating-animation" style={{ animationDelay: '3s' }}>
        <Heart className="w-6 h-6 text-primary opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex"
            >
              <Badge className="bg-gradient-to-r from-accent to-secondary text-primary border-primary/20 px-4 py-2 text-sm shadow-warm">
                <Star className="h-4 w-4 mr-2 fill-current" />
                Authentic South Asian Desserts
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="font-parisienne text-5xl sm:text-6xl lg:text-7xl text-primary mb-4 leading-tight">
                {hero.title}
              </h1>
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground/90 mb-6">
                  {hero.subtitle}
                </h2>
                <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-accent to-primary rounded-full"></div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-2xl"
            >
              Experience the authentic taste of South Asian desserts, lovingly prepared by Chef Bano using traditional recipes passed down through generations. Every bite tells a story of heritage, flavor, and passion.
            </motion.p>

            {/* Enhanced CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start"
            >
              {/* Primary CTA - Order Now */}
              <Button
                size="lg"
                onClick={handleOrderNow}
                className="btn-dessert text-lg px-8 py-6 rounded-2xl shadow-dessert group relative overflow-hidden min-w-[200px]"
              >
                <div className="flex items-center justify-center gap-3">
                  <ShoppingBag className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-medium">Sweet Indulgence Awaits</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Button>

              {/* Secondary CTA - Call Now */}
              <Button
                variant="outline"
                size="lg"
                onClick={handleCallNow}
                className="text-lg px-8 py-6 rounded-2xl border-2 border-primary/30 bg-card/80 backdrop-blur-sm hover:bg-primary/10 hover:border-primary hover:shadow-warm transition-all duration-300 group min-w-[180px]"
              >
                <div className="flex items-center justify-center gap-3">
                  <Phone className="h-5 w-5 group-hover:animate-pulse" />
                  <span className="font-medium">Call Chef Bano</span>
                </div>
              </Button>
            </motion.div>

            {/* Special Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2 bg-card/60 backdrop-blur-sm px-3 py-2 rounded-full border border-primary/10">
                <div className="w-2 h-2 bg-primary rounded-full pulse-soft"></div>
                <span>48-hour advance notice</span>
              </div>
              <div className="flex items-center gap-2 bg-card/60 backdrop-blur-sm px-3 py-2 rounded-full border border-primary/10">
                <div className="w-2 h-2 bg-accent rounded-full pulse-soft"></div>
                <span>Fresh ingredients daily</span>
              </div>
              <div className="flex items-center gap-2 bg-card/60 backdrop-blur-sm px-3 py-2 rounded-full border border-primary/10">
                <div className="w-2 h-2 bg-secondary rounded-full pulse-soft"></div>
                <span>Certified kitchen</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative group">
              {/* Main Image Container */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl group-hover:shadow-dessert transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-primary/20 z-10"></div>
                <ImageWithFallback
                  src={hero.backgroundImage}
                  alt={hero.title}
                  className="w-full h-[600px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay Elements */}
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-4 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-primary">Today's Special</p>
                        <p className="text-sm text-muted-foreground">Traditional Kheer & Kulfi</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements Around Image */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-accent to-secondary rounded-full opacity-60 blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full opacity-40 blur-2xl"></div>
              
              {/* Floating Rating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute -top-6 -left-6 bg-primary text-white p-4 rounded-2xl shadow-lg"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-bold">4.9</span>
                  </div>
                  <p className="text-xs opacity-90">5-Star Reviews</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave Transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-card"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-card"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-card"></path>
        </svg>
      </div>
    </section>
  );
}