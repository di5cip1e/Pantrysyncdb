import React, { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useShoppingListStore } from "utils/shoppingListStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, ShoppingCart, Package, CheckCircle, Wifi } from "lucide-react";
import { toast } from "sonner";
import ShoppingListScanner from "components/ShoppingListScanner";

function ShoppingListDetail() {
  const [searchParams] = useSearchParams();
  const listId = searchParams.get('listId');
  const {
    selectedList,
    isLoading,
    error,
    fetchListDetails,
    addItem,
    updateItem,
    deleteItem,
    stopItemsPolling,
  } = useShoppingListStore();
  const [newItemName, setNewItemName] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);

  useEffect(() => {
    if (listId) {
      fetchListDetails(listId);
    }
    
    // Cleanup function to stop listeners when component unmounts
    return () => {
      stopItemsPolling();
    };
  }, [listId, fetchListDetails, stopItemsPolling]);

  const handleAddItem = async () => {
    if (newItemName.trim() && listId) {
      setIsAddingItem(true);
      try {
        await addItem(listId, newItemName.trim());
        setNewItemName("");
      } finally {
        setIsAddingItem(false);
      }
    }
  };

  const handleTogglePurchased = async (itemId: string, currentPurchased: boolean) => {
    if (listId) {
      await updateItem(listId, itemId, { purchased: !currentPurchased });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (listId) {
      await deleteItem(listId, itemId);
    }
  };

  if (isLoading) {
    return (
      <main className="container mx-auto p-4 flex justify-center items-center h-screen scanline">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-2xl text-primary font-mono-upper">Loading items...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto p-4 flex flex-col justify-center items-center h-screen scanline">
        <div className="text-center">
          <Package className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-2xl text-red-500 font-mono-upper mb-4">{error}</p>
          <Button asChild variant="pipboy">
            <Link to="/shopping-lists">Back to Lists</Link>
          </Button>
        </div>
      </main>
    );
  }

  const completedItems = selectedList?.items?.filter(item => item.purchased) || [];
  const pendingItems = selectedList?.items?.filter(item => !item.purchased) || [];
  const totalItems = selectedList?.items?.length || 0;
  const completedCount = completedItems.length;
  const progressPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto scanline">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button asChild variant="pipboy-outline" size="sm">
            <Link to="/shopping-lists" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Lists
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-primary font-mono-upper tracking-wider flex items-center gap-3">
              <ShoppingCart className="h-10 w-10" />
              {selectedList?.name || "Shopping List"}
            </h1>
            <p className="text-primary/70 font-mono text-sm mt-1">
              ✨ Real-time sync: Changes appear instantly for all household members
            </p>
          </div>
          <div className="flex items-center gap-4 ml-12">
            <Badge variant="outline" className="text-primary border-primary font-mono">
              {totalItems} items total
            </Badge>
            <Badge 
              variant={completedCount === totalItems && totalItems > 0 ? "default" : "secondary"}
              className={`font-mono ${completedCount === totalItems && totalItems > 0 ? "bg-green-600" : ""}`}
            >
              {completedCount} completed ({progressPercentage}%)
            </Badge>
            <Badge variant="outline" className="text-green-400 border-green-400 flex items-center gap-1 font-mono">
              <Wifi className="h-3 w-3" />
              Live sync
            </Badge>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </header>

      {/* Add New Item */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Item
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Enter item name (e.g., Milk, Bread, Apples)"
              className="flex-grow"
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              disabled={isAddingItem}
            />
            <Button 
              onClick={handleAddItem} 
              variant="pipboy"
              disabled={!newItemName.trim() || isAddingItem}
            >
              {isAddingItem ? "Adding..." : "Add Item"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shopping List Scanner */}
      <div className="mb-6">
        <ShoppingListScanner 
          listId={listId!} 
          onItemsAdded={() => {
            // Refresh the list after items are added
            fetchListDetails(listId!);
            toast.success("Items added to your list!");
          }} 
        />
      </div>

      {/* Shopping Items */}
      <div className="grid gap-6">
        {/* Pending Items */}
        {pendingItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Shopping List ({pendingItems.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-4 bg-black/30 border-2 border-primary/30 rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Checkbox
                        id={`item-${item.id}`}
                        checked={item.purchased}
                        onCheckedChange={() => handleTogglePurchased(item.id, item.purchased)}
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                      <label
                        htmlFor={`item-${item.id}`}
                        className="text-lg text-primary font-mono cursor-pointer flex-1"
                      >
                        {item.name}
                      </label>
                      {item.quantity && item.quantity > 1 && (
                        <Badge variant="outline" className="text-primary border-primary/50">
                          Qty: {item.quantity}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completed Items */}
        {completedItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                Completed ({completedItems.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-4 bg-green-900/20 border-2 border-green-600/30 rounded-lg"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Checkbox
                        id={`item-${item.id}`}
                        checked={item.purchased}
                        onCheckedChange={() => handleTogglePurchased(item.id, item.purchased)}
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                      <label
                        htmlFor={`item-${item.id}`}
                        className="text-lg text-green-400 font-mono line-through cursor-pointer flex-1"
                      >
                        {item.name}
                      </label>
                      {item.quantity && item.quantity > 1 && (
                        <Badge variant="outline" className="text-green-400 border-green-400/50">
                          Qty: {item.quantity}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {totalItems === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <ShoppingCart className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                <p className="text-center text-primary/70 font-mono mb-2">This list is empty</p>
                <p className="text-center text-primary/50 text-sm mb-4">Add your first item to get started</p>
                <Button 
                  onClick={() => document.getElementById('new-item-input')?.focus()}
                  variant="pipboy"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add First Item
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ShoppingListDetail;
