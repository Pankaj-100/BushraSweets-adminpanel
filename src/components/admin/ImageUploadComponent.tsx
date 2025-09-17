import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Upload, Link, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ImageUploadComponentProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function ImageUploadComponent({
  value,
  onChange,
  label = "Image",
  placeholder = "Enter image URL or upload file",
  className = ""
}: ImageUploadComponentProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>(() => {
    // Load saved uploaded images from localStorage
    const saved = localStorage.getItem('uploaded-images');
    return saved ? JSON.parse(saved) : [];
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64 for demo purposes
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        
        // Create a mock URL for the uploaded image
        const imageId = Date.now().toString();
        const mockUrl = `data:${file.type};base64,${base64String.split(',')[1]}`;
        
        // Save to uploaded images list
        const newUploadedImages = [...uploadedImages, mockUrl];
        setUploadedImages(newUploadedImages);
        localStorage.setItem('uploaded-images', JSON.stringify(newUploadedImages));
        
        // Set as current image
        onChange(mockUrl);
        toast.success('Image uploaded successfully!');
        setIsUploading(false);
      };
      
      reader.onerror = () => {
        toast.error('Failed to upload image');
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to upload image');
      setIsUploading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
  };

  const handleClearImage = () => {
    onChange('');
  };

  const handleDeleteUploaded = (imageUrl: string) => {
    const updatedImages = uploadedImages.filter(img => img !== imageUrl);
    setUploadedImages(updatedImages);
    localStorage.setItem('uploaded-images', JSON.stringify(updatedImages));
    
    if (value === imageUrl) {
      onChange('');
    }
    
    toast.success('Image deleted successfully');
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1571167530149-c1105870ab78?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1606471191009-63f1e9ec901b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400&h=300&fit=crop'
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label htmlFor="image-input">{label}</Label>
        
        {/* URL Input */}
        <div className="flex gap-2 mt-1">
          <Input
            id="image-input"
            type="text"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          {value && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearImage}
              className="px-3"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* File Upload */}
        <div className="mt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Current Image Preview */}
      {value && (
        <div>
          <Label className="text-sm">Current Image</Label>
          <Card className="mt-1">
            <CardContent className="p-3">
              <div className="relative w-full h-32 rounded-md overflow-hidden bg-muted">
                <ImageWithFallback
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Uploaded Images Gallery */}
      {uploadedImages.length > 0 && (
        <div>
          <Label className="text-sm">Your Uploaded Images</Label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            {uploadedImages.map((imageUrl, index) => (
              <div
                key={index}
                className="relative group cursor-pointer rounded-md overflow-hidden hover:ring-2 hover:ring-primary transition-all"
              >
                <ImageWithFallback
                  src={imageUrl}
                  alt={`Uploaded image ${index + 1}`}
                  className="w-full h-16 object-cover"
                  onClick={() => onChange(imageUrl)}
                />
                {value === imageUrl && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-primary text-white p-1 rounded-full">
                      <ImageIcon className="h-3 w-3" />
                    </div>
                  </div>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteUploaded(imageUrl);
                  }}
                  className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sample Images */}
      <div>
        <Label className="text-sm">Sample Images</Label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {sampleImages.map((url, index) => (
            <div
              key={index}
              className="relative cursor-pointer rounded-md overflow-hidden hover:ring-2 hover:ring-primary transition-all"
              onClick={() => onChange(url)}
            >
              <ImageWithFallback
                src={url}
                alt={`Sample image ${index + 1}`}
                className="w-full h-16 object-cover"
              />
              {value === url && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="bg-primary text-white p-1 rounded-full">
                    <ImageIcon className="h-3 w-3" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Usage Tips */}
      <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded">
        <p className="font-medium mb-1">Tips:</p>
        <ul className="space-y-1">
          <li>• Upload images up to 5MB in size</li>
          <li>• Use high-quality images for best results</li>
          <li>• Supported formats: JPG, PNG, GIF, WebP</li>
          <li>• Uploaded images are saved for reuse</li>
        </ul>
      </div>
    </div>
  );
}