import { Search, Plus } from "lucide-react";

function GroupHeader({ searchTerm, setSearchTerm, openGroupModal }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
      {/* Search Input */}
      <div className="relative w-full sm:w-64">
         <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search group by Name....."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-2xl  px-12 py-3 pr-10 text-sm w-full shadow focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        {/* <Search className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" /> */}
      </div>

      {/* Add Group Button */}
      <button
        type="button"
        onClick={openGroupModal}
        className="w-full sm:w-auto px-5 py-2 bg-teal-500 text-white rounded-xl shadow flex items-center justify-center gap-2 hover:bg-teal-700 hover:cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add Group
      </button>
    </div>
  );
}

export default GroupHeader;
