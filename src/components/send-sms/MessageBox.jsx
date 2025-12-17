import React from "react";

export default function MessageBox({ message, setMessage }) {
  const characterCount = message.length;
  const messageCount = Math.ceil(characterCount / 160) || 1;

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
      <textarea
        rows="6"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your message here..."
        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 resize-none"
      />
      <p className="text-sm text-gray-600 mt-2">
        {characterCount} characters • {messageCount} SMS part{messageCount > 1 ? "s" : ""}
      </p>
    </div>
  );
}
