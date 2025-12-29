"use client";

import React, { useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import FilterBar from "@/components/balance-report/FilterBar";
import BalanceTable from "@/components/balance-report/BalanceTable";
import { balanceReportData } from "@/components/balance-report/Data";

export default function BalanceReportPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("balance-report");
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("");

  const filteredData = useMemo(() => {
    return balanceReportData.filter((row) => {
      const matchDate = filterDate ? row.date === filterDate : true;
      const matchType = filterType
        ? row.particular.toLowerCase().includes(filterType)
        : true;
      return matchDate && matchType;
    });
  }, [filterDate, filterType]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col overflow-hidden ">
       
        <div className="sticky top-0 z-30 bg-white shadow">
          <Header title="Send SMS" />
        </div>

        <main className="flex-1 overflow-auto p-6 space-y-6">
          <FilterBar
            filterDate={filterDate}
            filterType={filterType}
            onDateChange={setFilterDate}
            onTypeChange={setFilterType}
          />

          <BalanceTable data={filteredData} />
        </main>
      </div>
    </div>
  );
}
