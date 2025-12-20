// app/dashboard/components/DashboardLayout.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useToggle } from '@/hooks/useToggle';
import { User } from '@/types/user';
import Swal from 'sweetalert2';

// Import semua komponen view dengan path yang benar
import MainDashboardView from './MainDashboardView';
import ProfileView from './ProfileView';
import SettingsView from './SettingsView';
import ApprovalView from './ApprovalView';

type ActiveView = 'dashboard' | 'profile' | 'settings' | 'approval';

interface DashboardLayoutProps {
  user: User;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user }) => {
  const router = useRouter();
  const { logout } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isSidebarOpen, setIsSidebarOpen] = useToggle(true);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log me out!'
    });

    if (result.isConfirmed) {
      logout();
    }
  };

  const renderActiveView = () => {
    try {
      switch (activeView) {
        case 'dashboard': return <MainDashboardView user={user} />;
        case 'profile': return <ProfileView user={user} />;
        case 'settings': return <SettingsView user={user} />;
        case 'approval':
          if (user.role === 'admin') {
            return <ApprovalView user={user} />;
          }
          return (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                <p className="text-gray-600">You don't have permission to access this page.</p>
              </div>
            </div>
          );
        default: return <MainDashboardView user={user} />;
      }
    } catch (error) {
      console.error('Error rendering view:', error);
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
                <h2 className="text-2xl font-bold text-red-800 mb-2">Error Loading View</h2>
                <p className="text-gray-600">Please try again or contact support.</p>
          </div>
        </div>
      );
    }
  };

  // ... (Sisanya kode untuk sidebar dan render)
  
  return (
    <div className="flex w-screen h-screen bg-gray-100">
      {/* ... */}
    </div>
  );
};

export default DashboardLayout;