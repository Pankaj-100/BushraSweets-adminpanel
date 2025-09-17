import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { motion } from 'motion/react';
import { useContent } from '../ContentContext';
import { Save, Phone, Mail, MapPin, Truck, Facebook, Instagram, MessageCircle, Twitter, Linkedin, Youtube, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function AdminSiteSettings() {
  const { content, updateContent } = useContent();
  const { siteSettings } = content;
  
  const [businessSettings, setBusinessSettings] = useState(siteSettings);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusinessSettings(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleSave = () => {
    updateContent('siteSettings', businessSettings);
    toast.success('Site settings saved successfully!');
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast.success(`${fieldName} copied to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const socialPlatforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="h-4 w-4" />,
      placeholder: 'https://facebook.com/bushrassweets',
      description: 'Your Facebook page URL'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="h-4 w-4" />,
      placeholder: 'https://instagram.com/bushrassweets',
      description: 'Your Instagram profile URL'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <MessageCircle className="h-4 w-4" />,
      placeholder: 'https://wa.me/15551234567',
      description: 'WhatsApp contact link (wa.me format)'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter className="h-4 w-4" />,
      placeholder: 'https://twitter.com/bushrassweets',
      description: 'Your Twitter profile URL'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin className="h-4 w-4" />,
      placeholder: 'https://linkedin.com/company/bushrassweets',
      description: 'Your LinkedIn company page URL'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: <Youtube className="h-4 w-4" />,
      placeholder: 'https://youtube.com/@bushrassweets',
      description: 'Your YouTube channel URL'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Site Settings</h2>
          <p className="text-muted-foreground">Manage your business information and social media presence</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="business">Business Information</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-6">
          {/* Business Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={businessSettings.businessName}
                    onChange={handleBusinessChange}
                    placeholder="Your business name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        value={businessSettings.phone}
                        onChange={handleBusinessChange}
                        placeholder="(555) 123-4567"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={businessSettings.email}
                        onChange={handleBusinessChange}
                        placeholder="hello@bushrassweets.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Business Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      name="address"
                      value={businessSettings.address}
                      onChange={handleBusinessChange}
                      placeholder="123 Sweet Lane, Flavor Town, ST 12345"
                      className="pl-10"
                      rows={3}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="deliveryInfo">Delivery Information</Label>
                  <div className="relative">
                    <Truck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="deliveryInfo"
                      name="deliveryInfo"
                      value={businessSettings.deliveryInfo}
                      onChange={handleBusinessChange}
                      placeholder="Free delivery on orders over $50"
                      className="pl-10"
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          {/* Social Media Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Social Media Links
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Add your social media links to display them in the footer and contact sections.
                  Leave fields empty to hide specific platforms.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {socialPlatforms.map((platform) => {
                    const currentValue = businessSettings.socialMedia[platform.id as keyof typeof businessSettings.socialMedia] || '';
                    const isCopied = copiedField === platform.name;
                    
                    return (
                      <motion.div
                        key={platform.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: socialPlatforms.indexOf(platform) * 0.1 }}
                        className="space-y-3"
                      >
                        <Card className="border-0 shadow-sm bg-muted/20">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="bg-background p-2 rounded-lg">
                                {platform.icon}
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">{platform.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {platform.description}
                                </p>
                              </div>
                              {currentValue && (
                                <Badge variant="secondary" className="ml-auto">
                                  Connected
                                </Badge>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={platform.id} className="text-xs">
                                URL
                              </Label>
                              <div className="flex gap-2">
                                <Input
                                  id={platform.id}
                                  value={currentValue}
                                  onChange={(e) => handleSocialMediaChange(platform.id, e.target.value)}
                                  placeholder={platform.placeholder}
                                  className="text-sm"
                                />
                                
                                {currentValue && (
                                  <div className="flex gap-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => copyToClipboard(currentValue, platform.name)}
                                      className="p-2 h-9"
                                      title="Copy URL"
                                    >
                                      {isCopied ? (
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                      ) : (
                                        <Copy className="h-3 w-3" />
                                      )}
                                    </Button>
                                    
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => window.open(currentValue, '_blank')}
                                      className="p-2 h-9"
                                      title="Open in new tab"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Quick Setup Guide */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-blue-800 mb-2">Quick Setup Tips</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Copy the exact URL from your browser when visiting your social media pages</li>
                        <li>• For WhatsApp, use the format: https://wa.me/[country_code][phone_number]</li>
                        <li>• Test each link after saving to ensure they work correctly</li>
                        <li>• Only filled links will appear in your website footer and contact sections</li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Current Configuration Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Current Configuration</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Preview of how your social links will appear
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm mb-3">Active Social Links:</h5>
                        {socialPlatforms
                          .filter(platform => businessSettings.socialMedia[platform.id as keyof typeof businessSettings.socialMedia])
                          .map(platform => (
                            <div key={platform.id} className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded">
                              <div className="flex items-center gap-2">
                                {platform.icon}
                                <span>{platform.name}</span>
                              </div>
                              <Badge variant="secondary" className="text-xs">Active</Badge>
                            </div>
                          ))}
                        
                        {socialPlatforms.every(platform => 
                          !businessSettings.socialMedia[platform.id as keyof typeof businessSettings.socialMedia]
                        ) && (
                          <p className="text-sm text-muted-foreground italic">
                            No social media links configured yet
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}