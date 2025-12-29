import { useEffect, useState } from "react";
import Modal from "./Modal";
import { toast } from "sonner";
import { bulkAddContactsToGroup } from "@/lib/group";

 function GroupAddContactModal({ token, group, onClose, onSuccess }) {
  const [contactIds, setContactIds] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

      useEffect(() => {
    const fetchContacts = async () => {
      const res = await fetchContacts(token);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      setContacts(res.data);
      setLoading(false);
    };

    fetchContacts();
  }, [token]);

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

  // return (
  //   <Modal title={`Add contacts to ${group.name}`} close={onClose}>
  //     {/* map contacts here */}
  //     <button
  //       onClick={handleAdd}
  //       className="w-full mt-4 bg-teal-600 text-white py-2 rounded-xl"
  //     >
  //       Add Contacts
  //     </button>
  //   </Modal>
  // );

    return (
    <Modal title={`Add contacts to ${group.name}`} close={onClose}>
      {loading ? (
        <p className="text-center text-gray-500">Loading contacts...</p>
      ) : contacts.length === 0 ? (
        <p className="text-center text-gray-500">No contacts found</p>
      ) : (
        <div className="max-h-64 overflow-y-auto space-y-2">
          {contacts.map((contact) => (
            <label
              key={contact.id}
              className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={contactIds.includes(contact.id)}
                onChange={() => toggle(contact.id)}
              />
              <div>
                <p className="font-medium">{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.email}</p>
              </div>
            </label>
          ))}
        </div>
      )}

      <button
        onClick={handleAdd}
        className="w-full mt-4 bg-teal-600 text-white py-2 rounded-xl disabled:opacity-50"
        disabled={contactIds.length === 0}
      >
        Add Contacts
      </button>
    </Modal>
  );
}



export default GroupAddContactModal;