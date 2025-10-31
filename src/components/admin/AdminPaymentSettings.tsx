import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { motion } from 'motion/react';
import { CreditCard, Key, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentGateway {
  id: string;
  name: string;
  enabled: boolean;
  testMode: boolean;
  credentials: {
    [key: string]: string;
  };
}

export function AdminPaymentSettings() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [showCredentials, setShowCredentials] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadPaymentSettings();
  }, []);

  const loadPaymentSettings = () => {
    try {
      const saved = localStorage.getItem('payment-gateways');
      if (saved) {
        setGateways(JSON.parse(saved));
      } else {
        // Initialize with only Elavon
        const defaultGateways: PaymentGateway[] = [
          {
            id: 'elavon',
            name: 'Elavon',
            enabled: true,
            testMode: false,
            credentials: {
              merchantId: '',
              apiKey: '',
              terminalId: ''
            }
          }
        ];
        setGateways(defaultGateways);
        localStorage.setItem('payment-gateways', JSON.stringify(defaultGateways));
      }
    } catch (error) {
      console.error('Error loading payment settings:', error);
    }
  };

  const savePaymentSettings = (updatedGateways: PaymentGateway[]) => {
    try {
      setGateways(updatedGateways);
      localStorage.setItem('payment-gateways', JSON.stringify(updatedGateways));
      toast.success('Payment settings saved successfully');
    } catch (error) {
      console.error('Error saving payment settings:', error);
      toast.error('Failed to save payment settings');
    }
  };

  const updateGateway = (gatewayId: string, updates: Partial<PaymentGateway>) => {
    const updatedGateways = gateways.map(gateway =>
      gateway.id === gatewayId ? { ...gateway, ...updates } : gateway
    );
    savePaymentSettings(updatedGateways);
  };

  const updateCredential = (gatewayId: string, credentialKey: string, value: string) => {
    const updatedGateways = gateways.map(gateway =>
      gateway.id === gatewayId 
        ? {
            ...gateway,
            credentials: {
              ...gateway.credentials,
              [credentialKey]: value
            }
          }
        : gateway
    );
    setGateways(updatedGateways);
  };

  const saveCredentials = (gatewayId: string) => {
    savePaymentSettings(gateways);
  };

  const toggleCredentialVisibility = (gatewayId: string, credentialKey: string) => {
    const key = `${gatewayId}-${credentialKey}`;
    setShowCredentials(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getCredentialFields = () => {
    return [
      { key: 'merchantId', label: 'Merchant ID', placeholder: '123456789' },
      { key: 'apiKey', label: 'API Key', placeholder: 'api_key_...', sensitive: true },
      { key: 'terminalId', label: 'Terminal ID', placeholder: 'terminal_...', sensitive: true }
    ];
  };

  const isGatewayConfigured = (gateway: PaymentGateway) => {
    const requiredFields = getCredentialFields();
    return requiredFields.every(field => gateway.credentials[field.key]?.trim());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div>
        <h2 className="text-2xl font-bold mb-2">Payment Gateway Settings</h2>
        <p className="text-muted-foreground">
          Configure Elavon payment gateway to accept online payments. Ensure all credentials are kept secure.
        </p>
      </div> */}

      {/* Security Notice */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-orange-800 mb-1">Security Notice</h4>
                <p className="text-sm text-orange-700">
                  Payment gateway credentials are sensitive information. Store them securely and never share them. 
                  Always use test credentials during development and switch to live credentials only when ready for production.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div> */}

      {/* Payment Gateways */}
      <div className="grid grid-cols-1 gap-6">
        {gateways.map((gateway, index) => (
          <motion.div
            key={gateway.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={`${gateway.enabled ? 'ring-2 ring-primary/20' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded-lg">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        {gateway.name}
                        {gateway.enabled && (
                          <Badge variant="secondary" className="text-sm">
                            {isGatewayConfigured(gateway) ? 'Configured' : 'Needs Setup'}
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-lg text-muted-foreground mt-1">
                        Enterprise payment processing with Elavon. Secure and reliable payment gateway.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isGatewayConfigured(gateway) && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    <Switch
                      checked={gateway.enabled}
                      onCheckedChange={(enabled) => updateGateway(gateway.id, { enabled })}
                    />
                  </div>
                </div>
              </CardHeader>

              {gateway.enabled && (
                <CardContent className="space-y-4">
                  {/* Test Mode Toggle */}
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <Label className="font-medium text-lg">Test Mode</Label>
                      <p className="text-md text-muted-foreground">
                        Use test credentials for development
                      </p>
                    </div>
                    <Switch
                      checked={gateway.testMode}
                      onCheckedChange={(testMode) => updateGateway(gateway.id, { testMode })}
                    />
                  </div>

                  {/* Credentials */}
                  <div className="space-y-4">
                    <Label className="text-md font-medium">API Credentials</Label>
                    {getCredentialFields().map((field) => {
                      const credentialKey = `${gateway.id}-${field.key}`;
                      const isVisible = showCredentials[credentialKey];
                      const value = gateway.credentials[field.key] || '';

                      return (
                        <div key={field.key} className="space-y-2">
                          <Label htmlFor={credentialKey} className="text-lg">
                            {field.label}
                          </Label>
                          <div className="relative">
                            <Input
                              id={credentialKey}
                              type={field.sensitive && !isVisible ? 'password' : 'text'}
                              value={value}
                              onChange={(e) => updateCredential(gateway.id, field.key, e.target.value)}
                              placeholder={field.placeholder}
                              className="text-sm"
                            />
                            {field.sensitive && (
                              <button
                                type="button"
                                onClick={() => toggleCredentialVisibility(gateway.id, field.key)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {isVisible ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <EyeOff className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <Button
                      onClick={() => saveCredentials(gateway.id)}
                      size="sm"
                      className="w-full text-lg"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Save Credentials
                    </Button>
                  </div>

                  {/* Gateway Status */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-lg">
                      <span>Status:</span>
                      <Badge variant={isGatewayConfigured(gateway) ? 'default' : 'secondary'}>
                        {isGatewayConfigured(gateway) ? 'Ready' : 'Incomplete'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-lg mt-1">
                      <span>Environment:</span>
                      <Badge variant={gateway.testMode ? 'outline' : 'default'}>
                        {gateway.testMode ? 'Test' : 'Production'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}