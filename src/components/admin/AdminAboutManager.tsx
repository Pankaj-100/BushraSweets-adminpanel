import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { motion } from 'motion/react';
import { Save, Eye, User, FileText, Award } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner';
import { useGetAboutQuery, useEditAboutMutation, useUploadSingleImageMutation } from '../../store/cmsApi';
import { ImageUploadComponent } from './ImageUploadComponent';

export function AdminAboutManager() {
  const { data, isLoading, isError } = useGetAboutQuery();
  const [editAbout, { isLoading: isSaving }] = useEditAboutMutation();
  const [uploadImage] = useUploadSingleImageMutation();

  const [formData, setFormData] = useState({
    chefName: '',
    professionalTitle: '',
    chefStory: '',
    chefPhoto: '',
    certification: '',
    experience: ''
  });

  useEffect(() => {
    if (data?.about) {
      setFormData({
        chefName: data.about.chefName,
        professionalTitle: data.about.professionalTitle,
        chefStory: data.about.chefStory,
        chefPhoto: data.about.chefPhoto,
        certification: data.about.certification,
        experience: data.about.experience
      });
    }
  }, [data]);

  const handleSave = async () => {
    if (!formData.chefName || !formData.chefStory) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await editAbout(formData).unwrap();
      toast.success('About section updated successfully!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update About section');
    }
  };

  const handleReset = () => {
    if (data?.about) {
      setFormData({
        chefName: data.about.chefName,
        professionalTitle: data.about.professionalTitle,
        chefStory: data.about.chefStory,
        chefPhoto: data.about.chefPhoto,
        certification: data.about.certification,
        experience: data.about.experience
      });
      toast.info('Changes reset to saved version');
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const res = await uploadImage(file).unwrap();
      if (res?.url) {
        setFormData(prev => ({ ...prev, chefPhoto: res.url }));
        toast.success('Chef photo uploaded successfully!');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Image upload failed');
    }
  };

  if (isLoading) return <p>Loading About section...</p>;
  if (isError) return <p>Failed to load About section</p>;

  const sampleImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h2 className="text-2xl font-bold mb-2">About Section Management</h2>
        <p className="text-muted-foreground">Manage the chef's profile, story, and credentials</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Edit Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-6">
          {/* Basic Info */}
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
                />
              </div>

              <div>
                <Label htmlFor="professionalTitle">Professional Title</Label>
                <Input
                  id="professionalTitle"
                  value={formData.professionalTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, professionalTitle: e.target.value }))}
                />
              </div>

              <div>
                <Label>Chef Photo</Label>
                <ImageUploadComponent
                  value={formData.chefPhoto}
                  onChange={(url) => setFormData(prev => ({ ...prev, chefPhoto: url }))}
                  onFileUpload={handleImageUpload}
                  placeholder="Enter URL or upload file"
                />

                {/* Sample Photos */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {sampleImages.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative cursor-pointer rounded-md overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                      onClick={() => setFormData(prev => ({ ...prev, chefPhoto: url }))}
                    >
                      <ImageWithFallback src={url} alt={`Chef option ${idx + 1}`} className="w-full h-20 object-cover" />
                      {formData.chefPhoto === url && (
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

          {/* Story & Credentials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Story & Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="chefStory">Chef's Story *</Label>
                <Textarea
                  id="chefStory"
                  value={formData.chefStory}
                  onChange={(e) => setFormData(prev => ({ ...prev, chefStory: e.target.value }))}
                  rows={5}
                />
              </div>

              <div>
                <Label htmlFor="certification">Certification</Label>
                <Input
                  id="certification"
                  value={formData.certification}
                  onChange={(e) => setFormData(prev => ({ ...prev, certification: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1" disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" /> {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={handleReset}>Reset</Button>
          </div>
        </motion.div>

        {/* Live Preview */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 text-center">
                <ImageWithFallback
                  src={formData.chefPhoto}
                  alt={formData.chefName}
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                />
                <h3 className="text-xl font-bold">{formData.chefName || 'Chef Name'}</h3>
                <p className="text-muted-foreground">{formData.professionalTitle}</p>
                <div>
                  <h4 className="font-medium mb-1">Story</h4>
                  <p className="text-sm text-muted-foreground">{formData.chefStory || 'Chef story goes here...'}</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg"><Award className="h-4 w-4" /></div>
                    <div>
                      <div className="font-medium text-sm">{formData.certification || 'Certification'}</div>
                      <div className="text-xs text-muted-foreground">Food Safety</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg"><User className="h-4 w-4" /></div>
                    <div>
                      <div className="font-medium text-sm">{formData.experience || 'Experience'}</div>
                      <div className="text-xs text-muted-foreground">Culinary Experience</div>
                    </div>
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
