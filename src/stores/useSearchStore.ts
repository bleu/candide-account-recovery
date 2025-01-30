import { create } from "zustand";

interface SearchState {
  isLoading: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  setIsLoading: (loading: boolean) => void;
  handleSearch: (searchValue: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  isLoading: false,
  searchValue: "",
};

export const useSearchStore = create<SearchState>()((set) => ({
  ...initialState,
  setSearchValue: (value) => set({ searchValue: value }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  handleSearch: async (searchValue) => {
    if (!searchValue.trim()) return;

    set({ isLoading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(searchValue);

      if (isValidAddress || searchValue.toLowerCase() === "bleu") {
        window.location.href = "/manage-recovery/dashboard";
      } else {
        window.location.href = "/manage-recovery/not-found";
      }
    } catch (error) {
      console.error("Search error:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => set(initialState),
}));
