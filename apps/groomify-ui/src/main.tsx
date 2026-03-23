import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { BookingProvider } from "./context/BookingContext.js";
import App from "./App";
import "./index.css";
import "./i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BookingProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BookingProvider>
  </QueryClientProvider>,
);
