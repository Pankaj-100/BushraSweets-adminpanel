import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useContent } from './ContentContext';
import { Award, Clock, Heart, Shield } from 'lucide-react';

export function AboutSection() {
  const { content, isLoading } = useContent();
  
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
  
  const about = content.about || {
    chefName: "Chef Bano Ahmad",
    chefTitle: "Master of Traditional South Asian Desserts",
    chefImage: "https://images.unsplash.com/photo-1559847844-5315695abf42?w=400&h=400&fit=crop",
    story: "With over 15 years of experience in traditional South Asian cuisine, Chef Bano brings authentic flavors and time-honored techniques to every dessert.",
    certification: "Certified Food Handler",
    experience: "15+ Years"
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
            About Our Kitchen
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Meet {about.chefName}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {about.chefTitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Chef Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src={about.chefImage}
                alt={about.chefName}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-lg border"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">15+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Preserving Heritage Through Every Sweet Bite
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {about.story}
              </p>
            </div>

            {/* Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{about.certification}</div>
                      <div className="text-xs text-muted-foreground">Food Safety</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{about.experience}</div>
                      <div className="text-xs text-muted-foreground">Culinary Experience</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary p-2 rounded-lg mt-1">
                  <Heart className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Family Recipes</h4>
                  <p className="text-sm text-muted-foreground">
                    Every dessert is made using authentic family recipes passed down through generations, 
                    ensuring you taste the true essence of South Asian tradition.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary p-2 rounded-lg mt-1">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Premium Ingredients</h4>
                  <p className="text-sm text-muted-foreground">
                    We source only the finest ingredients - from aromatic cardamom and saffron to 
                    the richest milk and purest ghee - to create desserts worthy of your celebrations.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="pt-4">
              <Button size="lg" className="px-8">
                Order Your Favorites
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                "To bring the authentic taste of South Asian heritage to every celebration, 
                preserving traditional recipes while creating new memories for families to cherish. 
                Every dessert we craft carries the love and tradition of generations."
              </p>
              <div className="mt-4 text-sm text-primary font-medium">
                - {about.chefName}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}