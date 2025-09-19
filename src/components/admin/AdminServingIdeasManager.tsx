import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Plus, Edit, Trash2, Save, Eye, Calendar, Users, Heart, Sparkles, Upload } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  useGetServingIdeasQuery,
  useAddServingIdeaMutation,
  useEditServingIdeaMutation,
  useDeleteServingIdeaMutation,
  useUploadSingleImageMutation
} from '../../store/cmsApi';

const occasionOptions = [
  { value: 'Religious Festival', icon: <Sparkles className="h-4 w-4" />, color: 'bg-purple-100 text-purple-600' },
  { value: 'Wedding', icon: <Heart className="h-4 w-4" />, color: 'bg-pink-100 text-pink-600' },
  { value: 'Family Event', icon: <Users className="h-4 w-4" />, color: 'bg-green-100 text-green-600' },
  { value: 'Corporate', icon: <Calendar className="h-4 w-4" />, color: 'bg-blue-100 text-blue-600' },
];

const initialForm = { title: '', description: '', image: '', occasionType: 'Family Event' };

export function AdminServingIdeasManager() {
  const { data, isLoading, refetch } = useGetServingIdeasQuery({ page: 1, limit: 50 });
  const [addServingIdea] = useAddServingIdeaMutation();
  const [editServingIdea] = useEditServingIdeaMutation();
  const [deleteServingIdea] = useDeleteServingIdeaMutation();
  const [uploadImage] = useUploadSingleImageMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<any>(null);
  const [formData, setFormData] = useState(initialForm);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isDialogOpen) resetForm();
  }, [isDialogOpen]);

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingIdea) {
        await editServingIdea({ id: editingIdea.id, data: formData }).unwrap();
        toast.success('Serving idea updated successfully!');
      } else {
        await addServingIdea(formData).unwrap();
        toast.success('Serving idea created successfully!');
      }
      setIsDialogOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Something went wrong!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this serving idea?')) return;

    try {
      await deleteServingIdea(id).unwrap();
      toast.success('Serving idea deleted successfully!');
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Something went wrong!');
    }
  };

  const handleEdit = (idea: any) => {
    setEditingIdea(idea);
    setFormData({
      title: idea.title,
      description: idea.description,
      image: idea.image,
      occasionType: idea.occasionType,
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await uploadImage(file).unwrap();
      setFormData(prev => ({ ...prev, image: res.imageUrl }));
      toast.success('Image uploaded successfully!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Image upload failed!');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingIdea(null);
  };

  const getOccasionIcon = (occasion: string) => {
    const option = occasionOptions.find(opt => opt.value === occasion);
    return option?.icon || <Calendar className="h-4 w-4" />;
  };

  const getOccasionColor = (occasion: string) => {
    const option = occasionOptions.find(opt => opt.value === occasion);
    return option?.color || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div className="flex items-center justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div>
          <h2 className="text-2xl font-bold mb-2">Serving Ideas Management</h2>
          <p className="text-muted-foreground">Manage occasion-based serving suggestions and celebration ideas</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Idea
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingIdea ? 'Edit Serving Idea' : 'Add New Serving Idea'}</DialogTitle>
              <DialogDescription>
                {editingIdea ? 'Update your serving idea with occasion-specific details and imagery.' : 'Create a new serving idea to showcase how your desserts fit different occasions and celebrations.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} placeholder="e.g., Eid Celebrations" />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Describe how your desserts fit this occasion..." rows={3} />
              </div>
              <div>
                <Label htmlFor="occasion">Occasion Type</Label>
                <Select value={formData.occasionType} onValueChange={value => setFormData(prev => ({ ...prev, occasionType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {occasionOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">{opt.icon}{opt.value}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image Upload */}
              <div>
                <Label>Image</Label>
                <div className="flex gap-2">
                  <Input value={formData.image} onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))} placeholder="https://example.com/image.jpg" />
                  <Button onClick={() => document.getElementById('fileInput')?.click()} disabled={uploading}>
                    <Upload className="h-4 w-4 mr-2" /> Upload
                  </Button>
                  <input type="file" id="fileInput" className="hidden" accept="image/*" onChange={e => e.target.files && handleImageUpload(e.target.files[0])} />
                </div>
                {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {editingIdea ? 'Update' : 'Create'} Idea
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Serving Ideas List */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
        <AnimatePresence>
          {isLoading ? (
            <p>Loading...</p>
          ) : data?.servingIdeas.length === 0 ? (
            <Card className="p-12 text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No serving ideas found</h3>
              <p className="text-muted-foreground mb-4">Start by adding your first serving idea</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Idea
              </Button>
            </Card>
          ) : (
            data.servingIdeas.map((idea: any, index: number) => (
              <motion.div key={idea.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
                <Card className="overflow-hidden">
                  <div className="relative">
                    <ImageWithFallback src={idea.image} alt={idea.title} className="w-full h-48 object-cover" />
                    <div className="absolute top-3 left-3">
                      <Badge className={`${getOccasionColor(idea.occasionType)} flex items-center gap-1`}>
                        {getOccasionIcon(idea.occasionType)}
                        {idea.occasionType}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{idea.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{idea.description}</p>
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
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
