import dayjs from "dayjs";
import { FaFolder } from "react-icons/fa";
import { Link } from "react-router";
import FolderActions from "./FolderActions";
import type { ExplorerEntry } from "../types";

export default function FolderRow({
  folder,
}: {
  folder: ExplorerEntry<"folder">;
}) {
  return (
    <tr>
      <td>
        <FaFolder className="text-primary" /> &ensp;
        <Link
          to={`/folders/${folder.id}`}
          className="link-body-emphasis link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover"
        >
          {folder.name}
        </Link>
      </td>
      <td>&ndash;</td>
      <td>{dayjs(folder.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
      <td>
        <FolderActions folder={folder} />
      </td>
    </tr>
  );
}
