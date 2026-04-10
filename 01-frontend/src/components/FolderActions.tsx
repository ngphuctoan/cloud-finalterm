import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaEllipsisV, FaTrashAlt } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ExplorerEntry } from "../types";
import DeleteFolderModal from "./DeleteFolderModal";
import { deleteFolder } from "../actions";

export default function FolderActions({
  folder,
}: {
  folder: ExplorerEntry<"folder">;
}) {
  const [showDeleteFolderModal, setShowDeleteFolderModal] =
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
          <Dropdown.Item onClick={() => setShowDeleteFolderModal(true)}>
            <FaTrashAlt /> Xóa thư mục
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
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
