import { useContext, type SubmitEvent } from "react";
import RootFolderContext from "../contexts/RootFolderContext";
import { Button, Form, Modal, Spinner } from "react-bootstrap";

export default function CreateFolderModal({
  show,
  onHide,
  isLoading,
  onCreateFolder,
}: {
  show: boolean;
  onHide: () => void;
  isLoading?: boolean;
  onCreateFolder: (formData: FormData) => void;
}) {
  const rootFolderId = useContext(RootFolderContext);

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    if (rootFolderId) {
      formData.append("parentId", rootFolderId.toString());
    }

    onCreateFolder(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Tạo thư mục</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nhập tên thư mục cần tạo:</Form.Label>
            <Form.Control name="name" autoFocus />
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
