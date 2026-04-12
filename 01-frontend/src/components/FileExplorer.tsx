import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Spinner, Stack, Table } from "react-bootstrap";
import { match } from "ts-pattern";
import { getContentsOfFolder } from "../actions";
import RootFolderContext from "../contexts/RootFolderContext";
import FileRow from "./FileRow";
import FolderRow from "./FolderRow";
import useSearchStore from "../stores/searchStore";
import useTitleStore from "../stores/titleStore";
import { FaFolderOpen } from "react-icons/fa";
import type { ExplorerEntry } from "../types";

export default function FileExplorer() {
  const rootFolderId = useContext(RootFolderContext);
  const query = useSearchStore((state) => state.query);
  const setTitle = useTitleStore((state) => state.setTitle);

  const { data, isFetching } = useQuery({
    queryKey: ["folders", rootFolderId],
    queryFn: () => getContentsOfFolder(rootFolderId ?? undefined),
  });

  if (data?.name) {
    setTitle(data.name.replace(/^\/$/, "Home"));
  }

  return (
    <div className="position-relative table-responsive border">
      <Table
        className="align-middle"
        style={{
          minWidth: "max-content",
          marginBottom: 0,
        }}
      >
        <thead>
          <tr>
            <th>Tên</th>
            <th>Kích cỡ</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {match(data?.contents)
            .when(
              (contents) => (contents?.length ?? 0) > 0,
              (contents) =>
                (
                  contents as (
                    | ExplorerEntry<"file">
                    | ExplorerEntry<"folder">
                  )[]
                )
                  .filter((entry) => entry.name.toLowerCase().includes(query))
                  .map((entry, i) =>
                    match(entry)
                      .with({ type: "file" }, (entry) => (
                        <FileRow key={i} file={entry} />
                      ))
                      .with({ type: "folder" }, (entry) => (
                        <FolderRow key={i} folder={entry} />
                      ))
                      .exhaustive(),
                  ),
            )
            .otherwise((contents) => (
              <tr>
                <td colSpan={4}>
                  <Stack
                    className={
                      contents === undefined
                        ? "invisible"
                        : "align-items-center"
                    }
                  >
                    <FaFolderOpen
                      size={64}
                      className="text-body-tertiary my-2"
                    />
                    <p className="lead text-body-tertiary my-2">
                      Thư mục trống trơn luôn...
                    </p>
                  </Stack>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <div
        className="position-absolute bg-body bg-opacity-50"
        style={{
          inset: 0,
          cursor: "wait",
          display: isFetching ? "flex" : "none",
        }}
      >
        <Spinner className="m-auto" />
      </div>
    </div>
  );
}
