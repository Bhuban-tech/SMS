"use client";

import React from "react";
import { MessageSquare, Users, LayoutDashboard, Settings, FileText, File, Pen } from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "../hooks/useIsMobile"; // adjust path

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab }) => {
  const isMobile = useIsMobile();

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { id: "messages", icon: MessageSquare, label: "Individual", path: "/contacts" },
    { id: "batch", icon: File, label: "SMS Files", path: "/sms-files" },
    { id: "groups", icon: Users, label: "Group Contact", path: "/groups" },
    { id: "delivery-reports", icon: FileText, label: "Delivery Reports", path: "/delivery-reports" },
    { id: "balance-report", icon: Pen, label: "Balance Report", path: "/balance-report" },
    { id: "send sms", icon: Users, label: "Send SMS", path: "/send-sms" },
  ];

  return (
    <>
      {/* Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

   
      <aside
        className={`
          fixed lg:relative top-0 left-0 h-screen w-64 z-40 bg-linear-to-b from-slate-900 via-slate-800 to-slate-900
          p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out shadow-2xl
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0
        `}
      >
        
        <div>
          <div className="mb-12">
            <h1 className="text-white text-2xl sm:text-2xl font-bold tracking-tight">KritimSMS</h1>
          </div>

         
          <nav className="flex-1 px-2 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <Link key={item.id} href={item.path}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white hover:cursor-pointer"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium truncate">{item.label}</span>
                  </button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="mt-auto">
          <button className="flex items-center gap-3 w-full px-4 py-2 text-slate-400 hover:text-white transition">
            <Settings size={18} />
            <span className="text-sm truncate">Settings</span>
          </button>
        </div>
      </aside>

    
      {isMobile && !sidebarOpen && (
        <div className="fixed top-4 left-4 z-50">
          <button
            className="p-2 bg-teal-600 text-white rounded-md shadow-lg"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
