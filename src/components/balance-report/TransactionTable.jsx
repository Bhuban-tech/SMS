"use client";
import React from "react";
import { AlertCircle, Loader } from "lucide-react";

export default function TransactionTable({
  transactions,
  filterDate,
  filterType,
  isLoading,
  formatDate,
  getPaymentMethodDisplay,
}) {
  // Filtering Logic
  const filteredTransactions = transactions.filter((t) => {
    // Date filter
    let matchesDate = true;
    if (filterDate) {
      const txDate = new Date(t.paidAt || t.createdAt || t.created_at || 0);
      const filterDateObj = new Date(filterDate);

      matchesDate =
        txDate.getFullYear() === filterDateObj.getFullYear() &&
        txDate.getMonth() === filterDateObj.getMonth() &&
        txDate.getDate() === filterDateObj.getDate();
    }

    // Type filter ("top up")
    let matchesType = true;
    if (filterType === "top up") {
      const status = (t.status || "").trim();
      const method = (t.paymentMethod || "").toLowerCase();

      const isSuccessfulTopup =
        status === "Completed" ||           // Current official Khalti success status
        status.toLowerCase() === "completed" ||
        status === "COMPLETE" ||
        status === "Success" ||
        status === "success" ||
        method === "khalti" ||
        method === "esewa";

      matchesType = isSuccessfulTopup;
    }

    return matchesDate && matchesType;
  });

  // Helpers
  const getTransactionType = (t) => {
    const status = (t.status || "").toLowerCase().trim();
    const method = (t.paymentMethod || "").toLowerCase();

    const isCredit =
      status === "completed" ||
      status === "complete" ||
      status === "success" ||
      method === "khalti" ||
      method === "esewa" ||
      t.type === "credit" ||
      (t.amount ?? t.totalAmount ?? 0) > 0;

    return isCredit ? "credit" : "debit";
  };

  const getDisplayAmount = (t) => {
    let raw = t.totalAmount ?? t.amount ?? 0;

    // Most common case: backend saves Khalti amount in paisa
    if ((t.paymentMethod?.toLowerCase() === "khalti" || t.pidx) && raw > 500) {
      raw = raw / 100;
    }

    const type = getTransactionType(t);
    const sign = type === "credit" ? "+" : "−";
    const color = type === "credit" ? "text-emerald-700" : "text-rose-700";

    return (
      <span className={`text-lg font-bold ${color}`}>
        {sign} रु{" "}
        {Math.abs(raw).toLocaleString("en-NP", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    );
  };

  const getStatusBadgeStyle = (status) => {
    const s = (status || "Pending").toLowerCase().trim();

    if (["completed", "complete", "success"].includes(s)) {
      return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    }
    if (s.includes("pending")) {
      return "bg-amber-100 text-amber-800 border border-amber-200";
    }
    if (
      s.includes("cancel") ||
      s.includes("fail") ||
      s.includes("expire") ||
      s.includes("refund")
    ) {
      return "bg-rose-100 text-rose-800 border border-rose-200";
    }
    return "bg-gray-100 text-gray-700 border border-gray-200";
  };

  const getMethodBadgeStyle = (method) => {
    const m = (method || "").toLowerCase();

    if (m === "khalti") return "bg-indigo-100 text-indigo-800 border border-indigo-200";
    if (m === "esewa") return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    if (m === "system" || m === "deduction")
      return "bg-rose-100 text-rose-800 border border-rose-200";
    return "bg-gray-100 text-gray-700 border border-gray-200";
  };

  // Render
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {isLoading ? (
        <div className="text-center py-20">
          <Loader className="w-14 h-14 text-teal-600 mx-auto mb-4 animate-spin" />
          <p className="text-lg text-gray-600 font-medium">Loading transactions...</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-20 px-6">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <p className="text-lg font-semibold text-gray-700 mb-2">No transactions found</p>
          <p className="text-sm text-gray-500">
            {filterDate
              ? "No transactions found for selected date."
              : "Your transaction history will appear here."}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {/* Mobile Card View */}
          <div className="md:hidden">
            {filteredTransactions.map((t) => (
              <div
                key={t.id || t.pidx || t.transactionUuid || Math.random()}
                className="p-5 hover:bg-teal-50/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium text-gray-900">{formatDate(t)}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {getTransactionType(t) === "debit"
                        ? "SMS Deduction"
                        : getPaymentMethodDisplay(t.paymentMethod)}
                    </div>
                  </div>
                  <div className="text-right">{getDisplayAmount(t)}</div>
                </div>

                <span
                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeStyle(
                    t.status
                  )}`}
                >
                  {t.status || "Pending"}
                </span>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-160">
              <thead className="bg-teal-700 border-b-2 border-teal-200">
                <tr>
                  <th className="px-8 py-5 text-left text-white text-xs font-bold text-teal-800 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-8 py-5 text-left text-xs text-white font-bold text-teal-800 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-8 py-5 text-right text-xs text-white font-bold text-teal-800 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-8 py-5 text-center text-xs text-white font-bold text-teal-800 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredTransactions.map((t) => (
                  <tr
                    key={t.id || t.pidx || t.transactionUuid || Math.random()}
                    className="hover:bg-teal-50/50 transition-colors"
                  >
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(t)}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-4 py-1.5 text-xs font-semibold rounded-full ${getMethodBadgeStyle(
                          t.paymentMethod ||
                            (getTransactionType(t) === "debit" ? "system" : "")
                        )}`}
                      >
                        {getTransactionType(t) === "debit"
                          ? "SMS Deduction"
                          : getPaymentMethodDisplay(t.paymentMethod)}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right font-medium">
                      {getDisplayAmount(t)}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex px-4 py-1.5 text-xs font-semibold rounded-full ${getStatusBadgeStyle(
                          t.status
                        )}`}
                      >
                        {t.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}