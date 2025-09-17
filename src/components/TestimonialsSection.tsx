import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useContent } from './ContentContext';
import { Star, Quote } from 'lucide-react';

export function TestimonialsSection() {
  const { content, isLoading } = useContent();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll functionality
  useEffect(() => {
    // Don't set up auto-scroll if content is still loading or not available
    if (isLoading || !content) return;
    
    const testimonials = content.testimonials || [];
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollInterval: NodeJS.Timeout;
    let isScrolling = false;

    const startAutoScroll = () => {
      if (isScrolling) return;
      
      scrollInterval = setInterval(() => {
        if (scrollContainer) {
          const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
          
          if (scrollContainer.scrollLeft >= maxScrollLeft) {
            // Reset to beginning
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            // Scroll to next testimonial
            const cardWidth = 350; // Approximate width of each card + gap
            scrollContainer.scrollBy({ left: cardWidth, behavior: 'smooth' });
          }
        }
      }, 2500); // Reduced from 4000ms to 2500ms (37.5% faster)
    };

    const stopAutoScroll = () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
    };

    // Mouse event handlers
    const handleMouseEnter = () => {
      isScrolling = true;
      stopAutoScroll();
    };

    const handleMouseLeave = () => {
      isScrolling = false;
      startAutoScroll();
    };

    // Touch event handlers for mobile
    const handleTouchStart = () => {
      isScrolling = true;
      stopAutoScroll();
    };

    const handleTouchEnd = () => {
      setTimeout(() => {
        isScrolling = false;
        startAutoScroll();
      }, 2000); // Restart after 2 seconds of no interaction
    };

    // Add event listeners
    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    scrollContainer.addEventListener('touchstart', handleTouchStart);
    scrollContainer.addEventListener('touchend', handleTouchEnd);

    // Start auto-scroll
    startAutoScroll();

    // Cleanup
    return () => {
      stopAutoScroll();
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
        scrollContainer.removeEventListener('touchstart', handleTouchStart);
        scrollContainer.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [content, isLoading]);

  // Add proper fallback for when content is not yet loaded
  if (isLoading || !content) {
    return (
      <section className="py-16 lg:py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }
  
  const testimonials = content.testimonials || [];

  return (
    <section className="py-16 lg:py-20 bg-muted/20">
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
            Client Testimonials
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from our delighted customers who have experienced the authentic taste 
            and exceptional quality of our traditional South Asian desserts.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitScrollbar: 'none'
            }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex-shrink-0 w-80 sm:w-96"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-card">
                  <CardContent className="p-6">
                    {/* Quote Icon */}
                    <div className="mb-4">
                      <Quote className="h-8 w-8 text-primary/30" />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-muted-foreground mb-6 leading-relaxed italic">
                      "{testimonial.review}"
                    </p>

                    {/* Customer Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        {testimonial.image ? (
                          <ImageWithFallback
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold text-lg">
                              {testimonial.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                        {testimonial.occasion && (
                          <p className="text-xs text-muted-foreground capitalize">
                            {testimonial.occasion}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Gradient Fade Effects */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-muted/20 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-muted/20 to-transparent pointer-events-none" />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-6"
        >
          <p className="text-xs text-muted-foreground">
            Hover to pause • Swipe or scroll to see more
          </p>
        </motion.div>
      </div>
    </section>
  );
}