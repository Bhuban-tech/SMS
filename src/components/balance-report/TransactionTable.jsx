"use client";
import React from "react";
import { AlertCircle, Loader } from "lucide-react";

export default function TransactionTable({ transactions, filterDate, filterType, isLoading, formatDate, getPaymentMethodDisplay }) {
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
      matchesType = t.status === "COMPLETE" || t.status === "Completed" || t.status === "Success";
    }

    return matchesDate && matchesType;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {isLoading ? (
        <div className="text-center py-16">
          <Loader className="w-12 h-12 text-teal-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500 font-medium">Loading transactions...</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-16">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 font-medium mb-4">No transactions found</p>
          <p className="text-sm text-gray-400">
            {filterDate ? "No transactions on selected date." : "Transaction history will appear here after successful top-ups."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Transaction ID</th> */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Method</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id || transaction.pidx || transaction.transactionUuid} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(transaction)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{transaction.transactionUuid || transaction.pidx || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      transaction.paymentMethod === "esewa" ? "bg-green-100 text-green-800" :
                      transaction.paymentMethod === "khalti" ? "bg-purple-100 text-purple-800" :
                      "bg-gray-100 text-gray-800"}`}>
                      {getPaymentMethodDisplay(transaction.paymentMethod)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Rs. {(transaction.totalAmount || transaction.amount || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      (transaction.status === "COMPLETE" || transaction.status === "Completed" || transaction.status === "Success") ? "bg-green-100 text-green-800" :
                      transaction.status?.toLowerCase().includes("pending") ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"}`}>
                      {transaction.status || "Pending"}{(transaction.status === "COMPLETE" || transaction.status === "Completed" || transaction.status === "Success") && " (Paid)"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{transaction.transactionId || transaction.transactionCode || transaction.idx || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
