"use client";

import React from "react";
import { X } from "lucide-react";

export default function SMSViewModal({ sms, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50 p-4 sm:p-6">
      <div
        className="
          bg-white rounded-2xl shadow-2xl relative
          w-full max-w-lg sm:max-w-xl
          p-5 sm:p-7
        "
      >
        <button
          onClick={onClose}
          className="
            absolute top-3 right-3 sm:top-4 sm:right-4
            text-gray-500 hover:text-gray-800
            p-1 rounded-full hover:bg-gray-100 transition-colors
          "
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-gray-800 pr-10">
          SMS Delivery Report
        </h2>

        <div className="space-y-3.5 sm:space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            <strong className="text-gray-900">User:</strong>{" "}
            {sms.user?.name || sms.user || "—"}
          </p>
          <p>
            <strong className="text-gray-900">Sent From:</strong>{" "}
            {sms.sent_from || "—"}
          </p>
          <p>
            <strong className="text-gray-900">Mobile:</strong>{" "}
            {sms.mobile_number || "—"}
          </p>
          <p>
            <strong className="text-gray-900">Status:</strong>{" "}
            <span className="font-bold text-blue-600">{sms.status || "Unknown"}</span>
          </p>

          <div>
            <strong className="text-gray-900 block mb-1">Message:</strong>
            <p className="bg-gray-50 p-3 sm:p-4 rounded-lg text-sm border border-gray-200 whitespace-pre-wrap">
              {sms.message || sms.content || "No message content"}
            </p>
          </div>

          <p>
            <strong className="text-gray-900">Sent At:</strong>{" "}
            {sms.sent_at || sms.created_at
              ? new Date(sms.sent_at || sms.created_at).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}