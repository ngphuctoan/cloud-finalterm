import { useQuery } from "@tanstack/react-query";
import { Container, Stack } from "react-bootstrap";
import { BASE_URL, checkAuth } from "./actions";
import AppHeader from "./components/AppHeader";
import UserContext from "./contexts/UserContext";
import FileExplorer from "./components/FileExplorer";
import { useParams } from "react-router";
import RootFolderContext from "./contexts/RootFolderContext";
import RootFolderActions from "./components/RootFolderActions";
import ExplorerBreadcrumb from "./components/ExplorerBreadcrumb";
import { useEffect } from "react";
import navigationStore from "./stores/NavigationStore";
import { useLocation } from "react-router";
import { match } from "ts-pattern";
import { useNavigate } from "react-router";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const { rootFolderId } = useParams<{ rootFolderId?: string }>();

  const { data } = useQuery({
    queryKey: ["auth", "check"],
    queryFn: checkAuth,
  });

  useEffect(() => {
    if (data?.isAuthenticated === false) {
      window.location.replace(
        `${BASE_URL}/auth/login?redirect_uri=${window.location.href}`,
      );
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
            <ExplorerBreadcrumb />
            <RootFolderActions />
            <FileExplorer />
          </Stack>
        </Container>
      </RootFolderContext.Provider>
    </UserContext.Provider>
  );
}
