// app/dashboard/components/settingsView.tsx

'use client';

import React, { useState, ChangeEvent } from 'react';
import { User } from '@/lib/dummyDb';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from "react-icons/fa6";

interface SettingsViewProps {
  user: User;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user }) => {
  // State untuk form password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // State untuk kontrol visibilitas form password
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);

  // --- STATE UNTUK VISIBILITAS PASSWORD ---
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // --- STATE UNTUK TRACKING FOKUS FIELD ---
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // --- STATE UNTUK VALIDASI PASSWORD ---
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  // --- FUNGSI UNTUK TOGGLE PASSWORD ---
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // --- FUNGSI UNTUK HANDLE FOKUS ---
  const handleFocus = (field: string) => setFocusedField(field);
  const handleBlur = () => setFocusedField(null);

  // --- FUNGSI UNTUK VALIDASI PASSWORD BARU ---
  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setHasUppercase(/[A-Z]/.test(value));
    setHasLowercase(/[a-z]/.test(value));
    setHasNumber(/[0-9]/.test(value));
    setHasSpecialChar(/[^A-Za-z0-9]/.test(value));
  };
  
  // --- FUNGSI BARU UNTUK HANDLE KONFIRMASI PASSWORD ---
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

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

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      setPasswordError('Password must contain uppercase, lowercase, number, and special character');
      return;
    }
    
    Swal.fire({
      icon: 'success',
      title: 'Password Changed',
      text: 'Your password has been successfully updated.',
    });
    
    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setHasUppercase(false);
    setHasLowercase(false);
    setHasNumber(false);
    setHasSpecialChar(false);
    setIsPasswordFormOpen(false);
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 hidden md:block">Settings</h1>
        
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
              
              {/* Field Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input 
                    type={showPasswords.current ? 'text' : 'password'} 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    onFocus={() => handleFocus('current')}
                    onBlur={handleBlur}
                    className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-left" 
                    required 
                  />
                  {focusedField === 'current' && (
                    <button
                      type="button"
                      onMouseDown={() => togglePasswordVisibility('current')}
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.current ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Field New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input 
                    type={showPasswords.new ? 'text' : 'password'} 
                    value={newPassword} 
                    onChange={handleNewPasswordChange}
                    onFocus={() => handleFocus('new')}
                    onBlur={handleBlur}
                    className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-left" 
                    required 
                  />
                  {focusedField === 'new' && (
                    <button
                      type="button"
                      onMouseDown={() => togglePasswordVisibility('new')}
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.new ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Field Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showPasswords.confirm ? 'text' : 'password'} 
                    value={confirmPassword} 
                    onChange={handleConfirmPasswordChange} // Menggunakan fungsi baru
                    onFocus={() => handleFocus('confirm')}
                    onBlur={handleBlur}
                    className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-left" 
                    required 
                  />
                  {focusedField === 'confirm' && (
                    <button
                      type="button"
                      onMouseDown={() => togglePasswordVisibility('confirm')}
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.confirm ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* --- PERUBAHAN LOGIKA INDICATOR --- */}
              {newPassword && (
                <p className={`mt-2 text-xs transition-colors duration-300 ${
                  // HIJAU: Jika password kuat DAN cocok
                  newPassword.length >= 8 && hasUppercase && hasLowercase && hasNumber && hasSpecialChar && newPassword === confirmPassword
                    ? 'text-green-600' 
                    // MERAH: Jika password tidak cocok (dan field confirm sudah diisi)
                    : confirmPassword && newPassword !== confirmPassword
                      ? 'text-red-500'
                      // ABU-ABU: Default
                      : 'text-gray-400'
                }`}>
                  {
                    // HIJAU
                    newPassword.length >= 8 && hasUppercase && hasLowercase && hasNumber && hasSpecialChar && newPassword === confirmPassword
                      ? 'Passwords match and are strong.'
                      // MERAH
                      : confirmPassword && newPassword !== confirmPassword
                        ? 'Passwords do not match.'
                        // ABU-ABU
                        : 'Create a strong password using a mix of uppercase and lowercase letters, numbers, and special characters.'
                  }
                </p>
              )}

              {/* Error Message & Button */}
              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{passwordError}</p>
                </div>
              )}
              <button 
                type="submit" 
                className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
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