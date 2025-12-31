"use client";
import React from "react";
import { X } from "lucide-react";

export default function EditGroupModal({ editModalOpen, setEditModalOpen, newGroupName, setNewGroupName, handleSaveEdit }) {
  if (!editModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
        <button
          onClick={() => setEditModalOpen(false)}
          className="absolute top-4 right-4"
        >
          <X />
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Group Name</h2>
        <label className="text-sm text-gray-600 block mb-1">Group Name</label>
        <input
          className="w-full border rounded p-2 mb-3"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          autoFocus
        />
        <button
          onClick={handleSaveEdit}
          className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
