"use client";

export default function LoginButton({ loading, onClick }) {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={loading}
      className="cursor-pointer w-full py-3 rounded-xl bg-teal-500 text-white font-semibold shadow-lg hover:bg-teal-600 transition disabled:opacity-50"
    >
      {loading ? "Logging in..." : "Login"}
    </button>
  );
}
