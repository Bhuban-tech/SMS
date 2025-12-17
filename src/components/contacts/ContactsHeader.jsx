import { Plus, Upload } from "lucide-react";

export default function ContactsHeader({
  searchTerm,
  setSearchTerm,
  onAdd,
  onUpload,
  fileInputRef,
}) {
  return (
    <div className="p-6  flex flex-col md:flex-row justify-end gap-3">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-48 px-3 py-2 border rounded-lg"
      />

      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg"
      >
        <Plus size={16} /> Add Contact
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={onUpload}
        hidden
      />

      <button
        onClick={() => fileInputRef.current.click()}
        className="px-3 py-2 border rounded"
      >
        <Upload size={16} />
      </button>
    </div>
  );
}
