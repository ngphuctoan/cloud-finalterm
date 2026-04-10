import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Spinner, Table } from "react-bootstrap";
import { match } from "ts-pattern";
import { getContentsOfFolder } from "../actions";
import RootFolderContext from "../contexts/RootFolderContext";
import FileRow from "./FileRow";
import FolderRow from "./FolderRow";

export default function FileExplorer() {
  const rootFolderId = useContext(RootFolderContext);

  const { data, isFetching, isPlaceholderData } = useQuery({
    queryKey: ["folders", rootFolderId],
    queryFn: () => getContentsOfFolder(rootFolderId),
  });

  return (
    <div className="position-relative">
      <Table bordered className="align-middle">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Kích cỡ</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data?.contents.map((entry, i) =>
            match(entry)
              .with({ type: "file" }, (entry) => (
                <FileRow key={i} file={entry} />
              ))
              .with({ type: "folder" }, (entry) => (
                <FolderRow key={i} folder={entry} />
              ))
              .exhaustive(),
          )}
        </tbody>
      </Table>
      <div
        className="position-absolute bg-body bg-opacity-50"
        style={{
          inset: 0,
          cursor: "wait",
          display: isFetching && !isPlaceholderData ? "flex" : "none",
        }}
      >
        <Spinner className="m-auto" />
      </div>
    </div>
  );
}
