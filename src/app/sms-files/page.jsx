"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { toast } from "sonner";

import SearchUploadBar from "@/components/sms-files/SearchUploadBar";
import FilesTable from "@/components/sms-files/FilesTable";
import EditGroupModal from "@/components/sms-files/EditGroupModal";
import DeleteGroupModal from "@/components/sms-files/DeleteGroupModal";

import {
  fetchGroups,
  uploadGroupFile,
  updateGroup,
  deleteGroup,
} from "@/lib/smsfiles";

export default function SMSFilesPage() {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("batch");
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [bulkGroupName, setBulkGroupName] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");

  const [token, setToken] = useState("");
  const [adminId, setAdminId] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token") || "");
      setAdminId(Number(localStorage.getItem("adminId")) || 0);
    }
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const data = await fetchGroups(token);
      setFiles(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load groups");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchFiles();
  }, [token]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["csv", "xlsx"];
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !allowedTypes.includes(extension)) {
      toast.warning("Only CSV or XLSX files are allowed");
      e.target.value = null;
      return;
    }

    if (!bulkGroupName.trim()) {
      toast.warning("Please enter a group name");
      e.target.value = null;
      return;
    }

    setUploading(true);
    try {
      await uploadGroupFile(token, adminId, file, bulkGroupName);
      toast.success("File uploaded and contacts added successfully!");
      setBulkGroupName("");
      e.target.value = null;
      await fetchFiles();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const openEditModal = (file) => {
    setSelectedFile(file);
    setNewGroupName(file.name || "");
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedFile?.id) return;

    const trimmedName = newGroupName.trim();
    if (!trimmedName) return toast.warning("Group name cannot be empty");

    try {
      await updateGroup(token, selectedFile.id, { name: trimmedName });
      toast.success("Group name updated successfully!");
      setEditModalOpen(false);
      setNewGroupName("");
      await fetchFiles();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update group");
      await fetchFiles();
    }
  };

  const handleDeleteClick = (file) => {
    setFileToDelete(file);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!fileToDelete?.id) return;
    try {
      await deleteGroup(token, fileToDelete.id);
      toast.success("Group deleted successfully!");
      await fetchFiles();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to delete group");
      await fetchFiles();
    } finally {
      setDeleteModalOpen(false);
      setFileToDelete(null);
    }
  };

  const filteredFiles = files.filter((f) =>
    (f.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (f.fileName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="SMS-Files" />
        <main className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
          {/* Search & Upload Bar */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <SearchUploadBar
              search={search}
              setSearch={setSearch}
              bulkGroupName={bulkGroupName}
              setBulkGroupName={setBulkGroupName}
              handleUpload={handleUpload}
              uploading={uploading}
            />
          </div>

          {/* Files Table */}
          <div className="overflow-x-auto">
            <FilesTable
              files={files}
              filteredFiles={filteredFiles}
              loading={loading}
              openEditModal={openEditModal}
              handleDeleteClick={handleDeleteClick}
            />
          </div>

          {/* Edit Group Modal */}
          <EditGroupModal
            editModalOpen={editModalOpen}
            setEditModalOpen={setEditModalOpen}
            newGroupName={newGroupName}
            setNewGroupName={setNewGroupName}
            handleSaveEdit={handleSaveEdit}
          />

          {/* Delete Group Modal */}
          <DeleteGroupModal
            deleteModalOpen={deleteModalOpen}
            setDeleteModalOpen={setDeleteModalOpen}
            fileToDelete={fileToDelete}
            confirmDelete={confirmDelete}
          />
        </main>
      </div>
    </div>
  );
}
