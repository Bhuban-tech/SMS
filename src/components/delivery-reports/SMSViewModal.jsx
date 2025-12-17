"use client";

import React from "react";
import { X } from "lucide-react";

export default function SMSViewModal({ sms, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">SMS Delivery Report</h2>

        <div className="space-y-3 text-left">
          <p><strong>User:</strong> {sms.user?.name || sms.user}</p>
          <p><strong>Sent From:</strong> {sms.sent_from}</p>
          <p><strong>Mobile:</strong> {sms.mobile_number}</p>
          <p><strong>Status:</strong> <span className="font-bold text-blue-600">{sms.status}</span></p>
          <p><strong>Message:</strong></p>
          <p className="bg-gray-50 p-3 rounded-lg text-sm">{sms.message || sms.content}</p>
          <p><strong>Sent At:</strong> {new Date(sms.sent_at || sms.created_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
