"use client";
import { Edit, Plus, Trash } from "lucide-react";
import { useState, useEffect } from "react";

function GroupRow({
  group,
  index,
  onDelete,
  onAddContact,
  onViewContacts,
  isEditing,
  onSaveName,
  onCancelEdit,
  onEditClick,
}) {
  const [localName, setLocalName] = useState(group.name);

 
  useEffect(() => {
    setLocalName(group.name);
  }, [group.name]);

  return (
    <tr className="border border-gray-200 hover:bg-gray-100">
     
      <td className="p-3 text-center">{index + 1}</td>

      
      <td className="p-3 text-center">
        {isEditing ? (
          <input
            type="text"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full max-w-xs"
            autoFocus
          />
        ) : (
          <span
            className="cursor-pointer text-blue-600 hover:underline"
            onClick={() => onViewContacts(group)}
          >
            {group.name}
          </span>
        )}
      </td>

   
      <td className="p-3 text-center">{group.contactCount ?? 0}</td>

     
      <td className="p-3 flex justify-center gap-3">
        {isEditing ? (
          <>
            <button
              className="bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-700 hover:cursor-pointer"
              onClick={() => onSaveName(group.id, localName)}
            >
              Save
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-500 hover:cursor-pointer"
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="bg-teal-500 text-white p-2 rounded-full shadow hover:bg-teal-700 hover:cursor-pointer"
              onClick={onEditClick}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              className="bg-green-500 text-white p-2 rounded-full shadow hover:bg-green-700 hover:cursor-pointer"
              onClick={() => onAddContact(group)}
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-700 hover:cursor-pointer"
              onClick={() => onDelete(group)}
            >
              <Trash className="w-4 h-4" />
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

export default GroupRow;
