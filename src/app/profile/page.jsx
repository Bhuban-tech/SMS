'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, ArrowLeft } from 'lucide-react';
import InputField from '@/components/profile/InputField';
import PasswordInput from '@/components/profile/PasswordInput';
import { fetchProfile, updateProfile } from '@/lib/profile';

export default function Profile({ isModal = false }) {
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
  const [showProfileModal, setShowProfileModal] = useState(true);

  useEffect(() => {
    const storedId = localStorage.getItem('adminId');
    if (!storedId) router.push('/login');
    else setAdminId(storedId);
  }, [router]);

  useEffect(() => {
    if (!adminId) return;
    fetchProfile(adminId)
      .then((data) => setUsername(data.username))
      .catch((err) => {
        console.error(err);
        setMessage('Failed to load profile');
        setMessageType('error');
      });
  }, [adminId]);

  const handleSubmit = async () => {
    setMessage('');
    setLoading(true);
    setShowProfileModal(false)

    // if (!username.trim()) return setError('Username is required');

    // if (currentPassword || newPassword || confirmPassword) {
    //   if (!currentPassword) return setError('Current password is required');
    //   if (newPassword.length < 8) return setError('New password must be at least 8 characters');
    //   if (newPassword !== confirmPassword) return setError('Passwords do not match');
    // }

    if (!username.trim()) return setError('Username is required');


if (!currentPassword) {
  return setError('Current password is required');
}


if (newPassword || confirmPassword) {
  if (newPassword.length < 8)
    return setError('New password must be at least 8 characters');
  if (newPassword !== confirmPassword)
    return setError('Passwords do not match');
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
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Failed to update profile');
      setMessageType('error');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 6000);
      
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
    if (adminId) fetchProfile(adminId).then(data => setUsername(data.username || ''));
  };

  const setError = (msg) => {
    setMessage(msg);
    setMessageType('error');
    setLoading(false);
  };

  if (!adminId) return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;

  return (
    <div className={`${isModal ? 'bg-transparent' : 'min-h-screen bg-linear-to-br from-slate-50 to-slate-100'} flex items-center justify-center p-4`}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center gap-4 px-6 py-4 bg-teal-600">
          <button onClick={() => router.back()} className="text-white hover:text-gray-200 transition cursor-pointer" aria-label="Back">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
        </div>

        <div className="p-8 space-y-6">
          {message && <div className={`p-4 rounded-lg border ${messageType === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>{message}</div>}

          <InputField label="Username" value={username} setValue={setUsername} Icon={User} placeholder="Enter username" />
          <PasswordInput label="Current Password" value={currentPassword} setValue={setCurrentPassword} show={showCurrentPassword} setShow={setShowCurrentPassword} />
          <PasswordInput label="New Password" value={newPassword} setValue={setNewPassword} show={showNewPassword} setShow={setShowNewPassword} />
          <PasswordInput label="Confirm New Password" value={confirmPassword} setValue={setConfirmPassword} show={showConfirmPassword} setShow={setShowConfirmPassword} />

          <div className="flex gap-4 pt-6">
            <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 hover:cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed transition">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={handleCancel} disabled={loading} className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 hover:cursor-pointer transition">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
