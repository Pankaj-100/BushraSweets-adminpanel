import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Save, Edit, FileText, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation
} from '../../store/orderApi';

// Loader component
const Loader = () => (
  <div className="flex justify-center items-center py-20">
    <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// React Quill modules configuration
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script',
  'blockquote', 'code-block',
  'list', 'bullet', 'indent',
  'direction', 'align',
  'link', 'image', 'video'
];

export function AdminPrivacyPolicyManager() {
  const { data: policyResponse, isLoading, refetch } = useGetPrivacyPolicyQuery();
  const [updatePrivacyPolicy, { isLoading: isUpdating }] = useUpdatePrivacyPolicyMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [content, setContent] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  // Extract data from API response
  const policyData = policyResponse?.data;

  useEffect(() => {
    if (policyData) {
      setContent(policyData.content || '');
      setLastUpdated(policyData.updatedAt || '');
    }
  }, [policyData]);

  const handleSave = async () => {
    if (!content.trim() || content === '<p><br></p>') {
      toast.error('Privacy Policy content cannot be empty');
      return;
    }

    try {
      await updatePrivacyPolicy({ content }).unwrap();
      toast.success('Privacy Policy updated successfully!');
      setIsDialogOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update Privacy Policy');
    }
  };

  const handleEdit = () => {
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never updated';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-end" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
      >

        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleEdit} className="text-lg">
              <Edit className="h-4 w-4 mr-2" />
              {content ? 'Edit Policy' : 'Create Policy'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] w-full">
            <DialogHeader>
              <DialogTitle className="text-lg">
                {content ? 'Edit Privacy Policy' : 'Create Privacy Policy'}
              </DialogTitle>
              <DialogDescription className="text-lg">
                {content 
                  ? 'Update your privacy policy content using the rich text editor.' 
                  : 'Create your privacy policy content using the rich text editor.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="privacy-content" className="mb-2 text-lg block">
                  Privacy Policy Content *
                </Label>
                <div className="border rounded-lg overflow-hidden">
                  <ReactQuill
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    theme="snow"
                    style={{ 
                      height: '400px',
                      border: 'none'
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSave} 
                  className="flex-1 text-lg"
                  disabled={isUpdating}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isUpdating ? 'Saving...' : (content ? 'Update Policy' : 'Create Policy')}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Current Policy Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Current Privacy Policy</h3>
                <p className="text-sm text-muted-foreground">
                  {lastUpdated ? `Last updated: ${formatDate(lastUpdated)}` : 'No policy content yet'}
                </p>
              </div>
            </div>

            {isLoading ? (
              <Loader />
            ) : content ? (
              <div className="bg-muted/50 p-6 rounded-lg max-h-96 overflow-y-auto">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No privacy policy content</h3>
                <p className="text-muted-foreground mb-4">
                  Start by creating your privacy policy content
                </p>
                <Button onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Create Policy
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}