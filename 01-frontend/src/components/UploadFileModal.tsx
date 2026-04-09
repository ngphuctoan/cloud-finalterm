import { useContext, type SubmitEvent } from "react";
import RootFolderContext from "../contexts/RootFolderContext";
import { Button, Form, Modal } from "react-bootstrap";

export default function UploadFileModal({
  show,
  onHide,
  onUploadFile,
}: {
  show: boolean;
  onHide: () => void;
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
    <Modal show={show} onHide={onHide}>
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
            Lưu
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
