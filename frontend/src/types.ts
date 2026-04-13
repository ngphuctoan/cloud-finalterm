export type Theme = "dark" | "light" | "system";

export type User = {
  username: string;
  fullName: string;
  email: string;
};

export type Auth =
  | {
      isAuthenticated: false;
      user: null;
    }
  | {
      isAuthenticated: true;
      user: User;
    };

type Folder = {
  type: "folder";
  id: number;
  name: string;
  parentId: number;
  createdAt: string;
};

type File = {
  type: "file";
  id: number;
  name: string;
  mimeType: string;
  sizeBytes: number;
  bucketKey: string;
  createdAt: string;
};

export type ExplorerEntryType = "folder" | "file";

export type ExplorerEntry<T extends ExplorerEntryType> = T extends "folder"
  ? Folder
  : T extends "file"
    ? File
    : never;
