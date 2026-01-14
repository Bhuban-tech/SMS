"use client";

import { useState } from "react";
import { Edit, Trash2, Check, X } from "lucide-react";

export default function ContactsTable({
  contacts = [],
  loading,
  onUpdate,   // new: (id, {name, mobile}) => Promise
  onDelete,
  onView,
  onSend,
}) {
  const [sortOrder, setSortOrder] = useState("asc");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editMobile, setEditMobile] = useState("");

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const startEditing = (contact) => {
    setEditingId(contact.id);
    setEditName(contact.name || "");
    setEditMobile(contact.mobile || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditMobile("");
  };

  const saveEdit = async (contact) => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    // You can add mobile validation here if needed

    await onUpdate(contact.id, {
      name: editName.trim(),
      mobile: editMobile.trim(),
    });

    cancelEdit();
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();
    return sortOrder === "asc"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-center border-collapse">
        <thead>
          <tr className="bg-teal-700 text-white">
            <th className="p-4 rounded-tl-2xl font-medium">SN</th>
            <th className="p-4 font-medium">
              <button
                onClick={toggleSort}
                className="flex items-center gap-2 mx-auto hover:cursor-pointer group"
              >
                Name
                <span className="flex flex-col text-xs leading-tight">
                  <span className={sortOrder === "asc" ? "font-bold" : ""}>▲</span>
                  <span className={sortOrder === "desc" ? "font-bold -mt-1" : "-mt-1"}>▼</span>
                </span>
              </button>
            </th>
            <th className="p-4 font-medium">Mobile</th>
            <th className="p-4 rounded-tr-2xl font-medium">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={4} className="py-12 text-gray-500">
                Loading contacts...
              </td>
            </tr>
          ) : sortedContacts.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-12 text-gray-500">
                No contacts found
              </td>
            </tr>
          ) : (
            sortedContacts.map((contact, index) => (
              <tr
                key={contact.id}
                className={`hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="p-4 text-gray-600">{index + 1}</td>

                <td className="p-4 font-medium text-gray-800">
                  {editingId === contact.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(contact);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      autoFocus
                      className="w-full border border-teal-500 rounded px-3 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  ) : (
                    contact.name || "—"
                  )}
                </td>

                <td className="p-4 text-gray-700">
                  {editingId === contact.id ? (
                    <input
                      type="tel"
                      value={editMobile}
                      onChange={(e) => setEditMobile(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(contact);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className="w-full border border-teal-500 rounded px-3 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  ) : (
                    contact.mobile || "—"
                  )}
                </td>

                <td className="p-4">
                  {editingId === contact.id ? (
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => saveEdit(contact)}
                        className="p-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
                        title="Save"
                      >
                        save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-sm"
                        title="Cancel"
                      >
                       cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center gap-3">
                      <ActionBtn
                        onClick={() => startEditing(contact)}
                        color="teal"
                      >
                        <Edit size={16} />
                      </ActionBtn>
                      <ActionBtn
                        onClick={() => onDelete?.(contact)}
                        color="red"
                      >
                        <Trash2 size={16} />
                      </ActionBtn>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function ActionBtn({ children, onClick, color = "teal" }) {
  const colors = {
    teal: "bg-teal-500 hover:bg-teal-700 text-white",
    red: "bg-red-500 hover:bg-red-700 text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md active:scale-95 ${colors[color]}`}
    >
      {children}
    </button>
  );
}