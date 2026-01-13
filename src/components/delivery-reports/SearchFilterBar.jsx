"use client";

import React from "react";
import { RotateCw } from "lucide-react";

export default function SearchFilterBar({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  onReload,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-stretch sm:items-center">
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="
          w-full sm:w-64 md:w-72
          border border-gray-300 bg-white px-4 py-2.5 rounded-xl shadow-sm
          focus:ring-2 focus:ring-teal-500 focus:border-teal-500
          transition-all text-sm
        "
      >
        <option value="all">All Status</option>
        <option value="delivered">Delivered</option>
        <option value="failed">Failed</option>
        <option value="pending">Pending</option>
      </select>

      {/* Reload button: icon-only on mobile, text on larger screens */}
      <button
        onClick={onReload}
        title="Refresh / Reload"
        className="
          flex items-center justify-center gap-2
          px-4 sm:px-5 py-2.5
          bg-teal-600 text-white rounded-xl shadow-sm
          hover:bg-teal-700 transition-colors
          font-medium text-sm sm:text-base
          focus:outline-none focus:ring-2 focus:ring-teal-400
          min-w-11 sm:min-w-auto
        "
      >
        <RotateCw size={18} className="sm:hidden" />
        <span className="hidden sm:inline">Reload</span>
      </button>
    </div>
  );
}