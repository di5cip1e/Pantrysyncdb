import React, { useState } from "react";
import { usePantryStore } from "utils/pantryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Camera, Receipt, Plus } from "lucide-react";
import BarcodeScanner from "components/BarcodeScanner";
import ReceiptScanner from "components/ReceiptScanner";
import { toast } from "sonner";

interface Props {
  householdId: string;
}

const AddPantryItemForm: React.FC<Props> = ({ householdId }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showReceiptScanner, setShowReceiptScanner] = useState(false);
  const addPantryItem = usePantryStore((state) => state.addPantryItem);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addPantryItem(householdId, { name, quantity });
    setName("");
    setQuantity(1);
  };

  const handleProductFound = async (product: any) => {
    try {
      await addPantryItem(householdId, {
        name: product.name,
        quantity: 1
      });
      toast.success(`Added ${product.name} to pantry`);
    } catch (error) {
      console.error('Error adding scanned product:', error);
      toast.error('Failed to add product to pantry');
    }
  };

  const handleReceiptSuccess = () => {
    toast.success('Receipt items added successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Quick Add Options */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => setShowBarcodeScanner(true)}
          className="h-20 flex flex-col gap-2 bg-black/80 border-primary/30 hover:bg-primary/10"
        >
          <Camera className="h-6 w-6" />
          <span className="text-xs font-mono">SCAN BARCODE</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setShowReceiptScanner(true)}
          className="h-20 flex flex-col gap-2 bg-black/80 border-primary/30 hover:bg-primary/10"
        >
          <Receipt className="h-6 w-6" />
          <span className="text-xs font-mono">SCAN RECEIPT</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground font-mono">OR ADD MANUALLY</span>
        <Separator className="flex-1" />
      </div>
      
      {/* Manual Entry Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="font-mono text-primary">ITEM NAME</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Milk"
            required
            className="bg-black/80 border-primary/30"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity" className="font-mono text-primary">QUANTITY</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            required
            className="bg-black/80 border-primary/30"
          />
        </div>
        <Button type="submit" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </form>
      
      {/* Scanners */}
      <BarcodeScanner
        isOpen={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        onProductFound={handleProductFound}
      />
      
      <ReceiptScanner
        isOpen={showReceiptScanner}
        onClose={() => setShowReceiptScanner(false)}
        onSuccess={handleReceiptSuccess}
      />
    </div>
  );
};

export default AddPantryItemForm;
