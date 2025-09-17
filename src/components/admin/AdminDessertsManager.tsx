import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Package,
  Star,
  Clock,
  Users
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ImageUploadComponent } from './ImageUploadComponent';
import { motion, AnimatePresence } from 'motion/react';
import { useContent, DessertItem } from '../ContentContext';
import { toast } from 'sonner@2.0.3';

interface AdminDessert extends DessertItem {
  prepTime?: string;
  serves?: string;
  category?: 'traditional' | 'seasonal' | 'frozen' | 'custom';
  isPopular?: boolean;
  rating?: number;
  reviewCount?: number;
  allergens?: string[];
  ingredients?: string[];
  isActive?: boolean;
}

const initialDessertData: Omit<AdminDessert, 'id'> = {
  name: '',
  description: '',
  price: 0,
  image: '',
  featured: false,
  prepTime: '',
  serves: '',
  category: 'traditional',
  isPopular: false,
  rating: 0,
  reviewCount: 0,
  allergens: [],
  ingredients: [],
  isActive: true
};

export function AdminDessertsManager() {
  const { content, updateDesserts, isLoading } = useContent();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDessert, setEditingDessert] = useState<AdminDessert | null>(null);
  const [formData, setFormData] = useState<Omit<AdminDessert, 'id'>>(initialDessertData);
  const [allergenInput, setAllergenInput] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  
  if (isLoading || !content) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Convert content desserts to admin format
  const adminDesserts: AdminDessert[] = content.desserts.map(dessert => ({
    ...dessert,
    prepTime: dessert.prepTime || '24 hours',
    serves: dessert.serves || '4-6 people',
    category: dessert.category || 'traditional',
    isPopular: dessert.isPopular || dessert.featured,
    rating: dessert.rating || 4.8,
    reviewCount: dessert.reviewCount || 50,
    allergens: dessert.allergens || [],
    ingredients: dessert.ingredients || [],
    isActive: dessert.isActive !== undefined ? dessert.isActive : true
  }));

  const handleSave = async () => {
    if (!formData.name || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const dessertData: AdminDessert = {
      ...formData,
      id: editingDessert?.id || Date.now().toString()
    };

    let updatedDesserts;
    if (editingDessert) {
      updatedDesserts = adminDesserts.map(d => d.id === editingDessert.id ? dessertData : d);
    } else {
      updatedDesserts = [...adminDesserts, dessertData];
    }

    // Convert back to content format and update
    const contentDesserts: DessertItem[] = updatedDesserts.map(dessert => ({
      id: dessert.id,
      name: dessert.name,
      description: dessert.description,
      price: dessert.price,
      image: dessert.image,
      featured: dessert.featured || dessert.isPopular || false,
      // Store admin-specific fields as additional properties
      prepTime: dessert.prepTime,
      serves: dessert.serves,
      category: dessert.category,
      isPopular: dessert.isPopular,
      rating: dessert.rating,
      reviewCount: dessert.reviewCount,
      allergens: dessert.allergens,
      ingredients: dessert.ingredients,
      isActive: dessert.isActive
    }));

    updateDesserts(contentDesserts);
    toast.success(editingDessert ? 'Dessert updated successfully!' : 'Dessert created successfully!');
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dessert?')) return;
    
    const updatedDesserts = adminDesserts.filter(d => d.id !== id);
    const contentDesserts: DessertItem[] = updatedDesserts.map(dessert => ({
      id: dessert.id,
      name: dessert.name,
      description: dessert.description,
      price: dessert.price,
      image: dessert.image,
      featured: dessert.featured || dessert.isPopular || false,
      prepTime: dessert.prepTime,
      serves: dessert.serves,
      category: dessert.category,
      isPopular: dessert.isPopular,
      rating: dessert.rating,
      reviewCount: dessert.reviewCount,
      allergens: dessert.allergens,
      ingredients: dessert.ingredients,
      isActive: dessert.isActive
    }));

    updateDesserts(contentDesserts);
    toast.success('Dessert deleted successfully!');
  };

  const handleEdit = (dessert: AdminDessert) => {
    setEditingDessert(dessert);
    setFormData(dessert);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData(initialDessertData);
    setEditingDessert(null);
    setIsDialogOpen(false);
    setAllergenInput('');
    setIngredientInput('');
  };

  const addAllergen = () => {
    if (allergenInput.trim() && !formData.allergens?.includes(allergenInput.trim())) {
      setFormData(prev => ({
        ...prev,
        allergens: [...(prev.allergens || []), allergenInput.trim()]
      }));
      setAllergenInput('');
    }
  };

  const removeAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens?.filter(a => a !== allergen) || []
    }));
  };

  const addIngredient = () => {
    if (ingredientInput.trim() && !formData.ingredients?.includes(ingredientInput.trim())) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...(prev.ingredients || []), ingredientInput.trim()]
      }));
      setIngredientInput('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients?.filter(i => i !== ingredient) || []
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h2 className="text-2xl font-bold mb-2">Desserts Management</h2>
          <p className="text-muted-foreground">Manage your dessert catalog and inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Dessert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDessert ? 'Edit Dessert' : 'Add New Dessert'}
              </DialogTitle>
              <DialogDescription>
                {editingDessert 
                  ? 'Make changes to your dessert. Fill in all required fields and save your changes.'
                  : 'Add a new dessert to your catalog. Fill in all required fields to create your dessert.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Dessert Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Traditional Kheer"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="12.99"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your dessert..."
                  rows={3}
                />
              </div>

              {/* Image Upload Component */}
              <ImageUploadComponent
                value={formData.image}
                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                label="Dessert Image"
                placeholder="Enter image URL or upload file"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="prepTime">Prep Time</Label>
                  <Input
                    id="prepTime"
                    value={formData.prepTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, prepTime: e.target.value }))}
                    placeholder="24 hours"
                  />
                </div>
                <div>
                  <Label htmlFor="serves">Serves</Label>
                  <Input
                    id="serves"
                    value={formData.serves}
                    onChange={(e) => setFormData(prev => ({ ...prev, serves: e.target.value }))}
                    placeholder="4-6 people"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traditional">Traditional</SelectItem>
                      <SelectItem value="seasonal">Seasonal</SelectItem>
                      <SelectItem value="frozen">Frozen</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Allergens */}
              <div>
                <Label>Allergens</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={allergenInput}
                    onChange={(e) => setAllergenInput(e.target.value)}
                    placeholder="Add allergen"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergen())}
                  />
                  <Button type="button" onClick={addAllergen} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.allergens?.map((allergen) => (
                    <Badge key={allergen} variant="secondary" className="cursor-pointer" onClick={() => removeAllergen(allergen)}>
                      {allergen} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <Label>Ingredients</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    placeholder="Add ingredient"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                  />
                  <Button type="button" onClick={addIngredient} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.ingredients?.map((ingredient) => (
                    <Badge key={ingredient} variant="outline" className="cursor-pointer" onClick={() => removeIngredient(ingredient)}>
                      {ingredient} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPopular"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                  />
                  <Label htmlFor="isPopular">Popular Item</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {editingDessert ? 'Update' : 'Create'} Dessert
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Desserts List */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <AnimatePresence>
          {adminDesserts.map((dessert, index) => (
            <motion.div
              key={dessert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <div className="relative">
                  <ImageWithFallback
                    src={dessert.image}
                    alt={dessert.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    {dessert.featured && (
                      <Badge className="bg-primary">Featured</Badge>
                    )}
                    {dessert.isPopular && (
                      <Badge className="bg-orange-500">Popular</Badge>
                    )}
                    <Badge variant={dessert.isActive ? "default" : "secondary"}>
                      {dessert.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{dessert.name}</h3>
                    <span className="text-lg font-bold text-primary">${dessert.price}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {dessert.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{dessert.prepTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{dessert.serves}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{dessert.rating} ({dessert.reviewCount})</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(dessert)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(dessert.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {adminDesserts.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No desserts found</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first dessert</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Dessert
          </Button>
        </Card>
      )}
    </div>
  );
}