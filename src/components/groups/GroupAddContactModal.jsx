import { useEffect, useState, useMemo } from "react";
import Modal from "./Modal";
import { toast } from "sonner";
import { addContactsToGroup } from "@/lib/group";
import { fetchContacts as fetchContactsAPI } from "@/lib/contacts";

function GroupAddContactModal({ token, group, onClose, onSuccess }) {
  const [contactIds, setContactIds] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // New state for search input

  useEffect(() => {
    if (!token) return;

    const loadContacts = async () => {
      try {
        const res = await fetchContactsAPI(token);
        if (!res.success) {
          toast.error(res.message);
          return;
        }
        setContacts(res.data);
      } catch (err) {
        toast.error("Failed to load contacts");
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, [token]);

  const toggle = (id) => {
    setContactIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAdd = async () => {
    if (contactIds.length === 0) {
      toast.error("Select at least one contact");
      return;
    }

    const res = await addContactsToGroup(token, group.id, contactIds);
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success("Contacts added successfully");
    onSuccess();
    onClose();
  };

  // Filter contacts by search term (case-insensitive)
  const filteredContacts = useMemo(() => {
    if (!search) return contacts;
    return contacts.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [contacts, search]);

  return (
    <Modal title={`Add contacts to ${group.name}`} close={onClose}>
      {loading ? (
        <p className="text-center text-gray-500">Loading contacts...</p>
      ) : contacts.length === 0 ? (
        <p className="text-center text-gray-500">No contacts found</p>
      ) : (
        <>
          {/* Search Field */}
          <input
            type="text"
            placeholder="Search contacts by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-2 px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {/* Contact list */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredContacts.length === 0 ? (
              <p className="text-center text-gray-500">No contacts found</p>
            ) : (
              filteredContacts.map((contact) => (
                <label
                  key={contact.id}
                  className="flex items-center gap-3 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={contactIds.includes(contact.id)}
                    onChange={() => toggle(contact.id)}
                  />
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                  </div>
                </label>
              ))
            )}
          </div>
        </>
      )}

      <button
        onClick={handleAdd}
        className="w-full mt-4 bg-teal-600 text-white py-2 rounded-xl disabled:opacity-50 hover:cursor-pointer hover:bg-teal-700"
        disabled={contactIds.length === 0}
      >
        Add Contacts
      </button>
    </Modal>
  );
}

export default GroupAddContactModal;
