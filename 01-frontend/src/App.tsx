import { useQuery } from "@tanstack/react-query";
import { Container } from "react-bootstrap";
import { BASE_URL, checkAuth } from "./actions";
import AppHeader from "./components/AppHeader";
import UserContext from "./contexts/UserContext";
import FileExplorer from "./components/FileExplorer";
import { useParams } from "react-router";
import RootFolderContext from "./contexts/RootFolderContext";
import FolderActions from "./components/FolderActions";

export default function App() {
  const { rootFolderId } = useParams<{ rootFolderId?: string }>();

  const { data } = useQuery({
    queryKey: ["auth", "check"],
    queryFn: checkAuth,
    meta: {
      redirectTo: `${BASE_URL}/auth/login`,
    },
  });

  return (
    <UserContext.Provider value={data?.user || null}>
      <AppHeader />
      <Container>
        <RootFolderContext.Provider
          value={rootFolderId ? Number(rootFolderId) : null}
        >
          <FolderActions />
          <FileExplorer />
        </RootFolderContext.Provider>
      </Container>
    </UserContext.Provider>
  );
}
