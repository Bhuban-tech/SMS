import React from "react";
import { User, Users, Upload } from "lucide-react";

export default function SendTypeSelector({ sendType, setSendType }) {
  const types = [
    { key: "individual", label: "Individual", Icon: User },
    { key: "group", label: "Group", Icon: Users },
    { key: "bulk", label: "Bulk", Icon: Upload },
  ];

  return (
    <div className="mb-8 grid grid-cols-3 gap-4">
      {types.map(({ key, label, Icon }) => (
        <button
          key={key}
          onClick={() => setSendType(key)}
          className={`p-5 rounded-lg border-2 transition-all flex flex-col items-center ${
            sendType === key ? "border-teal-600 bg-teal-50 text-teal-700" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <Icon className="w-8 h-8 mb-2" />
          <span className="font-semibold capitalize">{label}</span>
        </button>
      ))}
    </div>
  );
}
