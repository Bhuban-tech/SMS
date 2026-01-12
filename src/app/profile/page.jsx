"use client";

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

    try {
      const payload = { username };

      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await updateProfile(adminId, payload);
      setMessage(res.message || "Profile updated");
      setMessageType("success");

      setTimeout(() => isModal && onClose(), 1200);
    } catch (err) {
      setMessage(err.message || "Update failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        isModal
          ? "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          : "min-h-screen bg-slate-100 flex items-center justify-center"
      }`}
    >
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
        {initialLoading ? (
          <div className="p-10 text-center text-gray-600">
            Loading profile...
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center bg-teal-600 px-6 py-4">
              <div className="flex items-center gap-3">
                {!isModal && (
                  <button onClick={() => router.back()}>
                    <ArrowLeft className="text-white" />
                  </button>
                )}
                <h2 className="text-white text-xl font-bold">Edit Profile</h2>
              </div>

              {isModal && (
                <button onClick={onClose}>
                  <X className="text-white" />
                </button>
              )}
            </div>

            <div className="p-6 space-y-5">
              {message && (
                <div
                  className={`p-3 rounded ${
                    messageType === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
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
              />

              <PasswordInput
                label="Current Password"
                value={currentPassword}
                setValue={setCurrentPassword}
              />

              <PasswordInput
                label="New Password"
                value={newPassword}
                setValue={setNewPassword}
              />

              <PasswordInput
                label="Confirm New Password"
                value={confirmPassword}
                setValue={setConfirmPassword}
              />

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 hover:cursor-pointer"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={isModal ? onClose : () => router.back()}
                  className="flex-1 bg-gray-300 rounded-lg py-3 hover:bg-gray-500 hover:cursor-pointer"
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
