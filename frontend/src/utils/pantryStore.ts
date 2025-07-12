import { create } from "zustand";
import brain from "brain";
import { PantryItemResponse } from "types";
import { Toaster, toast } from "sonner";

interface PantryState {
  items: PantryItemResponse[];
  isLoading: boolean;
  error: string | null;
  isPolling: boolean;
  pollInterval: NodeJS.Timeout | null;
  fetchPantryItems: () => Promise<void>;
  startPolling: (householdId: string) => void;
  stopPolling: () => void;
  addPantryItem: (householdId: string, item: { name: string; quantity: number }) => Promise<void>;
  updatePantryItem: (householdId: string, itemId: string, updates: { name?: string; quantity?: number }) => Promise<void>;
  deletePantryItem: (householdId: string, itemId: string) => Promise<void>;
}

export const usePantryStore = create<PantryState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  isPolling: false,
  pollInterval: null,
  
  fetchPantryItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await brain.get_pantry_items();
      if (response.ok) {
        const items = await response.json();
        set({ items: items, isLoading: false }); // Fixed: use 'items' not 'pantryItems'
        // Note: Don't auto-start polling here - let components manage when to poll
      } else {
        throw new Error("Failed to fetch pantry items.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      set({ error: errorMessage, isLoading: false });
      toast.error("Failed to load pantry items.", {
        description: errorMessage,
      });
    }
  },
  
  startPolling: (householdId) => {
    const state = get();
    
    // Don't start if already polling
    if (state.isPolling || state.pollInterval) {
      console.log('Pantry polling already active, skipping');
      return;
    }
    
    // Validate householdId
    if (!householdId || householdId.trim() === '') {
      console.warn('Cannot start polling: invalid householdId');
      return;
    }
    
    console.log('Starting pantry polling for household:', householdId);
    
    // Start polling every 3 seconds
    const interval = setInterval(async () => {
      try {
        const response = await brain.get_pantry_items({ householdId });
        const items = await response.json();
        
        // Only update if items actually changed to avoid unnecessary re-renders
        const currentItems = get().items;
        if (JSON.stringify(currentItems) !== JSON.stringify(items)) {
          console.log('Pantry items updated via polling, count:', items.length);
          set({ items, error: null });
        }
      } catch (error) {
        console.error('Error in pantry polling:', error);
        // Don't show frequent error toasts during polling
        set({ error: 'Sync temporarily unavailable' });
      }
    }, 3000); // Poll every 3 seconds
    
    set({ pollInterval: interval, isPolling: true });
  },
  
  stopPolling: () => {
    const state = get();
    
    if (state.pollInterval) {
      console.log('Stopping pantry polling');
      clearInterval(state.pollInterval);
      set({ pollInterval: null, isPolling: false });
    }
  },
  
  addPantryItem: async (householdId, item) => {
    try {
      const response = await brain.add_pantry_item({ householdId }, item);
      const newItem = await response.json();
      // Immediately refresh to show the new item
      await get().fetchPantryItems(householdId);
      toast.success(`'${newItem.name}' has been added to the pantry.`);
    } catch (error) {
      const errorMessage = "Failed to add item.";
      set({ error: errorMessage });
      toast.error(errorMessage);
    }
  },
  
  updatePantryItem: async (householdId, itemId, updates) => {
    try {
      const response = await brain.update_pantry_item({ householdId, itemId }, updates);
      const updatedItem = await response.json();
      // Immediately refresh to show the updated item
      await get().fetchPantryItems(householdId);
      toast.success(`'${updatedItem.name}' has been updated.`);
    } catch (error) {
      const errorMessage = "Failed to update item.";
      set({ error: errorMessage });
      toast.error(errorMessage);
    }
  },
  
  deletePantryItem: async (householdId, itemId) => {
    try {
      await brain.delete_pantry_item({ householdId, itemId });
      // Immediately refresh to remove the deleted item
      await get().fetchPantryItems(householdId);
      toast.success("Item deleted successfully.");
    } catch (error) {
      const errorMessage = "Failed to delete item.";
      toast.error(errorMessage);
    }
  },
}));
