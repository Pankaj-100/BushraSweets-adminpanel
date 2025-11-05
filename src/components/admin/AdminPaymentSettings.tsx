import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { motion } from 'motion/react';
import { CreditCard, Eye, EyeOff, AlertTriangle, CheckCircle, Save } from 'lucide-react';
import { toast } from 'sonner';
import { 
  useGetPaymentConfigQuery, 
  useUpdatePaymentConfigMutation 
} from '../../store/orderApi';

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

  // API hooks
  const { data: paymentConfig, isLoading, refetch } = useGetPaymentConfigQuery();
  const [updatePaymentConfig, { isLoading: isUpdating }] = useUpdatePaymentConfigMutation();

  useEffect(() => {
    loadPaymentSettings();
  }, [paymentConfig]);

  const loadPaymentSettings = () => {
    try {
      if (paymentConfig?.config) {
        // Use API data
        const apiGateway: PaymentGateway = {
          id: 'elavon',
          name: 'Elavon',
          enabled: true,
          testMode: false,
          credentials: {
            ssl_account_id: paymentConfig.config.ssl_account_id || '',
            ssl_user_id: paymentConfig.config.ssl_user_id || '',
            ssl_pin: paymentConfig.config.ssl_pin || ''
          }
        };
        setGateways([apiGateway]);
      } else {
        // Initialize with empty gateway if no API data
        const defaultGateway: PaymentGateway = {
          id: 'elavon',
          name: 'Elavon',
          enabled: true,
          testMode: false,
          credentials: {
            ssl_account_id: '',
            ssl_user_id: '',
            ssl_pin: ''
          }
        };
        setGateways([defaultGateway]);
      }
    } catch (error) {
      console.error('Error loading payment settings:', error);
      toast.error('Failed to load payment configuration');
    }
  };

  const savePaymentSettings = async (updatedGateways: PaymentGateway[]) => {
    try {
      setGateways(updatedGateways);
      
      // Save to API only
      const gateway = updatedGateways[0]; // Only one gateway (Elavon)
      if (gateway) {
        const configData = {
          ssl_account_id: gateway.credentials.ssl_account_id,
          ssl_user_id: gateway.credentials.ssl_user_id,
          ssl_pin: gateway.credentials.ssl_pin
        };

        await updatePaymentConfig(configData).unwrap();
        toast.success('Payment configuration saved successfully');
        refetch(); // Refresh the config data
      }
    } catch (error: any) {
      console.error('Error saving payment settings:', error);
      toast.error(error?.data?.message || 'Failed to save payment configuration');
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
      { key: 'ssl_account_id', label: 'SSL Account ID', placeholder: '21505' },
      { key: 'ssl_user_id', label: 'SSL User ID', placeholder: 'apiuser', sensitive: true },
      { key: 'ssl_pin', label: 'SSL PIN', placeholder: 'BNNFA921E7E70P8KD1CWD...', sensitive: true }
    ];
  };

  const isGatewayConfigured = (gateway: PaymentGateway) => {
    const requiredFields = getCredentialFields();
    return requiredFields.every(field => gateway.credentials[field.key]?.trim());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading payment configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
  

      {/* API Status */}
      {paymentConfig?.config && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-800 mb-1">Configuration Synced</h4>
                  <p className="text-sm text-green-700">
                    Your payment configuration is securely stored on the server and will be used for all transactions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

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
                      onCheckedChange={(enabled: boolean) => updateGateway(gateway.id, { enabled })}
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
                      onCheckedChange={(testMode:any) => updateGateway(gateway.id, { testMode })}
                    />
                  </div>

                  {/* Credentials */}
                  <div className="space-y-4">
                    <Label className="text-md font-medium">SSL Credentials</Label>
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
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Configuration
                        </>
                      )}
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
                    <div className="flex items-center justify-between text-lg mt-1">
                      <span>Storage:</span>
                      <Badge variant="default">
                        Server
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