// app/dashboard/components/mainDashboardView.tsx

'use client';

import React from 'react';
import { User } from '@/lib/dummyDb';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// Import Icon fa6
import { FaUserGroup, FaUserPlus } from "react-icons/fa6";

interface MainDashboardViewProps {
  user: User;
}

const MainDashboardView: React.FC<MainDashboardViewProps> = ({ user }) => {
  const isPending = user.status === 'pending';

  // --- MOCK DATA ---
  const totalMembers = 152;
  const newThisMonth = 28;
  const totalMembersLastMonth = 135; 
  const newLastMonth = 25;

  const memberGrowthData = [
    { month: 'Jan', members: 40 },
    { month: 'Feb', members: 80 },
    { month: 'Mar', members: 120 },
    { month: 'Apr', members: 160 },
    { month: 'May', members: 180 },
    { month: 'Jun', members: 152 },
  ];

  const calculateTrend = (current: number, last: number) => {
    if (last === 0) return { percentage: 0, isPositive: true };
    const percentage = ((current - last) / last) * 100;
    return {
      percentage: Math.abs(percentage).toFixed(1),
      isPositive: current >= last
    };
  };

  const totalMembersTrend = calculateTrend(totalMembers, totalMembersLastMonth);
  const newThisMonthTrend = calculateTrend(newThisMonth, newLastMonth);

  const TrendArrow = ({ isPositive }: { isPositive: boolean }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={`h-3 w-3 inline-block mr-1 text-gray-400 md:text-gray-500`} 
      fill="none" viewBox="0 0 24 24" stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isPositive ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
    </svg>
  );

  return (
    <div className="px-4 py-4 md:px-8 md:py-8">
      {/* Notification */}
      {isPending && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98L5.58 9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs md:text-sm text-yellow-700">Your account status is <span className="font-semibold">pending</span>.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 hidden md:block">Dashboard</h1>
        <p className="text-gray-600 text-sm md:text-base mt-1">
          Welcome back, {user.fullName}! Here's what's happening.
        </p>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-2 gap-2 mb-4 md:grid-cols-2 md:gap-6 md:mb-6">
        
        {/* CARD 1: TOTAL MEMBERS */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm md:shadow-md p-2 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between h-full">
          
          {/* --- MOBILE CONTENT --- */}
          <div className="md:hidden w-full flex flex-col gap-1 mb-2 justify-between">
            {/* Atas: Icon + Label | Trend */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* --- ICON (FA6) --- */}
                <div className="p-1 bg-blue-50 rounded-lg mr-1">
                  <FaUserGroup className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-[10px] font-semibold text-gray-600">Total</p>
              </div>
              <div className="flex items-center">
                <TrendArrow isPositive={totalMembersTrend.isPositive} />
                {/* --- PRESENTASE HIJAU (text-green-600) --- */}
                <span className="text-[8px] font-medium ml-1 text-green-600">{totalMembersTrend.percentage}%</span>
              </div>
            </div>
            {/* Bawah: Angka */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 leading-none">{totalMembers}</h3>
            </div>
          </div>

          {/* --- DESKTOP CONTENT --- */}
          <div className="hidden md:flex items-center w-full">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                 {/* --- ICON (FA6) --- */}
                 <FaUserGroup className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                 <p className="text-sm text-gray-500">Total Members</p>
                 <p className="text-2xl md:text-3xl font-bold text-gray-900">{totalMembers}</p>
              </div>
            </div>
            <div className="text-right">
              <TrendArrow isPositive={totalMembersTrend.isPositive} />
              <span className="text-sm font-medium ml-1 text-gray-400">{totalMembersTrend.percentage}% vs last month</span>
            </div>
          </div>
        </div>

        {/* CARD 2: NEW THIS MONTH */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm md:shadow-md p-2 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between h-full">
           
           {/* --- MOBILE CONTENT --- */}
           <div className="md:hidden w-full flex flex-col gap-1 mb-2 justify-between">
             {/* Atas */}
             <div className="flex items-center justify-between">
               <div className="flex items-center">
                 {/* --- ICON (FA6) --- */}
                 <div className="p-1 bg-green-50 rounded-lg mr-1">
                    <FaUserPlus className="h-4 w-4 text-green-600" />
                 </div>
                 <p className="text-[10px] font-semibold text-gray-600">New Month</p>
               </div>
               <div className="flex items-center">
                 <TrendArrow isPositive={newThisMonthTrend.isPositive} />
                 {/* --- PRESENTASE HIJAU (text-green-600) --- */}
                 <span className="text-[8px] font-medium ml-1 text-green-600">{newThisMonthTrend.percentage}%</span>
               </div>
             </div>
             {/* Bawah */}
             <div className="text-center">
                <h3 className="text-2xl font-bold text-green-600 leading-none">+{newThisMonth}</h3>
             </div>
           </div>

           {/* --- DESKTOP CONTENT --- */}
           <div className="hidden md:flex items-center w-full">
             <div className="flex items-center">
               <div className="p-3 bg-green-100 rounded-full">
                  {/* --- ICON (FA6) --- */}
                  <FaUserPlus className="h-8 w-8 text-green-600" />
               </div>
               <div className="ml-4">
                  <p className="text-sm text-gray-500">New This Month</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">+{newThisMonth}</p>
               </div>
             </div>
             <div className="text-right">
               <TrendArrow isPositive={newThisMonthTrend.isPositive} />
               <span className="text-sm font-medium ml-1 text-gray-400">{newThisMonthTrend.percentage}% vs last month</span>
             </div>
           </div>
        </div>
      </div>

      {/* --- OPTIMISASI CHART (Sparkline Mobile / Full Desktop) --- */}
      <div className="bg-white p-3 md:p-6 rounded-lg border border-gray-100 shadow-sm md:shadow-md mb-6 md:mb-8">
        <h2 className="text-base md:text-xl font-bold text-gray-800 mb-2 md:mb-4">Member Growth (Last 6 Months)</h2>
        
        {/* --- HEIGHT: Mobile 140px, Desktop 300px --- */}
        {/* --- AXIS: Mobile Hide, Desktop Show --- */}
        <ResponsiveContainer width="100%" height={140} className="md:h-[300]">
          <LineChart data={memberGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            
            {/* Axis Hide on Mobile (md:hidden), Show on Desktop */}
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} hide={true} className="md:hide false" />
            <YAxis stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false} hide={true} className="md:hide false" />
            
            <Tooltip 
              cursor="pointer"
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.375rem' }}
              labelStyle={{ color: '#fff', fontWeight: 'bold' }}
            />
            
            <Line 
              type="monotone" 
              dataKey="members" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 3 }}
              activeDot={{ r: 6 }}
              name="Total Members"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* --- TWO COLUMN LAYOUT --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Announcements */}
        <div className="bg-white p-3 md:p-6 rounded-lg shadow-sm md:shadow-md border border-gray-100">
          <h2 className="text-base md:text-xl font-bold text-gray-800 mb-4">Community Announcements</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-3 md:pl-4">
              <p className="text-sm md:text-base font-semibold text-gray-900">New Product Launch!</p>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">We are excited to announce launch of our new TRAPO product line.</p>
              <p className="text-[10px] md:text-xs text-gray-400 mt-1">2 days ago</p>
            </div>
            <div className="border-l-4 border-gray-300 pl-3 md:pl-4">
              <p className="text-sm md:text-base font-semibold text-gray-900">Community Meetup</p>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">Join us for our monthly online meetup this Friday.</p>
              <p className="text-[10px] md:text-xs text-gray-400 mt-1">5 days ago</p>
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="bg-white p-3 md:p-6 rounded-lg shadow-sm md:shadow-md border border-gray-100">
          <h2 className="text-base md:text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-2 md:p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
              <p className="text-xs md:text-sm font-medium text-gray-900">Update Profile Information</p>
            </button>
            <button className="w-full text-left p-2 md:p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
              <p className="text-xs md:text-sm font-medium text-gray-900">View Sales Resources</p>
            </button>
            <button className="w-full text-left p-2 md:p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
              <p className="text-xs md:text-sm font-medium text-gray-900">Contact Support</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboardView;