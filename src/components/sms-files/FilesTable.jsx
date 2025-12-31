"use client";
import React from "react";
import { Download, Edit, Trash2 } from "lucide-react";

export default function FilesTable({
  files,
  filteredFiles,
  loading,
  openEditModal,
  handleDeleteClick
}) {
  return (
    <div className="rounded-2xl bg-white shadow-xl p-4 overflow-x-auto">
      <table className="w-full text-sm text-center">
        <thead>
          <tr className="bg-teal-700 text-white">
            <th className="p-3">S.N</th>
            <th className="p-3">Author</th>
            <th className="p-3">File Name</th>
            <th className="p-3">Type</th>
            <th className="p-3">Size</th>
            <th className="p-3">Group Name</th>
            <th className="p-3">Created At</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="p-10 text-center text-gray-500">
                Loading groups...
              </td>
            </tr>
          ) : filteredFiles.length === 0 ? (
            <tr>
              <td colSpan="8" className="p-10 text-center text-gray-500">
                {files.length === 0
                  ? "No groups found. Upload your first file!"
                  : "No groups match your search."}
              </td>
            </tr>
          ) : (
            filteredFiles.map((row, index) => (
              <tr key={row.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{row.author || "admin college"}</td>
                <td className="p-3">{row.fileName || "-"}</td>
                <td className="p-3 uppercase">{row.fileType || "-"}</td>
                <td className="p-3">{row.size || "-"}</td>
                <td className="p-3 font-medium">{row.name || "-"}</td>
                <td className="p-3">
                  {row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}
                </td>
                <td className="p-3 flex gap-3 justify-center">
                  <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => openEditModal(row)}
                    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(row)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
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
