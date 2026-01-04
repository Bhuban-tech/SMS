"use client";

import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { toast } from "sonner";

import CsvUploader from "@/components/send-sms/CsvUploader";
import TemplatePreview from "@/components/send-sms/TemplatePreview";

import {
  createTemplate,
  getTemplateSMS,
  updateTemplate,
  deleteTemplate
} from "@/lib/sendsms";

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

  const [tplSendType, setTplSendType] = useState("individual"); // buttons inside template
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

  /** Load token */
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  /** Load templates */
  useEffect(() => {
    if (!token) return;
    const loadTemplates = async () => {
      const res = await getTemplateSMS(token);
      if (res?.success) setTemplates(res.data || []);
      else toast.error(res?.message || "Failed to load templates");
    };
    loadTemplates();
  }, [token]);

  /** CSV upload */
  const handleFileUpload = (file) => {
    setBulkFile(file);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => setCsvData(results.data)
    });
  };

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  /** Preview template with CSV variables */
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

  /** Update template payload for sending */
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

  /** Filter contacts for search */
  const filteredContacts = (contacts || []).filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  /** Handle add/update template */
  const handleSaveTemplate = async () => {
    if (!newTemplateName.trim() || !newTemplateContent.trim()) {
      toast.error("Template name and content are required");
      return;
    }

    const payload = {
      name: newTemplateName,
      content: newTemplateContent,
      description: "",
      active: true
    };

    try {
      let res;
      if (editingTemplateId) {
        res = await updateTemplate(token, editingTemplateId, payload);
      } else {
        res = await createTemplate(token, payload);
      }

      if (!res?.success) throw new Error(res?.message);

      const refreshed = await getTemplateSMS(token);
      if (refreshed?.success) setTemplates(refreshed.data);

      toast.success(editingTemplateId ? "Template updated" : "Template created");

      setShowModal(false);
      setEditingTemplateId(null);
      setNewTemplateName("");
      setNewTemplateContent("");
    } catch {
      toast.error("Failed to save template");
    }
  };

  /** Delete template */
  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;
    const res = await deleteTemplate(token, templateToDelete.id);
    if (res?.success) {
      setTemplates((prev) => prev.filter((t) => t.id !== templateToDelete.id));
      if (selectedTemplateId === templateToDelete.id) setSelectedTemplateId(null);
      toast.success("Template deleted");
    } else toast.error("Delete failed");

    setShowDeleteConfirm(false);
    setTemplateToDelete(null);
  };

  /** Edit template */
  const handleEditTemplate = (template) => {
    setEditingTemplateId(template.id);
    setNewTemplateName(template.name);
    setNewTemplateContent(template.content);
    setShowModal(true);
  };

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
                    else setSelectedContacts([...selectedContacts, c.id]);
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
          className="w-full p-2 border rounded"
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

      {/* Add / Manage Template buttons */}
      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 hover:cursor-pointer"
          onClick={() => {
            setShowModal(true);
            setEditingTemplateId(null);
            setNewTemplateName("");
            setNewTemplateContent("");
          }}
        >
          + Add Template
        </button>

        <button
          className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 hover:cursor-pointer"
          onClick={() => setShowTemplatesModal(true)}
        >
          Manage Templates
        </button>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4">
            <input
              className="w-full p-2 border rounded"
              placeholder="Template name"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
            />
            <textarea
              className="w-full p-2 border rounded h-24"
              placeholder="Template content"
              value={newTemplateContent}
              onChange={(e) => setNewTemplateContent(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
              >
                {editingTemplateId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 max-h-[80vh] overflow-y-auto space-y-2">
            <h2 className="text-lg font-bold mb-4">Existing Templates</h2>
            {templates.length === 0 && <p>No templates available</p>}
            {templates.map((t) => (
              <div key={t.id} className="flex justify-between items-center border p-2 rounded hover:bg-gray-50">
                <span>{t.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowTemplatesModal(false); handleEditTemplate(t); }}
                    className="px-2 py-1 bg-teal-600 rounded text-sm text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => { setShowTemplatesModal(false); setTemplateToDelete(t); setShowDeleteConfirm(true); }}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowTemplatesModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {showDeleteConfirm && templateToDelete && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4">
            <h2 className="text-lg font-bold">Delete Template</h2>
            <p>Are you sure you want to delete "{templateToDelete.name}"?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => { setShowDeleteConfirm(false); setTemplateToDelete(null); }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleDeleteTemplate}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSMS;
