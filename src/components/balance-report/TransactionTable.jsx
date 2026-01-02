"use client";
import React from "react";
import { AlertCircle, Loader } from "lucide-react";

export default function TransactionTable({
  transactions = [],
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
      const transactionDate = new Date(
        t.paidAt || t.createdAt || t.created_at || 0
      );
      const filterDateObj = new Date(filterDate);

      matchesDate =
        transactionDate.getFullYear() === filterDateObj.getFullYear() &&
        transactionDate.getMonth() === filterDateObj.getMonth() &&
        transactionDate.getDate() === filterDateObj.getDate();
    }

    if (filterType === "top up") {
      matchesType =
        ["complete", "completed", "success"].includes(
          t.status?.toLowerCase()
        ) ||
        ["esewa", "khalti"].includes(t.paymentMethod?.toLowerCase());
    }

    return matchesDate && matchesType;
  });

  const getTransactionType = (t) => {
    const status = t.status?.toLowerCase();
    const method = t.paymentMethod?.toLowerCase();

    const isCredit =
      ["complete", "completed", "success"].includes(status) ||
      ["esewa", "khalti"].includes(method) ||
      t.type === "credit" ||
      Number(t.amount) > 0;

    return isCredit ? "credit" : "debit";
  };

  const getAmountDisplay = (t) => {
    const amount = t.totalAmount || t.amount || 0;
    const type = getTransactionType(t);

    return (
      <span
        className={`text-lg font-bold ${
          type === "credit"
            ? "text-emerald-700"
            : "text-rose-700"
        }`}
      >
        {type === "credit" ? "+" : "–"} Rs.{" "}
        {Math.abs(Number(amount)).toFixed(2)}
      </span>
    );
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();

    if (["complete", "completed", "success"].includes(s)) {
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
          <p className="text-lg text-gray-600 font-medium">
            Loading transactions...
          </p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-20">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <p className="text-lg font-semibold text-gray-700 mb-2">
            No transactions found
          </p>
          <p className="text-sm text-gray-500">
            {filterDate
              ? "There are no transactions on the selected date."
              : "Your transactions will appear here."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-teal-600 border-b-2 border-teal-200">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-white uppercase">
                  Date
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold text-white uppercase">
                  Method
                </th>
                <th className="px-8 py-5 text-right text-xs font-bold text-white uppercase">
                  Amount
                </th>
                <th className="px-8 py-5 text-center text-xs font-bold text-white uppercase">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((t) => (
                <tr
                  key={t.id || t.pidx || t.transactionUuid}
                  className="hover:bg-teal-50/50 transition"
                >
                  <td className="px-8 py-5 text-sm font-medium text-gray-900">
                    {formatDate(t)}
                  </td>

                  <td className="px-8 py-5">
                    <span
                      className={`inline-flex px-4 py-1.5 text-xs font-semibold rounded-full ${getPaymentMethodColor(
                        getTransactionType(t) === "debit"
                          ? "system"
                          : t.paymentMethod
                      )}`}
                    >
                      {getTransactionType(t) === "debit"
                        ? "SMS Sent / Deduction"
                        : getPaymentMethodDisplay(t.paymentMethod)}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-right">
                    {getAmountDisplay(t)}
                  </td>

                  <td className="px-8 py-5 text-center">
                    <span
                      className={`inline-flex px-4 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(
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
      )}
    </div>
  );
}
