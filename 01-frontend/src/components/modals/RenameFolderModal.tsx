import { type SubmitEvent } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import type { ExplorerEntry } from "../../types";

export default function RenameFolderModal({
  folder,
  show,
  onHide,
  isLoading,
  errors,
  onRenameFolder,
}: {
  folder: ExplorerEntry<"folder">;
  show: boolean;
  onHide: () => void;
  isLoading?: boolean;
  errors?: Record<string, string[]>;
  onRenameFolder: (id: number, data: FormData) => void;
}) {
  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onRenameFolder(folder.id, new FormData(event.currentTarget));
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Đổi tên thư mục</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nhập tên thư mục mới:</Form.Label>
            <Form.Control
              name="name"
              autoFocus
              defaultValue={folder.name}
              isInvalid={errors?.name?.length > 0}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.name?.[0]}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="primary" disabled={isLoading}>
            <Spinner hidden={!isLoading} size="sm" /> Lưu
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
