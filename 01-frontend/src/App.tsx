import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Container, Stack } from "react-bootstrap";
import { useParams } from "react-router";
import { BASE_URL, checkAuth } from "./actions";
import AppHeader from "./components/AppHeader";
import ExplorerBreadcrumb from "./components/ExplorerBreadcrumb";
import FileExplorer from "./components/FileExplorer";
import RootFolderActions from "./components/RootFolderActions";
import RootFolderContext from "./contexts/RootFolderContext";
import UserContext from "./contexts/UserContext";
import FileViewer from "./components/FileViewer";
import SearchBar from "./components/SearchBar";

export default function App() {
  const { rootFolderId } = useParams<{ rootFolderId?: string }>();

  const { data } = useQuery({
    queryKey: ["auth", "check"],
    queryFn: checkAuth,
  });

  useEffect(() => {
    if (data?.isAuthenticated === false) {
      window.location.href = `${BASE_URL}/auth/login?redirect_uri=${window.location.href}`;
    }
  }, [data?.isAuthenticated]);

  return (
    <UserContext.Provider value={data?.user || null}>
      <AppHeader />
      <RootFolderContext.Provider
        value={rootFolderId ? Number(rootFolderId) : null}
      >
        <Container>
          <Stack gap={4}>
            <SearchBar />
            <Stack direction="horizontal" gap={2} className="flex-wrap">
              <div className="flex-grow-1">
                <ExplorerBreadcrumb />
              </div>
              <RootFolderActions />
            </Stack>
            <FileExplorer />
            <FileViewer />
          </Stack>
        </Container>
      </RootFolderContext.Provider>
    </UserContext.Provider>
  );
}
