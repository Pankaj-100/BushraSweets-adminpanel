import React, { useState } from 'react';
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
  Eye,
  Calendar,
  Users,
  Heart,
  Sparkles
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { useContent, ServingIdea } from '../ContentContext';
import { toast } from 'sonner@2.0.3';

const initialIdeaData: Omit<ServingIdea, 'id'> = {
  title: '',
  description: '',
  image: '',
  occasion: 'Family Event'
};

const occasionOptions = [
  { value: 'Religious Festival', icon: <Sparkles className="h-4 w-4" />, color: 'bg-purple-100 text-purple-600' },
  { value: 'Wedding', icon: <Heart className="h-4 w-4" />, color: 'bg-pink-100 text-pink-600' },
  { value: 'Family Event', icon: <Users className="h-4 w-4" />, color: 'bg-green-100 text-green-600' },
  { value: 'Corporate', icon: <Calendar className="h-4 w-4" />, color: 'bg-blue-100 text-blue-600' }
];

export function AdminServingIdeasManager() {
  const { content, updateServingIdeas } = useContent();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<ServingIdea | null>(null);
  const [formData, setFormData] = useState<Omit<ServingIdea, 'id'>>(initialIdeaData);

  const handleSave = () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const ideaData: ServingIdea = {
      ...formData,
      id: editingIdea?.id || Date.now().toString()
    };

    let updatedIdeas;
    if (editingIdea) {
      updatedIdeas = content.servingIdeas.map(idea => idea.id === editingIdea.id ? ideaData : idea);
    } else {
      updatedIdeas = [...content.servingIdeas, ideaData];
    }

    updateServingIdeas(updatedIdeas);
    toast.success(editingIdea ? 'Serving idea updated successfully!' : 'Serving idea created successfully!');
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this serving idea?')) return;
    
    const updatedIdeas = content.servingIdeas.filter(idea => idea.id !== id);
    updateServingIdeas(updatedIdeas);
    toast.success('Serving idea deleted successfully!');
  };

  const handleEdit = (idea: ServingIdea) => {
    setEditingIdea(idea);
    setFormData(idea);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData(initialIdeaData);
    setEditingIdea(null);
    setIsDialogOpen(false);
  };

  const getOccasionIcon = (occasion: string) => {
    const option = occasionOptions.find(opt => opt.value === occasion);
    return option?.icon || <Calendar className="h-4 w-4" />;
  };

  const getOccasionColor = (occasion: string) => {
    const option = occasionOptions.find(opt => opt.value === occasion);
    return option?.color || 'bg-gray-100 text-gray-600';
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1571167530149-c1105870ab78?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1606471191009-63f1e9ec901b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400&h=300&fit=crop'
  ];

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
          <h2 className="text-2xl font-bold mb-2">Serving Ideas Management</h2>
          <p className="text-muted-foreground">Manage occasion-based serving suggestions and celebration ideas</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Idea
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingIdea ? 'Edit Serving Idea' : 'Add New Serving Idea'}
              </DialogTitle>
              <DialogDescription>
                {editingIdea 
                  ? 'Update your serving idea with occasion-specific details and imagery.'
                  : 'Create a new serving idea to showcase how your desserts fit different occasions and celebrations.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Eid Celebrations"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe how your desserts fit this occasion..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="occasion">Occasion Type</Label>
                <Select value={formData.occasion} onValueChange={(value) => setFormData(prev => ({ ...prev, occasion: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {occasionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          {option.icon}
                          {option.value}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Sample Images */}
              <div>
                <Label>Quick Select Images</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {sampleImages.map((url, index) => (
                    <div
                      key={index}
                      className="relative cursor-pointer rounded-md overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                      onClick={() => setFormData(prev => ({ ...prev, image: url }))}
                    >
                      <ImageWithFallback
                        src={url}
                        alt={`Sample image ${index + 1}`}
                        className="w-full h-16 object-cover"
                      />
                      {formData.image === url && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="bg-primary text-white p-1 rounded-full">
                            <Eye className="h-3 w-3" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {editingIdea ? 'Update' : 'Create'} Idea
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Serving Ideas List */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <AnimatePresence>
          {content.servingIdeas.map((idea, index) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <div className="relative">
                  <ImageWithFallback
                    src={idea.image}
                    alt={idea.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={`${getOccasionColor(idea.occasion)} flex items-center gap-1`}>
                      {getOccasionIcon(idea.occasion)}
                      {idea.occasion}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{idea.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {idea.description}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(idea)} className="flex-1">
                      <Edit className="h-3 w-3 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(idea.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {content.servingIdeas.length === 0 && (
        <Card className="p-12 text-center">
          <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No serving ideas found</h3>
          <p className="text-muted-foreground mb-4">Start by adding your first serving idea</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Idea
          </Button>
        </Card>
      )}

      {/* Content Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Content Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Writing Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Focus on the occasion and emotional connection</li>
                  <li>• Mention specific desserts that work well</li>
                  <li>• Include practical serving suggestions</li>
                  <li>• Keep descriptions concise but descriptive</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Image Selection</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use high-quality, appetizing food photos</li>
                  <li>• Show desserts in context of the occasion</li>
                  <li>• Consider seasonal and cultural relevance</li>
                  <li>• Ensure good lighting and composition</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}