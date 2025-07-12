import { create } from "zustand";
import { toast } from "sonner";
import { immer } from "zustand/middleware/immer";
import brain from "brain";
import { ShoppingListResponse, ShoppingListItemResponse } from "brain/data-contracts";
import { useHouseholdStore } from "utils/householdStore";

interface ShoppingListState {
  shoppingLists: ShoppingListResponse[];
  isLoading: boolean;
  error: string | null;
  fetchShoppingLists: () => Promise<void>;
  createShoppingList: (name: string) => Promise<void>;
  deleteList: (listId: string) => Promise<void>;
  selectedList: ShoppingListDetails | null;
  fetchListDetails: (listId: string) => Promise<void>;
  addItem: (listId: string, itemName: string) => Promise<void>;
  updateItem: (
    listId: string,
    itemId: string,
    update: { name?: string; quantity?: number; purchased?: boolean }
  ) => Promise<void>;
  deleteItem: (listId: string, itemId: string) => Promise<void>;
  // Polling management
  listsPolling: boolean;
  itemsPolling: boolean;
  listsPollInterval: NodeJS.Timeout | null;
  itemsPollInterval: NodeJS.Timeout | null;
  startListsPolling: () => void;
  stopListsPolling: () => void;
  startItemsPolling: (listId: string) => void;
  stopItemsPolling: () => void;
}

interface ShoppingListDetails extends ShoppingListResponse {
  items: ShoppingListItemResponse[];
}

