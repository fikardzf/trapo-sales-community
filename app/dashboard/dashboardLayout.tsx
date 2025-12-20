// app/dashboard/components/dashboardLayout.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User } from '@/lib/dummyDb';
import Swal from 'sweetalert2';

// Import semua komponen view
import MainDashboardView from './mainDashboardView';
import ProfileView from './profileView';
import SettingsView from './settingsView';
import ApprovalView from './approvalView';

// Tipe untuk view yang aktif
type ActiveView = 'dashboard' | 'profile' | 'settings' | 'approval';

interface DashboardLayoutProps {
  user: User;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user }) => {
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // State untuk mengontrol visibilitas dan lebar sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  
  // State untuk menentukan view mana yang sedang aktif
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  
  // --- STATE KUNCI UNTUK MENCEGAH HIDRASI ERROR ---
  const [isClient, setIsClient] = useState(false);

  // Pastikan kode hanya berjalan di client
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
      try {
        localStorage.removeItem('loggedInUser');
        await Swal.fire('Logged Out!', 'You have been successfully logged out.', 'success');
        router.replace('/');
      } catch (error) {
        console.error('Error during logout:', error);
        router.replace('/');
      }
    }
  };

  // Fungsi untuk merender view yang sesuai
  const renderActiveView = () => {
    try {
      switch (activeView) {
        case 'dashboard':
          return <MainDashboardView user={user} />;
        case 'profile':
          return <ProfileView user={user} />;
        case 'settings':
          return <SettingsView user={user} />;
        case 'approval':
          if (user.role === 'admin') {
            return <ApprovalView user={user} />;
          }
          return <div className="flex items-center justify-center h-full"><p className="text-red-600 text-xl font-semibold">Access Denied: Admins only.</p></div>;
        default:
          return <MainDashboardView user={user} />;
      }
    } catch (error) {
      console.error('Error rendering view:', error);
      return <div className="flex items-center justify-center h-full"><p className="text-red-600 text-xl font-semibold">Error loading view. Please try again.</p></div>;
    }
  };

  // Auto-hide sidebar functionality
  useEffect(() => {
    if (!isClient) return;
    
    const handleMouseEnter = () => {
      setIsHovering(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      timeoutRef.current = setTimeout(() => setIsSidebarOpen(false), 500);
    };

    const sidebarElement = sidebarRef.current;
    if (sidebarElement) {
      sidebarElement.addEventListener('mouseenter', handleMouseEnter);
      sidebarElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (sidebarElement) {
        sidebarElement.removeEventListener('mouseenter', handleMouseEnter);
        sidebarElement.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isClient]);

  // Show sidebar when hovering over the collapsed area
  useEffect(() => {
    if (!isClient) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isSidebarOpen && e.clientX < 50) {
        setIsSidebarOpen(true);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isSidebarOpen, isClient]);

  return (
    <div className="flex w-screen h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div 
        ref={sidebarRef}
        className={`${isSidebarOpen ? 'w-[10%] min-w-[192px]' : 'w-16 min-w-[64px]'} bg-gradient-to-b from-gray-200/90 to-gray-200/70 backdrop-blur-sm transition-all duration-300 flex flex-col relative shadow-lg`}
      >
        <div className="flex justify-center p-4">
          <Image src="/images/logo_trapo.png" alt="TRAPO Logo" width={isSidebarOpen ? 60 : 40} height={isSidebarOpen ? 60 : 40} className="object-contain" />
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
            ...(user.role === 'admin' ? [{ id: 'approval', label: 'Approval', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }] : [])
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ActiveView)}
              className={`w-full flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} p-3 rounded-md transition-all duration-200 ${
                activeView === item.id 
                  ? 'bg-white/60 text-gray-800 shadow-sm' 
                  : 'text-gray-700 hover:bg-white/40 hover:text-gray-900'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {isSidebarOpen && <span className="ml-3 whitespace-nowrap font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-300/50">
          <div className={`text-gray-700 text-sm ${isSidebarOpen ? 'text-center' : 'text-center'}`}>
            {isSidebarOpen ? <p className="truncate font-medium">{user?.fullName}</p> : (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-gray-400/50 rounded-full flex items-center justify-center text-gray-700 font-semibold">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="w-full mt-3 flex items-center justify-center p-2 rounded-md text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors" title="Logout">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            {isSidebarOpen && <span className="ml-2 whitespace-nowrap font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* AREA KONTEN UTAMA */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* --- PERBAIKAN KRUSIAL: Hanya render view dinamis jika sudah di client --- */}
        {isClient ? renderActiveView() : <MainDashboardView user={user} />}
      </div>
    </div>
  );
};

export default DashboardLayout;