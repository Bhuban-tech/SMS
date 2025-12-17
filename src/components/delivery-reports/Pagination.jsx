"use client";

import React from "react";

export default function Pagination({ currentPage, totalPages, setCurrentPage }) {
  return (
    <div className="flex justify-end gap-3 mt-4">
      <button
        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="px-5 py-2 bg-white border rounded-xl shadow hover:bg-gray-50 disabled:opacity-50"
      >
        Previous
      </button>
      <span className="px-5 py-2 bg-white border rounded-xl shadow">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-5 py-2 bg-white border rounded-xl shadow hover:bg-gray-50 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
