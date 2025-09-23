import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { motion } from 'motion/react';
import { Save, Phone, Mail, MapPin, Truck, Facebook, Instagram, MessageCircle, Twitter, Linkedin, Youtube, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  useGetBusinessInfoQuery,
  useEditBusinessInfoMutation,
  useGetSocialsQuery,
  useEditSocialsMutation
} from '../../store/cmsApi';

export function AdminSiteSettings() {
  const { data: businessData, isLoading: isBusinessLoading } = useGetBusinessInfoQuery();
  const [editBusinessInfo, { isLoading: isSavingBusiness }] = useEditBusinessInfoMutation();

  const { data: socialsData, isLoading: isSocialsLoading } = useGetSocialsQuery();
  const [editSocials, { isLoading: isSavingSocials }] = useEditSocialsMutation();

  const [businessSettings, setBusinessSettings] = useState({
    businessName: '',
    phone: '',
    email: '',
    address: '',
    deliveryInfo: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      whatsapp: '',
      twitter: '',
      linkedIn: '',
      youTube: ''
    }
  });
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Initialize state when API data arrives
  useEffect(() => {
    if (businessData?.businessInfo) {
      setBusinessSettings(prev => ({
        ...prev,
        businessName: businessData.businessInfo.businessName || '',
        phone: businessData.businessInfo.phone || '',
        email: businessData.businessInfo.email || '',
        address: businessData.businessInfo.businessAddress || '',
        deliveryInfo: businessData.businessInfo.deliveryInformation || ''
      }));
    }
   if (socialsData?.social) { // ✅ use 'social' not 'socials'
    setBusinessSettings(prev => ({
      ...prev,
      socialMedia: {
        facebook: socialsData.social.facebook || '',
        instagram: socialsData.social.instagram || '',
        whatsapp: socialsData.social.whatsapp || '',
        twitter: socialsData.social.twitter || '',
        linkedIn: socialsData.social.linkedIn || '',
        youTube: socialsData.social.youTube || ''
      }
    }));
  }
}, [businessData, socialsData]);
  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusinessSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setBusinessSettings(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      await editBusinessInfo({
        businessName: businessSettings.businessName,
        businessAddress: businessSettings.address,
        email: businessSettings.email,
        deliveryInformation: businessSettings.deliveryInfo
      }).unwrap();

      await editSocials({
        facebook: businessSettings.socialMedia.facebook,
        instagram: businessSettings.socialMedia.instagram,
        whatsapp: businessSettings.socialMedia.whatsapp,
        twitter: businessSettings.socialMedia.twitter,
        linkedIn: businessSettings.socialMedia.linkedIn,
        youTube: businessSettings.socialMedia.youTube
      }).unwrap();

      toast.success('Site settings saved successfully!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save settings');
    }
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast.success(`${fieldName} copied to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  if (isBusinessLoading || isSocialsLoading) return <p>Loading site settings...</p>;

  const socialPlatforms = [
    { id: 'facebook', name: 'Facebook', icon: <Facebook className="h-4 w-4" />, placeholder: 'https://facebook.com/bushrassweets' },
    { id: 'instagram', name: 'Instagram', icon: <Instagram className="h-4 w-4" />, placeholder: 'https://instagram.com/bushrassweets' },
    { id: 'whatsapp', name: 'WhatsApp', icon: <MessageCircle className="h-4 w-4" />, placeholder: 'https://wa.me/15551234567' },
    { id: 'twitter', name: 'Twitter', icon: <Twitter className="h-4 w-4" />, placeholder: 'https://twitter.com/bushrassweets' },
    { id: 'linkedIn', name: 'LinkedIn', icon: <Linkedin className="h-4 w-4" />, placeholder: 'https://linkedin.com/company/bushrassweets' },
    { id: 'youTube', name: 'YouTube', icon: <Youtube className="h-4 w-4" />, placeholder: 'https://youtube.com/@bushrassweets' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Site Settings</h2>
          <p className="text-muted-foreground">Manage your business information and social media presence</p>
        </div>
        <Button onClick={handleSave} disabled={isSavingBusiness || isSavingSocials}>
          <Save className="h-4 w-4 mr-2" />
          {isSavingBusiness || isSavingSocials ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="business">Business Information</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-6">
          {/* Business Information */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" name="businessName" value={businessSettings.businessName} onChange={handleBusinessChange} placeholder="Your business name" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="phone" name="phone" value={businessSettings.phone} onChange={handleBusinessChange} placeholder="(555) 123-4567" className="pl-10" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" name="email" type="email" value={businessSettings.email} onChange={handleBusinessChange} placeholder="hello@bushrassweets.com" className="pl-10" />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea id="address" name="address" value={businessSettings.address} onChange={handleBusinessChange} placeholder="123 Sweet Lane, Flavor Town, ST 12345" className="pl-3" rows={3} />
                </div>
                <div>
                  <Label htmlFor="deliveryInfo">Delivery Information</Label>
                  <Textarea id="deliveryInfo" name="deliveryInfo" value={businessSettings.deliveryInfo} onChange={handleBusinessChange} placeholder="Free delivery on orders over $50" className="pl-3" rows={2} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          {/* Social Media */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5" /> Social Media Links</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {socialPlatforms.map(platform => {
                  const currentValue = businessSettings.socialMedia[platform.id as keyof typeof businessSettings.socialMedia] || '';
                  const isCopied = copiedField === platform.name;
                  return (
                    <Card key={platform.id} className="border-0 shadow-sm bg-muted/20 p-4 space-y-2">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-background p-2 rounded-lg">{platform.icon}</div>
                        <span className="font-medium text-sm">{platform.name}</span>
                        {currentValue && <Badge variant="secondary" className="ml-auto text-xs">Connected</Badge>}
                      </div>
                      <Input
                        value={currentValue}
                        onChange={(e) => handleSocialMediaChange(platform.id, e.target.value)}
                        placeholder={platform.placeholder}
                        className="text-sm"
                      />
                      {currentValue && (
                        <div className="flex gap-1 mt-1">
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(currentValue, platform.name)} className="p-2 h-9">
                            {isCopied ? <CheckCircle className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => window.open(currentValue, '_blank')} className="p-2 h-9">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
