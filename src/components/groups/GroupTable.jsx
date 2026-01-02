import { useState } from "react";
import GroupRow from "./GroupRow";

function GroupTable({
  groups = [],
  onEdit,
  onDelete,
  onAddContact,
  onViewContacts,
}) {
  const [sortOrder, setSortOrder] = useState("asc"); 

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };


  const sortedGroups = [...groups].sort((a, b) => {
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();
    return sortOrder === "asc"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">
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
                  <span className={sortOrder === "asc" ? "font-bold text-white opacity-100" : "opacity-40"}>
                    ▲
                  </span>
                  <span className={sortOrder === "desc" ? "font-bold text-white opacity-100 -mt-1" : "opacity-40 -mt-1"}>
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
                onEdit={onEdit}
                onDelete={onDelete}
                onAddContact={onAddContact}
                onViewContacts={onViewContacts}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default GroupTable;