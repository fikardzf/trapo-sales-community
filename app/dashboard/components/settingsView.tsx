// app/dashboard/components/settingsView.tsx

'use client';

import React, { useState } from 'react';
import { User } from '@/lib/dummyDb';
import Swal from 'sweetalert2';

interface SettingsViewProps {
  user: User;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user }) => {
  // State untuk form password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // State untuk form profil, hanya nomor HP yang bisa diubah
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);

  // State untuk kontrol visibilitas form (tetap independen)
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setPasswordError('Password must contain uppercase, lowercase, number, and special character');
      return;
    }
    
    Swal.fire({
      icon: 'success',
      title: 'Password Changed',
      text: 'Your password has been successfully updated.',
    });
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    Swal.fire({
      icon: 'success',
      title: 'Phone Number Updated',
      text: 'Your phone number has been successfully updated.',
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* --- UPDATE PERSONAL INFORMATION --- */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <button 
            onClick={() => setIsProfileFormOpen(!isProfileFormOpen)}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-xl font-semibold text-gray-800">Update Personal Information</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${isProfileFormOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className={`transition-all duration-500 ease-in-out ${isProfileFormOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <form onSubmit={handleProfileUpdate} className="p-6 space-y-4 border-t border-gray-100">
              {/* Field Read-Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={user.fullName} 
                  disabled 
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-900" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={user.email} 
                  disabled 
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-900" 
                />
              </div>
              
              {/* Field Editable */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900" 
                />
              </div>
              
              {/* Field Read-Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                <input 
                  type="text" 
                  value={user.instagram ? `@${user.instagram}` : 'Not connected'} 
                  disabled 
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-900" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TikTok</label>
                <input 
                  type="text" 
                  value={user.tiktok ? `@${user.tiktok}` : 'Not connected'} 
                  disabled 
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-900" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                <input 
                  type="text" 
                  value={user.facebook ? `@${user.facebook}` : 'Not connected'} 
                  disabled 
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-900" 
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Update Phone Number
              </button>
            </form>
          </div>
        </div>
        
        {/* --- CHANGE PASSWORD --- */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <button 
            onClick={() => setIsPasswordFormOpen(!isPasswordFormOpen)}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${isPasswordFormOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className={`transition-all duration-500 ease-in-out ${isPasswordFormOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <form onSubmit={handlePasswordChange} className="p-6 space-y-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900" 
                  required 
                />
              </div>
              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{passwordError}</p>
                </div>
              )}
              <button 
                type="submit" 
                className="w-full p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;