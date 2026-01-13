"use client";
import React, { useState } from "react";
import { Wallet, Loader } from "lucide-react";
import { toast } from "sonner";
import { initiateTopUp } from "../../lib/report";

const paymentMethods = [
  { id: "esewa", name: "eSewa" },
  { id: "khalti", name: "Khalti" },
];

const quickAmounts = [100, 500, 1000, 2000, 5000];

export default function TopUpSection({ balance, fetchTransactions }) {
  const [selectedPayment, setSelectedPayment] = useState("");
  const [topUpAmount, setTopUpAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount);
    if (!amount || amount < 100) {
      toast.error("Minimum top-up is Rs. 100");
      return;
    }
    setIsProcessing(true);
    try {
      const result = await initiateTopUp(selectedPayment, amount);

      if (selectedPayment === "khalti") {
        if (result.payment_url) window.location.href = result.payment_url;
        else throw new Error("No payment URL received from Khalti");
      } else if (selectedPayment === "esewa") {
        if (!result.api_endpoint || !result.formData) throw new Error("Invalid eSewa response");
        const form = document.createElement("form");
        form.method = "POST";
        form.action = result.api_endpoint;
        Object.entries(result.formData).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      }
    } catch (err) {
      toast.error(err.message || "Payment initiation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 mb-6">
      {/* Current Balance */}
      <div className="mb-5 sm:mb-6">
        <p className="text-sm text-gray-600">Current Balance</p>
        <p className="text-2xl sm:text-3xl font-bold text-teal-600 mt-1">
          Rs. {balance.toFixed(2)}
        </p>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-5 sm:mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">
          Select Payment Method
        </p>
        <div className="grid grid-cols-2 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedPayment(method.id)}
              className={`
                py-3.5 px-4 rounded-xl border-2 text-center font-medium transition-all
                ${
                  selectedPayment === method.id
                    ? "border-teal-600 bg-teal-50 text-teal-700"
                    : "border-gray-300 hover:border-gray-400 bg-white"
                }
                active:scale-[0.98]
              `}
            >
              {method.name}
            </button>
          ))}
        </div>
      </div>

      {/* Amount Selection */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">
          Amount (Minimum Rs. 100)
        </p>

        {/* Quick Amounts - Responsive grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 sm:gap-3 mb-4">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setTopUpAmount(amt.toString())}
              className={`
                py-3 px-3 sm:px-4 rounded-lg border font-medium text-sm sm:text-base
                transition-all active:scale-[0.98]
                ${
                  topUpAmount === amt.toString()
                    ? "border-teal-600 bg-teal-50 text-teal-700"
                    : "border-gray-300 hover:border-gray-400"
                }
              `}
            >
              Rs. {amt}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            Rs.
          </span>
          <input
            type="number"
            placeholder="Enter custom amount"
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            min={100}
            className="
              w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300
              focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none
              text-base sm:text-lg
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
            "
          />
        </div>
      </div>

      {/* Pay Button */}
      <button
        type="button"
        disabled={!topUpAmount || !selectedPayment || isProcessing || parseFloat(topUpAmount) < 100}
        onClick={handleTopUp}
        className="
          w-full py-4 sm:py-3.5 mt-2
          bg-teal-600 hover:bg-teal-700 
          disabled:bg-gray-400 disabled:cursor-not-allowed
          text-white font-medium rounded-xl
          flex items-center justify-center gap-2.5
          transition-colors shadow-sm
          text-lg sm:text-base
          active:scale-[0.98]
        "
      >
        {isProcessing ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>Pay Rs. {topUpAmount ? Number(topUpAmount).toLocaleString() : "0"}</>
        )}
      </button>
    </div>
  );
}