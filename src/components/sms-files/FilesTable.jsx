"use client";
import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

export default function FilesTable({
  files = [],
  filteredFiles = [],
  loading,
  openEditModal,
  handleDeleteClick,
  handleViewClick, 
}) {
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Sort only by Group Name (row.name)
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();

    return sortOrder === "asc"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">
      <table className="w-full text-sm text-center">
        <thead>
          <tr className="bg-teal-700 text-white">
            <th className="p-4 font-medium rounded-tl-2xl">S.N</th>
            <th className="p-4 font-medium">Author</th>
            <th className="p-4 font-medium">File Name</th>
            <th className="p-4 font-medium">Type</th>
            <th className="p-4 font-medium">Size</th>

            {/* Sortable Group Name Column */}
            <th className="p-4 font-medium">
              <button
                onClick={toggleSort}
                className="flex items-center gap-2 mx-auto hover:bg-teal-600 px-2 py-1 rounded transition-all duration-200 group"
              >
                Group Name
                <span className="flex flex-col text-xs leading-tight opacity-70 group-hover:opacity-100 transition-opacity">
                  <span className={sortOrder === "asc" ? "font-bold text-white opacity-100" : "opacity-40"}>
                    ▲
                  </span>
                  <span className={sortOrder === "desc" ? "font-bold text-white opacity-100 -mt-1" : "opacity-40 -mt-1"}>
                    ▼
                  </span>
                </span>
              </button>
            </th>

            <th className="p-4 font-medium">Created At</th>
            <th className="p-4 font-medium rounded-tr-2xl">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan="8" className="py-12 text-gray-500">
                Loading files...
              </td>
            </tr>
          ) : sortedFiles.length === 0 ? (
            <tr>
              <td colSpan="8" className="py-12 text-gray-500">
                {files.length === 0
                  ? "No files found. Upload your first file!"
                  : "No files match your search."}
              </td>
            </tr>
          ) : (
            filteredFiles.map((row, index) => (
              <tr key={row.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{row.author || "admin college"}</td>
                <td className="p-3">{row.originalFileName || "-"}</td>
                <td className="p-3">{row.contentType || "-"}</td>
                <td className="p-3">{row.fileSizeBytes || "-"}</td>
                <td className="p-3 font-medium">{row.name || "-"}</td>
                <td className="p-3">
                  {row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}
                </td>
                <td className="p-3 flex gap-3 justify-center">
                  {/* View button (replaces Download) */}
                  <button
                    onClick={() => handleViewClick?.(row)}
                    className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 hover:cursor-pointer"
                    title="View file"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    onClick={() => openEditModal(row)}
                    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 hover:cursor-pointer"
                    title="Edit file"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => handleDeleteClick(row)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 hover:cursor-pointer"
                    title="Delete file"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}