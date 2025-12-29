import React from "react";
import { Upload } from "lucide-react";

function BulkSMS({ bulkFile, setBulkFile, selectedFile, setSelectedFile, bulkGroupName, setBulkGroupName, showAlert }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      showAlert("error", "Please upload a CSV file only");
      e.target.value = null;
      return;
    }

    setBulkFile(file);
    setSelectedFile(file.name);
  };

  return (
    <>
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Upload CSV File</label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-teal-500 transition"
          onClick={() => document.getElementById("bulkFileInput").click()}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{selectedFile ? `Selected: ${selectedFile}` : "Click to upload or drag CSV file here"}</p>
          <input id="bulkFileInput" type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Group Name</label>
        <input
          type="text"
          value={bulkGroupName}
          onChange={(e) => setBulkGroupName(e.target.value) || ""}
          placeholder="e.g., Customers 2025, VIP Members"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500"
        />
      </div>
    </>
  );
}

export default BulkSMS;
