import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";

export default function ContactModal({
  open,
  close,
  initialData = { name: "", mobile: "" },
  editingId,
  onSave,
}) {
  const [localData, setLocalData] = useState(initialData);
  const [errors, setErrors] = useState({ name: false, mobile: false });

  const isEdit = !!editingId;

  useEffect(() => {
    setLocalData(initialData);
    setErrors({ name: false, mobile: false });
  }, [initialData]);

  if (!open) return null;

  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 10) value = value.slice(0, 10);

    if (value.length >= 2 && !value.startsWith("97") && !value.startsWith("98")) {
      return;
    }

    if (value.length === 1 && value !== "9") {
      value = "";
    }

    setLocalData({ ...localData, mobile: value });

    const isInvalid =
      value.length > 0 &&
      (value.length < 10 || (!value.startsWith("97") && !value.startsWith("98")));

    setErrors((prev) => ({ ...prev, mobile: isInvalid }));
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setLocalData({ ...localData, name: value });
    setErrors((prev) => ({ ...prev, name: value.trim() === "" && value !== "" }));
  };

  const handleSave = () => {
    const trimmedName = localData.name?.trim();

    if (!trimmedName || trimmedName === "") {
      toast.error("Name field is required");
      setErrors((prev) => ({ ...prev, name: true }));
      return;
    }

    if (localData.mobile.length === 0) {
      toast.error("Mobile number is required");
      setErrors((prev) => ({ ...prev, mobile: true }));
      return;
    }

    if (!/^(97|98)\d{8}$/.test(localData.mobile)) {
      toast.error("Mobile must be 10 digits and start with 97 or 98");
      setErrors((prev) => ({ ...prev, mobile: true }));
      return;
    }

    onSave({ name: trimmedName, mobile: localData.mobile });
    close();
  };

  return (
    <Modal title={isEdit ? "Edit Contact" : "Add Contact"} close={close}>
      {/* Name Field */}
      <div className="mb-4">
        <input
          placeholder="Name"
          value={localData.name || ""}
          onChange={handleNameChange}
          className={`w-full border px-4 py-3 rounded-lg transition-colors ${
            errors.name
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:ring-teal-500"
          } focus:outline-none focus:ring-2`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">Name is required</p>
        )}
      </div>

      {/* Mobile Field */}
      <div className="mb-6">
        <input
          placeholder="Phone Number (e.g. 9812345678)"
          value={localData.mobile || ""}
          onChange={handleMobileChange}
          inputMode="numeric"
          maxLength={10}
          className={`w-full border px-4 py-3 rounded-lg transition-colors ${
            errors.mobile
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:ring-teal-500"
          } focus:outline-none focus:ring-2`}
        />
        {errors.mobile && (
          <p className="mt-1 text-sm text-red-600">
            {localData.mobile.length === 0
              ? "Mobile number is required"
              : "Must be 10 digits starting with 97 or 98"}
          </p>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-teal-500 text-white font-medium py-3 rounded-lg hover:bg-teal-700 hover:cursor-pointer transition-colors"
      >
        {isEdit ? "Update" : "Add"} Contact
      </button>
    </Modal>
  );
}