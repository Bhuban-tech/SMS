"use client";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

export default function ContactsTable({
  contacts = [],
  loading,
  onUpdate,
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
    if (!editName.trim()) return;

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
    <div>
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-center border-collapse">
          <thead>
            <tr className="bg-teal-700 text-white">
              <th className="p-4 rounded-tl-2xl">SN</th>
              <th className="p-4">
                <button
                  onClick={toggleSort}
                  className="flex items-center gap-2 mx-auto"
                >
                  Name
                  <span className="flex flex-col text-xs">
                    <span className={sortOrder === "asc" ? "font-bold" : ""}>
                      ▲
                    </span>
                    <span
                      className={sortOrder === "desc" ? "font-bold -mt-1" : "-mt-1"}
                    >
                      ▼
                    </span>
                  </span>
                </button>
              </th>
              <th className="p-4">Mobile</th>
              <th className="p-4 rounded-tr-2xl">Actions</th>
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
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="p-4">{index + 1}</td>

                  <td className="p-4">
                    {editingId === contact.id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(contact);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        className="w-full border rounded px-2 py-1 text-center"
                        autoFocus
                      />
                    ) : (
                      contact.name
                    )}
                  </td>

                  <td className="p-4">
                    {editingId === contact.id ? (
                      <input
                        value={editMobile}
                        onChange={(e) => setEditMobile(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(contact);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        className="w-full border rounded px-2 py-1 text-center"
                      />
                    ) : (
                      contact.mobile
                    )}
                  </td>

                  <td className="p-4">
                    {editingId === contact.id ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => saveEdit(contact)}
                          className="px-3 py-1 bg-teal-500 text-white rounded hover:cursor-pointer hover:bg-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:cursor-pointer hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-2">
                        <ActionBtn onClick={() => startEditing(contact)}>
                          <Edit size={16} />
                        </ActionBtn>
                        <ActionBtn
                          color="red"
                          onClick={() => onDelete?.(contact)}
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

      {/* ================= MOBILE GRID ================= */}
      <div className="md:hidden grid gap-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading contacts...
          </div>
        ) : sortedContacts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No contacts found
          </div>
        ) : (
          sortedContacts.map((contact, index) => (
            <div
              key={contact.id}
              className="bg-white rounded-xl shadow-md p-4 grid gap-3"
            >
              <div className="flex justify-between text-sm text-gray-500">
                <span>#{index + 1}</span>
                <div className="flex gap-2">
                  {editingId !== contact.id && (
                    <>
                      <ActionBtn onClick={() => startEditing(contact)}>
                        <Edit size={14} />
                      </ActionBtn>
                      <ActionBtn
                        color="red"
                        onClick={() => onDelete?.(contact)}
                      >
                        <Trash2 size={14} />
                      </ActionBtn>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Name</p>
                {editingId === contact.id ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                ) : (
                  <p className="font-medium">{contact.name}</p>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-500">Mobile</p>
                {editingId === contact.id ? (
                  <input
                    value={editMobile}
                    onChange={(e) => setEditMobile(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                ) : (
                  <p>{contact.mobile}</p>
                )}
              </div>

              {editingId === contact.id && (
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => saveEdit(contact)}
                    className="px-3 py-1 bg-teal-600 text-white rounded hover:cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ActionBtn({ children, onClick, color = "teal" }) {
  const colors = {
    teal: "bg-teal-500 hover:bg-teal-700 text-white hover:cursor-pointer",
    red: "bg-red-500 hover:bg-red-700 text-white hover:cursor-pointer",
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg shadow transition ${colors[color]}`}
    >
      {children}
    </button>
  );
}
