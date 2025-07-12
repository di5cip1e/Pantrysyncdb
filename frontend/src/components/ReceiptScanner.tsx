import React, { useState, useRef } from 'react';
import { Camera, Upload, X, CheckCircle, AlertCircle, Eye, ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import brain from 'brain';
import { ReceiptScanResponse, ReceiptItem, ReceiptProcessRequest } from 'types';

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReceiptScanner({ isOpen, onClose, onSuccess }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ReceiptScanResponse | null>(null);
  const [selectedItems, setSelectedItems] = useState<{ [key: number]: boolean }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRawText, setShowRawText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Auto-scan the receipt
    scanReceipt(file);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const scanReceipt = async (file: File) => {
    setIsScanning(true);
    setScanResults(null);
    setSelectedItems({});
    
    try {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size too large. Please use a file smaller than 10MB.');
      }
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await brain.scan_receipt({ file });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to process receipt`);
      }
      
      const data = await response.json() as ReceiptScanResponse;
      
      console.log('Receipt scan results:', data);
      
      if (!data.items || data.items.length === 0) {
        toast.warning('No grocery items found in this receipt. Try taking a clearer photo or check if it\'s a grocery receipt.');
        setScanResults({ ...data, items: [] });
        return;
      }
      
      setScanResults(data);
      
      // Pre-select all items
      const allSelected: { [key: number]: boolean } = {};
      data.items.forEach((_, index) => {
        allSelected[index] = true;
      });
      setSelectedItems(allSelected);
      
      toast.success(`Found ${data.items.length} items in receipt`);
      
    } catch (error) {
      console.error('Error scanning receipt:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to scan receipt. Please try again.';
      toast.error(errorMessage);
      
      // Set empty results to show the error state
      setScanResults({ items: [], raw_text: '', total_amount: null, store_name: null, date: null, processing_time: null });
    } finally {
      setIsScanning(false);
    }
  };

  const handleItemToggle = (index: number, checked: boolean) => {
    setSelectedItems(prev => ({
      ...prev,
      [index]: checked
    }));
  };

  const handleSelectAll = () => {
    const allSelected: { [key: number]: boolean } = {};
    scanResults?.items.forEach((_, index) => {
      allSelected[index] = true;
    });
    setSelectedItems(allSelected);
  };

  const handleSelectNone = () => {
    setSelectedItems({});
  };

  const handleAddToPantry = async () => {
    if (!scanResults) return;
    
    const itemsToAdd = scanResults.items.filter((_, index) => selectedItems[index]);
    
    if (itemsToAdd.length === 0) {
      toast.error('Please select at least one item to add');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const request: ReceiptProcessRequest = {
        items: itemsToAdd,
        add_to_pantry: true
      };
      
      const response = await brain.process_receipt_items(request);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to add items to pantry`);
      }
      
      const result = await response.json();
      
      toast.success(`Successfully added ${itemsToAdd.length} items to pantry`);
      
      if (onSuccess) {
        onSuccess();
      }
      
      handleClose();
      
    } catch (error) {
      console.error('Error adding items to pantry:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add items to pantry';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsScanning(false);
    setScanResults(null);
    setSelectedItems({});
    setIsProcessing(false);
    setShowRawText(false);
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    onClose();
  };

  const selectedCount = Object.values(selectedItems).filter(Boolean).length;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Receipt Scanner
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto space-y-4">
          {/* File Upload Section */}
          {!selectedFile && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-center space-y-4">
                    <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-medium">Scan Your Receipt</h3>
                      <p className="text-muted-foreground">
                        Take a photo or upload an image of your grocery receipt
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col gap-2"
                      onClick={() => cameraInputRef.current?.click()}
                    >
                      <Camera className="h-6 w-6" />
                      Take Photo
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-6 w-6" />
                      Upload Image
                    </Button>
                  </div>
                  
                  {/* Hidden file inputs */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Preview and Results */}
          {selectedFile && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Image Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Receipt Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Receipt preview"
                        className="w-full h-auto max-h-96 object-contain rounded-lg border"
                      />
                    )}
                    
                    {isScanning && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <div className="bg-white rounded-lg p-4 flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Scanning receipt...</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Different Image
                    </Button>
                    
                    {scanResults?.raw_text && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowRawText(!showRawText)}
                        className="w-full"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {showRawText ? 'Hide' : 'Show'} Raw Text
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Scan Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>Extracted Items</span>
                    {scanResults && (
                      <Badge variant="secondary">
                        {scanResults.items.length} items found
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isScanning && (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center space-y-2">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        <p className="text-sm text-muted-foreground">Processing receipt...</p>
                      </div>
                    </div>
                  )}
                  
                  {scanResults && (
                    <div className="space-y-4">
                      {/* Metadata */}
                      {(scanResults.store_name || scanResults.date || scanResults.total_amount) && (
                        <div className="text-sm space-y-1 p-3 bg-muted rounded-lg">
                          {scanResults.store_name && (
                            <div><strong>Store:</strong> {scanResults.store_name}</div>
                          )}
                          {scanResults.date && (
                            <div><strong>Date:</strong> {scanResults.date}</div>
                          )}
                          {scanResults.total_amount && (
                            <div><strong>Total:</strong> ${scanResults.total_amount.toFixed(2)}</div>
                          )}
                        </div>
                      )}
                      
                      {/* Item Selection Controls */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {selectedCount} of {scanResults.items.length} selected
                        </div>
                        <div className="space-x-2">
                          <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                            Select All
                          </Button>
                          <Button variant="ghost" size="sm" onClick={handleSelectNone}>
                            Select None
                          </Button>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Items List */}
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {scanResults.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
                            <Checkbox
                              checked={selectedItems[index] || false}
                              onCheckedChange={(checked) => handleItemToggle(index, checked as boolean)}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{item.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Qty: {item.quantity}
                                {item.price && ` • $${item.price.toFixed(2)}`}
                                {item.category && ` • ${item.category}`}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddToPantry}
                          disabled={selectedCount === 0 || isProcessing}
                          className="flex-1"
                        >
                          {isProcessing ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <ShoppingCart className="h-4 w-4 mr-2" />
                          )}
                          Add {selectedCount} Items to Pantry
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {!scanResults && !isScanning && selectedFile && (
                    <div className="text-center py-8">
                      <AlertCircle className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No items found in the receipt. Try taking a clearer photo.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Raw Text Display */}
          {showRawText && scanResults?.raw_text && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Raw OCR Text</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-32">
                  {scanResults.raw_text}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
