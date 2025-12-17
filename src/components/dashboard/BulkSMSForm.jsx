"use client";
import React, { useState } from "react";

const BulkSMSForm = () => {
  const [recipients, setRecipients] = useState("");
  const [messageText, setMessageText] = useState("");
  const [status, setStatus] = useState(null);

  const handleSendSMS = () => {
    if (!recipients.trim() || !messageText.trim()) {
      setStatus("Please enter both recipients and message.");
      return;
    }
    const count = recipients.split(",").filter(n => n.trim()).length;
    setStatus(`Message successfully sent to ${count} recipient(s)!`);
    setRecipients("");
    setMessageText("");
    setTimeout(() => setStatus(null), 5000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Send Bulk SMS</h2>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Recipients</label>
          <textarea
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="e.g. 9851579340, 9813629763"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">Characters: {messageText.length}</p>
        </div>

        <button
          onClick={handleSendSMS}
          className="w-full py-4 bg-linear-to-r from-teal-500 to-teal-600 text-white font-bold rounded-xl hover:from-teal-600 hover:to-teal-700 transition shadow-lg"
        >
          Send SMS Now
        </button>

        {status && (
          <div
            className={`p-4 rounded-lg text-center font-medium ${
              status.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkSMSForm;
