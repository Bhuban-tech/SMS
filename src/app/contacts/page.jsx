"use client";

import { useEffect, useRef, useState } from "react";
import Papa from "papaparse";
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

  const fileRef = useRef(null);

  const loadContacts = async () => {
    setLoading(true);
    const res = await fetchContacts();
    if (res.success) {
      setContacts(
        res.data.map((c) => ({
          id: c.id,
          name: c.name,
          mobile: c.phoneNo,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search)
  );

  const saveContact = async () => {
    if (editing) {
      await updateContact(editing, {
        name: form.name,
        phoneNo: form.mobile,
      });
      toast.success("Contact updated");
    } else {
      await createContact({ name: form.name, phoneNo: form.mobile });
      toast.success("Contact added");
    }
    setModalOpen(false);
    setEditing(null);
    loadContacts();
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />

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
          onDelete={(c) => deleteContact(c.id).then(loadContacts)}
          onView={(c) => toast.info(c.name)}
          onSend={(c) => toast.success(`SMS sent to ${c.name}`)}
        />

        <ContactModal
          open={modalOpen}
          close={() => setModalOpen(false)}
          data={form}
          setData={setForm}
          onSave={saveContact}
          isEdit={!!editing}
        />
      </div>
    </div>
  );
}
