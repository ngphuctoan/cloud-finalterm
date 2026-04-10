import { Button, Modal, Spinner } from "react-bootstrap";
import type { ExplorerEntry } from "../../types";

export default function DeleteFileModal({
  file,
  show,
  onHide,
  isLoading,
  onDeleteFile,
}: {
  file: ExplorerEntry<"file">;
  show: boolean;
  onHide: () => void;
  isLoading?: boolean;
  onDeleteFile: (id: number) => void;
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xóa tệp tin</Modal.Title>
      </Modal.Header>
      <Modal.Body>Bạn chắc chắn muốn xóa tệp tin "{file.name}"?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={() => onDeleteFile(file.id)}
          disabled={isLoading}
        >
          <Spinner hidden={!isLoading} size="sm" /> Đồng ý
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
