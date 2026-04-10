import { Button, Modal, Spinner } from "react-bootstrap";
import type { ExplorerEntry } from "../../types";

export default function DeleteFolderModal({
  folder,
  show,
  onHide,
  isLoading,
  onDeleteFolder,
}: {
  folder: ExplorerEntry<"folder">;
  show: boolean;
  onHide: () => void;
  isLoading?: boolean;
  onDeleteFolder: (id: number) => void;
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xóa thư mục</Modal.Title>
      </Modal.Header>
      <Modal.Body>Bạn chắc chắn muốn xóa thư mục "{folder.name}"?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={() => onDeleteFolder(folder.id)}
          disabled={isLoading}
        >
          <Spinner hidden={!isLoading} size="sm" /> Đồng ý
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
