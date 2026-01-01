import { Eye, Edit, Trash, Send } from "lucide-react";

export default function ContactsTable({
  contacts,
  loading,
  onView,
  onEdit,
  onDelete,
  onSend,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 overflow-x-auto">
      <table className="w-full text-sm rounded-2xl text-center">
        <thead className="bg-teal-700 rounded-2xl text-white">
          <tr>
            <th className="p-3">SN</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3">Mobile</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="p-12 text-gray-500">
                Loading contacts...
              </td>
            </tr>
          ) : contacts.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-12 text-gray-500">
                No contacts found
              </td>
            </tr>
          ) : (
            contacts.map((c, i) => (
              <tr
                key={c.id}
                className="border border-gray-300 hover:bg-gray-50 transition"
              >
                <td className="p-3">{i + 1}</td>

                <td className="p-3 text-left font-medium">
                  {c.name}
                </td>

                <td className="p-3">{c.mobile}</td>

                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    {/* <ActionBtn onClick={() => onView(c)} color="green">
                      <Eye size={16} />
                    </ActionBtn> */}

                    <ActionBtn onClick={() => onEdit(c)} color="blue">
                      <Edit size={16} />
                    </ActionBtn>

                    <ActionBtn onClick={() => onDelete(c)} color="red">
                      <Trash size={16} />
                    </ActionBtn>

                    {/* <ActionBtn onClick={() => onSend(c)} color="gray">
                      <Send size={16} />
                    </ActionBtn> */}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}


function ActionBtn({ children, onClick, color }) {
  const colors = {
    green: "bg-green-500 hover:bg-green-600",
    blue: "bg-blue-500 hover:bg-blue-600",
    red: "bg-red-500 hover:bg-red-600",
    gray: "bg-gray-500 hover:bg-gray-600",
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded text-white transition ${colors[color]}`}
    >
      {children}
    </button>
  );
}
