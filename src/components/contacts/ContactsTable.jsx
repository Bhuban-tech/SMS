import { useState } from "react";
import { Edit, Trash } from "lucide-react";

export default function ContactsTable({
  contacts = [],
  loading,
  onEdit,
  onDelete,
}) {
  const [sortOrder, setSortOrder] = useState("asc");

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
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
      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead>
            <tr className="bg-teal-700 text-white">
              <th className="p-4 font-medium rounded-tl-2xl">SN</th>
              <th className="p-4 text-left font-medium">
                <button
                  onClick={toggleSort}
                  className="flex items-center gap-2 hover:bg-teal-600 px-2 py-1 rounded transition-all duration-200 group"
                >
                  Name
                  <span className="flex flex-col text-xs leading-tight opacity-70 group-hover:opacity-100">
                    <span
                      className={
                        sortOrder === "asc"
                          ? "font-bold text-white opacity-100"
                          : "opacity-40"
                      }
                    >
                      ▲
                    </span>
                    <span
                      className={
                        sortOrder === "desc"
                          ? "font-bold text-white opacity-100 -mt-1"
                          : "opacity-40 -mt-1"
                      }
                    >
                      ▼
                    </span>
                  </span>
                </button>
              </th>
              <th className="p-4 font-medium">Mobile</th>
              <th className="p-4 font-medium rounded-tr-2xl">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-12 text-gray-500">
                  Loading contacts...
                </td>
              </tr>
            ) : sortedContacts.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-12 text-gray-500">
                  No contacts found
                </td>
              </tr>
            ) : (
              sortedContacts.map((contact, index) => (
                <tr
                  key={contact.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="p-4 text-gray-600">{index + 1}</td>
                  <td className="p-4 text-left font-medium text-gray-800">
                    {contact.name}
                  </td>
                  <td className="p-4 text-gray-700">{contact.mobile}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <ActionBtn onClick={() => onEdit(contact)} color="blue">
                        <Edit size={16} />
                      </ActionBtn>
                      <ActionBtn onClick={() => onDelete(contact)} color="red">
                        <Trash size={16} />
                      </ActionBtn>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Grid Cards */}
      <div className="md:hidden grid  gap-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading contacts...</div>
        ) : sortedContacts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No contacts found</div>
        ) : (
          sortedContacts.map((contact, index) => (
            <div
              key={contact.id}
              className="bg-white rounded-xl shadow-md p-4 grid gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">#{index + 1}</span>
                <div className="flex gap-2">
                  <ActionBtn onClick={() => onEdit(contact)} color="blue">
                    <Edit size={14} />
                  </ActionBtn>
                  <ActionBtn onClick={() => onDelete(contact)} color="red">
                    <Trash size={14} />
                  </ActionBtn>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-semibold text-gray-800">{contact.name}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Mobile</p>
                <p className="text-gray-700">{contact.mobile}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ActionBtn({ children, onClick, color }) {
  const colors = {
    blue: "bg-teal-500 hover:bg-teal-700 text-white hover:cursor-pointer",
    red: "bg-red-500 hover:bg-red-700 text-white hover:cursor-pointer",
  };

  return (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${colors[color]}`}
    >
      {children}
    </button>
  );
}
