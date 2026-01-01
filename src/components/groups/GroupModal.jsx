import React, { useState } from "react";
import { toast } from "sonner";
import Modal from "./Modal";
import { createGroup, updateGroup } from "@/lib/group";

function GroupModal({ group, token, onClose, onSuccess }) {
  const [name, setName] = useState(group?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return toast.error("Please enter group name");
    setLoading(true);
    try {
      const result = group
        ? await updateGroup(token, group.id, name)
        : await createGroup(token, name);
      if (!result.success) return toast.error(result.message || "Failed");
      toast.success(group ? "Group updated!" : "Group created!");
      onSuccess();
      onClose();
    } catch {
      toast.error("Error saving group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={group ? "Edit Group" : "Add New Group"} close={onClose}>
      <input
        type="text"
        placeholder="Group Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
      />
      <button
        onClick={handleSave}
        disabled={loading}
        className={`w-full mt-4 py-2 text-white rounded-xl shadow ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700 hover:cursor-pointer"
        }`}
      >
        {loading ? "Saving..." : group ? "Save Changes" : "Add Group"}
      </button>
    </Modal>
  );
}
 export default GroupModal;