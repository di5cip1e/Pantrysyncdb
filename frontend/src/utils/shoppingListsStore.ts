import { create } from "zustand";
import brain from "brain";
import { toast } from "sonner";

interface ShoppingList {
  id: string;
  name: string;
}

interface ShoppingListsState {
  lists: ShoppingList[];
  loading: boolean;
  error: string | null;
  setLists: (lists: ShoppingList[]) => void;
  fetchLists: () => Promise<void>;
  addList: (name: string) => Promise<void>;
  removeList: (id: string) => Promise<void>;
}

export const useShoppingListsStore = create<ShoppingListsState>((set, get) => ({
  lists: [],
  loading: false,
  error: null,
  setLists: (lists) => set({ lists }),
  fetchLists: async () => {
    set({ loading: true, error: null });
    try {
      const response = await brain.get_shopping_lists();
      const data = await response.json();
      set({ lists: data, loading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      set({ error: errorMessage, loading: false });
      toast.error("Failed to fetch shopping lists.");
    }
  },
  addList: async (name) => {
    try {
      const response = await brain.create_shopping_list({ name });
      const newList = await response.json();
      set((state) => ({ lists: [...state.lists, newList] }));
      toast.success("Shopping list created!");
    } catch (error) {
      toast.error("Failed to create shopping list.");
    }
  },
  removeList: async (id: string) => {
    try {
      await brain.delete_shopping_list({ listId: id });
      set((state) => ({
        lists: state.lists.filter((list) => list.id !== id),
      }));
      toast.success("Shopping list deleted.");
    } catch (error) {
      toast.error("Failed to delete shopping list.");
    }
  },
}));
