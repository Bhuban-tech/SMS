"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Calendar } from "lucide-react";
import { API_BASE_URL, ENDPOINTS } from "@/config/api";
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
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const SMSDashboard = () => {
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const adminId = localStorage.getItem('adminId');

        if (!token || !adminId) {
          setError("Authentication required. Please login.");
          setLoading(false);
          return;
        }

        const apiUrl = `${API_BASE_URL}${ENDPOINTS.GET_ADMIN(adminId)}`;
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Session expired. Redirecting to login...");
            setTimeout(() => {
              localStorage.clear();
              window.location.href = '/login';
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

    fetchDashboardData();
  }, []);

  const handleSendSMS = () => {
    if (!messageText.trim() || !recipients.trim()) {
      setStatus("Please enter both recipients and message.");
      return;
    }
    const recipientCount = recipients.split(",").filter((num) => num.trim()).length;
    setStatus(`Message successfully sent to ${recipientCount} recipient(s)!`);
    setMessageText("");
    setRecipients("");
    setTimeout(() => setStatus(null), 5000);
  };

  const dailyData = [
    { hour: '00:00', sent: 45, delivered: 43, failed: 2 },
    { hour: '02:00', sent: 28, delivered: 27, failed: 1 },
    { hour: '04:00', sent: 32, delivered: 31, failed: 1 },
    { hour: '06:00', sent: 89, delivered: 87, failed: 2 },
    { hour: '08:00', sent: 156, delivered: 152, failed: 4 },
    { hour: '10:00', sent: 234, delivered: 230, failed: 4 },
    { hour: '12:00', sent: 289, delivered: 285, failed: 4 },
    { hour: '14:00', sent: 267, delivered: 263, failed: 4 },
    { hour: '16:00', sent: 234, delivered: 230, failed: 4 },
    { hour: '18:00', sent: 198, delivered: 195, failed: 3 },
    { hour: '20:00', sent: 178, delivered: 175, failed: 3 },
    { hour: '22:00', sent: 134, delivered: 132, failed: 2 },
  ];

  const monthlyData = [
    { date: 'Week 1', sent: 4520, delivered: 4456, failed: 64 },
    { date: 'Week 2', sent: 5230, delivered: 5180, failed: 50 },
    { date: 'Week 3', sent: 4890, delivered: 4820, failed: 70 },
    { date: 'Week 4', sent: 5670, delivered: 5610, failed: 60 },
  ];

  const providerData = [
    { name: 'NTC', value: 1245, color: '#14b8a6' },
    { name: 'Ncell', value: 834, color: '#8b5cf6' },
  ];

  const pageTitle = 
    viewMode === "daily-report" ? "Daily Report" :
    viewMode === "monthly-report" ? "Monthly Report" :
    "SMS Dashboard";

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
        <Header username={dashboardData?.username} email={dashboardData?.email} title={pageTitle} />

        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
          {/* Back to Dashboard button REMOVED */}

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

                  {/* Report Buttons */}
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

                  {/* Main Dashboard Content */}
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

                  {/* Daily Report Content */}
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

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md">
                          <h3 className="text-lg font-bold text-slate-800 mb-4">Hourly SMS Distribution</h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dailyData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                              <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                              <YAxis tick={{ fontSize: 12 }} />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="sent" fill="#3b82f6" name="Sent" radius={[8, 8, 0, 0]} />
                              <Bar dataKey="delivered" fill="#10b981" name="Delivered" radius={[8, 8, 0, 0]} />
                              <Bar dataKey="failed" fill="#ef4444" name="Failed" radius={[8, 8, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md">
                          <h3 className="text-lg font-bold text-slate-800 mb-4">Provider Distribution</h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={providerData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={3}
                                dataKey="value"
                              >
                                {providerData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="mt-4 space-y-3">
                            {providerData.map((item) => (
                              <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                                  <span className="text-sm text-slate-600">{item.name}</span>
                                </div>
                                <span className="font-semibold text-slate-800">{item.value.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-md">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Delivery Success Trend (Hourly)</h3>
                        <ResponsiveContainer width="100%" height={280}>
                          <LineChart data={dailyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="delivered" stroke="#14b8a6" strokeWidth={3} dot={{ fill: '#14b8a6', r: 4 }} name="Delivered" />
                            <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 4 }} name="Failed" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </>
                  )}

                  {/* Monthly Report Content */}
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

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md">
                          <h3 className="text-lg font-bold text-slate-800 mb-4">Weekly SMS Distribution</h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="sent" fill="#3b82f6" name="Sent" radius={[8, 8, 0, 0]} />
                              <Bar dataKey="delivered" fill="#10b981" name="Delivered" radius={[8, 8, 0, 0]} />
                              <Bar dataKey="failed" fill="#ef4444" name="Failed" radius={[8, 8, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md">
                          <h3 className="text-lg font-bold text-slate-800 mb-4">Provider Distribution</h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie data={providerData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                                {providerData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="mt-4 space-y-3">
                            {providerData.map((item) => (
                              <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                                  <span className="text-sm text-slate-600">{item.name}</span>
                                </div>
                                <span className="font-semibold text-slate-800">{item.value.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-md">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Monthly Delivery Success Trend</h3>
                        <ResponsiveContainer width="100%" height={280}>
                          <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="delivered" stroke="#14b8a6" strokeWidth={3} dot={{ fill: '#14b8a6', r: 4 }} name="Delivered" />
                            <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 4 }} name="Failed" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
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
                    <div className={`p-4 rounded-lg text-center font-medium ${status.includes("success") || status.includes("sent") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
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