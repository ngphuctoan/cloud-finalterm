import { useContext } from "react";
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
    <Breadcrumb>
      <Breadcrumb.Item
        linkAs={Link}
        linkProps={{ to: "/" }}
        active={rootFolderId === null}
      >
        <FaHome />
      </Breadcrumb.Item>
      {data?.map((breadcrumb) => (
        <Breadcrumb.Item
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
