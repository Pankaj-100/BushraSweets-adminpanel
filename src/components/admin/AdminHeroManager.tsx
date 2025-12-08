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
import { useGetHeroQuery, useEditHeroMutation, useGetDessertsQuery } from '../../store/cmsApi';
import { ImageUploadComponent } from './ImageUploadComponent';
import { Loader2 } from 'lucide-react';

export function AdminHeroManager() {
  const { data, isLoading, isError } = useGetHeroQuery();
  const [editHero, { isLoading: isSaving }] = useEditHeroMutation();
  const { data: dessertsData } = useGetDessertsQuery({ page: 1, limit: 50 });

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    ctaText: '',
    backgroundImage: '',
    description: '',
    todaysSpecial: '' // This stores dessert ID
  });

  // Find dessert ID by name from hero response
  const findDessertIdByName = (dessertName: string) => {
    if (!dessertName || !dessertsData?.desserts) return '';
    const dessert = dessertsData.desserts.find(
      (d: any) => d.dessertName === dessertName
    );
    return dessert?.id || '';
  };

  // Get dessert name by ID for display
  const getDessertNameById = (dessertId: string) => {
    if (!dessertId || !dessertsData?.desserts) return 'N/A';
    const dessert = dessertsData.desserts.find(
      (d: any) => d.id === dessertId
    );
    return dessert?.dessertName || 'N/A';
  };

  // Get current today's special name for display
  const getCurrentTodaysSpecialName = () => {
    return getDessertNameById(formData.todaysSpecial);
  };

  useEffect(() => {
    if (data?.hero && dessertsData?.desserts) {
      const todaysSpecialName = data.hero.todaysSpecial?.[0] || '';
      const todaysSpecialId = findDessertIdByName(todaysSpecialName);
      
      setFormData({
        title: data.hero.title || '',
        subtitle: data.hero.subtitle || '',
        ctaText: data.hero.ctaText || '',
        backgroundImage: data.hero.backgroundImage || '',
        description: data.hero.description || '',
        todaysSpecial: todaysSpecialId
      });
    }
  }, [data, dessertsData]);

  const handleSave = async () => {
    if (!formData.title || !formData.subtitle || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // API expects todaysSpecial as an array of IDs
      await editHero({ 
        ...formData, 
        todaysSpecial: formData.todaysSpecial ? [formData.todaysSpecial] : [] 
      }).unwrap();
      toast.success('Hero section updated successfully!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update hero');
    }
  };

  const handleReset = () => {
    if (data?.hero && dessertsData?.desserts) {
      const todaysSpecialName = data.hero.todaysSpecial?.[0] || '';
      const todaysSpecialId = findDessertIdByName(todaysSpecialName);
      
      setFormData({
        title: data.hero.title || '',
        subtitle: data.hero.subtitle || '',
        ctaText: data.hero.ctaText || '',
        backgroundImage: data.hero.backgroundImage || '',
        description: data.hero.description || '',
        todaysSpecial: todaysSpecialId
      });
      toast.info('Changes reset to saved version');
    }
  };

  const sampleBackgrounds = [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&h=800&fit=crop',
  ];

  if (isLoading) return (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-6">
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
                <Label htmlFor="title" className="mb-2 text-lg">Main Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Authentic South Asian Desserts"
                />
              </div>

              <div>
                <Label htmlFor="subtitle" className="mb-2 text-lg" >Subtitle *</Label>
                <Textarea
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="e.g., Handcrafted with love by Chef Bushra..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="description" className="mb-2 text-lg">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your hero section..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="todaysSpecial" className="mb-2 text-lg">Today's Special</Label>
                <select
                  id="todaysSpecial"
                  value={formData.todaysSpecial}
                  onChange={(e) => setFormData(prev => ({ ...prev, todaysSpecial: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Select Dessert --</option>
                  {dessertsData?.desserts?.map((dessert: any) => (
                    <option key={dessert.id} value={dessert.id}>
                      {dessert.dessertName}
                    </option>
                  ))}
                </select>
                {formData.todaysSpecial && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Current selection: {getCurrentTodaysSpecialName()}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="ctaText" className="mb-2 text-lg">Call-to-Action Button Text</Label>
                <Input
                  id="ctaText"
                  value={formData.ctaText}
                  onChange={(e) => setFormData(prev => ({ ...prev, ctaText: e.target.value }))}
                  placeholder="e.g., Explore Our Desserts"
                />
              </div>

              <div>
                <ImageUploadComponent
                  value={formData.backgroundImage}
                  label='Background Image'
                  onChange={(url) => setFormData(prev => ({ ...prev, backgroundImage: url }))}
                  placeholder="Enter image URL or upload file"
                />
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
                <ImageWithFallback
                  src={formData.backgroundImage}
                  alt="Hero background preview"
                  className="w-full h-full object-cover absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
                <div className="relative z-10 p-8 h-full flex flex-col justify-center text-center text-white">
                  <h1 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                    {formData.title || 'Your Title Here'}
                  </h1>
                  <p className="text-sm lg:text-base mb-2 opacity-90 leading-relaxed">
                    {formData.subtitle || 'Your subtitle will appear here...'}
                  </p>
                  <p className="text-sm lg:text-base mb-6 opacity-90 leading-relaxed">
                    {formData.description || 'Description goes here...'}
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button className="mx-auto px-6 py-2 text-sm">
                      <MousePointer className="h-3 w-3 mr-2" />
                      {formData.ctaText || 'Call to Action'}
                    </Button>
                    {formData.todaysSpecial && (
                      <p className="text-sm mt-2">
                        Today's Special: {getCurrentTodaysSpecialName()}
                      </p>
                    )}
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