import dayjs from "dayjs";
import type { ExplorerEntry } from "../types";
import FileIcon from "./FileIcon";
import toFileSizeFormat from "../utils/fileSize";
import FileActions from "./FileActions";
import useFileViewerStore from "../stores/fileViewerStore";

export default function FileRow({ file }: { file: ExplorerEntry<"file"> }) {
  const setFileViewerFile = useFileViewerStore((state) => state.setFile);

  return (
    <tr>
      <td>
        <FileIcon mimeType={file.mimeType} /> &ensp;
        <a
          href="#"
          onClick={() => setFileViewerFile(file)}
          className="link-body-emphasis link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover"
        >
          {file.name}
        </a>
      </td>
      <td>{toFileSizeFormat(file.sizeBytes)}</td>
      <td>{dayjs(file.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
      <td>
        <FileActions file={file} />
      </td>
    </tr>
  );
}
