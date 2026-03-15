import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ModalProvider } from "./components/modals/ModalProvider";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <RouterProvider router={router} />;
      </ModalProvider>
    </AuthProvider>
  );
}
