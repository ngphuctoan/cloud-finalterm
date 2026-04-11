import type { Auth, ExplorerEntry, ExplorerEntryType } from "./types";
import errorCheck from "./utils/errorCheck";

export const BASE_URL = "http://localhost:3000";

export const checkAuth = () =>
  fetch(`${BASE_URL}/auth/check`, {
    credentials: "include",
  })
    .then(errorCheck)
    .then((data) => data as Auth);

export const logout = (redirect_uri: string) =>
  fetch(`${BASE_URL}/auth/logout?redirect_uri=${redirect_uri}`, {
    credentials: "include",
  })
    .then(errorCheck)
    .then((data) => data as { url: string });

export const getContentsOfFolder = <T extends ExplorerEntryType>(
  rootFolderId?: number,
) =>
  fetch(`${BASE_URL}/folders/${rootFolderId || ""}`, {
    credentials: "include",
  })
    .then(errorCheck)
    .then(
      (data) =>
        data as ExplorerEntry<"folder"> & {
          contents: ExplorerEntry<T>[];
        },
    );

export const getFolderBreadcrumb = (rootFolderId?: number) => {
  if (!rootFolderId) {
    return [];
  }
  return fetch(`${BASE_URL}/folders/${rootFolderId}/breadcrumb`, {
    credentials: "include",
  })
    .then(errorCheck)
    .then((data) => data as { id: string; name: string }[]);
};

export const createFolder = (data: FormData) =>
  fetch(`${BASE_URL}/folders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.get("name"),
      parentId: data.get("parentId"),
    }),
    credentials: "include",
  })
    .then(errorCheck)
    .then((data) => data as ExplorerEntry<"folder">);

export const deleteFolder = (id: number) =>
  fetch(`${BASE_URL}/folders/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
    .then(errorCheck)
    .then((data) => data as ExplorerEntry<"folder">);

export const updateFolder = (id: number, data: FormData) =>
  fetch(`${BASE_URL}/folders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.get("name"),
    }),
    credentials: "include",
  })
    .then(errorCheck)
    .then((data) => data as ExplorerEntry<"folder">);

export const uploadFile = (data: FormData) =>
  fetch(`${BASE_URL}/files`, {
    method: "POST",
    body: data,
    credentials: "include",
  })
    .then(errorCheck)
    .then((data) => data as ExplorerEntry<"file">);

export const deleteFile = (id: number) =>
  fetch(`${BASE_URL}/files/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
    .then(errorCheck)
    .then((data) => data as ExplorerEntry<"file">);

export const updateFile = (id: number, data: FormData) =>
  fetch(`${BASE_URL}/files/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.get("name"),
    }),
    credentials: "include",
  })
    .then(errorCheck)
    .then((data) => data as ExplorerEntry<"file">);

export const getFileUrl = (id: number, download: boolean = false) =>
  fetch(`${BASE_URL}/files/${id}?download=${download.toString()}`, {
    credentials: "include",
  })
    .then(errorCheck)
    .then((data) => data as { url: string });
