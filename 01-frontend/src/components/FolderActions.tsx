import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaEdit, FaEllipsisV, FaTrashAlt } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ExplorerEntry } from "../types";
import DeleteFolderModal from "./modals/DeleteFolderModal";
import RenameFolderModal from "./modals/RenameFolderModal";
import { deleteFolder, updateFolder } from "../actions";
import type { FetchError } from "../utils/parseError";

export default function FolderActions({
  folder,
}: {
  folder: ExplorerEntry<"folder">;
}) {
  const [showDeleteFolderModal, setShowDeleteFolderModal] =
    useState<boolean>(false);
  const [showRenameFolderModal, setShowRenameFolderModal] =
    useState<boolean>(false);

  const queryClient = useQueryClient();

  const deleteFolderMutation = useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: ["folders"],
        })
        .then(() => {
          setShowDeleteFolderModal(false);
        });
    },
  });

  const renameFolderMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      updateFolder(id, data),
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: ["folders"],
        })
        .then(() => {
          setShowRenameFolderModal(false);
        });
    },
  });

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          variant="link"
          className="lh-1 p-0 hide-dropdown-caret"
        >
          <FaEllipsisV className="m-1" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setShowRenameFolderModal(true)}>
            <FaEdit /> Đổi tên
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setShowDeleteFolderModal(true)}>
            <FaTrashAlt /> Xóa thư mục
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <RenameFolderModal
        folder={folder}
        show={showRenameFolderModal}
        onHide={() => setShowRenameFolderModal(false)}
        isLoading={renameFolderMutation.isPending}
        errors={
          (renameFolderMutation.error as unknown as FetchError<"validation">)
            ?.fieldErrors
        }
        onRenameFolder={(id, data) => renameFolderMutation.mutate({ id, data })}
      />
      <DeleteFolderModal
        folder={folder}
        show={showDeleteFolderModal}
        onHide={() => setShowDeleteFolderModal(false)}
        isLoading={deleteFolderMutation.isPending}
        onDeleteFolder={(id) => deleteFolderMutation.mutate(id)}
      />
    </>
  );
}
