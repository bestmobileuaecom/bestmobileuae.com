"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Smartphone,
  FileText,
  Settings,
  LogOut,
  LayoutDashboard,
  X,
  Menu,
  Eye,
  Bell,
  GitCompare,
} from "lucide-react";

export default function AdminSidebar({ user, sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Phones",
      href: "/admin/phones",
      icon: Smartphone,
    },
    {
      name: "Articles",
      href: "/admin/articles",
      icon: FileText,
    },
    {
      name: "Comparisons",
      href: "/admin/comparisons",
      icon: GitCompare,
    },
    {
      name: "Price Alerts",
      href: "/admin/alerts",
      icon: Bell,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const isActive = (href) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 transform transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold">Admin Panel</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? "bg-emerald-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors mb-2"
          >
            <Eye className="w-5 h-5" />
            <span>View Site</span>
          </Link>
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.email?.[0]?.toUpperCase() || "A"}
              </span>
            </div>
            <span className="text-gray-400 text-sm truncate">
              {user?.email || "Admin"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
