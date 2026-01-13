// Filters.jsx
"use client";
import React from "react";
import { Calendar, Filter, Upload, Wallet } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Filters({
  filterDate,
  setFilterDate,
  filterType,
  setFilterType,
  onTopUpClick,
  transactions = [],
  formatDate,
  getPaymentMethodDisplay,
  getTransactionType,
  getAmountDisplay,
  getStatusColor
}) {
  const handleExport = () => {
    if (!transactions || transactions.length === 0) return;

    const dataToExport = transactions.map((t) => ({
      Date: formatDate(t),
      Method: getTransactionType(t) === "debit"
        ? "SMS Sent / Deduction"
        : getPaymentMethodDisplay(t.paymentMethod),
      Amount: getAmountDisplay(t).props.children.join(""),
      Status: t.status || "Pending",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "transactions.xlsx");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 mb-6">
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Filter by Date
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="inline w-4 h-4 mr-1" />
              Filter by Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
            >
              <option value="">All Types</option>
              <option value="top up">Top Up</option>
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onTopUpClick}
            className="flex-1 sm:flex-none min-w-40 bg-teal-600 hover:bg-teal-700 px-6 py-3 text-white rounded-xl shadow transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Wallet className="w-5 h-5" />
            Top Up
          </button>

          <button
            onClick={handleExport}
            className="flex-1 sm:flex-none min-w-40 bg-white border-2 border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-xl shadow-sm transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}