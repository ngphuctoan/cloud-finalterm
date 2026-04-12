import { Modal, Stack } from "react-bootstrap";
import useFileViewerStore from "../stores/fileViewerStore";
import FilePreview from "./FilePreview";
import getFileUrl from "../utils/getFileUrl";

export default function FileViewer() {
  const file = useFileViewerStore((state) => state.file);
  const setFileViewerFile = useFileViewerStore((state) => state.setFile);

  const onHide = () => setFileViewerFile(null);

  return (
    <Modal show={file !== null} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{file?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack className="align-items-center">
          {file && (
            <FilePreview
              url={getFileUrl(file.id)}
              mimeType={file.mimeType}
              ext={file.name.split(".").pop()}
            />
          )}
        </Stack>
      </Modal.Body>
    </Modal>
  );
}
