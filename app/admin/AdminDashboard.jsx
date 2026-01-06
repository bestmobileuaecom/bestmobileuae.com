"use client";

import Link from "next/link";
import { AdminLayoutWrapper } from "@/components/admin";
import {
  Smartphone,
  FileText,
  Plus,
  Eye,
  ChevronRight,
} from "lucide-react";

/**
 * AdminDashboard - Main admin dashboard page
 * Shows stats and quick actions
 */
export default function AdminDashboard({ user, stats }) {
  const statCards = [
    {
      name: "Total Phones",
      value: stats.phones,
      published: stats.publishedPhones,
      icon: Smartphone,
      color: "bg-blue-500",
      href: "/admin/phones",
    },
    {
      name: "Total Articles",
      value: stats.articles,
      published: stats.publishedArticles,
      icon: FileText,
      color: "bg-purple-500",
      href: "/admin/articles",
    },
  ];

  const quickActions = [
    {
      label: "Add Phone",
      href: "/admin/phones/new",
      icon: Plus,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      hoverBorder: "hover:border-emerald-500",
      hoverBg: "hover:bg-emerald-50",
    },
    {
      label: "Add Article",
      href: "/admin/articles/new",
      icon: Plus,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      hoverBorder: "hover:border-purple-500",
      hoverBg: "hover:bg-purple-50",
    },
    {
      label: "Manage Phones",
      href: "/admin/phones",
      icon: Smartphone,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      hoverBorder: "hover:border-blue-500",
      hoverBg: "hover:bg-blue-50",
    },
    {
      label: "Manage Articles",
      href: "/admin/articles",
      icon: FileText,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      hoverBorder: "hover:border-orange-500",
      hoverBg: "hover:bg-orange-50",
    },
  ];

  return (
    <AdminLayoutWrapper 
      user={user} 
      title="Dashboard"
      rightContent={
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <Eye className="w-4 h-4" />
          View Site
        </Link>
      }
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium">{stat.name}</h3>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
              <span className="text-sm text-emerald-600 mb-1">{stat.published} published</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`flex items-center gap-3 p-4 border border-gray-200 rounded-lg ${action.hoverBorder} ${action.hoverBg} transition-colors`}
            >
              <div className={`w-10 h-10 ${action.iconBg} rounded-lg flex items-center justify-center`}>
                <action.icon className={`w-5 h-5 ${action.iconColor}`} />
              </div>
              <span className="font-medium text-gray-900">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
