"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, ArrowLeft, X } from 'lucide-react'; 
import InputField from '@/components/profile/InputField';
import PasswordInput from '@/components/profile/PasswordInput';
import { fetchProfile, updateProfile } from '@/lib/profile';

export default function Profile({ isModal = false, onClose = () => {} }) {
  const router = useRouter();

  const [adminId, setAdminId] = useState(null);
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  const isNewPasswordSet = newPassword || confirmPassword;
  const isNewPasswordValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]).{6,}$/.test(newPassword);
  const isConfirmPasswordValid = newPassword === confirmPassword;
  const isFormValid = !isNewPasswordSet || (currentPassword && isNewPasswordValid && isConfirmPasswordValid);

  useEffect(() => {
    const storedId = localStorage.getItem('adminId');
    if (!storedId) {
      if (isModal) onClose(); 
      else router.push('/login');
    } else {
      setAdminId(storedId);
    }
  }, [router, isModal, onClose]);

  useEffect(() => {
    if (!adminId) return;
    fetchProfile(adminId)
      .then((data) => setUsername(data.username || ''))
      .catch((err) => {
        console.error(err);
        setMessage('Failed to load profile');
        setMessageType('error');
      });
  }, [adminId]);

  // ── rest of your logic stays exactly the same ──

  const containerClass = isModal
    ? "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    : "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4";

  return (
    <div className={containerClass}>
      <div className="w-full max-w-2xl bg-gray-900 text-gray-100 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-gray-700">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-teal-700 shadow-md">
          <div className="flex items-center gap-4">
            {!isModal && (
              <button
                onClick={() => router.back()}
                className="text-white hover:text-gray-200 transition"
                aria-label="Back"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            )}
            {isModal && <div className="w-10" />} 
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
          </div>

          {isModal && (
            <button
              onClick={onClose}
              className="text-white hover:bg-white/10 p-1.5 rounded-full transition"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Form Body - added dark theme text colors */}
        <div className="p-6 sm:p-8 space-y-7 bg-gray-900 text-gray-100">
          {message && (
            <div
              className={`p-4 rounded-lg border ${
                messageType === 'success'
                  ? 'bg-green-900/40 text-green-100 border-green-700'
                  : 'bg-red-900/40 text-red-100 border-red-700'
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
            placeholder="Enter username"
          />

          <PasswordInput
            label="Current Password"
            value={currentPassword}
            setValue={setCurrentPassword}
            show={showCurrentPassword}
            setShow={setShowCurrentPassword}
            required={isNewPasswordSet}
          />

          <PasswordInput
            label="New Password"
            value={newPassword}
            setValue={setNewPassword}
            show={showNewPassword}
            setShow={setShowNewPassword}
            validate={true}
            errorMessage="Must be 6+ chars: letter, number, special char"
          />

          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            setValue={setConfirmPassword}
            show={showConfirmPassword}
            setShow={setShowConfirmPassword}
            validate={true}
            errorMessage={newPassword !== confirmPassword ? "Passwords do not match" : ""}
          />

          {(newPassword || confirmPassword) && !currentPassword && (
            <p className="text-red-400 text-sm -mt-2">
              Current password is required to change password
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || loading || !username.trim()}
              className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}