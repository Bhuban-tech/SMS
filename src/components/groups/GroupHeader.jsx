import { Search, Plus } from "lucide-react";

function GroupHeader({ searchTerm, setSearchTerm, openGroupModal }) {
  return (
    <div className="flex justify-between items-center">
      <div className="relative w-64">
        <input
          type="text"
          placeholder="Search group..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 pr-10 text-sm w-full shadow"
        />
        <Search className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
      </div>

      <button
        type="button"
        onClick={openGroupModal}
        className="px-5 py-2 bg-teal-600 text-white rounded-xl shadow flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Group
      </button>
    </div>
  );
}

export default GroupHeader;
