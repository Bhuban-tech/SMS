// src/components/send-sms/CsvUploader.jsx
"use client";

import React, { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

const CsvUploader = ({ selectedFile, setSelectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please upload a CSV file only");
      return;
    }

    setSelectedFile(file);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Upload CSV File
      </label>

      <div
        className={`border-2 border-dashed rounded-xl p-2 text-center cursor-pointer transition
          ${
            isDragging
              ? "border-teal-500 bg-teal-50"
              : "border-gray-300 hover:border-teal-500"
          }`}
        onClick={() => document.getElementById("csvUploaderInput").click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />

        <p className="text-gray-600">
          {selectedFile
            ? `Selected: ${selectedFile.name}`
            : "Click to upload or drag CSV file here"}
        </p>

        <input
          id="csvUploaderInput"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>
    </div>
  );
};

export default CsvUploader;
