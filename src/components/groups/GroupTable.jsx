import GroupRow from "./GroupRow";

function GroupTable({ groups, onEdit, onDelete, onAddContact, onViewContacts }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 overflow-x-auto">
      <table className="w-full text-sm text-center">
        <thead className="bg-teal-700 text-white">
          <tr>
            <th className="p-3">SN</th>
            <th className="p-3">Group Name</th>
            <th className="p-3">Total Contacts</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {groups.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="p-6 text-center text-gray-500"
              >
                No groups found
              </td>
            </tr>
          ) : (
            groups.map((group, index) => (
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
