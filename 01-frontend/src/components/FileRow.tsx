import dayjs from "dayjs";
import type { ExplorerEntry } from "../types";
import FileIcon from "./FileIcon";
import { Link } from "react-router";
import toFileSizeFormat from "../utils/fileSize";
import FileActions from "./FileActions";

export default function FileRow({ file }: { file: ExplorerEntry<"file"> }) {
  return (
    <tr>
      <td>
        <FileIcon mimeType={file.mimeType} /> &ensp;
        <Link
          to="#"
          className="link-body-emphasis link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover"
        >
          {file.name}
        </Link>
      </td>
      <td>{toFileSizeFormat(file.sizeBytes)}</td>
      <td>{dayjs(file.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
      <td>
        <FileActions file={file} />
      </td>
    </tr>
  );
}
