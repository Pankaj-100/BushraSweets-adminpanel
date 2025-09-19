import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { motion } from 'motion/react';
import { Save, Eye, User, FileText, Award } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useContent } from '../ContentContext';
import { toast } from 'sonner';

export function AdminAboutManager() {
  const { content, updateContent, isLoading } = useContent();
  
  // Don't render until content is loaded
  if (isLoading || !content) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const [formData, setFormData] = useState({
    chefName: content.about.chefName,
    chefTitle: content.about.chefTitle,
    chefImage: content.about.chefImage,
    story: content.about.story,
    certification: content.about.certification,
    experience: content.about.experience
  });

  const handleSave = () => {
    if (!formData.chefName || !formData.story) {
      toast.error('Please fill in all required fields');
      return;
    }

    updateContent('about', formData);
    toast.success('About section updated successfully!');
  };

  const handleReset = () => {
    setFormData({
      chefName: content.about.chefName,
      chefTitle: content.about.chefTitle,
      chefImage: content.about.chefImage,
      story: content.about.story,
      certification: content.about.certification,
      experience: content.about.experience
    });
    toast.info('Changes reset to saved version');
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1494790108755-2616b2de1f91?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold mb-2">About Section Management</h2>
        <p className="text-muted-foreground">Manage Chef Bano's profile and story content</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Chef Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="chefName">Chef Name *</Label>
                <Input
                  id="chefName"
                  value={formData.chefName}
                  onChange={(e) => setFormData(prev => ({ ...prev, chefName: e.target.value }))}
                  placeholder="e.g., Chef Bano"
                />
              </div>

              <div>
                <Label htmlFor="chefTitle">Professional Title</Label>
                <Input
                  id="chefTitle"
                  value={formData.chefTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, chefTitle: e.target.value }))}
                  placeholder="e.g., Master of Traditional South Asian Desserts"
                />
              </div>

              <div>
                <Label htmlFor="chefImage">Chef Photo URL</Label>
                <Input
                  id="chefImage"
                  value={formData.chefImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, chefImage: e.target.value }))}
                  placeholder="https://example.com/chef-photo.jpg"
                />
              </div>

              {/* Sample Chef Images */}
              <div>
                <Label>Quick Select Photos</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {sampleImages.map((url, index) => (
                    <div
                      key={index}
                      className="relative cursor-pointer rounded-md overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                      onClick={() => setFormData(prev => ({ ...prev, chefImage: url }))}
                    >
                      <ImageWithFallback
                        src={url}
                        alt={`Chef photo option ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                      {formData.chefImage === url && (
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
            </CardContent>
          </Card>

          {/* Story and Credentials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Story & Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="story">Chef's Story *</Label>
                <Textarea
                  id="story"
                  value={formData.story}
                  onChange={(e) => setFormData(prev => ({ ...prev, story: e.target.value }))}
                  placeholder="Tell the chef's story, background, and passion for traditional desserts..."
                  rows={5}
                />
              </div>

              <div>
                <Label htmlFor="certification">Certification</Label>
                <Input
                  id="certification"
                  value={formData.certification}
                  onChange={(e) => setFormData(prev => ({ ...prev, certification: e.target.value }))}
                  placeholder="e.g., Certified Food Handler & Safety Expert"
                />
              </div>

              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="e.g., 15+ years of culinary expertise"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Chef Image and Basic Info */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <ImageWithFallback
                      src={formData.chefImage}
                      alt={formData.chefName}
                      className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                    />
                  </div>
                  <h3 className="text-xl font-bold mt-4">
                    {formData.chefName || 'Chef Name'}
                  </h3>
                  <p className="text-muted-foreground">
                    {formData.chefTitle || 'Professional Title'}
                  </p>
                </div>

                {/* Story */}
                <div>
                  <h4 className="font-medium mb-2">Story</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {formData.story || 'Chef\'s story will appear here...'}
                  </p>
                </div>

                {/* Credentials */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                      <Award className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {formData.certification || 'Certification'}
                      </div>
                      <div className="text-xs text-muted-foreground">Food Safety</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {formData.experience || 'Experience'}
                      </div>
                      <div className="text-xs text-muted-foreground">Culinary Experience</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Preview Notes:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• This is a simplified preview</li>
                  <li>• Actual layout includes additional elements</li>
                  <li>• Changes are applied in real-time</li>
                  <li>• Save to update the live website</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Content Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">Chef Story Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Share personal background</li>
                  <li>• Mention family traditions</li>
                  <li>• Include passion for cooking</li>
                  <li>• Keep it authentic and warm</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Professional Image</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use high-quality photos</li>
                  <li>• Professional but approachable</li>
                  <li>• Consider kitchen or food setting</li>
                  <li>• Square format works best</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Credentials</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Include relevant certifications</li>
                  <li>• Mention years of experience</li>
                  <li>• Highlight specializations</li>
                  <li>• Build trust and credibility</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}