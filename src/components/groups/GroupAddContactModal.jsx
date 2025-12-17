import { useEffect, useState } from "react";
import Modal from "./Modal";
import { toast } from "sonner";
import { bulkAddContactsToGroup } from "@/lib/group";

 function GroupAddContactModal({ token, group, onClose, onSuccess }) {
  const [contactIds, setContactIds] = useState([]);

  const toggle = (id) => {
    setContactIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAdd = async () => {
    if (contactIds.length === 0)
      return toast.error("Select at least one contact");

    const res = await bulkAddContactsToGroup(token, group.id, contactIds);
    if (!res.success) return toast.error(res.message);

    toast.success("Contacts added");
    onSuccess();
    onClose();
  };

  return (
    <Modal title={`Add contacts to ${group.name}`} close={onClose}>
      {/* map contacts here */}
      <button
        onClick={handleAdd}
        className="w-full mt-4 bg-teal-600 text-white py-2 rounded-xl"
      >
        Add Contacts
      </button>
    </Modal>
  );
}

export default GroupAddContactModal;