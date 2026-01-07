// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
// } from 'recharts';
// import { Calendar, ArrowLeft, Menu, X } from 'lucide-react';

// import Sidebar from '@/components/Sidebar';
// import Header from '@/components/Header';
// import TopStats from '@/components/dashboard/TopStats';
// import DownStats from '@/components/dashboard/DownStats';

// const DailyReport = () => {
//   const router = useRouter();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

//   const dashboardData = {
//     totalSmsCredits: 25000,
//     usedSmsCredits: 1884,
//     remainingCredits: 23116,
//     email: "admin@example.com",
//     username: "Admin"
//   };

//   const dailyData = [
//     { hour: '00:00', sent: 45, delivered: 43, failed: 2 },
//     { hour: '02:00', sent: 28, delivered: 27, failed: 1 },
//     { hour: '04:00', sent: 32, delivered: 31, failed: 1 },
//     { hour: '06:00', sent: 89, delivered: 87, failed: 2 },
//     { hour: '08:00', sent: 156, delivered: 152, failed: 4 },
//     { hour: '10:00', sent: 234, delivered: 230, failed: 4 },
//     { hour: '12:00', sent: 289, delivered: 285, failed: 4 },
//     { hour: '14:00', sent: 267, delivered: 263, failed: 4 },
//     { hour: '16:00', sent: 234, delivered: 230, failed: 4 },
//     { hour: '18:00', sent: 198, delivered: 195, failed: 3 },
//     { hour: '20:00', sent: 178, delivered: 175, failed: 3 },
//     { hour: '22:00', sent: 134, delivered: 132, failed: 2 },
//   ];

//   const providerData = [
//     { name: 'NTC', value: 1245, color: '#14b8a6' },
//     { name: 'Ncell', value: 834, color: '#8b5cf6' },
//   ];

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
//       <button
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-slate-800 transition"
//       >
//         {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
//       </button>

//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab="daily-report" />

//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header username={dashboardData.username} email={dashboardData.email} title="Daily Report" />

//         <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
//           <button
//             onClick={() => router.push('/dashboard')}
//             className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-teal-600 transition"
//           >
//             <ArrowLeft size={20} />
//             Back to Dashboard
//           </button>

//           {/* Top Stats */}
//           <TopStats dashboardData={dashboardData} />

//           {/* Exact Match: Date Selector like in the image - Centered & Inline */}
//           <div className="py-6">
//             <div className="max-w-2xl mx-auto">
//               <div className="bg-white rounded-2xl shadow-lg px-8 py-6">
//                 <div className="flex items-center justify-center gap-4">
//                   <Calendar className="w-6 h-6 text-teal-600" />
//                   <span className="text-base font-medium text-gray-700">Select Date:</span>
//                   <input
//                     type="date"
//                     value={selectedDate}
//                     onChange={(e) => setSelectedDate(e.target.value)}
//                     className="px-6 py-3 bg-gray-50 border border-gray-300 rounded-lg text-base font-medium text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none cursor-pointer"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Down Stats */}
//           <DownStats dashboardData={dashboardData} />

//           {/* Rest of the charts - UNCHANGED */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md">
//               <h3 className="text-lg font-bold text-slate-800 mb-4">Hourly SMS Distribution</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={dailyData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                   <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
//                   <YAxis tick={{ fontSize: 12 }} />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="sent" fill="#3b82f6" name="Sent" radius={[8, 8, 0, 0]} />
//                   <Bar dataKey="delivered" fill="#10b981" name="Delivered" radius={[8, 8, 0, 0]} />
//                   <Bar dataKey="failed" fill="#ef4444" name="Failed" radius={[8, 8, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>

//             <div className="bg-white rounded-xl p-6 shadow-md">
//               <h3 className="text-lg font-bold text-slate-800 mb-4">Provider Distribution</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={providerData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={100}
//                     paddingAngle={3}
//                     dataKey="value"
//                   >
//                     {providerData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//               <div className="mt-4 space-y-3">
//                 {providerData.map((item) => (
//                   <div key={item.name} className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
//                       <span className="text-sm text-slate-600">{item.name}</span>
//                     </div>
//                     <span className="font-semibold text-slate-800">{item.value.toLocaleString()}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-6 shadow-md">
//             <h3 className="text-lg font-bold text-slate-800 mb-4">Delivery Success Trend (Hourly)</h3>
//             <ResponsiveContainer width="100%" height={280}>
//               <LineChart data={dailyData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                 <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
//                 <YAxis tick={{ fontSize: 12 }} />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="delivered" stroke="#14b8a6" strokeWidth={3} dot={{ fill: '#14b8a6', r: 4 }} name="Delivered" />
//                 <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 4 }} name="Failed" />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DailyReport;