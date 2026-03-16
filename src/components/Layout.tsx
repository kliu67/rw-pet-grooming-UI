import { useEffect } from "react";
import { Outlet, NavLink } from "react-router";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  LogOut,
  Menu,
  Dog,
  File,
  User,
  LogIn,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { me } from "@/api/auth";
import { Toaster } from "./ui/sonner";
import { cn } from "../lib/utils"; // Assuming utility exists or I'll create it
import { MODAL_TYPES } from "@/components/modals/modalRegistry";
import { ModalProvider, useModal } from "@/components/modals/ModalProvider";

const Sidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { isAuthenticated, user, setAuth, clearAuth } = useAuth();
  const { openModal } = useModal();
  const { t } = useTranslation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Appointments", path: "/appointments", icon: Calendar },
    { name: "Clients", path: "/clients", icon: Users },
    { name: "Services", path: "/services", icon: Scissors },
    {
      name: "Service Configurations",
      path: "/serviceConfigurations",
      icon: File,
    },
    { name: "Breeds", path: "/breeds", icon: Scissors },
    { name: "Pets", path: "/pets", icon: Dog },
  ];

  const openUserModal = () => {
    openModal(MODAL_TYPES.USER, { user });
  };
  const openAuthModal = () => {
    openModal(MODAL_TYPES.AUTH);
  };
  const openLogoutModal = () => {
    openModal(MODAL_TYPES.LOGOUT, {
      title: t("logoutModal.heading"),
      message: t("logoutModal.message"),
      primaryLabel: t("logoutModal.confirm"),
    });
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const result = await me();
        const nextUser = result?.data?.user ?? null;
        setAuth(nextUser);
      } catch {
        clearAuth();
      }
    };

    initAuth();
  }, [clearAuth, setAuth]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky top-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
              <Scissors className="h-6 w-6" />
              <span>Groomify</span>
            </h1>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose()} // Close sidebar on mobile
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
            {isAuthenticated && user && (
              <button
                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 w-full transition-colors rounded-xl hover:bg-red-50 font-medium"
                onClick={() => openUserModal()}
              >
                <User className="h-5 w-5" />
                User
              </button>
            )}
            {!isAuthenticated ? (
              <button
                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 w-full transition-colors rounded-xl hover:bg-red-50 font-medium"
                onClick={() => openAuthModal()}
              >
                <LogIn className="h-5 w-5" />
                Login
              </button>
            ) : (
              <button
                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 w-full transition-colors rounded-xl hover:bg-red-50 font-medium"
                onClick={() => openLogoutModal()}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Toaster />
      <ModalProvider>
        <div className="min-h-screen bg-gray-50 flex">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <div className="flex-1 flex flex-col min-w-0">
            <header className="bg-white border-b border-gray-200 md:hidden sticky top-0 z-10">
              <div className="flex items-center justify-between px-4 py-3">
                <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
                  <Scissors className="h-5 w-5" />
                  <span>Groomify</span>
                </h1>
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </header>

            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
              <div className="max-w-8xl mx-auto">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </ModalProvider>
    </>
  );
};
