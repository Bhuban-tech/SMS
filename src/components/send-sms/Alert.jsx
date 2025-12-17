import React from "react";
import { Check, X, AlertCircle } from "lucide-react";

function Alert({ type, message, onClose }) {
  if (!message) return null;

  const bg =
    type === "success"
      ? "bg-green-100 border-green-500 text-green-800"
      : "bg-red-100 border-l-4 border-red-500 text-red-800";
  const Icon = type === "success" ? Check : AlertCircle;

  return (
    <div className={`mb-6 p-4 rounded-lg shadow-lg flex items-center gap-3 border-l-4 ${bg}`}>
      <Icon className="w-6 h-6" />
      <span className="flex-1 font-medium">{message}</span>
      <button onClick={onClose} className="hover:opacity-70">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

export default Alert;
