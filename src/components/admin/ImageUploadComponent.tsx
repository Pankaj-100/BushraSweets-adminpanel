import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Upload, Image as ImageIcon, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUploadSingleImageMutation } from '../../store/cmsApi';

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
  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // only in state

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadSingleImage] = useUploadSingleImageMutation();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const response: any = await uploadSingleImage(file).unwrap();
      if (response?.imageUrl) {
        const imageUrl = response.imageUrl;
        const newUploadedImages = [...uploadedImages, imageUrl];
        setUploadedImages(newUploadedImages); 
        onChange(imageUrl);
        toast.success('Image uploaded successfully!');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUrlChange = (url: string) => onChange(url);
  const handleClearImage = () => onChange('');

  const handleDeleteUploaded = (imageUrl: string) => {
    const updatedImages = uploadedImages.filter(img => img !== imageUrl);
    setUploadedImages(updatedImages);

    if (value === imageUrl) onChange('');
    toast.success('Image deleted successfully');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label htmlFor="image-input">{label}</Label>
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
            <Button type="button" variant="outline" size="sm" onClick={handleClearImage} className="px-3">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="mt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full">
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

      {value && (
        <div>
          <Label className="text-sm">Current Image</Label>
        
              <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted">
                <ImageWithFallback src={value} alt="Preview" className="object-cover" />
              </div>
      
        </div>
      )}

      {/* {uploadedImages.length > 0 && (
        <div>
          <Label className="text-sm">Your Uploaded Images</Label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            {uploadedImages.map((imageUrl, index) => (
              <div key={index} className="relative group cursor-pointer rounded-md overflow-hidden hover:ring-2 hover:ring-primary transition-all">
                <ImageWithFallback src={imageUrl} alt={`Uploaded ${index + 1}`} className=" " onClick={() => onChange(imageUrl)} />
                {value === imageUrl && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-primary text-white p-1 rounded-full">
                      <ImageIcon className="h-3 w-3" />
                    </div>
                  </div>
                )}
                <Button type="button" variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteUploaded(imageUrl); }} className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}
