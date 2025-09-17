import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useCart } from './CartContext';
import { useContent } from './ContentContext';
import { Star, Plus, Filter, Search, Grid, List } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

export function ProductsPage() {
  const { addToCart } = useCart();
  const { content } = useContent();
  const { desserts } = content;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredAndSortedDesserts = useMemo(() => {
    let filtered = desserts.filter(dessert =>
      dessert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dessert.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterBy === 'featured') {
      filtered = filtered.filter(dessert => dessert.featured);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [desserts, searchTerm, sortBy, filterBy]);

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

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredAndSortedDesserts.map((dessert, index) => (
        <motion.div
          key={dessert.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-0 shadow-md">
            <div className="relative overflow-hidden">
              <ImageWithFallback
                src={dessert.image}
                alt={dessert.name}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {dessert.featured && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-primary-foreground">
                    Featured
                  </Badge>
                </div>
              )}
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
  );

  const renderListView = () => (
    <div className="space-y-6">
      {filteredAndSortedDesserts.map((dessert, index) => (
        <motion.div
          key={dessert.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.05 }}
        >
          <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-0 shadow-md">
            <div className="flex flex-col md:flex-row">
              <div className="relative md:w-80 overflow-hidden">
                <ImageWithFallback
                  src={dessert.image}
                  alt={dessert.name}
                  className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {dessert.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground">
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">(4.8)</span>
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {dessert.name}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {dessert.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-primary">
                      ${dessert.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      per serving
                    </span>
                  </div>
                  
                  <Button 
                    size="lg"
                    className="px-8"
                    onClick={() => handleAddToCart(dessert)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );

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
            Our Dessert Collection
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Traditional South Asian Desserts
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Explore our complete collection of authentic desserts, each crafted with love and traditional recipes 
            passed down through generations.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search desserts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4">
                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Desserts</SelectItem>
                      <SelectItem value="featured">Featured Only</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Sort by Name</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-muted-foreground">
            Showing {filteredAndSortedDesserts.length} of {desserts.length} desserts
          </p>
        </motion.div>

        {/* Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {filteredAndSortedDesserts.length > 0 ? (
            viewMode === 'grid' ? renderGridView() : renderListView()
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No desserts found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setFilterBy('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}