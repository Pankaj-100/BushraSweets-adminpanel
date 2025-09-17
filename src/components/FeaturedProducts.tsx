import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useCart } from './CartContext';
import { useContent } from './ContentContext';
import { Star, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function FeaturedProducts() {
  const { addToCart } = useCart();
  const { content, isLoading } = useContent();
  
  // Add proper fallback for when content is not yet loaded
  if (isLoading || !content) {
    return (
      <section id="featured-products" className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }
  
  const featuredDesserts = content.desserts?.filter(dessert => dessert.featured) || [];

  const handleAddToCart = (dessert: any) => {
    try {
      addToCart({
        id: dessert.id,
        name: dessert.name,
        price: dessert.price,
        image: dessert.image,
        description: dessert.description
      });
      toast.success(`${dessert.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.error('Add to cart error:', error);
    }
  };

  const handleViewAllDesserts = () => {
    // Navigate to desserts page
    const event = new CustomEvent('navigate', { detail: 'desserts' });
    window.dispatchEvent(event);
  };

  // Show "View All Desserts" button only if there are more than 4 total desserts
  const showViewAllButton = (content.desserts?.length || 0) > 4;

  return (
    <section id="featured-products" className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
            Featured Desserts
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Taste the Tradition
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most beloved traditional South Asian desserts, each crafted with authentic recipes 
            passed down through generations and made with the finest ingredients.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredDesserts.map((dessert, index) => (
            <motion.div
              key={dessert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-0 shadow-md">
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={dessert.image}
                    alt={dessert.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground">
                      Featured
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">(4.8)</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {dessert.name}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {dessert.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ${dessert.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      per serving
                    </span>
                  </div>
                </CardContent>
                
                <CardFooter className="p-6 pt-0">
                  <Button 
                    className="w-full group-hover:shadow-md transition-all duration-300"
                    onClick={() => handleAddToCart(dessert)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action - Conditionally rendered */}
        {showViewAllButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-3"
              onClick={handleViewAllDesserts}
            >
              View All Desserts
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}