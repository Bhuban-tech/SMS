"use client";

import React from "react";

export default function SearchFilterBar({ searchTerm, setSearchTerm, filterType, setFilterType, onReload }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <input
        type="text"
        placeholder="Search by mobile or user..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border bg-white px-4 py-2 rounded-xl shadow-sm outline-none w-full md:w-96"
      />

      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="border bg-white px-4 py-2 rounded-xl shadow-sm"
      >
        <option value="all">All Status</option>
        <option value="delivered">Delivered</option>
        <option value="failed">Failed</option>
        <option value="pending">Pending</option>
      </select>

      <button
        onClick={onReload}
        className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
      >
        Reload
      </button>
    </div>
  );
}
