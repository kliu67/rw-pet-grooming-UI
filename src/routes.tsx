import React from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Appointments } from "./pages/Appointments";
import { Clients } from "./pages/Clients";
import { Services } from "./pages/Services";
import { Breeds } from "./pages/Breeds";
import { Pets } from "./pages/Pets";
import { ServiceConfigurations } from "./pages/ServiceConfigurations";
import { Authenticate } from "./pages/Authenticate";
import { EmptyState } from "./components/emptyState";
import { useAuth } from "./context/AuthContext";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/empty" replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Dashboard
      },
      {
        path: "/empty",
        Component: EmptyState
      },
      {
        path: "appointments",
        element: (
          <RequireAuth>
            <Appointments />
          </RequireAuth>
        )
      },
      {
        path: "clients",
        element: (
          <RequireAuth>
            <Clients />
          </RequireAuth>
        )
      },
      {
        path: "services",
        element: (
          <RequireAuth>
            <Services />
          </RequireAuth>
        )
      },
      {
        path: "serviceConfigurations",
        element: (
          <RequireAuth>
            <ServiceConfigurations />
          </RequireAuth>
        )
      },
      {
        path: "breeds",
        element: (
          <RequireAuth>
            <Breeds />
          </RequireAuth>
        )
      },
      {
        path: "pets",
        element: (
          <RequireAuth>
            <Pets />
          </RequireAuth>
        )
      },
      {
        path: "login",
        Component: Authenticate
      }
    ]
  }
]);
