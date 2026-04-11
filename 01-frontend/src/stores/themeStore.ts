import { create } from "zustand";
import type { Theme } from "../types";
import getCurrentTheme from "../utils/getCurrentTheme";

type ThemeStoreState = {
  theme: Theme;
};

type ThemeStoreActions = {
  setTheme: (theme: Theme) => void;
};

type ThemeStore = ThemeStoreState & ThemeStoreActions;

const useThemeStore = create<ThemeStore>((set) => ({
  theme: (localStorage.getItem("vite-ui-theme") as Theme) || "system",
  setTheme: (theme) => {
    localStorage.setItem("vite-ui-theme", theme);
    set({ theme });
  },
}));

useThemeStore.subscribe((state) => {
  const root = window.document.documentElement;
  root.setAttribute("data-bs-theme", getCurrentTheme(state.theme));
});

export default useThemeStore;