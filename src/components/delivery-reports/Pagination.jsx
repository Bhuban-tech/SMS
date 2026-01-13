"use client";

import React from "react";

export default function Pagination({ currentPage, totalPages, setCurrentPage }) {
  return (
    <div className="flex flex-wrap justify-end items-center gap-2 sm:gap-3 mt-6">
      <button
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="
          px-4 sm:px-5 py-2 text-sm sm:text-base
          bg-white border border-gray-300 rounded-xl shadow-sm
          hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400
        "
      >
        Previous
      </button>

      <span
        className="
          px-4 sm:px-5 py-2 text-sm sm:text-base
          bg-white border border-gray-300 rounded-xl shadow-sm
          font-medium text-gray-700
        "
      >
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="
          px-4 sm:px-5 py-2 text-sm sm:text-base
          bg-white border border-gray-300 rounded-xl shadow-sm
          hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400
        "
      >
        Next
      </button>
    </div>
  );
}