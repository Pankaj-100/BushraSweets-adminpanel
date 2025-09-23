import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { motion } from 'motion/react';
import { Save, Eye, FileText, MousePointer } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner';
import { useGetHeroQuery, useEditHeroMutation } from '../../store/cmsApi';
import { ImageUploadComponent } from './ImageUploadComponent';

export function AdminHeroManager() {
  const { data, isLoading, isError } = useGetHeroQuery();
  const [editHero, { isLoading: isSaving }] = useEditHeroMutation();

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    ctaText: '',
    backgroundImage: ''
  });

  useEffect(() => {
    if (data?.hero) {
      setFormData({
        title: data.hero.title,
        subtitle: data.hero.subtitle,
        ctaText: data.hero.ctaText,
        backgroundImage: data.hero.backgroundImage
      });
    }
  }, [data]);

  const handleSave = async () => {
    if (!formData.title || !formData.subtitle) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await editHero(formData).unwrap();
      toast.success('Hero section updated successfully!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update hero');
    }
  };

  const handleReset = () => {
    if (data?.hero) {
      setFormData({
        title: data.hero.title,
        subtitle: data.hero.subtitle,
        ctaText: data.hero.ctaText,
        backgroundImage: data.hero.backgroundImage
      });
      toast.info('Changes reset to saved version');
    }
  };

  const sampleBackgrounds = [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&h=800&fit=crop',
  ];

  if (isLoading) return <p>Loading hero data...</p>;
  if (isError) return <p>Failed to load hero data</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h2 className="text-2xl font-bold mb-2">Hero Section Management</h2>
        <p className="text-muted-foreground">Customize your homepage hero section content and appearance</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Edit Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Edit Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Main Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Authentic South Asian Desserts"
                  className="text-lg"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle *</Label>
                <Textarea
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="e.g., Handcrafted with love by Chef Bushra..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="ctaText">Call-to-Action Button Text</Label>
                <Input
                  id="ctaText"
                  value={formData.ctaText}
                  onChange={(e) => setFormData(prev => ({ ...prev, ctaText: e.target.value }))}
                  placeholder="e.g., Explore Our Desserts"
                />
              </div>

              {/* Image Upload using ImageUploadComponent */}
              <div>
                <Label>Background Image</Label>
                <ImageUploadComponent
                  value={formData.backgroundImage}
                  onChange={(url) => setFormData(prev => ({ ...prev, backgroundImage: url }))}
                  placeholder="Enter image URL or upload file"
                />
              </div>

              {/* Sample Background Images */}
              <div>
                <Label>Quick Select Backgrounds</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {sampleBackgrounds.map((url, index) => (
                    <div
                      key={index}
                      className="relative cursor-pointer rounded-md overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                      onClick={() => setFormData(prev => ({ ...prev, backgroundImage: url }))}
                    >
                      <ImageWithFallback src={url} alt={`Background option ${index + 1}`} className="w-full h-20 object-cover" />
                      {formData.backgroundImage === url && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="bg-primary text-white p-1 rounded-full">
                            <Eye className="h-4 w-4" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSave} className="flex-1" disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-lg overflow-hidden bg-gray-100 min-h-[400px]">
                <ImageWithFallback src={formData.backgroundImage} alt="Hero background preview" className="w-full h-full object-cover absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
                <div className="relative z-10 p-8 h-full flex flex-col justify-center text-center text-white">
                  <h1 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">{formData.title || 'Your Title Here'}</h1>
                  <p className="text-sm lg:text-base mb-6 opacity-90 leading-relaxed">{formData.subtitle || 'Your subtitle will appear here...'}</p>
                  <div className="flex flex-col gap-2">
                    <Button className="mx-auto px-6 py-2 text-sm"><MousePointer className="h-3 w-3 mr-2" />{formData.ctaText || 'Call to Action'}</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
