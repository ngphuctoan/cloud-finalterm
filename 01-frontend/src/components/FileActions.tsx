import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaDownload, FaEllipsisV, FaTrashAlt } from "react-icons/fa";
import { deleteFile, getFileUrl } from "../actions";
import type { ExplorerEntry } from "../types";
import DeleteFileModal from "./modals/DeleteFileModal";

export default function FileActions({ file }: { file: ExplorerEntry<"file"> }) {
  const [showDeleteFileModal, setShowDeleteFileModal] =
    useState<boolean>(false);

  const queryClient = useQueryClient();

  const deleteFileMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: ["folders"],
        })
        .then(() => {
          setShowDeleteFileModal(false);
        });
    },
  });

  const downloadFileMutation = useMutation({
    mutationFn: (id: number) =>
      getFileUrl(id, true).then((data) => {
        window.location.href = data.url;
      }),
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
          <Dropdown.Item onClick={() => downloadFileMutation.mutate(file.id)}>
            <FaDownload /> Tải về
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setShowDeleteFileModal(true)}>
            <FaTrashAlt /> Xóa tệp tin
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <DeleteFileModal
        file={file}
        show={showDeleteFileModal}
        onHide={() => setShowDeleteFileModal(false)}
        isLoading={deleteFileMutation.isPending}
        onDeleteFile={(id) => deleteFileMutation.mutate(id)}
      />
    </>
  );
}
