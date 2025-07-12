import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import brain from "brain";
import { HouseholdResponse } from "brain/data-contracts";

interface HouseholdState {
  household: HouseholdResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchAttempted: boolean; // Flag to prevent re-fetching
  fetchHousehold: () => Promise<void>;
  createHousehold: (name: string) => Promise<boolean>;
  joinHousehold: (inviteCode: string) => Promise<void>;
  createInvitation: (householdId: string) => Promise<string | null>;
}

// Using immer middleware to allow for direct state mutation
// and to help stabilize function references.
export const useHouseholdStore = create<HouseholdState>()(
  immer((set, get) => ({
    household: null,
    isLoading: true, // Start with loading true
    error: null,
    fetchAttempted: false,
    
    fetchHousehold: async () => {
      if (get().fetchAttempted) {
        console.log("fetchHousehold: already attempted, skipping");
        return; // Do not fetch if already attempted
      }

      console.log("fetchHousehold: starting fetch");
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });
      try {
        const response = await brain.get_my_household();
        if (response.status === 200) {
          const household = await response.json();
          set({ household });
          console.log("fetchHousehold: success", household);
        } else {
          set({ household: null });
          console.log("fetchHousehold: no household found (404)");
        }
      } catch (error) {
        set({ household: null });
        console.log("fetchHousehold: error", error);
      } finally {
        set({ isLoading: false, fetchAttempted: true });
      }
    },

    createHousehold: async (name): Promise<boolean> => {
      set({ isLoading: true, error: null });
      try {
        const response = await brain.create_household({ name });
        const household = await response.json();
        set({ household, isLoading: false, fetchAttempted: true });
        console.log("createHousehold: created", household);
        return true;
      } catch (error: any) {
        console.log("createHousehold: error", error);
        set({
          error: error.error?.detail || error.message || "Failed to create household.",
          isLoading: false,
        });
        return false;
      }
    },

    joinHousehold: async (inviteCode) => {
      set({ isLoading: true, error: null });
      try {
        await brain.join_household({ invite_code: inviteCode });
        // Reset fetchAttempted so we can fetch the new household
        set({ fetchAttempted: false });
        // Fetch the new household details
        await get().fetchHousehold();
      } catch (error: any) {
        set({
          error: error.message || "Failed to join household.",
          isLoading: false,
        });
      }
    },

    createInvitation: async (householdId) => {
      set({ isLoading: true, error: null });
      try {
        const response = await brain.create_invitation({ householdId });
        const data = await response.json();
        set({ isLoading: false });
        return data.invite_code;
      } catch (error: any) {
        set({
          error: error.message || "Failed to create invitation.",
          isLoading: false,
        });
        return null;
      }
    },
  }))
);
