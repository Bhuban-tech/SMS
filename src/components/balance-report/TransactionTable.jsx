// TransactionTable.jsx - Most important responsiveness improvement
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
  const filteredTransactions = transactions.filter((t) => {
    let matchesDate = true;
    let matchesType = true;

    if (filterDate) {
      const transactionDate = new Date(t.paidAt || t.createdAt || t.created_at || 0);
      const filterDateObj = new Date(filterDate);

      matchesDate =
        transactionDate.getFullYear() === filterDateObj.getFullYear() &&
        transactionDate.getMonth() === filterDateObj.getMonth() &&
        transactionDate.getDate() === filterDateObj.getDate();
    }

    if (filterType === "top up") {
      matchesType =
        t.status === "COMPLETE" ||
        t.status === "Completed" ||
        t.status === "Success" ||
        ["esewa", "khalti"].includes(t.paymentMethod?.toLowerCase());
    }

    return matchesDate && matchesType;
  });

  const getTransactionType = (t) => {
    const status = t.status?.toLowerCase();
    const method = t.paymentMethod?.toLowerCase();

    const isTopUp =
      status === "complete" ||
      status === "completed" ||
      status === "success" ||
      method === "esewa" ||
      method === "khalti" ||
      t.type === "credit" ||
      t.amount > 0;

    return isTopUp ? "credit" : "debit";
  };

  const getAmountDisplay = (t) => {
    const amount = t.totalAmount || t.amount || 0;
    const type = getTransactionType(t);
    const sign = type === "credit" ? "+" : "–";
    const colorClass = type === "credit" ? "text-emerald-700" : "text-rose-700";

    return (
      <span className={`text-lg font-bold ${colorClass}`}>
        {sign} Rs. {Math.abs(amount).toFixed(2)}
      </span>
    );
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "complete" || s === "completed" || s === "success") {
      return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    }
    if (s?.includes("pending")) {
      return "bg-amber-100 text-amber-800 border border-amber-200";
    }
    return "bg-rose-100 text-rose-800 border border-rose-200";
  };

  const getPaymentMethodColor = (method) => {
    switch (method?.toLowerCase()) {
      case "esewa":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "khalti":
        return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      case "system":
      case "deduction":
        return "bg-rose-100 text-rose-800 border border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

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
            {filterDate ? "No transactions on selected date." : "Your transactions will appear here."}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {/* Mobile Card View */}
          <div className="md:hidden">
            {filteredTransactions.map((t) => (
              <div
                key={t.id || t.pidx || t.transactionUuid}
                className="p-5 bg-white hover:bg-teal-50/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium text-gray-900">{formatDate(t)}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {getTransactionType(t) === "debit"
                        ? "SMS Sent / Deduction"
                        : getPaymentMethodDisplay(t.paymentMethod)}
                    </div>
                  </div>
                  <div className="text-right">{getAmountDisplay(t)}</div>
                </div>

                <div>
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      t.status
                    )}`}
                  >
                    {t.status || "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-linear-to-r from-teal-50 to-cyan-50 border-b-2 border-teal-200">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-bold text-teal-800 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-teal-800 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-8 py-5 text-right text-xs font-bold text-teal-800 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-8 py-5 text-center text-xs font-bold text-teal-800 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id || transaction.pidx || transaction.transactionUuid}
                    className="hover:bg-teal-50/50 transition-all duration-200"
                  >
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(transaction)}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-4 py-1.5 text-xs font-semibold rounded-full ${getPaymentMethodColor(
                          transaction.paymentMethod ||
                            (getTransactionType(transaction) === "debit" ? "system" : "")
                        )}`}
                      >
                        {getTransactionType(transaction) === "debit"
                          ? "SMS Sent / Deduction"
                          : getPaymentMethodDisplay(transaction.paymentMethod)}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right">
                      {getAmountDisplay(transaction)}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex px-4 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status || "Pending"}
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