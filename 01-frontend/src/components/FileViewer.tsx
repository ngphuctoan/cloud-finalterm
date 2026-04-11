import { Modal, Stack } from "react-bootstrap";
import useFileViewerStore from "../stores/fileViewerStore";
import { useQuery } from "@tanstack/react-query";
import { getFileUrl } from "../actions";
import FilePreview from "./FilePreview";

export default function FileViewer() {
  const file = useFileViewerStore((state) => state.file);
  const setFileViewerFile = useFileViewerStore((state) => state.setFile);

  const { data } = useQuery({
    queryKey: ["files", file?.id],
    queryFn: () => getFileUrl(file.id),
    enabled: file !== null,
  });

  const onHide = () => setFileViewerFile(null);

  return (
    <Modal show={file !== null} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{file?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack className="align-items-center">
          {data?.url && file && (
            <FilePreview
              url={data.url}
              mimeType={file.mimeType}
              ext={file.name.split(".").pop()}
            />
          )}
        </Stack>
      </Modal.Body>
    </Modal>
  );
}
