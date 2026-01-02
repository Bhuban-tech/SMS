"use client";
import React, { useState } from "react";
import { Download, Edit, Trash2 } from "lucide-react";

export default function FilesTable({
  files = [],
  filteredFiles = [],
  loading,
  openEditModal,
  handleDeleteClick,
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
            sortedFiles.map((row, index) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="p-4 text-gray-600">{index + 1}</td>
                <td className="p-4 text-gray-700">{row.author || "admin college"}</td>
                <td className="p-4 text-gray-800 font-medium">{row.fileName || "-"}</td>
                <td className="p-4 uppercase text-gray-600">{row.fileType || "-"}</td>
                <td className="p-4 text-gray-700">{row.size || "-"}</td>
                <td className="p-4 font-medium text-gray-800">{row.name || "-"}</td>
                <td className="p-4 text-gray-600">
                  {row.createdAt
                    ? new Date(row.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <ActionButton color="blue" title="Download">
                      <Download size={16} />
                    </ActionButton>

                    <ActionButton
                      color="green"
                      onClick={() => openEditModal(row)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </ActionButton>

                    <ActionButton
                      color="red"
                      onClick={() => handleDeleteClick(row)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Reusable styled action button
function ActionButton({ children, onClick, color, title }) {
  const colors = {
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    red: "bg-red-500 hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2.5 rounded-lg text-white shadow-sm transition-all duration-200 hover:shadow-md ${colors[color]} ${
        onClick ? "cursor-pointer" : "cursor-not-allowed opacity-70"
      }`}
    >
      {children}
    </button>
  );
}