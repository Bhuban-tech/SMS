"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { toast } from "sonner";
import SearchUploadBar from "@/components/sms-files/SearchUploadBar";
import FilesTable from "@/components/sms-files/FilesTable";
import EditGroupModal from "@/components/sms-files/EditGroupModal";
import DeleteGroupModal from "@/components/sms-files/DeleteGroupModal";
import { fetchGroups, uploadGroupFile, updateGroup, deleteGroup } from "@/lib/smsfiles";
import { getGroupContacts } from "@/lib/group";
import { X, Menu } from "lucide-react";

export default function SMSFilesPage() {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("batch");
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [bulkGroupName, setBulkGroupName] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");

  const [token, setToken] = useState("");
  const [adminId, setAdminId] = useState(0);

  // Contacts modal state
  const [showContacts, setShowContacts] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loadingContacts, setLoadingContacts] = useState(false);
  
  // New state for contacts search
  const [contactSearch, setContactSearch] = useState("");

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
      toast.success("File uploaded successfully!");
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

  const onEditStart = (file) => {
    setEditingId(file.id);
    setEditingName(file.name || "");
  };

  const onEditCancel = () => {
    setEditingId(null);
    setEditingName("");
  };

  const onEditSave = async (id) => {
    const trimmedName = editingName.trim();
    if (!trimmedName) return toast.warning("Group name cannot be empty");

    try {
      await updateGroup(token, id, { name: trimmedName });
      toast.success("Group name updated");
      setEditingId(null);
      setEditingName("");
      await fetchFiles();
    } catch (err) {
      toast.error("Failed to update group");
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

  const handleViewContacts = async (row) => {
    if (!token) return toast.error("Token not available");

    try {
      setLoadingContacts(true);
      const res = await getGroupContacts(token, row.id);

      if (res.success && res.data) {
        const allContacts = res.data.contacts || [];
        const contactsWithoutHeader = allContacts.slice(1);

        setContacts(contactsWithoutHeader);
        setSelectedGroup(res.data);
        setShowContacts(true);
        setContactSearch(""); // reset search when opening modal
      } else {
        setContacts([]);
        toast.error("No contacts found");
        setShowContacts(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load contacts");
      setContacts([]);
      setShowContacts(false);
    } finally {
      setLoadingContacts(false);
    }
  };

  // Filter contacts by name
  const filteredContacts = contacts.filter((contact) =>
    (contact.name || "").toLowerCase().includes(contactSearch.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
        <button
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-slate-800 transition"
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="SMS-Files" />
        <main className="flex-1 overflow-auto p-6">
          <SearchUploadBar
            search={search}
            setSearch={setSearch}
            bulkGroupName={bulkGroupName}
            setBulkGroupName={setBulkGroupName}
            handleUpload={handleUpload}
            uploading={uploading}
          />

          <FilesTable
            files={files}
            filteredFiles={filteredFiles}
            loading={loading}
            editingId={editingId}
            editingName={editingName}
            setEditingName={setEditingName}
            onEditStart={onEditStart}
            onEditCancel={onEditCancel}
            onEditSave={onEditSave}
            handleDeleteClick={handleDeleteClick}
            handleViewClick={handleViewContacts}
          />

          <DeleteGroupModal
            deleteModalOpen={deleteModalOpen}
            setDeleteModalOpen={setDeleteModalOpen}
            fileToDelete={fileToDelete}
            confirmDelete={confirmDelete}
          />

          {/* Contacts Modal with Search */}
          {showContacts && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="relative bg-white w-full max-w-lg rounded-xl p-6 shadow-xl">
                         <button
        onClick={() => setShowContacts(false)}
        aria-label="Close"
        className="absolute top-4 right-6 text-gray-400 hover:text-gray-600 hover:cursor-pointer"
      >
        ✕
      </button>
        
                <h2 className="text-xl text-center font-bold mb-4 text-teal-700">
                  {selectedGroup?.name}
                </h2>
                 

                {/* Search Input */}
                <div className="mb-4 relative">
                  
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>

                {loadingContacts ? (
                  <p className="text-center py-10">Loading contacts...</p>
                ) : filteredContacts.length === 0 ? (
                  <p className="text-center text-gray-500 py-6">
                    {contactSearch
                      ? "No matching contacts found"
                      : "No contacts found"}
                  </p>
                ) : (
                  <div className="max-h-80 overflow-y-auto border rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="p-3 text-left">Name</th>
                          <th className="p-3 text-left">Contact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredContacts.map((c, i) => (
                          <tr key={i} className="border-t hover:bg-gray-50">
                            <td className="p-3">{c.name || "-"}</td>
                            <td className="p-3">{c.phoneNo || c.contact || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowContacts(false);
                    setContactSearch(""); 
                  }}
                  className="mt-6 w-full py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-700 hover:cursor-pointer text-center"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}