import { useContext, type CSSProperties } from "react";
import RootFolderContext from "../contexts/RootFolderContext";
import { Breadcrumb } from "react-bootstrap";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getFolderBreadcrumb } from "../actions";

export default function ExplorerBreadcrumb() {
  const rootFolderId = useContext(RootFolderContext);

  const { data } = useQuery({
    queryKey: ["folders", "breadcrumb", rootFolderId],
    queryFn: () => getFolderBreadcrumb(rootFolderId ?? undefined),
  });

  return (
    <Breadcrumb
      listProps={{
        style: {
          "--bs-breadcrumb-margin-bottom": 0,
        } as CSSProperties,
      }}
    >
      <Breadcrumb.Item
        linkAs={Link}
        linkProps={{ to: "/folders" }}
        active={rootFolderId === null}
      >
        <FaHome />
      </Breadcrumb.Item>
      {data?.map((breadcrumb, i) => (
        <Breadcrumb.Item
          key={i}
          linkAs={Link}
          linkProps={{ to: `/folders/${breadcrumb.id}` }}
          active={rootFolderId === (breadcrumb.id as unknown as number)}
        >
          {breadcrumb.name}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}
