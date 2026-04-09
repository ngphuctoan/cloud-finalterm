"use client";

import { deleteFolder, getFolders } from "@/app/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { Spinner, Table } from "react-bootstrap";
import { FaDownload, FaFile, FaTrash } from "react-icons/fa";
import { FaFolder } from "react-icons/fa6";
import SearchBar from "./search-bar";
import { Content, ContentType } from "@/types/content";
import FolderActions from "./folder-actions";

function ContentsTable<T extends ContentType>({
  contents,
  isLoading,
  onDelete,
}: {
  contents?: Content<T>[];
  isLoading: boolean;
  onDelete: (type: string, id: number) => void;
}) {
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
        {isLoading ? (
          <tr>
            <td colSpan={4} align="center">
              <Spinner className="m-4" />
            </td>
          </tr>
        ) : (
          contents?.map((content, i) => (
            <tr key={i}>
              <td>
                {content.type === "folder" ? (
                  <>
                    <FaFolder className="text-primary" /> &ensp;
                    <Link
                      href={`/folders/${content.id}`}
                      className="link-body-emphasis link-offset-2"
                    >
                      {content.name}
                    </Link>
                  </>
                ) : (
                  <>
                    <FaFile /> &ensp;
                    {content.name}
                  </>
                )}
              </td>
              <td>
                {content.type === "folder" ? <>&ndash;</> : content.sizeBytes}
              </td>
              <td>{dayjs(content.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
              <td>
                <div className="hstack gap-3 my-1">
                  <FaDownload role="button" />
                  <FaTrash
                    role="button"
                    onClick={() => onDelete(content.type, content.id)}
                  />
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}

export default function FileExplorer({ parentId }: { parentId?: number }) {
  const { data, isPending } = useQuery({
    queryKey: ["folders", parentId],
    queryFn: () => getFolders(parentId),
  });

  const queryClient = useQueryClient();

  const deleteFolderMutation = useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["folders"],
      });
    },
  });

  return (
    <div className="vstack gap-3">
      <SearchBar folderName={data?.name} />
      <FolderActions />
      <ContentsTable
        contents={data?.contents}
        isLoading={isPending}
        onDelete={(type, id) => {
          if (type === "folder") {
            deleteFolderMutation.mutate(id);
          }
        }}
      />
    </div>
  );
}
