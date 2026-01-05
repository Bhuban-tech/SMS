"use client";

import React from "react";
import { Search, Plus, Filter } from "lucide-react";

export default function FileUploadControls({
  search,
  setSearch,
  bulkGroupName,
  setBulkGroupName,
  fileInputRef,
  onUpload,
  uploading,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6">
      {/* Search input */}
      <div className="relative w-full sm:w-72">
        <input
          type="text"
          placeholder="Search group name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-xl py-2 pl-10 pr-4 shadow-sm text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
        />
        <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <input
          type="text"
          placeholder="Enter group name"
          value={bulkGroupName}
          onChange={(e) => setBulkGroupName(e.target.value)}
          className="border rounded-xl py-2 px-3 text-sm shadow-sm w-full sm:w-auto"
          disabled={uploading}
        />
        <button
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="w-full sm:w-auto px-5 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow flex items-center justify-center gap-2 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
          {uploading ? "Uploading..." : "ADD FILES"}
        </button>
        <button className="w-full sm:w-auto rounded-lg px-3 py-2 border shadow-sm flex items-center justify-center hover:bg-gray-100">
          <Filter className="w-4 h-4" />
        </button>
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => onUpload(e.target.files[0])}
          className="hidden"
          accept=".csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
      </div>
    </div>
  );
}
