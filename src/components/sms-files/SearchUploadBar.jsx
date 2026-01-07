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
    <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6">
      {/* Search input */}
      <div className="relative w-full sm:w-72">
        <input
          type="text"
          placeholder="Search group name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-xl py-2 pl-10 pr-4 shadow-sm text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
        />
        <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
      </div>

      {/* Upload controls */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {/* Group name input */}
        <input
          type="text"
          placeholder="Enter group name"
          value={bulkGroupName}
          onChange={(e) => setBulkGroupName(e.target.value)}
          className="w-full sm:w-auto border border-gray-300 rounded-xl py-2 px-3 text-sm shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          disabled={uploading}
        />

        {/* Add files button */}
        <button
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="w-full sm:w-auto px-5 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow flex items-center justify-center gap-2 hover:bg-teal-600 disabled:opacity-50 hover:cursor-pointer transition"
        >
          <Plus size={16} />
          {uploading ? "Uploading..." : "ADD FILES"}
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
