import { create } from "zustand";
import type { ExplorerEntry } from "../types";

type FileViewerStoreState = {
  file: ExplorerEntry<"file"> | null;
};

type FileViewerStoreActions = {
  setFile: (file: FileViewerStoreState["file"]) => void;
};

type FileViewerStore = FileViewerStoreState & FileViewerStoreActions;

const useFileViewerStore = create<FileViewerStore>((set) => ({
  file: null,
  setFile: (file) => set({ file }),
}));

export default useFileViewerStore;
