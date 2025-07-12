import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useShoppingListStore } from "utils/shoppingListStore";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUserGuardContext } from "app/auth";
import { Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useHouseholdStore } from "utils/householdStore";

// Define the type for a single shopping list to use in our state
type ShoppingList = {
  id: string;
  name: string;
};

const ShoppingLists = () => {
  const { shoppingLists, isLoading, error, createShoppingList, deleteList, fetchShoppingLists, stopListsPolling, startListsPolling } =
    useShoppingListStore();
  const [newListName, setNewListName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  // State to manage which list is targeted for deletion
  const [listToDelete, setListToDelete] = useState<ShoppingList | null>(null);
  const navigate = useNavigate();
  const { user } = useUserGuardContext();
  const { household, fetchHousehold, fetchAttempted } = useHouseholdStore();

  useEffect(() => {
    // Ensure household is fetched when component mounts
    if (user && !fetchAttempted) {
      fetchHousehold();
    }
  }, [user, fetchHousehold, fetchAttempted]);

  useEffect(() => {
    fetchShoppingLists();
  }, [fetchShoppingLists]);

  // Start polling when household becomes available and component is mounted
  useEffect(() => {
    if (household?.id) {
      console.log('Household available, starting shopping lists polling');
      startListsPolling();
    }
    
    // Cleanup function to stop polling when component unmounts or household changes
    return () => {
      console.log('ShoppingLists component unmounting, stopping polling');
      stopListsPolling();
    };
  }, [household?.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListsPolling();
    };
  }, []);

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      toast.error("Please enter a name for the shopping list.");
      return;
    }
    await createShoppingList(newListName.trim());
    setNewListName("");
    setShowCreateForm(false);
  };

  const handleDeleteList = async (list: ShoppingList) => {
    setListToDelete(list);
  };

  const handleConfirmDelete = async () => {
    if (!listToDelete) return;
    await deleteList(listToDelete.id);
    setListToDelete(null); // Close the dialog
    toast.success(`List "${listToDelete.name}" was deleted.`);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto scanline">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary font-mono-upper tracking-wider flex items-center gap-3">
          <ShoppingCart className="h-10 w-10" />
          SHOPPING LISTS
        </h1>
        <p className="text-primary font-mono mt-2">
          Manage all household shopping lists, {user?.displayName || user?.primaryEmail}.
        </p>
        <p className="text-primary/70 font-mono text-sm mt-1">
          ✨ Real-time sync: Changes appear instantly for all household members
        </p>
      </header>

      <div className="grid gap-6">
        {/* Create New List Section */}
        <Card className="bg-black/80 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-primary font-mono-upper">
              Create New Shopping List
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                variant="pipboy"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {showCreateForm ? "Cancel" : "New List"}
              </Button>
            </CardTitle>
          </CardHeader>
          {showCreateForm && (
            <CardContent>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="new-list-name" className="sr-only">
                    List Name
                  </Label>
                  <Input
                    id="new-list-name"
                    type="text"
                    placeholder="Enter list name (e.g., Weekly Groceries)"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
                    className="bg-black/50 border-primary/30 text-primary font-mono placeholder:text-primary/50"
                  />
                </div>
                <Button
                  onClick={handleCreateList}
                  variant="pipboy"
                  disabled={!newListName.trim() || isLoading}
                >
                  {isLoading ? "Creating..." : "Create"}
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Shopping Lists Section */}
        <Card className="bg-black/80 border-primary/30">
          <CardHeader>
            <CardTitle className="text-primary font-mono-upper">Your Shopping Lists ({shoppingLists.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-primary font-mono">Loading lists...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-red-500 font-mono">{error}</p>
              </div>
            ) : shoppingLists.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCart className="h-16 w-16 text-primary/50 mb-4" />
                <p className="text-primary/70 font-mono mb-2">No shopping lists yet</p>
                <p className="text-primary/50 font-mono text-sm mb-4">Create your first list to get started</p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  variant="pipboy"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create First List
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {shoppingLists.map((list) => (
                  <div
                    key={list.id}
                    className="flex justify-between items-center p-4 bg-black/50 border-2 border-primary/30 rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                      <span className="text-xl text-primary font-mono">
                        {list.name}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="pipboy">
                        <Link to={`/shopping-list-detail?listId=${list.id}`}>
                          View Items
                        </Link>
                      </Button>
                      <Button
                        variant="pipboy-outline"
                        size="icon"
                        onClick={() => handleDeleteList(list)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!listToDelete}
        onOpenChange={(isOpen) => !isOpen && setListToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              the <strong>{listToDelete?.name}</strong> shopping list and all its items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete List
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ShoppingLists;
