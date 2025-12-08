// src/components/admin/AdminDeliveryChargesManager.tsx
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Save, Truck, Percent, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { 
  useGetChargesQuery,
  useUpdateChargesMutation,
  useSetChargesMutation
} from '../../store/orderApi';
import { Loader2 } from 'lucide-react';

export function AdminDeliveryChargesManager() {
  const { data: response, isLoading, refetch } = useGetChargesQuery();
  const [updateCharges, { isLoading: isUpdating }] = useUpdateChargesMutation();
  const [setCharges, { isLoading: isSetting }] = useSetChargesMutation();

  const [charges, setChargesState] = useState({
    delivery: 0,
    gst: 0
  });

  const [isSaved, setIsSaved] = useState(true);

  // Get charges from response
  const chargesData = response?.charges;

  // Initialize state when API data arrives
  useEffect(() => {
    if (chargesData) {
      setChargesState({
        delivery: chargesData.delivery || 0,
        gst: chargesData.gst || 0
      });
      setIsSaved(true);
    }
  }, [chargesData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    setChargesState(prev => ({ 
      ...prev, 
      [name]: isNaN(numValue) ? 0 : numValue 
    }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    try {
      // Check if charges already exist
      const hasExistingCharges = !!chargesData;
      
      if (hasExistingCharges) {
        // Update existing charges
        await updateCharges({
          delivery: charges.delivery,
          gst: charges.gst
        }).unwrap();
      } else {
        // Set new charges
        await setCharges({
          delivery: charges.delivery,
          gst: charges.gst
        }).unwrap();
      }

      toast.success('Delivery charges saved successfully!');
      setIsSaved(true);
      refetch(); // Refresh the data
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save delivery charges');
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
     
        <div className="flex items-center gap-2">
      
          <Button 
            onClick={handleSave} 
            disabled={isUpdating || isSetting || isSaved}
          >
            {isUpdating || isSetting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isSaved ? 'Saved' : 'Save Changes'}
              </>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configure Charges</CardTitle>
          <CardDescription>
            Enter delivery charge amount and GST percentage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Charge Field */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-500" />
                <Label htmlFor="delivery" className="text-lg font-medium">
                  Delivery Charge ($)
                </Label>
              </div>
              <Input
                id="delivery"
                name="delivery"
                type="number"
                min="0"
                step="0.01"
                value={charges.delivery}
                onChange={handleChange}
                placeholder="0.00"
                className="text-lg h-12"
              />
              <p className="text-sm text-muted-foreground">
                Flat delivery fee applied to all orders
              </p>
            </div>

            {/* GST Field */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-green-500" />
                <Label htmlFor="gst" className="text-lg font-medium">
                  GST Percentage (%)
                </Label>
              </div>
              <Input
                id="gst"
                name="gst"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={charges.gst}
                onChange={handleChange}
                placeholder="0.00"
                className="text-lg h-12"
              />
              <p className="text-sm text-muted-foreground">
                GST rate applied to order total
              </p>
            </div>
          </div>

          {/* Current Values Display */}
          <div className="border rounded-lg p-4 bg-muted/20">
            <h3 className="font-medium mb-3">Current Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Delivery Charge:</span>
                <span className="font-bold text-blue-600">${charges.delivery.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium">GST Rate:</span>
                <span className="font-bold text-green-600">{charges.gst}%</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              {chargesData ? (
                <div className="text-green-600">✓ Charges are configured</div>
              ) : (
                <div className="text-amber-600">⚠ No charges configured yet</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}