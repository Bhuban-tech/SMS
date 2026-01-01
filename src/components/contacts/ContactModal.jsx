import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";

export default function ContactModal({ open, close, data, setData, onSave, isEdit }) {
  const [isInvalid, setIsInvalid] = useState(false);

  if (!open) return null;

  const handleMobileChange = (e) => {
    let value = e.target.value;

    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    // Max 10 digits
    if (value.length > 10) return;

    // Strict prefix enforcement
    if (value.length === 1) {
      // First digit must be 9
      if (value !== "9") return;
    }

    if (value.length === 2) {
      // Second digit must be 7 or 8
      if (!value.startsWith("97") && !value.startsWith("98")) return;
    }

    setData({ ...data, mobile: value });

    // Safety: if somehow invalid (like paste), show red
    setIsInvalid(value.length >= 2 && !value.startsWith("97") && !value.startsWith("98"));
  };

  const handleSave = () => {
    const mobile = data.mobile;

    if (!/^(97|98)\d{8}$/.test(mobile)) {
      toast.error("Mobile number must start with 97 or 98 and be 10 digits");
      return;
    }

    onSave();
  };

  return (
    <Modal title={isEdit ? "Edit Contact" : "Add Contact"} close={close}>
      <input
        placeholder="Name"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        className="w-full border px-3 py-2 rounded mb-4"
      />

      <input
        placeholder="Mobile"
        value={data.mobile}
        onChange={handleMobileChange}
        inputMode="numeric"
        className={`w-full border px-3 py-2 rounded mb-4 ${
          isInvalid ? "text-red-500" : "text-black"
        }`}
      />

      <button
        onClick={handleSave}
        className="w-full bg-teal-500 text-white py-2 rounded"
      >
        Save
      </button>
    </Modal>
  );
}
