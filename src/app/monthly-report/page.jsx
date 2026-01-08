// // 'use client';

// // import React, { useState } from 'react';
// // import { useRouter } from 'next/navigation';
// // import {
// //   BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
// // } from 'recharts';
// // import { Calendar, ArrowLeft, Menu, X } from 'lucide-react';

// // import Sidebar from '@/components/Sidebar';
// // import Header from '@/components/Header';
// // import TopStats from '@/components/dashboard/TopStats';
// // import DownStats from '@/components/dashboard/DownStats'; // Add this import!

// // const MonthlyReport = () => {
// //   const router = useRouter();
// //   const [sidebarOpen, setSidebarOpen] = useState(false);
// //   const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

// //   // Dashboard data for TopStats and DownStats
// //   const dashboardData = {
// //     totalSmsCredits: 25000,
// //     usedSmsCredits: 20310,      // This will be used in DownStats as Total Sent
// //     remainingCredits: 4690,
// //     email: "admin@example.com",
// //     username: "Admin"
// //   };

// //   const monthlyData = [
// //     { date: 'Week 1', sent: 4520, delivered: 4456, failed: 64 },
// //     { date: 'Week 2', sent: 5230, delivered: 5180, failed: 50 },
// //     { date: 'Week 3', sent: 4890, delivered: 4820, failed: 70 },
// //     { date: 'Week 4', sent: 5670, delivered: 5610, failed: 60 },
// //   ];

// //   const providerData = [
// //     { name: 'NTC', value: 12450, color: '#14b8a6' },
// //     { name: 'Ncell', value: 8340, color: '#8b5cf6' },
// //   ];

// //   return (
// //     <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
// //       <button
// //         onClick={() => setSidebarOpen(!sidebarOpen)}
// //         className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-slate-800 transition"
// //       >
// //         {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
// //       </button>

// //       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab="monthly-report" />

// //       <div className="flex-1 flex flex-col overflow-hidden">
// //         <Header username={dashboardData.username} email={dashboardData.email} title="Monthly Report" />

       
//         <div className="p-6 lg:p-8 overflow-y-auto h-[calc(100vh-80px)] space-y-6">
       
          <div className="space-y-4">
  <button
    onClick={handleBack}
    className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-slate-900 transition cursor-pointer"
  >
    <ArrowLeft size={20} className='font-bold' />
            Back to dashboard
  </button>

  <p className="text-gray-600">
    SMS delivery performance overview for the month
  </p>
</div>


         
//           <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
//             <div className="flex items-center gap-4">
//               <Calendar className="w-5 h-5 text-teal-600" />
//               <label className="text-sm font-semibold text-gray-700">Select Month:</label>
//               <input
//                 type="month"
//                 value={selectedMonth}
//                 onChange={(e) => setSelectedMonth(e.target.value)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//               />
//             </div>
//           </div>

     
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             <StatCard
//               icon={MessageSquare}
//               label="Total Messages"
//               value={monthlyStats.total.toLocaleString()}
//               color="bg-blue-600"
//             />
//             <StatCard
//               icon={CheckCircle}
//               label="Delivered"
//               value={monthlyStats.delivered.toLocaleString()}
//               subValue={`${monthlyStats.deliveryRate}% success rate`}
//               color="bg-green-600"
//             />
//             <StatCard
//               icon={XCircle}
//               label="Failed"
//               value={monthlyStats.failed.toLocaleString()}
//               color="bg-red-600"
//             />
//             <StatCard
//               icon={Clock}
//               label="Pending"
//               value={monthlyStats.pending.toLocaleString()}
//               color="bg-yellow-600"
//             />
//           </div>

        
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
//             <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Distribution</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={monthlyData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="sent" fill="#3b82f6" name="Sent" />
//                   <Bar dataKey="delivered" fill="#10b981" name="Delivered" />
//                   <Bar dataKey="failed" fill="#ef4444" name="Failed" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>

// //             <div className="bg-white rounded-xl p-6 shadow-md">
// //               <h3 className="text-lg font-bold text-slate-800 mb-4">Provider Distribution</h3>
// //               <ResponsiveContainer width="100%" height={300}>
// //                 <PieChart>
// //                   <Pie
// //                     data={providerData}
// //                     cx="50%"
// //                     cy="50%"
// //                     innerRadius={60}
// //                     outerRadius={100}
// //                     paddingAngle={3}
// //                     dataKey="value"
// //                   >
// //                     {providerData.map((entry, index) => (
// //                       <Cell key={`cell-${index}`} fill={entry.color} />
// //                     ))}
// //                   </Pie>
// //                   <Tooltip />
// //                 </PieChart>
// //               </ResponsiveContainer>
// //               <div className="mt-4 space-y-3">
// //                 {providerData.map((item) => (
// //                   <div key={item.name} className="flex items-center justify-between">
// //                     <div className="flex items-center gap-2">
// //                       <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
// //                       <span className="text-sm text-slate-600">{item.name}</span>
// //                     </div>
// //                     <span className="font-semibold text-slate-800">{item.value.toLocaleString()}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-white rounded-xl p-6 shadow-md">
// //             <h3 className="text-lg font-bold text-slate-800 mb-4">Delivery Success Trend</h3>
// //             <ResponsiveContainer width="100%" height={280}>
// //               <LineChart data={monthlyData}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
// //                 <XAxis dataKey="date" />
// //                 <YAxis />
// //                 <Tooltip />
// //                 <Legend />
// //                 <Line type="monotone" dataKey="delivered" stroke="#14b8a6" strokeWidth={3} dot={{ fill: '#14b8a6', r: 4 }} />
// //                 <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 4 }} />
// //               </LineChart>
// //             </ResponsiveContainer>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// export default MonthlyReport;