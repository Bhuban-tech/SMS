"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import { API_BASE_URL, ENDPOINTS } from "@/config/api";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!login || !password) {
      setError("Username/Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ login, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      localStorage.setItem("token", data.data.token);
      router.push("/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-linear-to-br from-white to-white relative overflow-hidden flex items-center justify-center px-6 py-12">
        <div className="absolute top-0 left-0 w-80 h-80 bg-teal-300/60 rounded-full -translate-x-40 -translate-y-40" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-700/40 rounded-full translate-x-40 translate-y-40" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-7xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md lg:-mr-15 lg:z-20 order-2 lg:order-1 lg:self-stretch flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-center text-teal-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-center  text-gray-600 mb-8">
              Log in to continue using Kritim<span className="text-teal-600">SMS</span>
            </p>

            {error && (
              <p className="text-red-600 text-center mb-4 text-sm">{error}</p>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Username"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-purple-200 focus:border-purple-500 focus:outline-none bg-purple-50/50"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-4 rounded-xl border border-purple-200 focus:border-purple-500 focus:outline-none bg-purple-50/50"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition duration-200"
              >
                {loading ? "Logging in..." : "Login Now"}
              </button>
            </form>
          </div>

          <div className="hidden lg:block order-1 lg:order-2 lg:self-stretch">
            <img
              src="/Bhuban.png"
              alt="Professional woman using tablet"
              className="rounded-3xl shadow-2xl w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
