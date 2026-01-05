"use client";
import React from "react";
import { Calendar, Filter, Upload, Wallet } from "lucide-react";

export default function Filters({
  filterDate,
  setFilterDate,
  filterType,
  setFilterType,
  onTopUpClick,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        {/* Date Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Filter by Date
          </label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none hover:cursor-pointer"
          />
        </div>

        {/* Type Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Filter className="inline w-4 h-4 mr-1" />
            Filter by Type
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white hover:cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="top up">Top Up</option>
          </select>
        </div>

        {/* Top Up Button */}
        <button
          onClick={onTopUpClick}
          className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 px-6 py-3 text-white rounded-xl shadow transition-colors font-medium flex items-center justify-center gap-2 hover:cursor-pointer"
        >
          <Wallet className="w-5 h-5" />
          Top Up
        </button>

        {/* Export Button */}
        <button className="w-full sm:w-auto bg-white border-2 border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-xl shadow-sm transition-colors font-medium flex items-center justify-center gap-2 hover:cursor-pointer">
          <Upload className="w-5 h-5" />
          Export
        </button>
      </div>
    </div>
  );
}
