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
  const [errors, setErrors] = useState({
    name: false,
    mobile: false,
    mobileMessage: "",
  });

  const isEdit = !!editingId;

  useEffect(() => {
    setLocalData(initialData);
    setErrors({ name: false, mobile: false, mobileMessage: "" });
  }, [initialData]);

  if (!open) return null;


  const handleNameChange = (e) => {
    const value = e.target.value;

    if (value.length > 0) {
      const firstChar = value[0];
      if (!/[A-Za-z]/.test(firstChar)) {
        return; 
      }
    }


    if (value.length > 1 && /[^A-Za-z0-9\s'-]/.test(value)) {
      return; 
    }

    setLocalData({ ...localData, name: value });

    setErrors((prev) => ({
      ...prev,
      name: value.trim() === "" && value.length > 0,
    }));
  };

  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 10) value = value.slice(0, 10);

    setLocalData({ ...localData, mobile: value });

    let mobileError = false;
    let errorMessage = "";

    if (value.length === 0) {
      mobileError = true;
      errorMessage = "Mobile number is required";
    } else if (value.length === 1) {
      if (value !== "9") {
        mobileError = true;
        errorMessage = "Must start with 9";
      }
    } else if (value.length === 2) {
      if (!/^9[78]$/.test(value)) {
        mobileError = true;
        errorMessage = "Second digit must be 7 or 8";
      }
    } else if (value.length < 10) {
      mobileError = true;
      errorMessage = `Complete 10 digits (${10 - value.length} left)`;
    } else if (value.length === 10) {
      if (!/^9[78]\d{8}$/.test(value)) {
        mobileError = true;
        errorMessage = "Invalid number - must start with 97 or 98";
      }
    }

    setErrors((prev) => ({
      ...prev,
      mobile: mobileError,
      mobileMessage: errorMessage,
    }));
  };

  const handleSave = () => {
    const trimmedName = localData.name?.trim();

    if (!trimmedName) {
      toast.error("Name is required");
      setErrors((prev) => ({ ...prev, name: true }));
      return;
    }

    if (!/^[A-Za-z]/.test(trimmedName)) {
      toast.error("Name must start with a letter");
      setErrors((prev) => ({ ...prev, name: true }));
      return;
    }

    if (localData.mobile.length === 0) {
      toast.error("Mobile number is required");
      setErrors((prev) => ({
        ...prev,
        mobile: true,
        mobileMessage: "Mobile number is required",
      }));
      return;
    }

    if (!/^9[78]\d{8}$/.test(localData.mobile)) {
      toast.error("Invalid mobile number");
      setErrors((prev) => ({
        ...prev,
        mobile: true,
        mobileMessage:
          localData.mobile.length < 10
            ? "Must be 10 digits starting with 97/98"
            : "Must start with 97 or 98",
      }));
      return;
    }

    onSave({ name: trimmedName, mobile: localData.mobile });
    close();
  };

  return (
    <Modal title={isEdit ? "Edit Contact" : "Add Contact"} close={close}>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Full Name"
          value={localData.name || ""}
          onChange={handleNameChange}
          className={`w-full border px-4 py-3 rounded-lg transition-colors ${
            errors.name
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:ring-teal-500"
          } focus:outline-none focus:ring-2`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">
            Name is required and must start with a letter
          </p>
        )}
      </div>

      <div className="mb-6">
        <input
          placeholder="9812345678"
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
        {errors.mobile && errors.mobileMessage && (
          <p className="mt-1 text-sm text-red-600">{errors.mobileMessage}</p>
        )}
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-teal-500 text-white font-medium py-3 rounded-lg hover:bg-teal-700 transition-colors"
      >
        {isEdit ? "Update" : "Add"} Contact
      </button>
    </Modal>
  );
}