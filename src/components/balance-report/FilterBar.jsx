import { Calendar, Filter, Upload } from "lucide-react";

export default function FilterBar({
  filterDate,
  filterType,
  onDateChange,
  onTypeChange,
}) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow">
        <Calendar className="w-5 h-5" />
        <input
          type="date"
          className="outline-none"
          value={filterDate}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow">
        <Filter className="w-5 h-5" />
        <select
          className="outline-none"
          value={filterType}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          <option value="">Filter by Type</option>
          <option value="bulk">Bulk SMS</option>
          <option value="group">Group SMS</option>
          <option value="single">Single SMS</option>
        </select>
      </div>

      <div className="ml-auto flex gap-3">
        <button className="bg-teal-600 px-4 py-2 text-white rounded-xl shadow hover:bg-teal-700">
          Load Balance
        </button>

        <button className="px-3 py-2 border rounded hover:bg-gray-100 shadow flex items-center gap-2">
          <Upload size={16} />
        </button>
      </div>
    </div>
  );
}
