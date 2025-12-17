import React from "react";
import { X } from "lucide-react";

export default function EditModal({ file, newFile, setNewFile, onClose, onSave }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4"><X /></button>
        <h2 className="text-xl font-bold mb-4">Edit Group</h2>

        <label className="text-sm text-gray-600 block mb-1">File Name</label>
        <input
          className="w-full border rounded p-2 mb-3"
          value={newFile.fileName}
          onChange={(e) => setNewFile({ ...newFile, fileName: e.target.value })}
        />

        <label className="text-sm text-gray-600 block mb-1">File Type</label>
        <input
          className="w-full border rounded p-2 mb-3"
          value={newFile.fileType}
          onChange={(e) => setNewFile({ ...newFile, fileType: e.target.value })}
        />

        <label className="text-sm text-gray-600 block mb-1">Size</label>
        <input
          className="w-full border rounded p-2 mb-4"
          value={newFile.size}
          onChange={(e) => setNewFile({ ...newFile, size: e.target.value })}
        />

        <button
          onClick={onSave}
          className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
