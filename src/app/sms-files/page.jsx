"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { toast } from "sonner";

import { fetchGroups, uploadGroupFile, updateGroup, deleteGroup } from "@/lib/smsfiles";

import FileUploadControls from "@/components/sms-files/FileUploadControl";
import FileTable from "@/components/sms-files/FileTable";
import EditModal from "@/components/sms-files/EditModal";
import DeleteModal from "@/components/sms-files/DeleteModal";

export default function SMSFilesPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFile, setNewFile] = useState({ fileName: "", fileType: "", size: "" });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const [bulkGroupName, setBulkGroupName] = useState("");
  const fileInputRef = useRef(null);

  const [token, setToken] = useState("");
  const [adminId, setAdminId] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("batch");
  

  // Load token/adminId
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token") || "");
      setAdminId(Number(localStorage.getItem("adminId")) || 0);
    }
  }, []);

  // Fetch files
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const groups = await fetchGroups(token);
      setFiles(groups);
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

  // Upload file
  const handleUpload = async (file) => {
    if (!file) return;

    const allowedTypes = ["csv", "xlsx"];
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !allowedTypes.includes(extension)) {
      toast.warning("Only CSV or XLSX files are allowed");
      return;
    }

    if (!bulkGroupName.trim()) {
      toast.warning("Please enter a group name");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadGroupFile(token, adminId, file, bulkGroupName);
      const newGroup = {
        id: result.id,
        fileName: result.fileName || file.name,
        fileType: result.fileType || extension,
        size: result.size || file.size,
        groupName: result.groupName || result.name || bulkGroupName.trim(),
        name: result.name || bulkGroupName.trim(),
        createdAt: result.createdAt || new Date().toISOString(),
        author: result.author || "admin college",
      };
      setFiles((prev) => [...prev, newGroup]);
      toast.success("File uploaded and contacts added successfully!");
      setBulkGroupName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchFiles();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!selectedFile?.id) return;
    try {
      const updatedGroup = await updateGroup(token, selectedFile.id, newFile);
      setFiles((prev) =>
        prev.map((f) => (f.id === selectedFile.id ? { ...f, ...updatedGroup } : f))
      );
      toast.success("Group details updated successfully!");
      setEditModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update group");
      fetchFiles();
    }
  };

  // Confirm delete
  const handleDelete = async () => {
    if (!fileToDelete?.id) return;
    try {
      await deleteGroup(token, fileToDelete.id);
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      toast.success("Group deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to delete group");
      fetchFiles();
    } finally {
      setDeleteModalOpen(false);
      setFileToDelete(null);
    }
  };

  const filteredFiles = useMemo(
    () =>
      files.filter((f) =>
        (f.groupName || f.name || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (f.fileName || "").toLowerCase().includes(search.toLowerCase())
      ),
    [files, search]
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex-1 flex flex-col overflow-hidden ">
        <Header title="SMS Files" />
        <main className="flex-1 overflow-auto p-6 space-y-6">
          <FileUploadControls
            search={search}
            setSearch={setSearch}
            bulkGroupName={bulkGroupName}
            setBulkGroupName={setBulkGroupName}
            fileInputRef={fileInputRef}
            onUpload={handleUpload}
            uploading={uploading}
          />

          <FileTable
            files={filteredFiles}
            loading={loading}
            onEdit={(file) => {
              setSelectedFile(file);
              setNewFile({
                fileName: file.fileName || "",
                fileType: file.fileType || "",
                size: file.size || "",
              });
              setEditModalOpen(true);
            }}
            onDelete={(file) => {
              setFileToDelete(file);
              setDeleteModalOpen(true);
            }}
          />

          {editModalOpen && (
            <EditModal
              file={selectedFile}
              newFile={newFile}
              setNewFile={setNewFile}
              onClose={() => setEditModalOpen(false)}
              onSave={handleSaveEdit}
            />
          )}

          {deleteModalOpen && (
            <DeleteModal
              file={fileToDelete}
              onClose={() => setDeleteModalOpen(false)}
              onConfirm={handleDelete}
            />
          )}
        </main>
      </div>
    </div>
  );
}
