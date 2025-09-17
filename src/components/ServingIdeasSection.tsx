import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useContent } from './ContentContext';
import { Calendar, Users, Heart, Sparkles } from 'lucide-react';

interface ServingIdeasSectionProps {
  isStandalonePage?: boolean;
}

export function ServingIdeasSection({ isStandalonePage = false }: ServingIdeasSectionProps) {
  const { content, isLoading } = useContent();
  
  // Add proper fallback for when content is not yet loaded
  if (isLoading || !content) {
    return (
      <section className={`py-16 lg:py-24 ${isStandalonePage ? 'min-h-screen pt-24' : 'bg-background'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }
  
  const servingIdeas = content.servingIdeas || [];

  const getOccasionIcon = (occasion: string) => {
    switch (occasion.toLowerCase()) {
      case 'religious festival':
        return <Sparkles className="h-5 w-5" />;
      case 'wedding':
        return <Heart className="h-5 w-5" />;
      case 'family event':
        return <Users className="h-5 w-5" />;
      case 'corporate':
        return <Calendar className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  const getOccasionColor = (occasion: string) => {
    switch (occasion.toLowerCase()) {
      case 'religious festival':
        return 'bg-purple-100 text-purple-600';
      case 'wedding':
        return 'bg-pink-100 text-pink-600';
      case 'family event':
        return 'bg-green-100 text-green-600';
      case 'corporate':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <section className={`py-16 lg:py-24 ${isStandalonePage ? 'min-h-screen pt-24' : 'bg-background'}`}>
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
            Serving Ideas
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Perfect for Every Occasion
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From intimate family gatherings to grand celebrations, discover how our traditional desserts 
            can make your special moments even more memorable.
          </p>
        </motion.div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {servingIdeas.map((idea, index) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-0 shadow-md">
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={idea.image}
                    alt={idea.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getOccasionColor(idea.occasion)} flex items-center gap-1`}>
                      {getOccasionIcon(idea.occasion)}
                      {idea.occasion}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {idea.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {idea.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Content for Standalone Page */}
        {isStandalonePage && (
          <>
            {/* Planning Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-16"
            >
              <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-accent/5">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">Planning Your Order</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="bg-primary/10 text-primary p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <h4 className="font-medium mb-2">Advance Notice</h4>
                      <p className="text-sm text-muted-foreground">
                        Order 24-48 hours in advance for best availability and freshness.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="bg-primary/10 text-primary p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <Users className="h-6 w-6" />
                      </div>
                      <h4 className="font-medium mb-2">Quantity Guide</h4>
                      <p className="text-sm text-muted-foreground">
                        Plan for 1-2 servings per person, depending on other desserts offered.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="bg-primary/10 text-primary p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <Heart className="h-6 w-6" />
                      </div>
                      <h4 className="font-medium mb-2">Custom Requests</h4>
                      <p className="text-sm text-muted-foreground">
                        We accommodate dietary restrictions and custom portion sizes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Testimonials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-16"
            >
              <h3 className="text-2xl font-bold text-center mb-8">What Our Customers Say</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: "Fatima A.",
                    event: "Eid Celebration",
                    quote: "The Sheer Khorma was absolutely perfect for our Eid celebration. Everyone loved it!"
                  },
                  {
                    name: "Raj & Priya",
                    event: "Wedding Reception",
                    quote: "Chef Bushra's desserts were the highlight of our wedding. Authentic and delicious."
                  },
                  {
                    name: "Sarah M.",
                    event: "Family Gathering",
                    quote: "Brought back childhood memories. The taste is exactly like my grandmother's recipes."
                  }
                ].map((testimonial, index) => (
                  <Card key={index} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                      <div>
                        <div className="font-medium">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.event}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: isStandalonePage ? 0.6 : 0.3 }}
          className="text-center"
        >
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Ready to Make Your Event Special?</h3>
            <p className="text-muted-foreground">
              Contact us to discuss your event needs and create a custom dessert package.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                Browse Our Desserts
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Contact for Custom Orders
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}