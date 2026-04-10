import { useContext, type SubmitEvent } from "react";
import RootFolderContext from "../contexts/RootFolderContext";
import { Button, Form, Modal, Spinner } from "react-bootstrap";

export default function UploadFileModal({
  show,
  onHide,
  isLoading,
  onUploadFile,
}: {
  show: boolean;
  onHide: () => void;
  isLoading?: boolean;
  onUploadFile: (formData: FormData) => void;
}) {
  const rootFolderId = useContext(RootFolderContext);

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    if (rootFolderId) {
      formData.append("folderId", rootFolderId.toString());
    }

    onUploadFile(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Tải tệp tin</Modal.Title>
      </Modal.Header>
      <Form encType="multipart/form-data" onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Chọn tệp tin cần tải:</Form.Label>
            <Form.Control type="file" name="file" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="primary">
            <Spinner hidden={!isLoading} size="sm" /> Lưu
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
