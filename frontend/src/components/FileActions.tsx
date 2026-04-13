import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaDownload, FaEdit, FaEllipsisV, FaTrashAlt } from "react-icons/fa";
import { deleteFile, updateFile } from "../actions";
import type { ExplorerEntry } from "../types";
import getFileUrl from "../utils/getFileUrl";
import type { FetchError } from "../utils/parseError";
import DeleteFileModal from "./modals/DeleteFileModal";
import RenameFileModal from "./modals/RenameFileModal";

export default function FileActions({ file }: { file: ExplorerEntry<"file"> }) {
  const [showDeleteFileModal, setShowDeleteFileModal] =
    useState<boolean>(false);
  const [showRenameFileModal, setShowRenameFileModal] =
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

  const renameFileMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      updateFile(id, data),
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: ["folders"],
        })
        .then(() => {
          setShowRenameFileModal(false);
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
          <Dropdown.Item href={getFileUrl(file.id, true)}>
            <FaDownload /> Tải về
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setShowRenameFileModal(true)}>
            <FaEdit /> Đổi tên
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setShowDeleteFileModal(true)}>
            <FaTrashAlt /> Xóa tệp tin
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <RenameFileModal
        file={file}
        show={showRenameFileModal}
        onHide={() => setShowRenameFileModal(false)}
        isLoading={renameFileMutation.isPending}
        errors={
          (renameFileMutation.error as unknown as FetchError<"validation">)
            ?.fieldErrors
        }
        onRenameFile={(id, data) => renameFileMutation.mutate({ id, data })}
      />
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
