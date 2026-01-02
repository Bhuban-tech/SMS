"use client";
import React, { useState, useEffect, useCallback } from "react";
import { X, Loader } from "lucide-react";
import { toast } from "sonner";

const quickAmounts = [100, 500, 1000, 2000, 5000];

export default function TopUpModal({
  balance,
  paymentMethods,
  topUpAmount,
  setTopUpAmount,
  selectedPayment,
  setSelectedPayment,
  showAmountInput,
  setShowAmountInput,
  isProcessing,
  setIsProcessing,
  resetModal,
  initiateTopUp,
}) {

  const [hasClickedPay, setHasClickedPay] = useState(false);

  useEffect(() => {
    setHasClickedPay(false);
  }, [topUpAmount, selectedPayment]);

  const handlePaymentSelect = (id) => {
    setSelectedPayment(id);
    setShowAmountInput(true);
  };

  const handleBackToPaymentMethod = () => {
    setShowAmountInput(false);
    setSelectedPayment("");
    setTopUpAmount("");
    setHasClickedPay(false)
  };

  const handleTopUp = useCallback(async () => {
    if (hasClickedPay) return;

    const amount = parseFloat(topUpAmount);
    if (!amount || amount < 100) {
      toast.error("Minimum top-up is Rs. 100");
      return;
    }


    setHasClickedPay(true);
    setIsProcessing(true);

    try {
      const result = await initiateTopUp(selectedPayment, amount);

      if (selectedPayment === "khalti") {
        if (result.payment_url) {
          window.location.href = result.payment_url;
        } else {
          throw new Error("No payment URL received from Khalti");
        }
      } else if (selectedPayment === "esewa") {
        if (!result.api_endpoint || !result.formData) {
          throw new Error("Invalid eSewa response from server");
        }

        const form = document.createElement("form");
        form.method = "POST";
        form.action = result.api_endpoint;

        Object.entries(result.formData).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      }
    } catch (err) {
      toast.error(err.message || "Payment initiation failed. Please try again.");
      console.error("Payment initiation error:", err);
   
    } finally {
      setIsProcessing(false);

    }
  }, [topUpAmount, selectedPayment, initiateTopUp, hasClickedPay]);


  const isPayDisabled =
    isProcessing ||
    !topUpAmount ||
    parseFloat(topUpAmount) < 100 ||
    hasClickedPay;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
       
        <div className="bg-linear-to-r from-teal-600 to-teal-500 p-6 rounded-t-3xl text-white relative">
          <h2 className="text-2xl font-bold mb-1">Top Up Balance</h2>
          <p className="text-teal-100 text-sm">
            {!showAmountInput
              ? "Choose payment method"
              : `Pay with ${selectedPayment === "esewa" ? "eSewa" : "Khalti"}`}
          </p>
          <button
            onClick={resetModal}
            className="p-2 hover:bg-white/20 rounded-full transition-colors absolute top-6 right-6"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          
          <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-teal-700 font-medium mb-1">Current Balance</p>
            <p className="text-3xl font-bold text-teal-900">Rs. {balance.toFixed(2)}</p>
          </div>

          {!showAmountInput ? (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
              <div className="space-y-3 mb-6">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentSelect(method.id)}
                      className="w-full p-6 rounded-xl border-2 transition-all border-gray-200 hover:border-teal-500 hover:shadow-lg hover:scale-105"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`${method.color} p-3 rounded-lg`}>
                          <Icon className={`w-6 h-6 ${method.iconColor}`} />
                        </div>
                        <span className="text-lg font-semibold text-gray-900">{method.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
          
              {(() => {
                const method = paymentMethods.find((m) => m.id === selectedPayment);
                if (!method) return null;
                const Icon = method.icon;
                return (
                  <div className="flex items-center justify-between mb-6 bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`${method.color} p-2 rounded-lg`}>
                        <Icon className={`w-5 h-5 ${method.iconColor}`} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Selected Method</p>
                        <p className="font-semibold text-gray-900">{method.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleBackToPaymentMethod}
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Change
                    </button>
                  </div>
                );
              })()}

     
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Amount (Min. Rs. 100)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setTopUpAmount(amt.toString())}
                      disabled={isProcessing || hasClickedPay}
                      className={`p-3 rounded-lg border transition-all ${
                        topUpAmount === amt.toString()
                          ? "border-teal-500 bg-teal-50 text-teal-700 font-semibold"
                          : "border-gray-200 hover:border-teal-300"
                      } disabled:opacity-50`}
                    >
                      Rs. {amt}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    Rs.
                  </span>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    disabled={isProcessing || hasClickedPay}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none disabled:bg-gray-100"
                    min="100"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-6 bg-gray-50 rounded-b-3xl flex gap-3">
          {!showAmountInput ? (
            <button
              onClick={resetModal}
              className="w-full py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          ) : (
            <>
              <button
                onClick={handleBackToPaymentMethod}
                disabled={isProcessing}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-100 disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleTopUp}
                disabled={isPayDisabled}
                className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : hasClickedPay ? (
                  "Payment Initiated"
                ) : (
                  <>Pay Rs. {topUpAmount || "0"}</>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}