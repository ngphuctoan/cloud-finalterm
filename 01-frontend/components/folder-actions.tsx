"use client";

import { createFolder } from "@/app/actions";
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

export default function FolderActions() {
  const [showNewFolderDialog, setShowNewFolderDialog] =
    useState<boolean>(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["folders"],
      });
      setShowNewFolderDialog(false);
    },
  });

  const onCreateFolder = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    mutation.mutate({
      name: formData.get("name")!.toString(),
      parentId: null,
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
        <Button variant="outline-success">
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
              disabled={mutation.isPending}
            >
              <Spinner size="sm" hidden={!mutation.isPending} />
              Đồng ý
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Stack>
  );
}
