export type ContentType = "folder" | "file";

export type Content<T extends ContentType> = T extends "folder"
  ? {
      type: "folder";
      id: number;
      name: string;
      parentId: number;
      createdAt: string;
    }
  : T extends "file"
    ? {
        type: "file";
        id: number;
        name: string;
        sizeBytes: number;
        bucketKey: string;
        createdAt: string;
      }
    : never;
