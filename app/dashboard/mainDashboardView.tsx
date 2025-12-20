// app/dashboard/components/mainDashboardView.tsx

import React from 'react';
import { User } from '@/lib/dummyDb';

interface MainDashboardViewProps {
  user: User;
}

const MainDashboardView: React.FC<MainDashboardViewProps> = ({ user }) => {
  // Cek apakah user statusnya pending
  const isPending = user.status === 'pending';

  return (
    <div className="p-8">
      {/* Notification for pending users */}
      {isPending && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your registration is currently under review. Your account status is <span className="font-semibold">pending</span>. You'll have full access once your account is approved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user.fullName}! Here's what's happening in the community today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm">Total Members</p>
            <p className="text-2xl font-bold text-gray-900">152</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="p-3 bg-green-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm">New This Month</p>
            <p className="text-2xl font-bold text-gray-900">28</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Announcements */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Community Announcements</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-4">
              <p className="font-semibold text-gray-900">New Product Launch!</p>
              <p className="text-sm text-gray-600">We are excited to announce the launch of our new TRAPO product line.</p>
              <p className="text-xs text-gray-400 mt-1">2 days ago</p>
            </div>
            <div className="border-l-4 border-gray-300 pl-4">
              <p className="font-semibold text-gray-900">Community Meetup</p>
              <p className="text-sm text-gray-600">Join us for our monthly online meetup this Friday.</p>
              <p className="text-xs text-gray-400 mt-1">5 days ago</p>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
              <p className="font-medium text-gray-900">Update Profile Information</p>
            </button>
            <button className="w-full text-left p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
              <p className="font-medium text-gray-900">View Sales Resources</p>
            </button>
            <button className="w-full text-left p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
              <p className="font-medium text-gray-900">Contact Support</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboardView;