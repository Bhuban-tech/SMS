"use client";

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 border border-teal-100 hover:scale-105 transition-transform duration-500">
        <h1 className="text-3xl font-bold mb-8 text-center">
          <span className="text-teal-600">SMS Portal</span>{" "}
          <span className="text-gray-700">Login</span>
        </h1>

        <LoginForm />
      </div>
    </div>
  );
}
