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

  const handleDelete = async (c) => {
    if (!token) return toast.error("Session expired. Please login again.");

    try {
      const res = await deleteContact(token, c.id);
      if (!res.success) return toast.error(res.message);
      toast.success("Contact deleted");
      loadContacts();
    } catch {
      toast.error("Failed to delete contact");
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
          onDelete={handleDelete}
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
      </div>
    </div>
  );
}
