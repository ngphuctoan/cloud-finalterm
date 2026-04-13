import { type SubmitEvent } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import type { ExplorerEntry } from "../../types";

export default function RenameFileModal({
  file,
  show,
  onHide,
  isLoading,
  errors,
  onRenameFile,
}: {
  file: ExplorerEntry<"file">;
  show: boolean;
  onHide: () => void;
  isLoading?: boolean;
  errors?: Record<string, string[]>;
  onRenameFile: (id: number, data: FormData) => void;
}) {
  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onRenameFile(file.id, new FormData(event.currentTarget));
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Đổi tên tệp tin</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nhập tên tệp tin mới:</Form.Label>
            <Form.Control
              name="name"
              autoFocus
              defaultValue={file.name}
              isInvalid={(errors?.name?.length ?? 0) > 0}
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
