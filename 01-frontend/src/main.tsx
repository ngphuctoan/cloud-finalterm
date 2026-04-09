import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import type { Auth } from "./types.ts";
import { Routes } from "react-router";
import { Route } from "react-router";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onSuccess: (data: Auth, query) => {
      if (
        data?.isAuthenticated === false &&
        typeof query.meta.redirectTo === "string"
      ) {
        window.location.href = query.meta.redirectTo;
      }
    },
  }),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path=":rootFolderId?" element={<App />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
