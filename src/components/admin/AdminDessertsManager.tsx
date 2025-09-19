import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Plus, Edit, Trash2, Save, X, Package, Star, Clock, Users } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ImageUploadComponent } from './ImageUploadComponent';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  useGetDessertsQuery, 
  useAddDessertMutation, 
  useEditDessertMutation, 
  useDeleteDessertMutation 
} from '../../store/cmsApi';

interface AdminDessert {
  id?: string;
  dessertName: string;
  description: string;
  price: number;
  dessertImages: string[];
  prepTime?: string;
  serves?: string;
  category?: 'Traditional' | 'Seasonal' | 'Frozen' | 'Custom';
  isPopular?: boolean;
  featured?: boolean;
  allergens?: string[];
  ingredients?: string[];
  isActive?: boolean;
  rating?: number;
  reviewCount?: number;
}

const initialDessertData: Omit<AdminDessert, 'id'> = {
  dessertName: '',
  description: '',
  price: 0,
  dessertImages: [''],
  prepTime: '',
  serves: '',
  category: 'Traditional',
  isPopular: false,
  featured: false,
  allergens: [],
  ingredients: [],
  isActive: true,
  rating: 0,
  reviewCount: 0
};

export function AdminDessertsManager() {
  const { data, refetch, isLoading } = useGetDessertsQuery({ page: 1, limit: 20 });
  const [addDessert] = useAddDessertMutation();
  const [editDessert] = useEditDessertMutation();
  const [deleteDessert] = useDeleteDessertMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDessert, setEditingDessert] = useState<AdminDessert | null>(null);
  const [formData, setFormData] = useState<Omit<AdminDessert, 'id'>>(initialDessertData);
  const [allergenInput, setAllergenInput] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const desserts: AdminDessert[] = data?.desserts || [];

  const handleSave = async () => {
    if (!formData.dessertName || !formData.description) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      if (editingDessert?.id) {
        await editDessert({ id: editingDessert.id, data: formData }).unwrap();
        toast.success('Dessert updated successfully!');
      } else {
        await addDessert(formData).unwrap();
        toast.success('Dessert added successfully!');
      }
      refetch();
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Something went wrong!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dessert?')) return;
    try {
      await deleteDessert(id).unwrap();
      toast.success('Dessert deleted successfully!');
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Something went wrong!');
    }
  };

  const handleEdit = (dessert: AdminDessert) => {
    setEditingDessert(dessert);
    setFormData({
      ...dessert,
      dessertImages: dessert.dessertImages.length ? dessert.dessertImages : ['']
    });
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
      setFormData(prev => ({ ...prev, allergens: [...(prev.allergens || []), allergenInput.trim()] }));
      setAllergenInput('');
    }
  };

  const removeAllergen = (allergen: string) => {
    setFormData(prev => ({ ...prev, allergens: prev.allergens?.filter(a => a !== allergen) || [] }));
  };

  const addIngredient = () => {
    if (ingredientInput.trim() && !formData.ingredients?.includes(ingredientInput.trim())) {
      setFormData(prev => ({ ...prev, ingredients: [...(prev.ingredients || []), ingredientInput.trim()] }));
      setIngredientInput('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setFormData(prev => ({ ...prev, ingredients: prev.ingredients?.filter(i => i !== ingredient) || [] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div className="flex items-center justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div>
          <h2 className="text-2xl font-bold mb-2">Desserts Management</h2>
          <p className="text-muted-foreground">Manage your dessert catalog and inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" /> Add New Dessert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDessert ? 'Edit Dessert' : 'Add New Dessert'}</DialogTitle>
              <DialogDescription>
                {editingDessert ? 'Edit your dessert and save changes.' : 'Add a new dessert to your catalog.'}
              </DialogDescription>
            </DialogHeader>
            {/* Form */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Dessert Name *</Label>
                  <Input value={formData.dessertName} onChange={e => setFormData(prev => ({ ...prev, dessertName: e.target.value }))} />
                </div>
                <div>
                  <Label>Price *</Label>
                  <Input type="text" value={formData.price} onChange={e => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))} />
                </div>
              </div>

              <div>
                <Label>Description *</Label>
                <Textarea value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={3} />
              </div>

              {/* Image Upload */}
              <ImageUploadComponent value={formData.dessertImages[0]} onChange={url => setFormData(prev => ({ ...prev, dessertImages: [url] }))} label="Dessert Image" />

              {/* Prep/Serves/Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Prep Time</Label>
                  <Input value={formData.prepTime} onChange={e => setFormData(prev => ({ ...prev, prepTime: e.target.value }))} />
                </div>
                <div>
                  <Label>Serves</Label>
                  <Input value={formData.serves} onChange={e => setFormData(prev => ({ ...prev, serves: e.target.value }))} />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Traditional">Traditional</SelectItem>
                      <SelectItem value="Seasonal">Seasonal</SelectItem>
                      <SelectItem value="Frozen">Frozen</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Allergens */}
              <div>
                <Label>Allergens</Label>
                <div className="flex gap-2 mb-2">
                  <Input value={allergenInput} onChange={e => setAllergenInput(e.target.value)} placeholder="Add allergen" onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addAllergen())} />
                  <Button onClick={addAllergen} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">{formData.allergens?.map(a => <Badge key={a} variant="secondary" className="cursor-pointer" onClick={() => removeAllergen(a)}>{a} <X className="h-3 w-3 ml-1" /></Badge>)}</div>
              </div>

              {/* Ingredients */}
              <div>
                <Label>Ingredients</Label>
                <div className="flex gap-2 mb-2">
                  <Input value={ingredientInput} onChange={e => setIngredientInput(e.target.value)} placeholder="Add ingredient" onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addIngredient())} />
                  <Button onClick={addIngredient} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">{formData.ingredients?.map(i => <Badge key={i} variant="outline" className="cursor-pointer" onClick={() => removeIngredient(i)}>{i} <X className="h-3 w-3 ml-1" /></Badge>)}</div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" checked={formData.featured} onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))} />
                  <Label>Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" checked={formData.isPopular} onChange={e => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))} />
                  <Label>Popular Item</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} />
                  <Label>Active</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1"><Save className="h-4 w-4 mr-2" />{editingDessert ? 'Update' : 'Create'} Dessert</Button>
                <Button variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Dessert List */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
        <AnimatePresence>
          {desserts.map((dessert, index) => (
            <motion.div key={dessert.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
              <Card className="overflow-hidden">
                <div className="relative mt-2">
                  <ImageWithFallback src={dessert.dessertImages[0]} alt={dessert.dessertName} className="w-80 h-48 object-fit mx-auto " />
                  <div className="absolute top-2 right-2 flex gap-2">
                    {dessert.featured && <Badge className="bg-primary">Featured</Badge>}
                    {dessert.isPopular && <Badge className="bg-orange-500">Popular</Badge>}
                    <Badge variant={dessert.isActive ? "default" : "secondary"}>{dessert.isActive ? 'Active' : 'Inactive'}</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{dessert.dessertName}</h3>
                    <span className="text-lg font-bold text-primary">${dessert.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{dessert.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> <span>{dessert.prepTime}</span></div>
                    <div className="flex items-center gap-1"><Users className="h-3 w-3" /> <span>{dessert.serves}</span></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> <span className="text-sm">{dessert.rating} ({dessert.reviewCount})</span></div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(dessert)}><Edit className="h-3 w-3" /></Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(dessert.id!)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {desserts.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No desserts found</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first dessert</p>
          <Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4 mr-2" /> Add Your First Dessert</Button>
        </Card>
      )}
    </div>
  );
}