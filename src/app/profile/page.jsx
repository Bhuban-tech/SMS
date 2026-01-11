"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, ArrowLeft, X } from 'lucide-react'; // Added X for close button
import InputField from '@/components/profile/InputField';
import PasswordInput from '@/components/profile/PasswordInput';
import { fetchProfile, updateProfile } from '@/lib/profile';

export default function Profile({ isModal = false, onClose = () => {} }) {
  // onClose prop allows closing when used as modal
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
      if (isModal) onClose(); // if modal and no login → just close
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

  const handleSubmit = async () => {
    setMessage('');
    setLoading(true);

    if (!username.trim()) {
      setMessage('Username is required');
      setMessageType('error');
      setLoading(false);
      return;
    }

    if (isNewPasswordSet && !currentPassword) {
      setMessage('Current password is required to change password');
      setMessageType('error');
      setLoading(false);
      return;
    }

    if (newPassword && !isNewPasswordValid) {
      setMessage('New password must be at least 6 characters with letter, number, and special character');
      setMessageType('error');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      setMessageType('error');
      setLoading(false);
      return;
    }

    const payload = { username: username.trim() };
    if (currentPassword && newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    try {
      const result = await updateProfile(adminId, payload);
      setMessage(result.message || 'Profile updated successfully');
      setMessageType('success');
      resetPasswords();

      setTimeout(() => {
        if (isModal) {
          onClose(); // Just close modal if used as popup
        } else {
          // Optional: logout and redirect only on full page
          // localStorage.removeItem('adminId');
          // router.push('/login');
        }
      }, 1500);
    } catch (err) {
      setMessage(err.message || 'Failed to update profile');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const resetPasswords = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleCancel = () => {
    resetPasswords();
    setMessage('');
    if (adminId) {
      fetchProfile(adminId).then((data) => setUsername(data.username || ''));
    }
    if (isModal) onClose();
  };

  if (!adminId) {
    return isModal ? null : (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  // Main container – changes based on modal or full page
  const containerClass = isModal
    ? "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    : "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4";

  return (
    <div className={containerClass}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-teal-600">
          <div className="flex items-center gap-4">
            {/* Back button only on full page */}
            {!isModal && (
              <button
                onClick={() => router.back()}
                className="text-white hover:text-gray-200 transition"
                aria-label="Back"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            )}
            {isModal && <div className="w-10" />} {/* Spacer for alignment */}
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
          </div>

          {/* Close button only in modal */}
          {isModal && (
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          {message && (
            <div
              className={`p-4 rounded-lg border ${
                messageType === 'success'
                  ? 'bg-green-50 text-green-800 border-green-200'
                  : 'bg-red-50 text-red-800 border-red-200'
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
            <p className="text-red-600 text-sm -mt-4">
              Current password is required to change password
            </p>
          )}

          <div className="flex gap-4 pt-6">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || loading || !username.trim()}
              className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}