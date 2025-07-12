import React, { useState, useRef } from 'react';
import { useZxing } from 'react-zxing';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, X, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import brain from 'brain';
import { toast } from 'sonner';

export interface Props {
  onProductFound?: (product: any) => void;
  onClose?: () => void;
  isOpen: boolean;
}

export default function BarcodeScanner({ onProductFound, onClose, isOpen }: Props) {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showContributeForm, setShowContributeForm] = useState(false);
  const [contributionData, setContributionData] = useState({
    name: '',
    brand: '',
    category: '',
    description: ''
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  const { ref } = useZxing({
    onDecodeResult(result) {
      const code = result.getText();
      if (code && code !== lastScannedCode) {
        setLastScannedCode(code);
        handleBarcodeDetected(code);
      }
    },
    onError(error) {
      console.error('Barcode scanning error:', error);
      toast.error('Error accessing camera. Please check permissions.');
    },
  });

  const handleBarcodeDetected = async (code: string) => {
    setIsLoading(true);
    try {
      console.log('Scanned barcode:', code);
      
      // Use enhanced UPC lookup API that combines basic + enhanced data
      const response = await brain.get_enhanced_upc_info({ upc: code });
      const data = await response.json();
      
      // Check if we got basic product info
      const basicProduct = data.basic_product_info?.product;
      const enhancedProduct = data.enhanced_product_info;
      
      if (data.basic_product_info?.success && basicProduct) {
        // Prefer enhanced name if available, fallback to basic name
        const productName = enhancedProduct?.enhanced_name || enhancedProduct?.base_name || basicProduct.name;
        
        toast.success(`Found: ${productName}`);
        
        // Call the callback with combined product info
        if (onProductFound) {
          onProductFound({
            name: productName,
            brand: basicProduct.brand,
            category: enhancedProduct?.category || basicProduct.category,
            image_url: basicProduct.image_url,
            ingredients: basicProduct.ingredients,
            nutrition_grade: basicProduct.nutrition_grade,
            // Enhanced metadata
            enhanced_name: enhancedProduct?.enhanced_name,
            subcategory: enhancedProduct?.subcategory,
            tags: enhancedProduct?.tags || [],
            storage_tips: enhancedProduct?.storage_tips,
            typical_shelf_life: enhancedProduct?.typical_shelf_life,
            upc: code,
            has_enhancement: data.has_enhancement
          });
        }
        
        // Close the scanner
        stopScanning();
      } else {
        // Product not found - show contribution form
        setShowContributeForm(true);
        setIsScanning(false);
        toast.info('Product not found. Help us build our database!');
      }
    } catch (error) {
      console.error('Error looking up product:', error);
      // Also show contribution form on error
      setShowContributeForm(true);
      setIsScanning(false);
      toast.info('Product not found. Help us build our database!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContributeProduct = async () => {
    if (!contributionData.name.trim() || !lastScannedCode) {
      toast.error('Product name is required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await brain.create_community_product({
        upc: lastScannedCode,
        name: contributionData.name.trim(),
        brand: contributionData.brand.trim() || null,
        category: contributionData.category || null,
        description: contributionData.description.trim() || null
      });
      
      const newProduct = await response.json();
      
      toast.success(`Thank you! Added "${newProduct.name}" to our community database.`);
      
      // Call the callback with the new product
      if (onProductFound) {
        onProductFound({
          name: newProduct.name,
          brand: newProduct.brand,
          category: newProduct.category,
          description: newProduct.description,
          upc: lastScannedCode,
          source: 'community'
        });
      }
      
      // Reset and close
      resetForm();
      stopScanning();
    } catch (error) {
      console.error('Error contributing product:', error);
      toast.error('Failed to add product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setContributionData({
      name: '',
      brand: '',
      category: '',
      description: ''
    });
    setShowContributeForm(false);
    setLastScannedCode(null);
  };

  const startScanning = () => {
    setIsScanning(true);
    setLastScannedCode(null);
    setShowContributeForm(false);
  };

  const stopScanning = () => {
    setIsScanning(false);
    resetForm();
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {showContributeForm ? 'Add New Product' : 'Barcode Scanner'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={stopScanning}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showContributeForm ? (
            // Product contribution form
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700">
                  <Plus className="h-4 w-4" />
                  <span className="text-sm font-medium">Help Build Our Database</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  UPC: {lastScannedCode} - This product isn't in our database yet.
                </p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="product-name">Product Name *</Label>
                  <Input
                    id="product-name"
                    placeholder="e.g., Organic Whole Milk"
                    value={contributionData.name}
                    onChange={(e) => setContributionData({...contributionData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="product-brand">Brand</Label>
                  <Input
                    id="product-brand"
                    placeholder="e.g., Horizon, Coca-Cola"
                    value={contributionData.brand}
                    onChange={(e) => setContributionData({...contributionData, brand: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="product-category">Category</Label>
                  <Select value={contributionData.category} onValueChange={(value) => setContributionData({...contributionData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="produce">Produce</SelectItem>
                      <SelectItem value="dairy">Dairy</SelectItem>
                      <SelectItem value="meat">Meat & Seafood</SelectItem>
                      <SelectItem value="pantry">Pantry Staples</SelectItem>
                      <SelectItem value="frozen">Frozen</SelectItem>
                      <SelectItem value="beverages">Beverages</SelectItem>
                      <SelectItem value="snacks">Snacks</SelectItem>
                      <SelectItem value="health">Health & Beauty</SelectItem>
                      <SelectItem value="household">Household</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="product-description">Description (Optional)</Label>
                  <Textarea
                    id="product-description"
                    placeholder="Any additional details about this product"
                    value={contributionData.description}
                    onChange={(e) => setContributionData({...contributionData, description: e.target.value})}
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleContributeProduct} 
                  disabled={!contributionData.name.trim() || isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Adding...' : 'Add Product'}
                </Button>
                <Button variant="outline" onClick={() => setShowContributeForm(false)}>
                  Scan Again
                </Button>
              </div>
            </div>
          ) : !isScanning ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Point your camera at a barcode to scan it
              </p>
              <Button onClick={startScanning} className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Start Scanning
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={ref}
                  className="w-full h-64 object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                
                {/* Scanning overlay */}
                <div className="absolute inset-0 border-2 border-red-500 border-dashed animate-pulse" />
                
                {/* Corner guides */}
                <div className="absolute top-4 left-4 w-6 h-6 border-l-4 border-t-4 border-white" />
                <div className="absolute top-4 right-4 w-6 h-6 border-r-4 border-t-4 border-white" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-4 border-b-4 border-white" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-4 border-b-4 border-white" />
                
                {isLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-4 flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                      <span className="text-sm">Looking up product...</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Position the barcode within the scanning area
                </p>
                {lastScannedCode && (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Scanned: {lastScannedCode}</span>
                  </div>
                )}
              </div>
              
              <Button variant="outline" onClick={stopScanning} className="w-full">
                Cancel Scanning
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
