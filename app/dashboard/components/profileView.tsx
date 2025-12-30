// app/dashboard/components/profileView.tsx

'use client'; // Tambahkan 'use client' karena menggunakan state dan event handler

import React, { useState } from 'react';
import { User } from '@/lib/dummyDb';
import Swal from 'sweetalert2'; // Import Swal untuk notifikasi

interface ProfileViewProps {
  user: User;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user }) => {
  // State untuk form update profil
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);

  const getStatusColor = () => {
    switch (user?.status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6 hidden md:block">Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-indigo-600">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          
          <div className="flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* --- KONTAINER PERSONAL INFORMATION --- */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Full Name</p>
                    <p className="font-medium text-gray-900">{user?.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email Address</p>
                    <p className="font-medium text-gray-900">{user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone Number</p>
                    <p className="font-medium text-gray-900">{user?.countryCode} {user?.phoneNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Account Status</p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
                        {user?.status?.charAt(0).toUpperCase() + user?.status?.slice(1) || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media</h3>
                <div className="space-y-3">
                  {user?.instagram && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Instagram</p>
                      <p className="font-medium text-gray-900">@{user.instagram}</p>
                    </div>
                  )}
                  {user?.tiktok && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">TikTok</p>
                      <p className="font-medium text-gray-900">@{user.tiktok}</p>
                    </div>
                  )}
                  {user?.facebook && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Facebook</p>
                      <p className="font-medium text-gray-900">@{user.facebook}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* --- NOTIFIKASI STATUS --- */}
            {user?.status === 'pending' && (
              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-800">
                      Your account is currently pending approval. You'll receive full access once an administrator reviews and approves your registration.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {user?.status === 'rejected' && (
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      Your registration has been rejected. Please contact support for more information.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- KONTAINER UPDATE PERSONAL INFORMATION (BARU) --- */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <button 
            onClick={() => setIsProfileFormOpen(!isProfileFormOpen)}
            className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {isProfileFormOpen ? 'Cancel Update' : 'Update Personal Information'}
          </button>

          <div className={`transition-all duration-500 ease-in-out ${isProfileFormOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900" 
                />
              </div>
              <button 
                type="submit" 
                className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;