"use client";
import { useState } from "react";
import GroupRow from "./GroupRow";
import { Edit, Eye, Trash } from "lucide-react";

function GroupTable({
  groups = [],
  onDelete,
  onAddContact,
  onViewContacts,
  onEditGroupName,
  editingGroupId,
  setEditingGroupId,
}) {
  const [sortOrder, setSortOrder] = useState("asc");

  const toggleSort = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const sortedGroups = [...groups].sort((a, b) => {
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();
    return sortOrder === "asc"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  const handleSaveName = (groupId, newName) => {
    if (!newName.trim()) return;
    onEditGroupName(groupId, newName);
    setEditingGroupId(null);
  };

  const handleCancelEdit = () => setEditingGroupId(null);

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead>
            <tr className="bg-teal-700 text-white">
              <th className="p-4 font-medium rounded-tl-2xl">SN</th>
              <th className="p-4 font-medium">
                <button
                  onClick={toggleSort}
                  className="flex items-center gap-2 mx-auto hover:bg-teal-600 px-2 py-1 rounded transition-all duration-200 group"
                >
                  Group Name
                  <span className="flex flex-col text-xs leading-tight opacity-70 group-hover:opacity-100 transition-opacity">
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
              <th className="p-4 font-medium">Total Contacts</th>
              <th className="p-4 font-medium rounded-tr-2xl">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {sortedGroups.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-12 text-gray-500">
                  No groups found
                </td>
              </tr>
            ) : (
              sortedGroups.map((group, index) => (
                <GroupRow
                  key={group.id}
                  group={group}
                  index={index}
                  onAddContact={onAddContact}
                  onDelete={onDelete}
                  onViewContacts={onViewContacts}
                  isEditing={editingGroupId === group.id}
                  onSaveName={handleSaveName}
                  onCancelEdit={handleCancelEdit}
                  onEditClick={() => setEditingGroupId(group.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Grid Cards */}
      <div className="md:hidden grid gap-4">
        {sortedGroups.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No groups found</div>
        ) : (
          sortedGroups.map((group, index) => (
            <div
              key={group.id}
              className="bg-white rounded-xl shadow-md p-4 grid gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">#{index + 1}</span>
                <div className="flex gap-2">
                  {editingGroupId === group.id ? (
                    <>
                      <button
                        onClick={() => handleSaveName(group.id, group.name)}
                        className="px-3 py-1 rounded bg-teal-600 text-white hover:bg-teal-700 hover:cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 rounded bg-gray-400 text-white hover:bg-gray-500 hover:cursor-pointer"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onViewContacts(group)}
                        className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 hover:cursor-pointer"
                      >
                        <Eye size={20}/>
                      </button>
                      <button
                        onClick={() => setEditingGroupId(group.id)}
                        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 hover:cursor-pointer"
                      >
                        <Edit size={20}/>
                      </button>
                      <button
                        onClick={() => onDelete(group)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 hover:cursor-pointer"
                      >
                        <Trash size={20} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Group Name</p>
                {editingGroupId === group.id ? (
                  <input
                    type="text"
                    value={group.name}
                    onChange={(e) => onEditGroupName(group.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleSaveName(group.id, group.name);
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                    autoFocus
                    className="w-full border border-teal-500 rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                ) : (
                  <p className="text-gray-800">{group.name}</p>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-500">Total Contacts</p>
                <p className="text-gray-800">{group.totalContacts || 0}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GroupTable;
