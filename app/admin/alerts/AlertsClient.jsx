"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayoutWrapper } from "@/components/admin";
import { createClient } from "@/lib/supabase/client";
import {
  Bell,
  Mail,
  Smartphone,
  Trash2,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function AlertsClient({ user }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, inactive
  const supabase = createClient();

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("price_alerts")
        .select(`
          *,
          phones (
            id,
            name,
            slug,
            price,
            image_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const toggleAlertStatus = async (alertId, currentStatus) => {
    try {
      const { error } = await supabase
        .from("price_alerts")
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq("id", alertId);

      if (error) throw error;
      
      setAlerts(alerts.map(a => 
        a.id === alertId ? { ...a, is_active: !currentStatus } : a
      ));
    } catch (error) {
      console.error("Error updating alert:", error);
    }
  };

  const deleteAlert = async (alertId) => {
    if (!confirm("Are you sure you want to delete this alert?")) return;
    
    try {
      const { error } = await supabase
        .from("price_alerts")
        .delete()
        .eq("id", alertId);

      if (error) throw error;
      
      setAlerts(alerts.filter(a => a.id !== alertId));
    } catch (error) {
      console.error("Error deleting alert:", error);
    }
  };

  // Filter and search alerts
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.phones?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === "all" ||
      (filter === "active" && alert.is_active) ||
      (filter === "inactive" && !alert.is_active);
    
    return matchesSearch && matchesFilter;
  });

  // Group by phone for summary
  const alertsByPhone = alerts.reduce((acc, alert) => {
    const phoneId = alert.phone_id;
    if (!acc[phoneId]) {
      acc[phoneId] = {
        phone: alert.phones,
        count: 0,
        activeCount: 0,
      };
    }
    acc[phoneId].count++;
    if (alert.is_active) acc[phoneId].activeCount++;
    return acc;
  }, {});

  const totalActive = alerts.filter(a => a.is_active).length;
  const uniquePhones = Object.keys(alertsByPhone).length;
  const uniqueEmails = new Set(alerts.map(a => a.user_email)).size;

  return (
    <AdminLayoutWrapper user={user} title="Price Alerts">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
              <p className="text-xs text-gray-500">Total Alerts</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalActive}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Smartphone className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{uniquePhones}</p>
              <p className="text-xs text-gray-500">Phones</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Mail className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{uniqueEmails}</p>
              <p className="text-xs text-gray-500">Subscribers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email or phone name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="all">All Alerts</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
            
            <button
              onClick={fetchAlerts}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
            <p className="text-gray-500">Loading alerts...</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No price alerts found</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm || filter !== "all" 
                ? "Try adjusting your search or filter" 
                : "Users can subscribe on phone detail pages"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
                    Email
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
                    Phone
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
                    Subscribed
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
                    Last Notified
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {alert.user_email}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {alert.phones ? (
                        <Link 
                          href={`/admin/phones/${alert.phones.id}`}
                          className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                        >
                          {alert.phones.name}
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-400">Unknown</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleAlertStatus(alert.id, alert.is_active)}
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                          alert.is_active
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {alert.is_active ? (
                          <>
                            <CheckCircle className="w-3 h-3" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(alert.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {alert.last_notified_price ? (
                        <span className="text-emerald-600">
                          AED {alert.last_notified_price.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">Never</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary by Phone */}
      {Object.keys(alertsByPhone).length > 0 && (
        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Alerts by Phone</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.values(alertsByPhone)
                .sort((a, b) => b.count - a.count)
                .slice(0, 6)
                .map((item) => (
                  <div
                    key={item.phone?.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.phone?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.activeCount} active / {item.count} total
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </AdminLayoutWrapper>
  );
}
