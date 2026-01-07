import { X } from "lucide-react";
import Modal from "./Modal";
import { useState, useMemo } from "react";

function GroupViewModal({ group, contacts = [], onClose, onRemoveContact }) {
  const [search, setSearch] = useState("");


  const filteredContacts = useMemo(() => {
    if (!search) return contacts;
    return contacts.filter((c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phoneNo?.toLowerCase().includes(search.toLowerCase())
    );
  }, [contacts, search]);

  return (
    <Modal title={`Contacts in ${group.name}`} close={onClose}>
      {contacts.length === 0 ? (
        <p className="text-center text-gray-500">No contacts</p>
      ) : (
        <div>
          {/* Search input */}
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />

          {/* Contact list */}
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <p className="text-center text-gray-500">No contacts match your search</p>
            ) : (
              filteredContacts.map((c) => (
                <li
                  key={c.id}
                  className="border p-3 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-gray-500">{c.phoneNo}</p>
                  </div>

                  <button
                    onClick={() => onRemoveContact(group.id, c)}
                    className="text-red-500 hover:text-red-700 hover:cursor-pointer"
                    title="Remove contact"
                  >
                    <X />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </Modal>
  );
}

export default GroupViewModal;
