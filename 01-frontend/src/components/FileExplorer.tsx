import { useQuery } from "@tanstack/react-query";
import { Table } from "react-bootstrap";
import { getContentsOfFolder } from "../actions";
import { match } from "ts-pattern";
import { FaFile, FaFolder } from "react-icons/fa";
import dayjs from "dayjs";
import { Link } from "react-router";
import { useContext } from "react";
import RootFolderContext from "../contexts/RootFolderContext";

export default function FileExplorer() {
  const rootFolderId = useContext(RootFolderContext);

  const { data } = useQuery({
    queryKey: ["folders", rootFolderId],
    queryFn: () => getContentsOfFolder(rootFolderId),
  });

  return (
    <Table bordered>
      <thead>
        <tr>
          <th>Tên</th>
          <th>Kích cỡ</th>
          <th>Ngày tạo</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {data?.contents.map((entry, i) => (
          <tr key={i}>
            {match(entry)
              .with({ type: "file" }, (entry) => (
                <>
                  <td>
                    <FaFile /> {entry.name}
                  </td>
                  <td>{entry.sizeBytes}</td>
                  <td>
                    {dayjs(entry.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                  </td>
                </>
              ))
              .with({ type: "folder" }, (entry) => (
                <>
                  <td>
                    <FaFolder className="text-primary" />{" "}
                    <Link
                      to={`/${entry.id}`}
                      className="link-body-emphasis link-offset-2 link-underline-opacity-0 link-underline-opacity-100-hover"
                    >
                      {entry.name}
                    </Link>
                  </td>
                  <td>&ndash;</td>
                  <td>
                    {dayjs(entry.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                  </td>
                </>
              ))
              .exhaustive()}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
