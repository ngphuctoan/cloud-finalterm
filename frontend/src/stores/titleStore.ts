import { create } from "zustand";

type TitleStoreState = {
  title: string;
  affix: string;
  separator: string;
};

type TitleStoreActions = {
  setTitle: (title: TitleStoreState["title"]) => void;
};

type TitleStore = TitleStoreState & TitleStoreActions;

const useTitleStore = create<TitleStore>((set, get) => ({
  title: "Home",
  affix: "KeepBin",
  separator: " • ",
  setTitle: (title) =>
    set({ title: title ? title + get().separator + get().affix : get().affix }),
}));

useTitleStore.subscribe((state) => {
  document.title = state.title;
});

export default useTitleStore;
