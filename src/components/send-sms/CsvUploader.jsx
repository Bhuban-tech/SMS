// src/components/send-sms/CsvUploader.jsx
"use client";

import React from "react";

const CsvUploader = ({ selectedFile, setSelectedFile }) => {
  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2"
      />
      {selectedFile && (
        <p className="mt-2 text-sm text-gray-600">
          Selected file: {selectedFile.name}
        </p>
      )}
    </div>
  );
};

export default CsvUploader;
