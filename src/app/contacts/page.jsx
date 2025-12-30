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
  const [form, setForm] = useState({ name: "", mobile: "" });
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tab1");

  const [token, setToken] = useState("");
  const [contactToDelete, setContactToDelete] = useState(null); // <-- new state
  const [showDeleteModal, setShowDeleteModal] = useState(false); // <-- new state

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

  const saveContact = async () => {
    if (!token) return toast.error("Session expired. Please login again.");

    try {
      if (editing) {
        const res = await updateContact(token, editing, {
          name: form.name,
          phoneNo: form.mobile,
        });
        if (!res.success) return toast.error(res.message);
        toast.success("Contact updated");
      } else {
        const res = await createContact(token, {
          name: form.name,
          phoneNo: form.mobile,
        });
        if (!res.success) return toast.error(res.message);
        toast.success("Contact added");
      }
      setModalOpen(false);
      setEditing(null);
      loadContacts();
    } catch {
      toast.error("Failed to save contact");
    }
  };

  const confirmDelete = (c) => {
    setContactToDelete(c);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!token || !contactToDelete) return toast.error("Session expired. Please login again.");
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="sticky top-0 z-30 bg-gray-50 shadow">
          <Header title="Individual Contacts" />
        </div>

        <ContactsHeader
          searchTerm={search}
          setSearchTerm={setSearch}
          onAdd={() => setModalOpen(true)}
          onUpload={() => fileRef.current.click()}
          fileInputRef={fileRef}
        />

        <ContactsTable
          contacts={filtered}
          loading={loading}
          onEdit={(c) => {
            setEditing(c.id);
            setForm(c);
            setModalOpen(true);
          }}
          onDelete={confirmDelete} // <-- use confirmDelete
          onView={(c) => toast.info(c.name)}
          onSend={(c) => toast.success(`SMS sent to ${c.name}`)}
        />

        {modalOpen && (
          <ContactModal
            open={modalOpen}
            close={() => setModalOpen(false)}
            data={form}
            setData={setForm}
            onSave={saveContact}
            isEdit={!!editing}
          />
        )}


        {showDeleteModal && contactToDelete && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur bg-opacity-50 z-50">
            <div className="bg-white rounded p-6 w-96">
              <h2 className="text-lg font-bold mb-4">Delete Contact</h2>
              <p>Are you sure you want to delete "{contactToDelete.name}"?</p>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded"
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
