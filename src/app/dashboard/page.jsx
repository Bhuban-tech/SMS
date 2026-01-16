"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Menu, X, Calendar } from "lucide-react";
import { API_BASE_URL, ENDPOINTS } from "@/config/api";
import { isAuthenticated, getAuthHeaders } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import TopStats from "@/components/dashboard/TopStats";
import DownStats from "@/components/dashboard/DownStats";
import DailySMSChart from "@/components/dashboard/DailySMSChart";
import ClientEnrollmentChart from "@/components/dashboard/ClientEnrollmentChart";
import MonthlyCostChart from "@/components/dashboard/MonthlyCostChart";
import SMSTypePieChart from "@/components/dashboard/SMSTypePieChart";
import TopRecipients from "@/components/dashboard/TopRecipients";
import GroupPage from "../groups/page";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { fetchDailyReport, fetchMonthlyReport } from "@/lib/reports";

const SMSDashboard = () => {
  const router = useRouter();
  const { user, token } = useSelector((state) => state.auth);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [viewMode, setViewMode] = useState("dashboard");
  const [messageText, setMessageText] = useState("");
  const [recipients, setRecipients] = useState("");
  const [status, setStatus] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dailyReportData, setDailyReportData] = useState(null);
  const [monthlyReportData, setMonthlyReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);

  const adminId = user?.id || (typeof window !== "undefined" ? localStorage.getItem('adminId') : null);

  useEffect(() => {
    if (!isAuthenticated() || !token) {
      router.replace("/login");
      return;
    }
  }, [token, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!token || !adminId) {
          setError("Authentication required. Please login.");
          setLoading(false);
          return;
        }

        const apiUrl = `${API_BASE_URL}${ENDPOINTS.GET_ADMIN(adminId)}`;
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Session expired. Redirecting to login...");
            setTimeout(() => {
              localStorage.clear();
              router.replace("/login");
            }, 2000);
            return;
          }
          throw new Error(`API Error (${response.status})`);
        }

        const result = await response.json();
        if (result.success) {
          setDashboardData(result.data);
          setError(null);
        } else {
          setError(result.message || "Failed to load dashboard data");
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (adminId && token) {
      fetchDashboardData();
    }
  }, [adminId, token, router]);

  useEffect(() => {
    if (viewMode === "daily-report" && adminId && selectedDate) {
      const loadDailyReport = async () => {
        setReportLoading(true);
        setReportError(null);
        try {
          const data = await fetchDailyReport(adminId, selectedDate, selectedDate);
          if (data.success && data.data && data.data.length > 0) {
            setDailyReportData(data.data[0]);
          } else {
            setDailyReportData(null);
          }
        } catch (err) {
          setReportError(err.message || "Failed to load daily report");
          setDailyReportData(null);
        } finally {
          setReportLoading(false);
        }
      };
      loadDailyReport();
    }
  }, [viewMode, selectedDate, adminId]);

  useEffect(() => {
    if (viewMode === "monthly-report" && adminId && selectedMonth) {
      const loadMonthlyReport = async () => {
        setReportLoading(true);
        setReportError(null);
        try {
          const year = parseInt(selectedMonth.split('-')[0]);
          const data = await fetchMonthlyReport(adminId, year);
          if (data.success && data.data) {
            const filtered = data.data.filter(item => 
              item.date && typeof item.date === 'string' && item.date.startsWith(selectedMonth)
            );
            setMonthlyReportData(filtered);
          } else {
            setMonthlyReportData([]);
          }
        } catch (err) {
          setReportError(err.message || "Failed to load monthly report");
          setMonthlyReportData([]);
        } finally {
          setReportLoading(false);
        }
      };
      loadMonthlyReport();
    }
  }, [viewMode, selectedMonth, adminId]);

  const handleSendSMS = () => {
    if (!messageText.trim() || !recipients.trim()) {
      setStatus("Please enter both recipients and message.");
      return;
    }
    const recipientCount = recipients.split(",").filter(num => num.trim()).length;
    setStatus(`Message successfully sent to ${recipientCount} recipient(s)!`);
    setMessageText("");
    setRecipients("");
    setTimeout(() => setStatus(null), 5000);
  };

  const providerData = [
    { name: 'NTC', value: 65, color: '#14b8a6' },
    { name: 'Ncell', value: 35, color: '#8b5cf6' },
  ];

  const formattedMonthlyData = monthlyReportData
    ? monthlyReportData
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(item => {
          const dateObj = new Date(item.date);
          const day = dateObj.getDate();
          return {
            date: day.toString(),
            smsCount: item.smsCount || 0,
          };
        })
    : [];

  const pageTitle =
    viewMode === "daily-report" ? "Daily Report" :
    viewMode === "monthly-report" ? "Monthly Report" :
    "SMS Dashboard";

  const monthTitle = selectedMonth
    ? new Date(selectedMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })
    : 'Monthly Report';

  if (!token || !isAuthenticated()) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Mobile Menu Button - Enhanced */}
      <button
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 w-11 h-11 sm:w-12 sm:h-12 bg-slate-700 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-slate-800 active:scale-95 transition-all duration-200"
      >
        {sidebarOpen ? <X size={20} className="sm:w-[22px] sm:h-[22px]" /> : <Menu size={20} className="sm:w-[22px] sm:h-[22px]" />}
      </button>

      {/* Sidebar with smooth animation */}
      <div className={`transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-40`}>
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header 
          username={dashboardData?.username || user?.username} 
          email={dashboardData?.email || user?.email} 
          title={pageTitle} 
        />

        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in-up">
            {activeTab === "dashboard" && (
              <>
                {loading ? (
                  <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="flex flex-col items-center gap-4 animate-fade-in">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                      <p className="text-gray-600 font-medium text-sm sm:text-base">Loading dashboard...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-md animate-shake">
                    <p className="font-semibold text-sm sm:text-base">Error loading dashboard</p>
                    <p className="text-xs sm:text-sm mt-1">{error}</p>
                  </div>
                ) : (
                  <>
                    <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                      <TopStats dashboardData={dashboardData} />
                    </div>

                    {/* Report Toggle Buttons - Enhanced for mobile */}
                    <div className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-2 sm:pb-3 scrollbar-hide animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                      <button
                        onClick={() => setViewMode("daily-report")}
                        className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold shadow-md transition-all duration-200 whitespace-nowrap text-sm sm:text-base active:scale-95 ${
                          viewMode === "daily-report"
                            ? "bg-teal-600 text-white hover:bg-teal-700"
                            : "bg-gray-200 text-slate-700 border border-gray-300 hover:bg-gray-300"
                        }`}
                      >
                        Daily Report
                      </button>
                      <button
                        onClick={() => setViewMode("monthly-report")}
                        className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold shadow-md transition-all duration-200 whitespace-nowrap text-sm sm:text-base active:scale-95 ${
                          viewMode === "monthly-report"
                            ? "bg-teal-600 text-white hover:bg-teal-700"
                            : "bg-gray-200 text-slate-700 border border-gray-300 hover:bg-gray-300"
                        }`}
                      >
                        Monthly Report
                      </button>
                    </div>

                    <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                      <DownStats dashboardData={dashboardData} />
                    </div>

                    {viewMode === "dashboard" && (
                      <>
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                          <div className="xl:col-span-2"><DailySMSChart /></div>
                          <ClientEnrollmentChart />
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                          <div className="xl:col-span-2"><MonthlyCostChart /></div>
                          <SMSTypePieChart />
                        </div>
                        <div className="animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                          <TopRecipients />
                        </div>
                      </>
                    )}

                    {viewMode === "daily-report" && (
                      <>
                        <div className="py-4 sm:py-6 animate-fade-in-up">
                          <div className="max-w-2xl mx-auto">
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
                              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                                <span className="text-sm sm:text-base font-medium text-gray-700">Select Date:</span>
                                <input
                                  type="date"
                                  value={selectedDate}
                                  onChange={(e) => setSelectedDate(e.target.value)}
                                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm sm:text-base font-medium text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none cursor-pointer transition-all"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {reportLoading ? (
                          <p className="text-center text-gray-600 text-base sm:text-lg animate-pulse">Loading daily report...</p>
                        ) : reportError ? (
                          <div className="text-center text-red-600 bg-red-50 p-4 sm:p-6 rounded-lg text-base sm:text-lg animate-shake">{reportError}</div>
                        ) : dailyReportData ? (
                          <>
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 text-center animate-scale-in">
                              <p className="text-base sm:text-lg font-medium text-gray-600 mb-3 sm:mb-4">
                                Total SMS Parts Sent on {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                              <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-teal-600 animate-count-up">
                                {(dailyReportData.smsCount ?? 0).toLocaleString()}
                              </p>
                            </div>

                            <div className="mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-md p-6 sm:p-8 text-center animate-fade-in">
                              <p className="text-gray-500 italic text-sm sm:text-base">
                                Hourly breakdown and delivery status will be available in future updates.
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-8 sm:py-12 animate-fade-in">
                            <p className="text-lg sm:text-xl text-gray-500">No SMS activity recorded on this date.</p>
                          </div>
                        )}
                      </>
                    )}

                    {viewMode === "monthly-report" && (
                      <>
                        <div className="py-4 sm:py-6 animate-fade-in-up">
                          <div className="max-w-2xl mx-auto">
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
                              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                                <span className="text-sm sm:text-base font-medium text-gray-700">Select Month:</span>
                                <input
                                  type="month"
                                  value={selectedMonth}
                                  onChange={(e) => setSelectedMonth(e.target.value)}
                                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm sm:text-base font-medium text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none cursor-pointer transition-all"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {reportLoading ? (
                          <p className="text-center text-gray-600 text-base sm:text-lg animate-pulse">Loading monthly report...</p>
                        ) : reportError ? (
                          <div className="text-center text-red-600 bg-red-50 p-4 sm:p-6 rounded-lg text-base sm:text-lg animate-shake">{reportError}</div>
                        ) : formattedMonthlyData.length > 0 ? (
                          <>
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 animate-fade-in-up">
                              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 text-center mb-4 sm:mb-6 md:mb-8">
                                Daily SMS Activity – {monthTitle}
                              </h3>
                              <ResponsiveContainer width="100%" height={300} className="sm:h-[350px] md:h-[450px]">
                                <BarChart data={formattedMonthlyData} margin={{ top: 20, right: 10, left: 0, bottom: 60 }}>
                                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                                  <XAxis 
                                    dataKey="date" 
                                    tick={{ fontSize: 12 }} 
                                    className="sm:text-sm"
                                    label={{ value: 'Day of Month', position: 'insideBottom', offset: -10, fontSize: 12 }}
                                  />
                                  <YAxis 
                                    tick={{ fontSize: 12 }} 
                                    className="sm:text-sm"
                                    label={{ value: 'SMS Parts Sent', angle: -90, position: 'insideLeft', fontSize: 12 }}
                                  />
                                  <Tooltip 
                                    formatter={(value) => value.toLocaleString()}
                                    contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '12px' }}
                                  />
                                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                                  <Bar 
                                    dataKey="smsCount" 
                                    fill="#14b8a6" 
                                    name="SMS Parts Sent" 
                                    radius={[12, 12, 0, 0]} 
                                    barSize={30}
                                  />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>

                            <div className="mt-6 sm:mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 animate-fade-in-left">
                                <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 mb-4 sm:mb-6 text-center">Estimated Provider Distribution</h3>
                                <ResponsiveContainer width="100%" height={250} className="sm:h-[280px] md:h-[300px]">
                                  <PieChart>
                                    <Pie
                                      data={providerData}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={60}
                                      outerRadius={90}
                                      paddingAngle={5}
                                      dataKey="value"
                                      label={({ name, value }) => `${name}: ${value}%`}
                                      labelLine={{ stroke: '#64748b', strokeWidth: 1 }}
                                    >
                                      {providerData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                      ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value}%`} contentStyle={{ fontSize: '12px' }} />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>

                              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 flex items-center justify-center animate-fade-in-right">
                                <p className="text-center text-gray-600 italic text-sm sm:text-base md:text-lg">
                                  Real provider stats coming soon!<br />
                                  Currently showing estimated distribution.
                                </p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-12 sm:py-16 animate-fade-in">
                            <p className="text-xl sm:text-2xl text-gray-500">No SMS activity recorded in {monthTitle}.</p>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}

            {activeTab === "groups" && (
              <div className="animate-fade-in-up">
                <GroupPage />
              </div>
            )}

            {activeTab === "messages" && (
              <div className="max-w-2xl mx-auto animate-fade-in-up">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Send Bulk SMS</h2>
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Recipients</label>
                      <textarea
                        value={recipients}
                        onChange={(e) => setRecipients(e.target.value)}
                        placeholder="e.g. 9851579340, 9813629763"
                        rows={4}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm sm:text-base transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Message</label>
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type your message..."
                        rows={6}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm sm:text-base transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-1">Characters: {messageText.length}</p>
                    </div>
                    <button
                      onClick={handleSendSMS}
                      className="w-full py-3 sm:py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-teal-600 hover:to-teal-700 active:scale-[0.98] transition-all duration-200 shadow-lg text-sm sm:text-base"
                    >
                      Send SMS Now
                    </button>
                    {status && (
                      <div className={`p-3 sm:p-4 rounded-lg text-center font-medium text-sm sm:text-base animate-slide-up ${status.includes("sent") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {status}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
          animation-fill-mode: both;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.5s ease-out;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.5s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-out;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @media (max-width: 640px) {
          .recharts-wrapper {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
};

export default SMSDashboard;