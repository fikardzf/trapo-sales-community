// components/dashboard/SettingsView.tsx
'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import { useToggle } from '@/hooks/useToggle';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Swal from 'sweetalert2';

interface SettingsViewProps {
  user: User;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user }) => {
  // State untuk form password (menggunakan aturan baru)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // State untuk form profil
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);

  // State untuk kontrol visibilitas form
  const [isProfileFormOpen, toggleProfileForm] = useToggle(false);
  const [isPasswordFormOpen, togglePasswordForm] = useToggle(false);

  // Fungsi validasi password yang sama dengan di halaman login
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setHasUppercase(/[A-Z]/.test(value));
    setHasLowercase(/[a-z]/.test(value));
    setHasNumber(/[0-9]/.test(value));
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(value));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }
    
    if (newPassword.length < 8 || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      setPasswordError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
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

  const handleProfileSubmit = async (e: React.FormEvent) => {
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
            onClick={toggleProfileForm}
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
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-4 border-t border-gray-100">
              {/* Field Read-Only */}
              <Input label="Full Name" value={user.fullName} disabled className="bg-gray-100 cursor-not-allowed" />
              <Input label="Email Address" value={user.email} disabled className="bg-gray-100 cursor-not-allowed" />
              
              {/* Field Editable */}
              <Input
                type="tel"
                label="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              
              {/* Field Read-Only */}
              <Input
                label="Instagram"
                value={user.instagram ? `@${user.instagram}` : 'Not connected'}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
              <Input
                label="TikTok"
                value={user.tiktok ? `@${user.tiktok}` : 'Not connected'}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
              <Input
                label="Facebook"
                value={user.facebook ? `@${user.facebook}` : 'Not connected'}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
              
              <Button type="submit" className="w-full">
                Update Phone Number
              </Button>
            </form>
          </div>
        </div>
        
        {/* --- CHANGE PASSWORD --- */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <button 
            onClick={togglePasswordForm}
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
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4 border-t border-gray-100">
              <Input
                type="password"
                label="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                label="New Password"
                value={newPassword}
                onChange={handlePasswordChange}
                required
              />
              <Input
                type="password"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{passwordError}</p>
                </div>
              )}
              <div className="mt-2 text-xs space-y-1">
                <div className={`flex items-center ${newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{newPassword.length >= 8 ? '✓' : '○'}</span><span>At least 8 characters</span></div>
                <div className={`flex items-center ${hasUppercase ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{hasUppercase ? '✓' : '○'}</span><span>One uppercase letter</span></div>
                <div className={`flex items-center ${hasLowercase ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{hasLowercase ? '✓' : '○'}</span><span>One lowercase letter</span></div>
                <div className={`flex items-center ${hasNumber ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{hasNumber ? '✓' : '○'}</span><span>One number</span></div>
                <div className={`flex items-center ${hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}><span className="mr-1">{hasSpecialChar ? '✓' : '○'}</span><span>One special character</span></div>
              </div>
              <Button type="submit" className="w-full">
                Change Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;