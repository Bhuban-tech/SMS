import React from "react";

 function GroupSMS({ selectedGroup, setSelectedGroup, groups }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">Select Group</label>
      <select
        value={selectedGroup}
        onChange={(e) => setSelectedGroup(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500"
      >
        <option value="">--Choose a group--</option>
        {groups.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name} ({g.contactCount ?? 0} contacts)
          </option>
        ))}
      </select>
    </div>
  );
}
export default GroupSMS;