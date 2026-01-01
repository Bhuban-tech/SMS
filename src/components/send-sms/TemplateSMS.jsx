"use client";

import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { toast } from "sonner";

import CsvUploader from "@/components/send-sms/CsvUploader";
import TemplatePreview from "@/components/send-sms/TemplatePreview";

import { createTemplate, getTemplateSMS, updateTemplate, deleteTemplate } from "@/lib/sendsms";

const TemplateSMS = ({
  contacts = [],
  groups = [],
  bulkFile,
  setBulkFile,
  selectedContacts,
  setSelectedContacts,
  selectedGroup,
  setSelectedGroup,
  setTemplatePayload
}) => {
  const [token, setToken] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  const [tplSendType, setTplSendType] = useState("individual"); // Buttons inside template
  const [csvData, setCsvData] = useState([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateContent, setNewTemplateContent] = useState("");

  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;

    const loadTemplates = async () => {
      const res = await getTemplateSMS(token);
      if (res?.success) setTemplates(res.data || []);
      else toast.error(res?.message || "Failed to load templates");
    };

    loadTemplates();
  }, [token]);

  const handleFileUpload = (file) => {
    setBulkFile(file);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => setCsvData(results.data)
    });
  };

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  const renderPreview = () => {
    if (!selectedTemplate) return "No template selected";
    if (csvData.length === 0) return selectedTemplate.content;

    let text = selectedTemplate.content;
    const row = csvData[currentRowIndex] || {};
    Object.keys(row).forEach((key) => {
      text = text.replace(new RegExp(`{{${key}}}`, "g"), row[key]);
    });
    return text;
  };

  // Update template payload for send button
  useEffect(() => {
    if (!selectedTemplate) {
      setTemplatePayload(null);
      return;
    }

    setTemplatePayload({
      templateId: selectedTemplate.id,
      content: selectedTemplate.content,
      csvData,
      selectedContacts,
      selectedGroup
    });
  }, [selectedTemplate, csvData, selectedContacts, selectedGroup, tplSendType]);

  // Filter contacts for search
  const filteredContacts = (contacts || []).filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  return (
    <div className="p-6 bg-white rounded-xl shadow space-y-6">
      {/* Template selection */}
      <select
        className="w-full p-2 border border-gray-300 rounded"
        value={selectedTemplateId || ""}
        onChange={(e) => setSelectedTemplateId(Number(e.target.value))}
      >
        <option value="">Select Template</option>
        {templates.map((t) => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>

      {/* Buttons for template send type */}
      <div className="flex gap-2 mt-2 mb-4">
        {["individual", "group", "bulk"].map((type) => (
          <button
            key={type}
            onClick={() => setTplSendType(type)}
            className={`px-4 py-2 rounded hover:cursor-pointer ${tplSendType === type ? "bg-teal-600 text-white" : "bg-gray-200"}`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Individual contacts selection */}
      {tplSendType === "individual" && (
        <div>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <div className="max-h-60 overflow-y-auto border border-gray-300 p-2 rounded space-y-1">
            {filteredContacts.map((c) => (
              <div key={c.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedContacts.includes(c.id)}
                  onChange={() => {
                    if (selectedContacts.includes(c.id))
                      setSelectedContacts(selectedContacts.filter((id) => id !== c.id));
                    else
                      setSelectedContacts([...selectedContacts, c.id]);
                  }}
                />
                <span>{c.name} - {c.phone}</span>
              </div>
            ))}
            {filteredContacts.length === 0 && <p className="text-sm text-gray-500">No contacts found</p>}
          </div>
        </div>
      )}

      {/* Group selection */}
      {tplSendType === "group" && (
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedGroup || ""}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="">Select Group</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      )}

      {/* Bulk CSV upload */}
      {tplSendType === "bulk" && (
        <CsvUploader selectedFile={bulkFile} setSelectedFile={handleFileUpload} />
      )}

      {/* Template preview */}
      <TemplatePreview templateText={renderPreview()} mappedVariables={csvData[currentRowIndex] || {}} />
    </div>
  );
};

export default TemplateSMS;
