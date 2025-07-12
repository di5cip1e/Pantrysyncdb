import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload, Loader2, FileImage, Check, X, Edit3 } from "lucide-react";
import { toast } from "sonner";
import brain from "brain";
import type { 
  ShoppingListScanResponse, 
  ShoppingListItem, 
  ShoppingListProcessRequest 
} from "types";

interface Props {
  listId: string;
  onItemsAdded: () => void;
}

interface ExtendedShoppingListItem extends ShoppingListItem {
  selected: boolean;
  editing: boolean;
}

const ShoppingListScanner = ({ listId, onItemsAdded }: Props) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState<ExtendedShoppingListItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [rawText, setRawText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsScanning(true);
    setShowResults(false);
    setScannedItems([]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await brain.scan_shopping_list({}, formData);
      const data: ShoppingListScanResponse = await response.json();

      if (response.ok) {
        const itemsWithSelection = data.items.map(item => ({
          ...item,
          selected: true,
          editing: false
        }));
        
        setScannedItems(itemsWithSelection);
        setRawText(data.raw_text);
        setShowResults(true);
        toast.success(`Found ${data.items.length} items in your shopping list!`);
      } else {
        throw new Error(data.message || 'Failed to scan shopping list');
      }
    } catch (error) {
      console.error('Error scanning shopping list:', error);
      toast.error('Failed to scan shopping list. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const toggleItemSelection = (index: number) => {
    setScannedItems(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const startEditingItem = (index: number) => {
    setScannedItems(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, editing: true } : { ...item, editing: false }
      )
    );
  };

  const saveItemEdit = (index: number, newName: string, newQuantity: number) => {
    setScannedItems(prev => 
      prev.map((item, i) => 
        i === index ? { 
          ...item, 
          name: newName.trim() || item.name,
          quantity: newQuantity || item.quantity, 
          editing: false 
        } : item
      )
    );
  };

  const cancelItemEdit = (index: number) => {
    setScannedItems(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, editing: false } : item
      )
    );
  };

  const removeItem = (index: number) => {
    setScannedItems(prev => prev.filter((_, i) => i !== index));
  };

  const addItemsToList = async () => {
    const selectedItems = scannedItems.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to add.');
      return;
    }

    setIsProcessing(true);

    try {
      const request: ShoppingListProcessRequest = {
        items: selectedItems,
        shopping_list_id: listId,
        add_to_list: true
      };

      const response = await brain.process_shopping_list_items(request);
      const data = await response.json();

      if (response.ok) {
        toast.success(`Successfully added ${selectedItems.length} items to your shopping list!`);
        setShowResults(false);
        setScannedItems([]);
        setRawText("");
        onItemsAdded();
      } else {
        throw new Error(data.detail || 'Failed to add items to shopping list');
      }
    } catch (error) {
      console.error('Error adding items:', error);
      toast.error('Failed to add items to shopping list. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedCount = scannedItems.filter(item => item.selected).length;

  return (
    <Card className="bg-black/80 border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary font-mono-upper">
          <Camera className="h-5 w-5" />
          Photo Shopping List Scanner
        </CardTitle>
        <p className="text-primary/70 font-mono text-sm">
          Take a photo of your handwritten or printed shopping list to convert it to digital
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showResults ? (
          <div className="space-y-4">
            {/* Upload Interface */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <Button
                  onClick={handleCameraCapture}
                  disabled={isScanning}
                  variant="pipboy"
                  className="flex-1 flex items-center gap-2"
                >
                  {isScanning ? (
                    <> 
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <> 
                      <Camera className="h-4 w-4" />
                      Take Photo
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                  variant="pipboy-outline"
                  className="flex-1 flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Image
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Instructions */}
            <div className="bg-black/50 p-4 rounded-lg border border-primary/20">
              <h4 className="text-primary font-mono-upper text-sm mb-2">📝 Tips for Best Results:</h4>
              <ul className="text-primary/70 font-mono text-xs space-y-1">
                <li>• Ensure good lighting and clear text</li>
                <li>• Hold the camera steady and focus the list</li>
                <li>• Works with handwritten or printed lists</li>
                <li>• Supports various formats (bullets, numbers, etc.)</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileImage className="h-5 w-5 text-green-400" />
                <span className="text-primary font-mono-upper">Scanned Items ({scannedItems.length})</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-primary border-primary font-mono">
                  {selectedCount} selected
                </Badge>
                <Button
                  onClick={() => setShowResults(false)}
                  variant="pipboy-outline"
                  size="sm"
                >
                  Scan Another
                </Button>
              </div>
            </div>

            {/* Scanned Items List */}
            {scannedItems.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {scannedItems.map((item, index) => (
                  <EditableShoppingItem
                    key={index}
                    item={item}
                    index={index}
                    onToggleSelection={() => toggleItemSelection(index)}
                    onStartEdit={() => startEditingItem(index)}
                    onSaveEdit={(name, quantity) => saveItemEdit(index, name, quantity)}
                    onCancelEdit={() => cancelItemEdit(index)}
                    onRemove={() => removeItem(index)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-primary/70 font-mono">No items found in the image</p>
                <p className="text-primary/50 font-mono text-sm mt-1">Try taking another photo with better lighting</p>
              </div>
            )}

            {/* Action Buttons */}
            {scannedItems.length > 0 && (
              <div className="flex gap-2 pt-4 border-t border-primary/20">
                <Button
                  onClick={addItemsToList}
                  disabled={selectedCount === 0 || isProcessing}
                  variant="pipboy"
                  className="flex-1"
                >
                  {isProcessing ? (
                    <> 
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Adding Items...
                    </>
                  ) : (
                    `Add ${selectedCount} Items to List`
                  )}
                </Button>
              </div>
            )}

            {/* Raw Text Debug (collapsible) */}
            {rawText && (
              <details className="bg-black/50 p-3 rounded border border-primary/20">
                <summary className="text-primary/70 font-mono text-xs cursor-pointer">Show raw extracted text</summary>
                <pre className="text-primary/60 font-mono text-xs mt-2 whitespace-pre-wrap">{rawText}</pre>
              </details>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Editable item component
interface EditableItemProps {
  item: ExtendedShoppingListItem;
  index: number;
  onToggleSelection: () => void;
  onStartEdit: () => void;
  onSaveEdit: (name: string, quantity: number) => void;
  onCancelEdit: () => void;
  onRemove: () => void;
}

const EditableShoppingItem = ({ 
  item, 
  index, 
  onToggleSelection, 
  onStartEdit, 
  onSaveEdit, 
  onCancelEdit, 
  onRemove 
}: EditableItemProps) => {
  const [editName, setEditName] = useState(item.name);
  const [editQuantity, setEditQuantity] = useState(item.quantity || 1);

  const handleSave = () => {
    onSaveEdit(editName, editQuantity);
  };

  const handleCancel = () => {
    setEditName(item.name);
    setEditQuantity(item.quantity || 1);
    onCancelEdit();
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
      item.selected ? 'bg-primary/10 border-primary/50' : 'bg-black/30 border-primary/20'
    }`}>
      <Checkbox
        checked={item.selected}
        onCheckedChange={onToggleSelection}
        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
      
      <div className="flex-1">
        {item.editing ? (
          <div className="flex gap-2">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 h-8 text-sm font-mono"
              placeholder="Item name"
            />
            <Input
              type="number"
              value={editQuantity}
              onChange={(e) => setEditQuantity(Number(e.target.value))}
              className="w-20 h-8 text-sm font-mono"
              min="1"
            />
            <Button onClick={handleSave} size="sm" variant="pipboy">
              <Check className="h-3 w-3" />
            </Button>
            <Button onClick={handleCancel} size="sm" variant="pipboy-outline">
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`font-mono ${
                item.selected ? 'text-primary' : 'text-primary/70'
              }`}>
                {item.name}
              </span>
              {(item.quantity && item.quantity > 1) && (
                <Badge variant="outline" className="text-xs">
                  {item.quantity} {item.unit || ''}
                </Badge>
              )}
            </div>
            <div className="flex gap-1">
              <Button onClick={onStartEdit} size="sm" variant="ghost">
                <Edit3 className="h-3 w-3" />
              </Button>
              <Button onClick={onRemove} size="sm" variant="ghost" className="text-red-400">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingListScanner;
