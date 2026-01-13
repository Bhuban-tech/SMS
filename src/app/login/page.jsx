// Profile.jsx (main profile component)
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { User, ArrowLeft, X } from "lucide-react";
import InputField from "@/components/profile/InputField";
import PasswordInput from "@/components/profile/PasswordInput";
import { fetchProfile, updateProfile } from "@/lib/profile";

export default function Profile({ isModal = false, onClose }) {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const adminId = user?.id;

  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (!adminId) return;

    setInitialLoading(true);
    fetchProfile(adminId)
      .then((res) => setUsername(res.username || ""))
      .catch(() => {
        setMessage("Failed to load profile");
        setMessageType("error");
      })
      .finally(() => setInitialLoading(false));
  }, [adminId]);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    if (!username.trim()) {
      setMessage("Username is required");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const payload = { username };

      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await updateProfile(adminId, payload);
      setMessage(res.message || "Profile updated successfully");
      setMessageType("success");

      setTimeout(() => {
        if (isModal && onClose) onClose();
      }, 1400);
    } catch (err) {
      setMessage(err.message || "Update failed. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        isModal
          ? "w-full h-full"
          : "min-h-screen bg-slate-50/50 flex items-center justify-center p-4 sm:p-6"
      }`}
    >
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
        {initialLoading ? (
          <div className="p-10 sm:p-12 text-center text-gray-600 text-lg">
            Loading profile...
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-teal-600 px-5 sm:px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                {!isModal && (
                  <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 rounded-full hover:bg-teal-700/30"
                  >
                    <ArrowLeft className="text-white h-5 w-5" />
                  </button>
                )}
                <h2 className="text-white text-lg sm:text-xl font-bold">
                  Edit Profile
                </h2>
              </div>

              {isModal && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-teal-700/30"
                >
                  <X className="text-white h-5 w-5" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
              {message && (
                <div
                  className={`p-3.5 rounded-lg text-sm sm:text-base ${
                    messageType === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}

              <InputField
                label="Username"
                value={username}
                setValue={setUsername}
                Icon={User}
                placeholder="Your username"
              />

              <PasswordInput
                label="Current Password"
                value={currentPassword}
                setValue={setCurrentPassword}
                show={showCurrent}
                setShow={setShowCurrent}
              />

              <PasswordInput
                label="New Password"
                value={newPassword}
                setValue={setNewPassword}
                show={showNew}
                setShow={setShowNew}
              />

              <PasswordInput
                label="Confirm New Password"
                value={confirmPassword}
                setValue={setConfirmPassword}
                show={showConfirm}
                setShow={setShowConfirm}
              />

              <div className="flex flex-col sm:flex-row gap-4 pt-4 sm:pt-6">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`
                    flex-1 py-3.5 sm:py-3 px-6 
                    bg-teal-600 text-white font-medium 
                    rounded-lg hover:bg-teal-700 
                    disabled:bg-teal-400 disabled:cursor-not-allowed
                    transition-all active:scale-[0.98]
                    text-base sm:text-[15px]
                  `}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={isModal ? onClose : () => router.back()}
                  className={`
                    flex-1 py-3.5 sm:py-3 px-6 
                    bg-gray-200 text-gray-800 font-medium 
                    rounded-lg hover:bg-gray-300 
                    transition-all active:scale-[0.98]
                    text-base sm:text-[15px]
                  `}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}