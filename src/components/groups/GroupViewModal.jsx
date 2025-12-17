import { Group } from "lucide-react";
import Modal from "./Modal";

function GroupViewModal({ group, contacts, onClose }) {
  return (
    <Modal title={`Contacts in ${group.name}`} close={onClose}>
      {contacts.length === 0 ? (
        <p className="text-center text-gray-500">No contacts</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {contacts.map((c) => (
            <li key={c.id} className="border p-2 rounded-lg">
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-gray-500">{c.phoneNo}</p>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

export default GroupViewModal;
