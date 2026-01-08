"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ContactsHeader from "@/components/contacts/ContactsHeader";
import ContactsTable from "@/components/contacts/ContactsTable";
import ContactModal from "@/components/contacts/ContactModal";

import {
  fetchContacts,
  createContact,
  updateContact,
  deleteContact,
} from "@/lib/contacts";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tab1");

  const [token, setToken] = useState("");
  const [contactToDelete, setContactToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fileRef = useRef(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (token) loadContacts();
  }, [token]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const res = await fetchContacts(token);
      if (!res.success) return toast.error(res.message);
      setContacts(
        res.data.map((c) => ({
          id: c.id,
          name: c.name,
          mobile: c.phoneNo,
        }))
      );
    } catch {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  // Fixed: Now accepts contactData from modal
  const saveContact = async (contactData) => {
    if (!token) return toast.error("Session expired. Please login again.");

    try {
      let res;
      if (editing) {
        res = await updateContact(token, editing, {
          name: contactData.name,
          phoneNo: contactData.mobile,
        });
        if (!res.success) return toast.error(res.message);
        toast.success("Contact updated");
      } else {
        res = await createContact(token, {
          name: contactData.name,
          phoneNo: contactData.mobile,
        });
        if (!res.success) return toast.error(res.message);
        toast.success("Contact added");
      }

      setModalOpen(false);
      setEditing(null);
      setSearch("");
      loadContacts(); // Refresh from server → correct data shown
    } catch {
      toast.error("Failed to save contact");
    }
  };

  const confirmDelete = (c) => {
    setContactToDelete(c);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!token || !contactToDelete)
      return toast.error("Session expired. Please login again.");
    try {
      const res = await deleteContact(token, contactToDelete.id);
      if (!res.success) return toast.error(res.message);
      toast.success("Contact deleted");
      loadContacts();
    } catch {
      toast.error("Failed to delete contact");
    } finally {
      setShowDeleteModal(false);
      setContactToDelete(null);
    }
  };

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search)
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="sticky top-0 z-30 bg-white shadow-sm">
          <Header title="Individual Contacts" />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col bg-white rounded-2xl shadow-md p-2">
              <ContactsHeader
                searchTerm={search}
                setSearchTerm={setSearch}
                onAdd={() => {
                  setEditing(null);
                  setModalOpen(true);
                }}
                onUpload={() => fileRef.current.click()}
                fileInputRef={fileRef}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4">
              <ContactsTable
                contacts={filtered}
                loading={loading}
                onEdit={(c) => {
                  setEditing(c.id);
                  setModalOpen(true);
                }}
                onDelete={confirmDelete}
                onView={(c) => toast.info(c.name)}
                onSend={(c) => toast.success(`SMS sent to ${c.name}`)}
              />
            </div>
          </div>
        </div>

        {modalOpen && (
          <ContactModal
            open={modalOpen}
            close={() => setModalOpen(false)}
            editingId={editing}
            initialData={
              editing
                ? contacts.find((c) => c.id === editing)
                : { name: "", mobile: "" }
            }
            onSave={saveContact}
          />
        )}

        {showDeleteModal && contactToDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
              <h2 className="text-lg font-semibold mb-4">Delete Contact</h2>
              <p className="text-gray-600">
                Are you sure you want to delete{" "}
                <span className="font-medium text-gray-900">
                  "{contactToDelete.name}"
                </span>
                ?
              </p>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 hover:cursor-pointer"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:cursor-pointer"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}