import { Button, ButtonGroup } from "react-bootstrap";
import { useState } from "react";
import { FaFolderPlus, FaUpload } from "react-icons/fa";
import CreateFolderModal from "./CreateFolderModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFolder, uploadFile } from "../actions";
import UploadFileModal from "./UploadFileModal";

export default function FolderActions() {
  const [showCreateFolderModal, setShowCreateFolderModal] =
    useState<boolean>(false);
  const [showUploadFileModal, setShowUploadFileModal] =
    useState<boolean>(false);

  const queryClient = useQueryClient();

  const createFolderMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: ["folders"],
        })
        .then(() => {
          setShowCreateFolderModal(false);
        });
    },
  });

  const uploadFileMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: ["folders"],
        })
        .then(() => {
          setShowUploadFileModal(false);
        });
    },
  });

  return (
    <>
      <ButtonGroup>
        <Button
          variant="outline-primary"
          onClick={() => setShowCreateFolderModal(true)}
        >
          <FaFolderPlus /> Tạo thư mục
        </Button>
        <Button
          variant="outline-success"
          onClick={() => setShowUploadFileModal(true)}
        >
          <FaUpload /> Tải tệp tin
        </Button>
      </ButtonGroup>
      <CreateFolderModal
        show={showCreateFolderModal}
        onHide={() => setShowCreateFolderModal(false)}
        onCreateFolder={(formData) => createFolderMutation.mutate(formData)}
      />
      <UploadFileModal
        show={showUploadFileModal}
        onHide={() => setShowUploadFileModal(false)}
        onUploadFile={(formData) => uploadFileMutation.mutate(formData)}
      />
    </>
  );
}
