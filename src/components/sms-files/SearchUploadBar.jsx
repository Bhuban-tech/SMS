"use client";
import React, { useRef } from "react";
import { Plus, Filter, Search } from "lucide-react";

export default function SearchUploadBar({
  search,
  setSearch,
  bulkGroupName,
  setBulkGroupName,
  handleUpload,
  uploading
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="relative w-72">
        <input
          type="text"
          placeholder="Search group name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-xl py-2 pl-10 pr-4 shadow-sm text-sm"
        />
        <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
      </div>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter group name"
          value={bulkGroupName}
          onChange={(e) => setBulkGroupName(e.target.value)}
          className="border rounded-xl py-2 px-3 text-sm shadow-sm"
          disabled={uploading}
        />
        <button
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow flex items-center gap-2 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
          {uploading ? "Uploading..." : "ADD FILES"}
        </button>
        <button className="rounded-lg px-3 py-2 border shadow-sm hover:bg-gray-100">
          <Filter className="w-4 h-4" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
          accept=".csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
      </div>
    </div>
  );
}
