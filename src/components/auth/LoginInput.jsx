

"use client";

export default function LoginInput({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-gray-600 font-bold mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 rounded-xl border border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none text-gray-700 placeholder-gray-400 transition"
      />
    </div>
  );
}
