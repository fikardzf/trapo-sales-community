// components/dashboard/DashboardLayout.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useToggle } from '@/hooks/useToggle';
import { User } from '@/types/user';
import Swal from 'sweetalert2';

// Import semua komponen view
import MainDashboardView from './MainDashboardView';
import ProfileView from './ProfileView';
import SettingsView from './SettingsView';
import ApprovalView from './ApprovalView';

// Tipe untuk view yang aktif
type ActiveView = 'dashboard' | 'profile' | 'settings' | 'approval';

interface DashboardLayoutProps {
  user: User;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user }) => {
  const router = useRouter();
  const { logout } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // State untuk mengontrol visibilitas dan lebar sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useToggle(true);
  const [isHovering, setIsHovering] = useToggle(false);
  
  // State untuk menentukan view mana yang sedang aktif
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  
  // State untuk mencegah masalah hidrasi
  const [isClient, setIsClient] = useState(false);

  // Pastikan kode hanya berjalan di client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fungsi untuk menangani logout dengan konfirmasi SweetAlert
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

  // Fungsi untuk merender view yang sesuai berdasarkan state activeView
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
          // Hanya tampilkan jika user adalah admin
          if (user.role === 'admin') {
            return <ApprovalView user={user} />;
          }
          // Jika bukan admin, tampilkan pesan akses ditolak
          return (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                <p className="text-gray-600">You don't have permission to access this page.</p>
              </div>
            </div>
          );
        default:
          return <MainDashboardView user={user} />;
      }
    } catch (error) {
      console.error('Error rendering view:', error);
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading View</h2>
            <p className="text-gray-600">Please try again or contact support.</p>
          </div>
        </div>
      );
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
      timeoutRef.current = setTimeout(() => {
        setIsSidebarOpen(false);
      }, 500); // 500ms delay before hiding
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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isClient, isHovering, setIsHovering, setIsSidebarOpen]);

  // Show sidebar when hovering over the collapsed area
  useEffect(() => {
    if (!isClient) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isSidebarOpen && e.clientX < 50) { // 50px from the left edge
        setIsSidebarOpen(true);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isClient, isSidebarOpen, setIsSidebarOpen]);

  // Jika belum di client, tampilkan UI sederhana
  if (!isClient) {
    return (
      <div className="flex w-screen h-screen bg-gray-100">
        <div className="w-[10%] min-w-[192px] bg-gray-700 flex flex-col">
          <div className="flex justify-center p-4">
            <div className="w-[60px] h-[60px] bg-gray-600 rounded-full"></div>
          </div>
          <div className="flex-1 px-2 py-4 space-y-2">
            <div className="w-full h-12 bg-gray-600 rounded-md"></div>
            <div className="w-full h-12 bg-gray-600 rounded-md"></div>
            <div className="w-full h-12 bg-gray-600 rounded-md"></div>
            {user.role === 'admin' && <div className="w-full h-12 bg-gray-600 rounded-md"></div>}
          </div>
          <div className="p-4 border-t border-gray-600">
            <div className="w-full h-10 bg-gray-600 rounded-md"></div>
          </div>
        </div>
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  // Daftar navigasi
  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  // Tambahkan navigasi approval hanya untuk admin
  if (user.role === 'admin') {
    navigationItems.push({
      id: 'approval',
      label: 'Approval',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    });
  }

  return (
    <div className="flex w-screen h-screen bg-gray-100">
      {/* SIDEBAR - 10% dari lebar layar HD (192px) dengan gradien transparan */}
      <div 
        ref={sidebarRef}
        className={`${isSidebarOpen ? 'w-[10%] min-w-[192px]' : 'w-16 min-w-[64px]'} bg-gradient-to-b from-gray-200/90 to-gray-200/70 backdrop-blur-sm transition-all duration-300 flex flex-col relative shadow-lg`}
      >
        {/* Logo TRAPO */}
        <div className="flex justify-center p-4">
          <Image 
            src="/images/logo_trapo.png" 
            alt="TRAPO Logo" 
            width={isSidebarOpen ? 60 : 40} 
            height={isSidebarOpen ? 60 : 40} 
            className="object-contain" 
          />
        </div>

        {/* Navigasi Utama */}
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ActiveView)}
              className={`w-full flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} p-3 rounded-md transition-all duration-200 ${
                activeView === item.id 
                  ? 'bg-white/60 text-gray-800 shadow-sm' 
                  : 'text-gray-700 hover:bg-white/40 hover:text-gray-900'
              }`}
            >
              {item.icon}
              {isSidebarOpen && <span className="ml-3 whitespace-nowrap font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Info User dan Tombol Logout */}
        <div className="p-4 border-t border-gray-300/50">
          <div className={`text-gray-700 text-sm ${isSidebarOpen ? 'text-center' : 'text-center'}`}>
            {isSidebarOpen ? (
              <p className="truncate font-medium">{user.fullName}</p>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-gray-400/50 rounded-full flex items-center justify-center text-gray-700 font-semibold">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-3 flex items-center justify-center p-2 rounded-md text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isSidebarOpen && <span className="ml-2 whitespace-nowrap font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* AREA KONTEN UTAMA */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {renderActiveView()}
      </div>
    </div>
  );
};

export default DashboardLayout;