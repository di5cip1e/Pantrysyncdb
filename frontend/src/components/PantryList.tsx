import React, { useState, useEffect } from "react";
import { usePantryStore } from "utils/pantryStore";
import { PantryItemResponse } from "types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Package, Users, Star, StarOff, Plus, X, Mic } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import brain from "brain";
import { toast } from "sonner";

interface Props {
  householdId: string;
  selectedCategory: string;
}

const PantryList: React.FC<Props> = ({ householdId, selectedCategory }) => {
  const { 
    items, // Fixed: use 'items' instead of 'pantryItems: items'
    isLoading, 
    error, 
    isPolling,
    startPolling, 
    stopPolling, 
    updatePantryItem, 
    deletePantryItem 
  } = usePantryStore();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PantryItemResponse | null>(null);
  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState(1);
  const [editVoiceLabels, setEditVoiceLabels] = useState<string[]>([]);
  const [newVoiceLabel, setNewVoiceLabel] = useState("");

  // Start polling when component mounts
  useEffect(() => {
    if (householdId) {
      console.log('Starting pantry polling for household:', householdId);
      startPolling(householdId);
    }
    
    // Cleanup: stop polling when component unmounts
    return () => {
      console.log('Stopping pantry polling');
      stopPolling();
    };
  }, [householdId, startPolling, stopPolling]);

  const handleEditClick = (item: PantryItemResponse) => {
    setSelectedItem(item);
    setEditName(item.name);
    setEditQuantity(item.quantity);
    setEditVoiceLabels(item.voice_labels || []);
    setNewVoiceLabel("");
    setIsEditDialogOpen(true);
  };

  const addVoiceLabel = () => {
    if (newVoiceLabel.trim() && !editVoiceLabels.includes(newVoiceLabel.trim()) && editVoiceLabels.length < 5) {
      setEditVoiceLabels([...editVoiceLabels, newVoiceLabel.trim()]);
      setNewVoiceLabel("");
    }
  };

  const removeVoiceLabel = (index: number) => {
    setEditVoiceLabels(editVoiceLabels.filter((_, i) => i !== index));
  };

  const handleUpdate = () => {
    if (selectedItem) {
      updatePantryItem(householdId, selectedItem.id, {
        name: editName,
        quantity: editQuantity,
        voice_labels: editVoiceLabels,
      });
      setIsEditDialogOpen(false);
    }
  };

  const handleDelete = (itemId: string) => {
    deletePantryItem(householdId, itemId);
  };

  const toggleStapleStatus = async (item: PantryItemResponse) => {
    try {
      await brain.toggle_staple_status(
        { householdId, itemId: item.id },
        { is_staple: !item.is_staple }
      );
      
      toast.success(item.is_staple ? 'Removed from staples' : 'Added to staples');
      
      // The real-time sync should update the items automatically
    } catch (err) {
      console.error('Error toggling staple status:', err);
      toast.error('Failed to update staple status');
    }
  };

  // Filter items by category
  const filteredItems = items.filter((item) => {
    if (selectedCategory === "all") return true;
    // Add category filtering logic here when categories are implemented
    return true;
  });

  if (isLoading && !isPolling) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-primary font-mono">Loading pantry items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-400 font-mono">Error: {error}</div>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Package className="h-12 w-12 text-gray-500 mb-4" />
        <div className="text-primary font-mono mb-2">No items in pantry</div>
        <div className="text-gray-400 text-sm font-mono">
          Add your first item to get started
        </div>
        {isPolling && (
          <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Live sync active
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Real-time sync indicator */}
      {isPolling && (
        <div className="flex items-center gap-2 text-xs text-green-400 mb-4">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <Users className="h-3 w-3" />
          Live collaboration active
        </div>
      )}
      
      {/* Items list */}
      <div className="grid gap-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-black/40 border border-primary/20 rounded p-4 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    {item.is_staple && (
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    )}
                    <h3 className="text-primary font-mono font-semibold">
                      {item.display_name || item.name}
                    </h3>
                  </div>
                  <Badge variant="outline" className="text-xs text-primary">
                    Qty: {item.quantity}
                  </Badge>
                  {item.is_staple && (
                    <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400">
                      STAPLE
                    </Badge>
                  )}
                </div>
                
                {/* Voice Labels */}
                {item.voice_labels && item.voice_labels.length > 0 && (
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs text-gray-400 font-mono">Voice:</span>
                    {item.voice_labels.map((label, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        "{label}"
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="text-xs text-gray-400 font-mono">
                  Added by: {item.added_by}
                  {item.usage_count !== undefined && item.usage_count > 0 && (
                    <span className="ml-2">• Used {item.usage_count} times</span>
                  )}
                </div>
                {item.expiry_date && (
                  <div className="text-xs text-yellow-400 font-mono">
                    Expires: {new Date(item.expiry_date).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleStapleStatus(item)}
                  className={`h-8 w-8 p-0 ${
                    item.is_staple 
                      ? 'border-yellow-500/30 hover:border-yellow-500/60' 
                      : 'border-gray-500/30 hover:border-yellow-500/60'
                  }`}
                >
                  {item.is_staple ? (
                    <StarOff className="h-3 w-3 text-yellow-400" />
                  ) : (
                    <Star className="h-3 w-3 text-gray-400 hover:text-yellow-400" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditClick(item)}
                  className="h-8 w-8 p-0 border-primary/30 hover:border-primary/60"
                >
                  <Edit className="h-3 w-3 text-primary" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(item.id)}
                  className="h-8 w-8 p-0 border-red-500/30 hover:border-red-500/60"
                >
                  <Trash2 className="h-3 w-3 text-red-400" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black/90 border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-primary font-mono">Edit Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="text-primary font-mono">
                Name
              </Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-black/20 border-primary/30 text-primary"
              />
            </div>
            <div>
              <Label htmlFor="edit-quantity" className="text-primary font-mono">
                Quantity
              </Label>
              <Input
                id="edit-quantity"
                type="number"
                value={editQuantity}
                onChange={(e) => setEditQuantity(Number(e.target.value))}
                className="bg-black/20 border-primary/30 text-primary"
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="edit-voice-labels" className="text-primary font-mono">
                Voice Labels
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="edit-voice-labels"
                  value={newVoiceLabel}
                  onChange={(e) => setNewVoiceLabel(e.target.value)}
                  className="bg-black/20 border-primary/30 text-primary"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addVoiceLabel}
                  className="h-8 w-8 p-0 border-primary/30 hover:border-primary/60"
                >
                  <Plus className="h-3 w-3 text-primary" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {editVoiceLabels.map((label, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    "{label}"
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeVoiceLabel(index)}
                      className="h-8 w-8 p-0 border-primary/30 hover:border-primary/60"
                    >
                      <X className="h-3 w-3 text-primary" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-primary/30 text-primary hover:border-primary/60"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              className="bg-primary text-black hover:bg-primary/80"
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PantryList;
