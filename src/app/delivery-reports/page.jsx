"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Eye, X, RotateCw,  } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config/api";

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Please login again");
    return null;
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }
  return response.json();
};

export default function DeliveryReports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("delivery-reports");
  const [smsData, setSmsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewSMS, setViewSMS] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const[searchTerm,setSearchTerm]= useState("");

  const itemsPerPage = 10;

  const fetchDeliveryReports = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/api/delivery-reports`;
      const response = await fetchWithAuth(url, { method: "GET" });
      if (!response || !response.success) {
        throw new Error(response?.message || "Invalid response");
      }
      const reports = Array.isArray(response.data) ? response.data : [];
      setSmsData(reports);
      if (reports.length === 0) {
        toast.info("No delivery reports found.");
      } else {
        toast.success(`Loaded ${reports.length} delivery report${reports.length > 1 ? "s" : ""}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.message.includes("404")
          ? "Endpoint not found."
          : error.message.includes("403")
          ? "Permission denied."
          : "Failed to load delivery reports"
      );
      setSmsData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleReport = async (reportId) => {
    setViewLoading(true);
    try {
      const url = `${API_BASE_URL}/api/delivery_reports/${reportId}`;
      const response = await fetchWithAuth(url, { method: "GET" });
      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to fetch report details");
      }
      setViewSMS(response.data);
      toast.success("Report details loaded");
    } catch (error) {
      console.error(error);
      toast.error("Failed to load report detail");
      setViewSMS(null);
    } finally {
      setViewLoading(false);
    }
  };

  const handleViewClick = (report) => {
    fetchSingleReport(report.id);
  };

  useEffect(() => {
    fetchDeliveryReports();
  }, []);


  // const filteredData = smsData.filter((item) => {
  //   const search = searchTerm.toLowerCase();
  //   const recipientId = item.messageRecipientId?.toString() || "";
    
    
    

  //   const searchMatch =
  //     recipientId.includes(search) 
   
     
      

  //   const statusMatch =
  //     filterType === "all" || status === filterType.toLowerCase();

  //   return searchMatch && statusMatch;
  // });
  const filteredData = smsData.filter((item) => {
  const search = searchTerm.toLowerCase();
  const recipientId = (item.messageRecipientId || "").toString();
  const reportId = (item.id || "").toString();

 
  const searchMatch =
    recipientId.includes(search) || reportId.includes(search);


  const statusMatch =
    filterType === "all" || (item.status || "").toLowerCase() === filterType.toLowerCase();

  return searchMatch && statusMatch;
});


  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="sticky top-0 z-30 bg-gray-50 shadow">
          <Header title="Delivery Reports" />
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
          {loading && (
            <p className="text-center text-blue-600 font-medium">
              Loading delivery reports...
            </p>
          )}

          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <input
              type="text"
              placeholder="Search by recipient ID, report ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 bg-white px-4 py-2 rounded-xl shadow-sm outline-none w-full md:w-96 focus:ring-2 focus:ring-blue-500 transition-all"
            />

            

            <select
  value={filterType}
  onChange={(e) => {
    setFilterType(e.target.value);
    setCurrentPage(1);
  }}
  className="w-full sm:w-auto md:w-48 min-w-0 max-w-full flex-shrink-0 border border-gray-300 bg-white px-3 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition-all hover:cursor-pointer text-sm">
  <option value="all">All</option>
  <option value="delivered">Delivered</option>
  <option value="failed">Failed</option>
  <option value="pending">Pending</option>
</select>



            <button
              onClick={fetchDeliveryReports}
              disabled={loading}
              title="Reload reports"
              className="flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-xl shadow hover:bg-teal-700 disabled:opacity-70 transition-colors hover:cursor-pointer"
            >
              <RotateCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Table */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center">
                <thead className="bg-teal-700 text-white">
                  <tr>
                    <th className="p-4">S.N</th>
                    <th className="p-4">Report ID</th>
                    <th className="p-4">Recipient ID</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Reported At</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length === 0 && !loading && (
                    <tr>
                      <td colSpan={7} className="p-12 text-gray-500">
                        No delivery reports available
                      </td>
                    </tr>
                  )}
                  {currentData.map((report, idx) => (
                    <tr
                      key={report.id}
                      className="border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">{startIndex + idx + 1}</td>
                      <td className="p-4 font-medium">{report.id}</td>
                      <td className="p-4">{report.messageRecipientId}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            report.status === "DELIVERED"
                              ? "bg-green-100 text-green-800"
                              : report.status === "FAILED"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {report.status || "Unknown"}
                        </span>
                      </td>
                      <td
                        className="p-4 max-w-xs truncate text-left"
                        title={report.description}
                      >
                        {report.description || "-"}
                      </td>
                      <td className="p-4">{formatDate(report.createdAt)}</td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleViewClick(report)}
                            disabled={viewLoading}
                            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-70 text-white p-2 rounded-full shadow transition-colors hover:cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-5 py-2 bg-white border rounded-xl shadow hover:bg-gray-50 disabled:opacity-50 transition"
              >
                Previous
              </button>
              <span className="px-5 py-2 bg-white border rounded-xl shadow flex items-center">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-5 py-2 bg-white border rounded-xl shadow hover:bg-gray-50 disabled:opacity-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>

    
     {viewSMS && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl relative animate-scaleIn overflow-hidden">
      
     
      <button
        onClick={() => setViewSMS(null)}
        className="absolute top-4 right-4 z-10 text-white hover:text-white bg-black/20 hover:bg-black/30 rounded-full p-1 transition hover:cursor-pointer"
      >
        <X size={26} />
      </button>

    
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
        <h2 className="text-2xl font-bold text-white text-center tracking-wide">
          Delivery Report Details
        </h2>
      </div>

      {/* CONTENT */}
      <div className="p-8">
        {viewLoading ? (
          <p className="text-center text-teal-600 font-medium">
            Loading details...
          </p>
        ) : (
          <div className="space-y-5 text-sm text-gray-700">
            
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-500">Report ID</span>
              <span className="font-mono text-gray-900">#{viewSMS.id}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-500">Recipient ID</span>
              <span className="font-mono text-gray-900">
                {viewSMS.messageRecipientId}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-500">Status</span>
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider shadow-sm ${
                  viewSMS.status === "DELIVERED"
                    ? "bg-green-100 text-green-700"
                    : viewSMS.status === "FAILED"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {viewSMS.status || "Unknown"}
              </span>
            </div>

            <div>
              <span className="font-semibold text-gray-500 block mb-1">
                Description
              </span>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-600 leading-relaxed shadow-inner">
                {viewSMS.description || "No description available"}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-semibold text-gray-500">Reported At</span>
              <span className="text-gray-800">
                {formatDate(viewSMS.createdAt)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
}