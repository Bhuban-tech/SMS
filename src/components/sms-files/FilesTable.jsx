"use client";
import React, { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

export default function FilesTable({
  files = [],
  filteredFiles = [],
  loading,
  editingId,
  editingName,
  setEditingName,
  onEditStart,
  onEditCancel,
  onEditSave,
  handleDeleteClick,
  handleViewClick,
}) {
  const [sortOrder, setSortOrder] = useState("asc");

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

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
            <th className="p-4 rounded-tl-2xl">S.N</th>
            <th className="p-4">Author</th>
            <th className="p-4">File Name</th>
            <th className="p-4">Type</th>
            <th className="p-4">Size</th>
            <th className="p-4">
              <button
                onClick={toggleSort}
                className="flex items-center gap-2 mx-auto hover:cursor-pointer"
              >
                Group Name
                <span className="flex flex-col text-xs">
                  <span className={sortOrder === "asc" ? "font-bold" : ""}>
                    ▲
                  </span>
                  <span className={sortOrder === "desc" ? "font-bold -mt-1" : "-mt-1"}>
                    ▼
                  </span>
                </span>
              </button>
            </th>
            <th className="p-4">Created At</th>
            <th className="p-4 rounded-tr-2xl">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {loading ? (
            <tr>
              <td colSpan="8" className="py-10 text-gray-500">
                Loading files...
              </td>
            </tr>
          ) : sortedFiles.length === 0 ? (
            <tr>
              <td colSpan="8" className="py-10 text-gray-500">
                No files found
              </td>
            </tr>
          ) : (
            sortedFiles.map((row, index) => (
              <tr
                key={row.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{row.author || "admin college"}</td>
                <td className="p-3">{row.originalFileName || "-"}</td>
                <td className="p-3">{row.contentType || "-"}</td>
                <td className="p-3">{row.fileSizeBytes || "-"}</td>

             
                <td className="p-3 font-medium">
                  {editingId === row.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") onEditSave(row.id);
                        if (e.key === "Escape") onEditCancel();
                      }}
                      autoFocus
                      className="w-full border border-teal-500 rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  ) : (
                    row.name || "-"
                  )}
                </td>

                <td className="p-3">
                  {row.createdAt
                    ? new Date(row.createdAt).toLocaleString()
                    : "-"}
                </td>

               
                <td className="p-3 flex gap-2 justify-center">
                  {editingId === row.id ? (
                    <>
                      <button
                        onClick={() => onEditSave(row.id)}
                        className="px-3 py-1 rounded bg-teal-600 text-white hover:bg-teal-700 hover:cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={onEditCancel}
                        className="px-3 py-1 rounded bg-gray-400 text-white hover:bg-gray-500 hover:cursor-pointer"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleViewClick(row)}
                        className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 hover:cursor-pointer"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEditStart(row)}
                        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 hover:cursor-pointer"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(row)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 hover:cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
