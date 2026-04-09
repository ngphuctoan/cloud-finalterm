import { Content, ContentType } from "@/types/content";

export const getFolders = async <T extends ContentType>(parentId?: number) => {
  const res = await fetch(
    `http://localhost:3000/v1/folders${parentId ? "/" + parentId : ""}`,
  );
  if (!res.ok) {
    throw new Error("Something went wrong");
  }
  return (await res.json()) as Content<"folder"> & { contents: Content<T>[] };
};

export const createFolder = async (data: {
  name: string;
  parentId?: number;
}) => {
  const res = await fetch("http://localhost:3000/v1/folders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Something went wrong");
  }
};

export const deleteFolder = async (id: number) => {
  const res = await fetch(`http://localhost:3000/v1/folders/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Something went wrong");
  }
};

export const uploadFile = async (data: { file: File; folderId?: number }) => {
  const formData = new FormData();
  formData.append("file", data.file);
  if (data.folderId) {
    formData.append("folderId", data.folderId.toString());
  }
  const res = await fetch("http://localhost:3000/v1/files", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Something went wrong");
  }
};
