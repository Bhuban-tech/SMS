"use client";
import React, { useState, useEffect } from "react";
import { Wallet, Loader, X, CreditCard, Phone } from "lucide-react";
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
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("balance-report");

  const formatDate = (transaction) => {
    let dateValue = transaction.paidAt || transaction.paid_at || transaction.completedAt || transaction.createdAt || transaction.created_at || transaction.updatedAt || transaction.date || transaction.timestamp;
    if (!dateValue) return "N/A";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const getPaymentMethodDisplay = (method) => method === "esewa" ? "eSewa" : method === "khalti" ? "Khalti" : method || "-";

  const fetchAllTransactions = async () => {
    setIsLoadingData(true);
    try {
      const esewaData = await fetchEsewaTransactions();
      const khaltiData = await fetchKhaltiTransactions();
      const allTransactions = [...esewaData, ...khaltiData].sort((a,b)=>new Date(b.createdAt||b.paidAt||0)-new Date(a.createdAt||a.paidAt||0));
      setTransactions(allTransactions);
      const total = allTransactions.filter(t => t.status==="COMPLETE"||t.status==="Completed"||t.status==="Success").reduce((sum,t)=>sum+(t.totalAmount||t.amount||0),0);
      setBalance(total);
    } catch(e){
      console.error(e);
      toast.error("Failed to load transactions");
    } finally { setIsLoadingData(false); }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchAllTransactions();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header title="Balance Report" />

        {/* Page Content */}
        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <Toaster position="top-center" richColors />
          <div className="max-w-7xl mx-auto">
            <Filters
              filterDate={filterDate}
              setFilterDate={setFilterDate}
              filterType={filterType}
              setFilterType={setFilterType}
              onTopUpClick={() => setShowTopUp(true)}
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
                resetModal={() => { setShowTopUp(false); setShowAmountInput(false); setSelectedPayment(""); setTopUpAmount(""); }}
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
