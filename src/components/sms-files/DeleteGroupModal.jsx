"use client";
import React from "react";

export default function DeleteGroupModal({ deleteModalOpen, setDeleteModalOpen, fileToDelete, confirmDelete }) {
  if (!deleteModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm">
         <button
        onClick={() => setDeleteModalOpen(false)}
        aria-label="Close"
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 hover:cursor-pointer"
      >
        ✕
      </button>
         
        <h2 className="text-xl font-bold mb-4 text-center">Confirm Delete</h2>
       
        <p className="mb-6 px-4 text-center text-gray-700">
          Are you sure you want to delete the group "<strong>{fileToDelete?.name}</strong>"? 
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="px-4 py-2 rounded-lg border hover:bg-gray-200 hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 hover:cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
