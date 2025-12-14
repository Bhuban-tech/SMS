import { Eye, Edit, Trash, Send } from "lucide-react";

export default function ContactsTable({
  contacts,
  loading,
  onView,
  onEdit,
  onDelete,
  onSend,
}) {
  if (loading) {
    return <p className="p-12 text-center">Loading contacts...</p>;
  }

  if (!contacts.length) {
    return <p className="p-12 text-center">No contacts found.</p>;
  }

  return (
    <table className="w-full text-sm text-center">
      <thead className="bg-teal-700 text-white">
        <tr>
          <th className="p-3">#</th>
          <th className="p-3">Name</th>
          <th className="p-3">Mobile</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((c, i) => (
          <tr key={c.id} className={i % 2 ? "bg-gray-100" : ""}>
            <td>{i + 1}</td>
            <td>{c.name}</td>
            <td>{c.mobile}</td>
            <td className="flex justify-center gap-2 p-2">
              <button onClick={() => onView(c)}><Eye size={16} /></button>
              <button onClick={() => onEdit(c)}><Edit size={16} /></button>
              <button onClick={() => onDelete(c)}><Trash size={16} /></button>
              <button onClick={() => onSend(c)}><Send size={16} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
