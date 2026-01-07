"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CreditCard, Phone } from "lucide-react";
import { toast, Toaster } from "sonner";

import Filters from "../../components/balance-report/Filters";
import TransactionTable from "../../components/balance-report/TransactionTable";
import TopUpModal from "../../components/balance-report/TopUpModal";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import {
  fetchEsewaTransactions,
  fetchKhaltiTransactions,
  initiateTopUp,
  verifyKhaltiPayment,
  verifyEsewaPayment,
} from "../../lib/report";

const paymentMethods = [
  { id: "esewa", name: "eSewa", icon: Phone, color: "bg-green-100", iconColor: "text-green-600" },
  { id: "khalti", name: "Khalti", icon: CreditCard, color: "bg-purple-100", iconColor: "text-purple-600" },
];

export default function BalanceReportPage() {
  const searchParams = useSearchParams();

  // States
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("balance-report");

  // Helper Functions
  const formatDate = (transaction) => {
    const dateValue =
      transaction.paidAt ||
      transaction.paid_at ||
      transaction.completedAt ||
      transaction.createdAt ||
      transaction.created_at ||
      transaction.updatedAt ||
      transaction.date ||
      transaction.timestamp;

    if (!dateValue) return "N/A";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getPaymentMethodDisplay = (method) =>
    method === "esewa" ? "eSewa" : method === "khalti" ? "Khalti" : method || "-";

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

  // Fetch all transactions
  const fetchAllTransactions = async () => {
    setIsLoadingData(true);
    try {
      const [esewaData, khaltiData] = await Promise.all([
        fetchEsewaTransactions(),
        fetchKhaltiTransactions(),
      ]);

      const allTransactions = [...esewaData, ...khaltiData].sort(
        (a, b) =>
          new Date(b.createdAt || b.paidAt || 0) - new Date(a.createdAt || a.paidAt || 0)
      );

      setTransactions(allTransactions);

      const total = allTransactions
        .filter((t) => ["COMPLETE", "Completed", "Success"].includes(t.status))
        .reduce((sum, t) => sum + (t.totalAmount || t.amount || 0), 0);

      setBalance(total);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setIsLoadingData(false);
    }
  };

  // Handle Export to CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    const filtered = transactions.filter((t) => {
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

    const csvRows = [];
    const headers = ["Date", "Payment Method", "Amount", "Status"];
    csvRows.push(headers.join(","));

    filtered.forEach((t) => {
      const row = [
        `"${formatDate(t)}"`,
        `"${getPaymentMethodDisplay(t.paymentMethod)}"`,
        `"${t.amount || t.totalAmount || 0}"`,
        `"${t.status || "Pending"}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Initial Fetch
  useEffect(() => {
    fetchAllTransactions();
  }, []);

  useEffect(() => {
    const data = searchParams.get("data");
    if (!data) return;
    if (sessionStorage.getItem("esewa_verified") === "true") return;

    setIsVerifying(true);
    toast.loading("Verifying eSewa payment...", { id: "esewa-verify" });

    verifyEsewaPayment(data)
      .then(() => {
        sessionStorage.setItem("esewa_verified", "true");
        toast.success("Payment successful! Balance updated.", { id: "esewa-verify" });
        fetchAllTransactions();
      })
      .catch((error) => {
        console.error("eSewa verification failed:", error);
        toast.error(`Verification failed: ${error.message}`, { id: "esewa-verify" });
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, [searchParams]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col">
        <Header title="Balance Report" />

        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <Toaster position="top-center" richColors />

          <div className="max-w-7xl mx-auto">
            <Filters
              filterDate={filterDate}
              setFilterDate={setFilterDate}
              filterType={filterType}
              setFilterType={setFilterType}
              onTopUpClick={() => setShowTopUp(true)}
              transactions={transactions}
              formatDate={formatDate}
              getPaymentMethodDisplay={getPaymentMethodDisplay}
              getTransactionType={getTransactionType}
              getAmountDisplay={getAmountDisplay}
              getStatusColor={getStatusColor}
              onExport={handleExportCSV} // Export button
            />

            <TransactionTable
              transactions={transactions}
              filterDate={filterDate}
              filterType={filterType}
              isLoading={isLoadingData}
              formatDate={formatDate}
              getPaymentMethodDisplay={getPaymentMethodDisplay}
            />

            {showTopUp && (
              <TopUpModal
                balance={balance}
                paymentMethods={paymentMethods}
                topUpAmount={topUpAmount}
                setTopUpAmount={setTopUpAmount}
                selectedPayment={selectedPayment}
                setSelectedPayment={setSelectedPayment}
                showAmountInput={showAmountInput}
                setShowAmountInput={setShowAmountInput}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
                resetModal={() => {
                  setShowTopUp(false);
                  setShowAmountInput(false);
                  setSelectedPayment("");
                  setTopUpAmount("");
                }}
                initiateTopUp={initiateTopUp}
                verifyKhaltiPayment={verifyKhaltiPayment}
                verifyEsewaPayment={verifyEsewaPayment}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
