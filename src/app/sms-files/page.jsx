"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { toast } from "sonner";

import {
  fetchGroups,
  uploadGroupFile,
  updateGroup,
  deleteGroup,
} from "@/lib/smsfiles";

import FileUploadControls from "@/components/sms-files/FileUploadControl";
import FileTable from "@/components/sms-files/FileTable";
import EditModal from "@/components/sms-files/EditModal";
import DeleteModal from "@/components/sms-files/DeleteModal";

import { useSMSFiles } from "@/context/SMSFileContext";

export default function SMSFilesPage() {
  const { smsFiles, setSmsFiles } = useSMSFiles();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFile, setNewFile] = useState({});

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const [bulkGroupName, setBulkGroupName] = useState("");
  const fileInputRef = useRef(null);

  const [token, setToken] = useState("");
  const [adminId, setAdminId] = useState(0);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("batch");

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
    setAdminId(Number(localStorage.getItem("adminId")) || 0);
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const data = await fetchGroups(token);
      setSmsFiles(data);
    } catch {
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchFiles();
  }, [token]);

  const filteredFiles = useMemo(
    () =>
      smsFiles.filter(
        (f) =>
          (f.groupName || f.name || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (f.fileName || "").toLowerCase().includes(search.toLowerCase())
      ),
    [smsFiles, search]
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col">
        <Header title="SMS Files" />

        <main className="p-6 space-y-6">
          <FileUploadControls
            search={search}
            setSearch={setSearch}
            bulkGroupName={bulkGroupName}
            setBulkGroupName={setBulkGroupName}
            fileInputRef={fileInputRef}
            uploading={uploading}
          />

          <FileTable
            files={filteredFiles}
            loading={loading}
            onEdit={(file) => {
              setSelectedFile(file);
              setNewFile(file);
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
              onSave={async () => {
                const updated = await updateGroup(
                  token,
                  selectedFile.id,
                  newFile
                );
                setSmsFiles((prev) =>
                  prev.map((f) =>
                    f.id === selectedFile.id ? updated : f
                  )
                );
                setEditModalOpen(false);
              }}
            />
          )}

          {deleteModalOpen && (
            <DeleteModal
              file={fileToDelete}
              onClose={() => setDeleteModalOpen(false)}
              onConfirm={async () => {
                await deleteGroup(token, fileToDelete.id);
                setSmsFiles((prev) =>
                  prev.filter((f) => f.id !== fileToDelete.id)
                );
                setDeleteModalOpen(false);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
