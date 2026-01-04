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

  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Allow only digits
    if (value.length > 10) value = value.slice(0, 10);

    setLocalData({ ...localData, mobile: value });

    let mobileError = false;
    let errorMessage = "";

    if (value.length === 0) {
      mobileError = true;
      errorMessage = "Mobile number is required";
    } else if (value.length < 10) {
  
      if (value.length >= 2 && !/^9[78]/.test(value)) {
 
        mobileError = true;
        errorMessage = "Must start with 97 or 98";
      } else {
        mobileError = true;
        errorMessage = "Must be 10 digits";
      }
    } else {
    
      if (!/^9[78]\d{8}$/.test(value)) {
        mobileError = true;
        errorMessage = "Must start with 97 or 98";
      }
      // Valid → no error
    }

    setErrors((prev) => ({
      ...prev,
      mobile: mobileError,
      mobileMessage: errorMessage,
    }));
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setLocalData({ ...localData, name: value });
    setErrors((prev) => ({
      ...prev,
      name: value.trim() === "" && value !== "",
    }));
  };

  const handleSave = () => {
    const trimmedName = localData.name?.trim();

    if (!trimmedName) {
      toast.error("Name field is required");
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

    if (!/^(97|98)\d{8}$/.test(localData.mobile)) {
      const msg =
        localData.mobile.length < 10
          ? "Must be 10 digits starting with 97 or 98"
          : "Must start with 97 or 98";

      toast.error("Invalid mobile number");
      setErrors((prev) => ({
        ...prev,
        mobile: true,
        mobileMessage: msg,
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
          <p className="mt-1 text-sm text-red-600">{errors.mobileMessage}</p>
        )}
      </div>

    
      <button
        onClick={handleSave}
        className="w-full bg-teal-500 text-white font-medium py-3 rounded-lg hover:bg-teal-600 transition-colors"
      >
        {isEdit ? "Update" : "Add"} Contact
      </button>
    </Modal>
  );
}