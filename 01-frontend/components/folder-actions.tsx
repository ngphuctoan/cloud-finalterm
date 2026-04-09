"use client";

import { createFolder, uploadFile } from "@/app/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitEvent, useState } from "react";
import {
  Button,
  ButtonGroup,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Stack,
} from "react-bootstrap";
import { FaFolderPlus, FaUpload } from "react-icons/fa";

export default function FolderActions({ folderId }: { folderId?: number }) {
  const [showNewFolderDialog, setShowNewFolderDialog] =
    useState<boolean>(false);
  const [showUploadDialog, setShowUploadDialog] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const createFolderMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["folders"],
      });
      setShowNewFolderDialog(false);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["folders"],
      });
      setShowUploadDialog(false);
    },
  });

  const onCreateFolder = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    createFolderMutation.mutate({
      name: formData.get("name")!.toString(),
      parentId: folderId,
    });
  };

  const onUploadFile = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    uploadMutation.mutate({
      file: formData.get("file")! as File,
      folderId,
    });
  };

  return (
    <Stack className="align-items-end">
      <ButtonGroup style={{ width: "max-content" }}>
        <Button
          variant="outline-primary"
          onClick={() => setShowNewFolderDialog(true)}
        >
          <FaFolderPlus /> Tạo mới
        </Button>
        <Button
          variant="outline-success"
          onClick={() => setShowUploadDialog(true)}
        >
          <FaUpload /> Tải lên
        </Button>
      </ButtonGroup>
      <Modal
        show={showNewFolderDialog}
        onHide={() => setShowNewFolderDialog(false)}
      >
        <ModalHeader closeButton>Tạo thư mục mới</ModalHeader>
        <Form onSubmit={onCreateFolder}>
          <ModalBody>
            <FormGroup>
              <FormLabel>Nhập tên thư mục</FormLabel>
              <FormControl name="name" />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              variant="primary"
              disabled={createFolderMutation.isPending}
            >
              <Spinner size="sm" hidden={!createFolderMutation.isPending} />
              Đồng ý
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
      <Modal show={showUploadDialog} onHide={() => setShowUploadDialog(false)}>
        <ModalHeader closeButton>Tải tệp tin lên</ModalHeader>
        <Form encType="multipart/form-data" onSubmit={onUploadFile}>
          <ModalBody>
            <FormGroup>
              <FormLabel>Chọn một tệp cần tải</FormLabel>
              <FormControl type="file" name="file" />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              variant="primary"
              disabled={uploadMutation.isPending}
            >
              <Spinner size="sm" hidden={!uploadMutation.isPending} />
              Đồng ý
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Stack>
  );
}
