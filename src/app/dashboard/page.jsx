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

  // Fetch daily report
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

  // Show loading state while checking authentication
  if (!token || !isAuthenticated()) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
      <button
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-slate-800 transition"
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          username={dashboardData?.username || user?.username} 
          email={dashboardData?.email || user?.email} 
          title={pageTitle} 
        />

        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
          {activeTab === "dashboard" && (
            <>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                    <p className="text-gray-600 font-medium">Loading dashboard...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-lg shadow-md">
                  <p className="font-semibold">Error loading dashboard</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              ) : (
                <>
                  <TopStats dashboardData={dashboardData} />

                  <div className="flex gap-4 overflow-x-auto pb-3">
                    <button
                      onClick={() => setViewMode("daily-report")}
                      className={`px-6 py-3 rounded-xl font-semibold shadow-md transition whitespace-nowrap ${
                        viewMode === "daily-report"
                          ? "bg-teal-600 text-white hover:bg-teal-700"
                          : "bg-gray-200 text-slate-700 border border-gray-300 hover:bg-gray-300"
                      }`}
                    >
                      Daily Report
                    </button>
                    <button
                      onClick={() => setViewMode("monthly-report")}
                      className={`px-6 py-3 rounded-xl font-semibold shadow-md transition whitespace-nowrap ${
                        viewMode === "monthly-report"
                          ? "bg-teal-600 text-white hover:bg-teal-700"
                          : "bg-gray-200 text-slate-700 border border-gray-300 hover:bg-gray-300"
                      }`}
                    >
                      Monthly Report
                    </button>
                  </div>

                  <DownStats dashboardData={dashboardData} />

                  {viewMode === "dashboard" && (
                    <>
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-2"><DailySMSChart /></div>
                        <ClientEnrollmentChart />
                      </div>
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-2"><MonthlyCostChart /></div>
                        <SMSTypePieChart />
                      </div>
                      <TopRecipients />
                    </>
                  )}

                  {viewMode === "daily-report" && (
                    <>
                      <div className="py-6">
                        <div className="max-w-2xl mx-auto">
                          <div className="bg-white rounded-2xl shadow-lg px-8 py-6">
                            <div className="flex items-center justify-center gap-4">
                              <Calendar className="w-6 h-6 text-teal-600" />
                              <span className="text-base font-medium text-gray-700">Select Date:</span>
                              <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="px-6 py-3 bg-gray-50 border border-gray-300 rounded-lg text-base font-medium text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {reportLoading ? (
                        <p className="text-center text-gray-600 text-lg">Loading daily report...</p>
                      ) : reportError ? (
                        <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg text-lg">{reportError}</div>
                      ) : dailyReportData ? (
                        <>
                          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
                            <p className="text-lg font-medium text-gray-600 mb-4">
                              Total SMS Parts Sent on {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p className="text-6xl font-bold text-teal-600">
                              {(dailyReportData.smsCount ?? 0).toLocaleString()}
                            </p>
                          </div>

                          <div className="mt-8 bg-white rounded-2xl shadow-md p-8 text-center">
                            <p className="text-gray-500 italic">
                              Hourly breakdown and delivery status will be available in future updates.
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-xl text-gray-500">No SMS activity recorded on this date.</p>
                        </div>
                      )}
                    </>
                  )}

                  {viewMode === "monthly-report" && (
                    <>
                      <div className="py-6">
                        <div className="max-w-2xl mx-auto">
                          <div className="bg-white rounded-2xl shadow-lg px-8 py-6">
                            <div className="flex items-center justify-center gap-4">
                              <Calendar className="w-6 h-6 text-teal-600" />
                              <span className="text-base font-medium text-gray-700">Select Month:</span>
                              <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="px-6 py-3 bg-gray-50 border border-gray-300 rounded-lg text-base font-medium text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {reportLoading ? (
                        <p className="text-center text-gray-600 text-lg">Loading monthly report...</p>
                      ) : reportError ? (
                        <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg text-lg">{reportError}</div>
                      ) : formattedMonthlyData.length > 0 ? (
                        <>
                          <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h3 className="text-2xl font-bold text-slate-800 text-center mb-8">
                              Daily SMS Activity – {monthTitle}
                            </h3>
                            <ResponsiveContainer width="100%" height={450}>
                              <BarChart data={formattedMonthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                                <XAxis 
                                  dataKey="date" 
                                  tick={{ fontSize: 14 }} 
                                  label={{ value: 'Day of Month', position: 'insideBottom', offset: -10 }}
                                />
                                <YAxis 
                                  tick={{ fontSize: 14 }} 
                                  label={{ value: 'SMS Parts Sent', angle: -90, position: 'insideLeft' }}
                                />
                                <Tooltip 
                                  formatter={(value) => value.toLocaleString()}
                                  contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                                />
                                <Legend />
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

                          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                              <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Estimated Provider Distribution</h3>
                              <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                  <Pie
                                    data={providerData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}%`}
                                  >
                                    {providerData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                  </Pie>
                                  <Tooltip formatter={(value) => `${value}%`} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center">
                              <p className="text-center text-gray-600 italic text-lg">
                                Real provider stats coming soon!<br />
                                Currently showing estimated distribution.
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-16">
                          <p className="text-2xl text-gray-500">No SMS activity recorded in {monthTitle}.</p>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}

          {activeTab === "groups" && <GroupPage />}

          {activeTab === "messages" && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Send Bulk SMS</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Recipients</label>
                    <textarea
                      value={recipients}
                      onChange={(e) => setRecipients(e.target.value)}
                      placeholder="e.g. 9851579340, 9813629763"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your message..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Characters: {messageText.length}</p>
                  </div>
                  <button
                    onClick={handleSendSMS}
                    className="w-full py-4 bg-linear-to-r from-teal-500 to-teal-600 text-white font-bold rounded-xl hover:from-teal-600 hover:to-teal-700 transition shadow-lg"
                  >
                    Send SMS Now
                  </button>
                  {status && (
                    <div className={`p-4 rounded-lg text-center font-medium ${status.includes("sent") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
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
  );
};

export default SMSDashboard;