export const useShoppingListStore = create<ShoppingListState>()(
  immer((set, get) => ({
    shoppingLists: [],
    isLoading: false,
    error: null,
    listsPolling: false,
    itemsPolling: false,
    listsPollInterval: null,
    itemsPollInterval: null,
    selectedList: null,

    // Polling for shopping lists
    startListsPolling: () => {
      const { household } = useHouseholdStore.getState();
      const householdId = household?.id;
      if (!householdId || householdId.trim() === '') {
        console.warn("No household ID available for shopping lists polling");
        return;
      }

      // Check if already polling
      const currentState = get();
      if (currentState.listsPolling || currentState.listsPollInterval) {
        console.log('Shopping lists polling already active, skipping');
        return;
      }

      console.log('Starting shopping lists polling for household:', householdId);

      // Start polling every 3 seconds
      const interval = setInterval(async () => {
        try {
          const response = await brain.get_shopping_lists();
          if (response.ok) {
            const lists = await response.json();
            
            // Only update if lists actually changed
            const currentLists = get().shoppingLists;
            if (JSON.stringify(currentLists) !== JSON.stringify(lists)) {
              console.log('Shopping lists updated via polling, count:', lists.length);
              set(state => {
                state.shoppingLists = lists;
                state.error = null;
              });
            }
          }
        } catch (error) {
          console.error("Error in shopping lists polling:", error);
          set(state => {
            state.error = 'Shopping lists sync temporarily unavailable';
          });
        }
      }, 3000);

      set(state => {
        state.listsPollInterval = interval;
        state.listsPolling = true;
      });
    },

    stopListsPolling: () => {
      const { listsPollInterval } = get();
      if (listsPollInterval) {
        console.log('Stopping shopping lists polling');
        clearInterval(listsPollInterval);
        set(state => {
          state.listsPollInterval = null;
          state.listsPolling = false;
        });
      }
    },

    startItemsPolling: (listId: string) => {
      // Stop any existing items polling
      get().stopItemsPolling();
      
      // Validate listId
      if (!listId || listId.trim() === '') {
        console.warn('Cannot start items polling: invalid listId');
        return;
      }
      
      console.log('Starting shopping list items polling for listId:', listId);

      // Start polling every 3 seconds
      const interval = setInterval(async () => {
        try {
          const itemsResponse = await brain.get_shopping_list_items({ listId });
          if (itemsResponse.ok) {
            const items = await itemsResponse.json();
            
            // Only update if items actually changed
            const currentItems = get().selectedList?.items || [];
            if (JSON.stringify(currentItems) !== JSON.stringify(items)) {
              console.log('Shopping list items updated via polling, count:', items.length);
              set(state => {
                if (state.selectedList && state.selectedList.id === listId) {
                  state.selectedList.items = items;
                }
              });
            }
          }
        } catch (error) {
          console.error("Error in shopping list items polling:", error);
          set(state => {
            state.error = 'Shopping list items sync temporarily unavailable';
          });
        }
      }, 3000);

      set(state => {
        state.itemsPollInterval = interval;
        state.itemsPolling = true;
      });
    },

    stopItemsPolling: () => {
      const { itemsPollInterval } = get();
      if (itemsPollInterval) {
        console.log('Stopping shopping list items polling');
        clearInterval(itemsPollInterval);
        set(state => {
          state.itemsPollInterval = null;
          state.itemsPolling = false;
        });
      }
    },

    fetchShoppingLists: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await brain.get_shopping_lists();
        if (response.ok) {
          const lists = await response.json();
          set({ shoppingLists: lists, isLoading: false });
          // Note: Don't auto-start polling here - let components manage when to poll
        } else {
          throw new Error("Failed to fetch shopping lists.");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred.";
        set({ error: errorMessage, isLoading: false });
        toast.error("Failed to load shopping lists.", {
          description: errorMessage,
        });
      }
    },

    createShoppingList: async (name: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await brain.create_shopping_list({ name });
        if (response.ok) {
          // Immediately refresh lists
          await get().fetchShoppingLists();
          toast.success("Shopping list created successfully!");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to create shopping list.");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred.";
        set({ error: errorMessage, isLoading: false });
        toast.error("Failed to create shopping list.", {
          description: errorMessage,
        });
      }
    },

    deleteList: async (listId: string) => {
      try {
        await brain.delete_shopping_list({ listId });
        // Immediately refresh lists
        await get().fetchShoppingLists();
        toast.success("Shopping list deleted successfully!");
      } catch (error) {
        set({ error: "Failed to delete list." });
        toast.error("Failed to delete shopping list.");
      }
    },

    fetchListDetails: async (listId) => {
      set({ isLoading: true });
      try {
        const listDetails = get().shoppingLists.find(l => l.id === listId);
        
        if (listDetails) {
          const itemsResponse = await brain.get_shopping_list_items({ listId });
          if (itemsResponse.ok) {
            const items = await itemsResponse.json();
            set({
              selectedList: { ...listDetails, items },
              isLoading: false,
              error: null,
            });
            // Start polling for items
            get().startItemsPolling(listId);
          } else {
            throw new Error("Failed to fetch list items");
          }
        } else {
            throw new Error("List not found");
        }
      } catch (error) {
        set({
          isLoading: false,
          error: "Failed to fetch list details.",
          selectedList: null,
        });
      }
    },

    addItem: async (listId, name) => {
        try {
            const response = await brain.add_shopping_list_item({ listId }, { name, quantity: 1 });
            if (response.ok) {
              // Immediately refresh items
              const itemsResponse = await brain.get_shopping_list_items({ listId });
              if (itemsResponse.ok) {
                const items = await itemsResponse.json();
                set(state => {
                  if (state.selectedList && state.selectedList.id === listId) {
                    state.selectedList.items = items;
                  }
                });
              }
              toast.success("Item added successfully!");
            } else {
              throw new Error("Failed to add item");
            }
        } catch (error) {
            set({ error: "Failed to add item." });
            toast.error("Failed to add item.");
        }
    },

    updateItem: async (listId, itemId, update) => {
        try {
            const response = await brain.update_shopping_list_item(
              { itemId, list_id: listId },
              { name: update.name || "", quantity: update.quantity || 1 }
            );
            if (response.ok) {
              // Immediately refresh items
              const itemsResponse = await brain.get_shopping_list_items({ listId });
              if (itemsResponse.ok) {
                const items = await itemsResponse.json();
                set(state => {
                  if (state.selectedList && state.selectedList.id === listId) {
                    state.selectedList.items = items;
                  }
                });
              }
            } else {
              throw new Error("Failed to update item");
            }
        } catch (error) {
            set({ error: "Failed to update item."});
            toast.error("Failed to update item.");
        }
    },

    deleteItem: async (listId, itemId) => {
        try {
            const response = await brain.delete_shopping_list_item({ itemId, list_id: listId });
            if (response.ok) {
              // Immediately refresh items
              const itemsResponse = await brain.get_shopping_list_items({ listId });
              if (itemsResponse.ok) {
                const items = await itemsResponse.json();
                set(state => {
                  if (state.selectedList && state.selectedList.id === listId) {
                    state.selectedList.items = items;
                  }
                });
              }
              toast.success("Item deleted successfully!");
            } else {
              throw new Error("Failed to delete item");
            }
        } catch (error) {
            set({ error: "Failed to delete item."});
            toast.error("Failed to delete item.");
        }
    }
  }))
);
