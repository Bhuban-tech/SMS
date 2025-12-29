"use client";

import React, { useState, useEffect } from "react";
import CsvUploader from "@/components/send-sms/CsvUploader";
import TemplatePreview from "@/components/send-sms/TemplatePreview";
import Papa from "papaparse";
import { toast } from "sonner";

const TemplateSMS = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateText, setNewTemplateText] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("templates");
    if (stored) setTemplates(JSON.parse(stored));
  }, []);

  const saveTemplates = (newTemplates) => {
    localStorage.setItem("templates", JSON.stringify(newTemplates));
    setTemplates(newTemplates);
  };

  const handleAddTemplate = () => {
    if (!newTemplateName || !newTemplateText) {
    //   alert("Enter template name and text");
    toast.error("Enter template name and text");
      return;
    }
    const newTemplate = {
      id: Date.now().toString(),
      name: newTemplateName,
      text: newTemplateText,
    };
    const updatedTemplates = [...templates, newTemplate];
    saveTemplates(updatedTemplates);
    setNewTemplateName("");
    setNewTemplateText("");
    setSelectedTemplateId(newTemplate.id);
    setShowModal(false);
  };

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  const handleFileUpload = (file) => {
    setSelectedFile(file);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data);
        setCurrentRowIndex(0);
      },
    });
  };

  const renderPreview = () => {
    if (!selectedTemplate) return "No template selected";
    if (csvData.length === 0) return "No CSV data loaded";

    const row = csvData[currentRowIndex];
    let preview = selectedTemplate.text;

    Object.keys(row).forEach((key) => {
      preview = preview.replace(new RegExp(`{{${key}}}`, "g"), row[key]);
    });

    return preview;
  };



  return (
    <div className="relative p-6 bg-white rounded-xl shadow-md space-y-6">
      {/* Template Selector */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Select Template</h2>
        <select
          value={selectedTemplateId}
          onChange={(e) => setSelectedTemplateId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Select Template --</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* CSV Uploader */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Upload Contacts CSV</h2>
        <CsvUploader selectedFile={selectedFile} setSelectedFile={handleFileUpload} />
        {csvData.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">{csvData.length} contacts loaded</p>
        )}
      </div>

      {/* Template Preview */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Preview Message</h2>
        <TemplatePreview mappedVariables={csvData[currentRowIndex] || {}} templateText={renderPreview()} />
        {csvData.length > 1 && (
          <div className="mt-2 flex justify-between items-center">
            <button
              disabled={currentRowIndex === 0}
              onClick={() => setCurrentRowIndex(currentRowIndex - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Previous
            </button>
            <span>
              Row {currentRowIndex + 1} of {csvData.length}
            </span>
            <button
              disabled={currentRowIndex === csvData.length - 1}
              onClick={() => setCurrentRowIndex(currentRowIndex + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* <button
        onClick={handleSendTemplateSMS}
        className="w-full bg-teal-600 text-white py-4 rounded-xl mt-4 hover:bg-teal-700"
      >
        Send Template SMS
      </button> */}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-teal-600 rounded-full text-white text-3xl shadow-lg flex items-center justify-center hover:bg-teal-700"
      >
        +
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 space-y-4 relative shadow-lg hover:shadow-xl animate-scaleIn hover:scale-105 transition-transform duration-300">
            <h2 className="text-lg font-semibold">Create New Template</h2>
            <input
              type="text"
              placeholder="Template Name"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Template Text"
              value={newTemplateText}
              onChange={(e) => setNewTemplateText(e.target.value)}
              className="w-full p-2 border rounded h-24"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2  rounded shadow-xl hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTemplate}
                className="px-4 py-2 bg-teal-600 shadow-xl text-white rounded hover:bg-teal-700"
              >
                Add Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSMS;
