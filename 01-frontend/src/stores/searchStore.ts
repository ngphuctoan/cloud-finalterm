import { create } from "zustand";

type SearchStoreState = {
  query: string;
};

type SearchStoreActions = {
  setQuery: (query: SearchStoreState["query"]) => void;
};

type SearchStore = SearchStoreState & SearchStoreActions;

const useSearchStore = create<SearchStore>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
}));

export default useSearchStore;
