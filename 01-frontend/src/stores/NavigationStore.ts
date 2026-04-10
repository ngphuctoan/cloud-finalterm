import { createStore } from "zustand";
import { persist } from "zustand/middleware";

type NavigationStoreState = {
  lastRoute: string | null;
};

type NavigationStoreActions = {
  rememberRoute: (route: string) => void;
  forgetRoute: () => void;
};

type NavigationStore = NavigationStoreState & NavigationStoreActions;

const navigationStore = createStore<NavigationStore>()(
  persist(
    (set) => ({
      lastRoute: null,
      rememberRoute: (route) => set({ lastRoute: route }),
      forgetRoute: () => set({ lastRoute: null }),
    }),
    { name: "navigation-storage" },
  ),
);

export default navigationStore;
