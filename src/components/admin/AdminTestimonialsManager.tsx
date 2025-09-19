import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit, Trash2, Save, X, Star, Quote, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetTestimonialsQuery,
  useAddTestimonialMutation,
  useEditTestimonialMutation,
  useDeleteTestimonialMutation,
} from '../../store/cmsApi';
import { ImageUploadComponent } from './ImageUploadComponent';

export function AdminTestimonialsManager() {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    review: '',
    rating: 5,
    occasion: '',
    image: '',
  });

  // Added isLoading here 👇
  const { data: testimonialsData, refetch, isLoading } = useGetTestimonialsQuery({ page: 1, limit: 20 });
  const [addTestimonial] = useAddTestimonialMutation();
  const [editTestimonial] = useEditTestimonialMutation();
  const [deleteTestimonial] = useDeleteTestimonialMutation();

  const testimonials = testimonialsData?.testimonials || [];

  const handleEdit = (testimonial: any) => {
    setIsEditing(testimonial.id);
    setEditForm({
      name: testimonial.customerName,
      review: testimonial.review,
      rating: testimonial.stars,
      occasion: testimonial.occasion || '',
      image: testimonial.customerImage || '',
    });
  };

  const handleSave = async () => {
    if (!editForm.name.trim() || !editForm.review.trim()) {
      toast.error('Name and review are required');
      return;
    }

    try {
      await editTestimonial({
        id: isEditing!,
        data: {
          customerName: editForm.name.trim(),
          review: editForm.review.trim(),
          stars: editForm.rating,
          occasion: editForm.occasion.trim() || undefined,
          customerImage: editForm.image.trim() || undefined,
        },
      }).unwrap();
      toast.success('Testimonial updated successfully');
      refetch();
      setIsEditing(null);
      setEditForm({ name: '', review: '', rating: 5, occasion: '', image: '' });
    } catch {
      toast.error('Failed to update testimonial');
    }
  };

  const handleAdd = async () => {
    if (!editForm.name.trim() || !editForm.review.trim()) {
      toast.error('Name and review are required');
      return;
    }

    try {
      await addTestimonial({
        customerName: editForm.name.trim(),
        review: editForm.review.trim(),
        stars: editForm.rating,
        occasion: editForm.occasion.trim() || undefined,
        customerImage: editForm.image.trim() || undefined,
      }).unwrap();
      toast.success('Testimonial added successfully');
      refetch();
      setIsAdding(false);
      setEditForm({ name: '', review: '', rating: 5, occasion: '', image: '' });
    } catch {
      toast.error('Failed to add testimonial');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await deleteTestimonial(id).unwrap();
        toast.success('Testimonial deleted successfully');
        refetch();
      } catch {
        toast.error('Failed to delete testimonial');
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setIsAdding(false);
    setEditForm({ name: '', review: '', rating: 5, occasion: '', image: '' });
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${
            interactive ? 'cursor-pointer hover:text-yellow-400' : ''
          }`}
          onClick={interactive && onChange ? () => onChange(star) : undefined}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Testimonials Management</h2>
          <p className="text-muted-foreground">Manage customer testimonials and reviews</p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding || isEditing !== null}>
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {/* Loader while fetching testimonials */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Add Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" /> Add New Testimonial
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-name">Customer Name *</Label>
                    <Input
                      id="new-name"
                      value={editForm.name}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-occasion">Occasion</Label>
                    <Input
                      id="new-occasion"
                      value={editForm.occasion}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, occasion: e.target.value }))}
                      placeholder="e.g., Wedding, Birthday"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <ImageUploadComponent
                  value={editForm.image}
                  onChange={(url) => setEditForm((prev) => ({ ...prev, image: url }))}
                  label="Customer Image"
                  placeholder="Enter image URL or upload"
                />

                <div>
                  <Label>Rating</Label>
                  {renderStars(editForm.rating, true, (rating) => setEditForm((prev) => ({ ...prev, rating })))}
                </div>

                <div>
                  <Label htmlFor="new-review">Review *</Label>
                  <Textarea
                    id="new-review"
                    value={editForm.review}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, review: e.target.value }))}
                    rows={4}
                    placeholder="Enter customer review"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAdd}>
                    <Save className="h-4 w-4 mr-2" /> Add Testimonial
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" /> Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Testimonials List */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {testimonials.map((testimonial: any) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full ">
                  <CardContent className="p-6">
                    {isEditing === testimonial.id ? (
                      <div className="space-y-4">
                        {/* Edit form inside card */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Customer Name *</Label>
                            <Input
                              value={editForm.name}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label>Occasion</Label>
                            <Input
                              value={editForm.occasion}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, occasion: e.target.value }))}
                            />
                          </div>
                        </div>

                        <ImageUploadComponent
                          value={editForm.image}
                          onChange={(url) => setEditForm((prev) => ({ ...prev, image: url }))}
                          label="Customer Image"
                          placeholder="Enter image URL or upload"
                        />

                        <div>
                          <Label>Rating</Label>
                          {renderStars(editForm.rating, true, (rating) =>
                            setEditForm((prev) => ({ ...prev, rating }))
                          )}
                        </div>
                        <div>
                          <Label>Review *</Label>
                          <Textarea
                            value={editForm.review}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, review: e.target.value }))}
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSave} size="sm">
                            <Save className="h-4 w-4 mr-2" /> Save
                          </Button>
                          <Button variant="outline" onClick={handleCancel} size="sm">
                            <X className="h-4 w-4 mr-2" /> Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <Quote className="h-6 w-6 text-primary/30 flex-shrink-0" />
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(testimonial)}
                              disabled={isEditing !== null || isAdding}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(testimonial.id)}
                              disabled={isEditing !== null || isAdding}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {renderStars(testimonial.stars)}
                          <span className="text-sm text-muted-foreground">({testimonial.stars}/5)</span>
                        </div>

                        <p className="text-muted-foreground italic leading-relaxed">
                          "{testimonial.review}"
                        </p>

                        <div className="flex items-center gap-4 pt-4 border-t">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                            {testimonial.customerImage ? (
                              <ImageWithFallback
                                src={testimonial.customerImage}
                                alt={testimonial.customerName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-semibold">
                                  {testimonial.customerName.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{testimonial.customerName}</h4>
                            {testimonial.occasion && (
                              <Badge variant="secondary" className="mt-1 text-xs">
                                {testimonial.occasion}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && testimonials.length === 0 && !isAdding && (
        <Card className="text-center py-12">
          <CardContent>
            <Quote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No testimonials yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first customer testimonial to showcase your amazing reviews.
            </p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add First Testimonial
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
