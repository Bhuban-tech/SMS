import { Cross, Trash2 } from "lucide-react";
import Modal from "./Modal";

function GroupViewModal({ group, contacts = [], onClose, onRemoveContact }) {
  return (
    <Modal title={`Contacts in ${group.name}`} close={onClose}>
      {contacts.length === 0 ? (
        <p className="text-center text-gray-500">No contacts</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {contacts.map((c) => (
            <li
              key={c.id}
              className="border p-3 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-gray-500">{c.phoneNo}</p>
              </div>

             
              <button
                onClick={() => onRemoveContact(group.id, c.id)}
                className="text-red-500 hover:text-red-700"
                title="Remove contact"
              >
                <Trash2 />
              </button>

            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

export default GroupViewModal;
