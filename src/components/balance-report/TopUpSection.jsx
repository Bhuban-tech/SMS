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
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600">Current Balance</p>
        <p className="text-2xl font-bold text-teal-600">Rs. {balance.toFixed(2)}</p>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">Select Payment Method</p>
        <div className="flex gap-2">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              className={`flex-1 p-3 rounded-xl border ${selectedPayment === method.id ? "border-teal-600 bg-teal-50" : "border-gray-300"}`}
              onClick={() => setSelectedPayment(method.id)}
            >
              {method.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">Amount (Min. Rs. 100)</p>
        <div className="grid grid-cols-5 gap-2 mb-2">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              className={`p-2 rounded-lg border ${topUpAmount == amt ? "border-teal-600 bg-teal-50" : "border-gray-300"}`}
              onClick={() => setTopUpAmount(amt.toString())}
            >
              Rs. {amt}
            </button>
          ))}
        </div>
        <input
          type="number"
          placeholder="Enter amount"
          value={topUpAmount}
          onChange={(e) => setTopUpAmount(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-teal-200 focus:border-teal-500"
          min={100}
        />
      </div>

      <button
        disabled={!topUpAmount || !selectedPayment || isProcessing || parseFloat(topUpAmount) < 100}
        onClick={handleTopUp}
        className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white rounded-xl flex items-center justify-center gap-2"
      >
        {isProcessing ? <Loader className="w-5 h-5 animate-spin" /> : <>Pay Rs. {topUpAmount || 0}</>}
      </button>
    </div>
  );
}
