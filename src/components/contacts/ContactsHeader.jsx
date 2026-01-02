import { Plus, Upload } from "lucide-react";

export default function ContactsHeader({
  searchTerm,
  setSearchTerm,
  onAdd,
  onUpload,
  fileInputRef,
}) {
  return (
    <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
 
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
      />

      
      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-700 hover:cursor-pointer transition-colors whitespace-nowrap "
        >
          <Plus size={16} />
          Add Contact
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={onUpload}
          hidden
        />

        
      </div>
    </div>
  );
}