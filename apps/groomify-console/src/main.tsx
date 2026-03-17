import { createRoot } from "react-dom/client";
import App from "./App.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./i18n";

import "./styles/index.css";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  }
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
