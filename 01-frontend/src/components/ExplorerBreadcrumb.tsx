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
    queryFn: () => getFolderBreadcrumb(rootFolderId),
  });

  return (
    <Breadcrumb
      listProps={{
        style: {
          "--bs-breadcrumb-padding-x": 0,
          "--bs-breadcrumb-padding-y": 0,
          "--bs-breadcrumb-margin-bottom": 0,
        } as CSSProperties,
      }}
    >
      <Breadcrumb.Item
        linkAs={Link}
        linkProps={{ to: "/" }}
        active={rootFolderId === null}
      >
        <FaHome />
      </Breadcrumb.Item>
      {data?.map((breadcrumb, i) => (
        <Breadcrumb.Item
          key={i}
          linkAs={Link}
          linkProps={{ to: `/${breadcrumb.id}` }}
          active={rootFolderId === breadcrumb.id}
        >
          {breadcrumb.name}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}
