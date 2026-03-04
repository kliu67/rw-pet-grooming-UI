import React from "react";
import { Outlet, NavLink, useLocation } from "react-router";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  LogOut,
  Menu,
  Dog,
  File
} from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils"; // Assuming utility exists or I'll create it

const Sidebar = ({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Appointments", path: "/appointments", icon: Calendar },
    { name: "Clients", path: "/clients", icon: Users },
    { name: "Services", path: "/services", icon: Scissors },
    {
      name: "Service Configurations",
      path: "/serviceConfigurations",
      icon: File
    },
    { name: "Breeds", path: "/breeds", icon: Scissors },
    { name: "Pets", path: "/pets", icon: Dog }
  ];

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
          isOpen ? "translate-x-0" : "-translate-x-full"
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
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 w-full transition-colors rounded-xl hover:bg-red-50 font-medium">
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
