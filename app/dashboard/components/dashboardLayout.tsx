'use client';

import React, { useState, useEffect } from 'react';
import { useNavigation } from '@/lib/useNavigation';
import Image from 'next/image';
import { User } from '@/lib/dummyDb';
import Swal from 'sweetalert2';
// Import Icon dari react-icons/fa6 (Stable & Modern)
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaHouse, 
  FaUsers, 
  FaClipboardCheck, 
  FaSliders, 
  FaArrowRightFromBracket 
} from "react-icons/fa6";

import MainDashboardView from './mainDashboardView';
import ProfileView from './profileView';
import SettingsView from './settingsView';
import ApprovalView from './approvalView';
import MemberListView from './memberlist';

type ActiveView = 'dashboard' | 'profile' | 'settings' | 'approval' | 'memberlist';

interface DashboardLayoutProps {
  user: User;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user }) => {
  const nav = useNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isClient, setIsClient] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setIsSidebarOpen(window.innerWidth >= 768);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // --- LOGIKA NAVIGASI DESKTOP (Closed -> Direct Nav) ---
  // --- LOGIKA MOBILE (Langsung Nav & Close) ---
  const handleDesktopNavClick = (viewId: ActiveView) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      // Desktop
      if (!isSidebarOpen) {
        // Jika Sidebar Closed, Langsung Navigasi (Direct)
        setActiveView(viewId);
      } else {
        // Jika Sidebar Open, Navigasi & Tutup Sidebar
        setActiveView(viewId);
        setIsSidebarOpen(false);
      }
    } else {
      // Mobile: Langsung Nav
      setActiveView(viewId);
      setIsSidebarOpen(false);
    }
  };

  const navigateTo = (viewId: ActiveView) => {
    // Mobile: Langsung navigasi & tutup sidebar
    setActiveView(viewId);
    setIsSidebarOpen(false);
  };

  const toggleSettingsDropdown = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setActiveView('settings');
      setIsSidebarOpen(false);
      return;
    }

    // Desktop Logic
    if (!isSidebarOpen) {
      // Jika sidebar closed, buka sidebar dulu
      setIsSidebarOpen(true);
    } else {
      // Jika sidebar open, buka/tutup dropdown
      setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
    }
  };

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
        nav.replace('/');
      } catch (error) {
        console.error('Error during logout:', error);
        nav.replace('/');
      }
    }
  };

  const renderActiveView = () => {
    try {
      switch (activeView) {
        case 'dashboard':
          return <MainDashboardView user={user} />;
        case 'profile':
          return <ProfileView user={user} />;
        case 'settings':
          return <SettingsView user={user} />;
        case 'memberlist':
          if (user.role === 'admin') {
            return <MemberListView user={user} />;
          }
          return <div className="flex items-center justify-center h-full"><p className="text-red-600 text-xl font-semibold">Access Denied: Admins only.</p></div>;
        
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

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-900">
      
      {/* --- MOBILE OVERLAY --- */}
      <div 
        className={`
          fixed inset-0 z-40 bg-black/10 backdrop-blur-sm md:hidden transition-opacity duration-300
          ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* --- SIDEBAR --- */}
      <div 
        className={`
          flex flex-col shadow-lg z-50
          bg-gradient-to-b from-gray-200/90 to-gray-200/70 backdrop-blur-sm
          transition-all duration-300 ease-in-out
          
          /* RESPONSIVE POSITIONING */
          fixed inset-y-0 left-0 md:relative md:h-full
          
          /* TRANSISI VISUAL */
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} /* Mobile Slide Effect */
          md:translate-x-0 /* Desktop Fixed Position */
          
          ${isSidebarOpen ? 'w-64' : 'w-20'} /* Desktop Logic Width */
        `}
      >
        
        {/* AREA LOGO */}
        <div className="flex justify-center p-4 relative shrink-0">
          <div className={`
            relative
            ${isSidebarOpen 
              ? 'w-32 h-9' 
              : 'w-14 h-14 md:w-15 md:h-10'
            }
          `}>
            <Image 
              src="/images/logo_trapo.png" 
              alt="TRAPO Logo" 
              fill
              className="object-contain transition-all duration-300" 
            />
          </div>
        </div>

        {/* CLOSE BUTTON (Hanya Mobile) */}
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-900 p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* TOGGLE BUTTON ARROW (Hanya Desktop) */}
        <button
          onClick={toggleSidebar}
          className="hidden md:flex absolute right-0 top-14 -translate-y-1/4 z-50 text-gray-600 hover:text-blue-600 transition-all duration-300 translate-x-1/2 bg-white border border-gray-200 shadow-lg rounded-full p-2"
          title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isSidebarOpen ? <FaChevronLeft className="text-lg" /> : <FaChevronRight className="text-lg" />}
        </button>

        {/* --- NAVIGASI UTAMA --- */}
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <FaHouse /> },
            ...(user.role === 'admin' ? 
            [
              { id: 'memberlist', label: 'Member List', icon: <FaUsers /> },
              { id: 'approval', label: 'Approval', icon: <FaClipboardCheck /> } 
            ] : [])
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth >= 768) {
                  handleDesktopNavClick(item.id as ActiveView);
                } else {
                  navigateTo(item.id as ActiveView);
                }
              }}
              title={isSidebarOpen ? "" : item.label}
              className={`
                w-full flex items-center transition-all duration-200 rounded-md
                ${isSidebarOpen ? 'justify-start px-3 py-3' : 'justify-center py-3 px-2'}
                ${activeView === item.id 
                  ? 'bg-white/60 text-gray-800 shadow-sm' 
                  : 'text-gray-700 hover:bg-white/40 hover:text-gray-900'
                }
              `}
            >
              {/* REACT ICON */}
              <span className={`h-6 w-6 flex-shrink-0 transition-colors ${activeView === item.id ? 'text-blue-600' : 'text-gray-600'}`}>
                {item.icon}
              </span>
              {/* --- FONT SIZE LABEL: Mobile 'text-sm', Desktop 'text-xs' --- */}
              {isSidebarOpen && <span className="ml-3 whitespace-nowrap font-medium text-xs md:text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* --- MENU SETTINGS (Icon React Icons) --- */}
        <div className="px-6 py-4">
          <button
            onClick={toggleSettingsDropdown}
            className={`
              w-full flex items-center transition-all duration-200 rounded-md
              ${isSidebarOpen ? 'justify-start px-3 py-3' : 'justify-center py-3 px-2'}
              ${isSettingsDropdownOpen
                ? 'bg-white/60 text-gray-800 shadow-sm' 
                : 'text-gray-700 hover:bg-white/40 hover:text-gray-900'
              }
            `}
          >
            {/* ICON SETTINGS: FaSliders (Standar Settings v6) */}
            <span className={`h-6 w-6.5 flex-shrink-0 transition-colors ${isSettingsDropdownOpen ? 'text-blue-600' : 'text-gray-600'}`}>
              <FaSliders />
            </span>
            {/* --- FONT SIZE LABEL --- */}
            {isSidebarOpen && <span className="ml-3 whitespace-nowrap font-medium text-xs md:text-sm">Settings</span>}
          </button>

          {/* Dropdown Menu */}
          {isSettingsDropdownOpen && isSidebarOpen && (
            <div className="mt-2 ml-8 space-y-1">
              <button
                onClick={() => { setActiveView('profile'); setIsSettingsDropdownOpen(false); if(window.innerWidth < 768) setIsSidebarOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
              >
                Profile
              </button>
              <button
                onClick={() => { setActiveView('settings'); setIsSettingsDropdownOpen(false); if(window.innerWidth < 768) setIsSidebarOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
              >
                Change Password
              </button>
            </div>
          )}
        </div>

        {/* --- BAGIAN BAWAH: USERNAME & LOGOUT --- */}
        <div className="p-4 shrink-0">
          {/* --- FONT SIZE NAME: Mobile 'text-sm', Desktop 'text-xs' --- */}
          <div className={`text-gray-700 text-sm text-center mb-3 ${isSidebarOpen ? 'ml-4' : ''}`}>
            {isSidebarOpen ? <p className="truncate font-medium">{user?.fullName}</p> : (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-gray-400/50 rounded-full flex items-center justify-center text-gray-700 font-semibold">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full p-2 rounded-md text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors flex ${isSidebarOpen ? 'justify-start px-2 ml-4' : 'justify-center'}`} 
            title="Logout"
          >
            {/* ICON LOGOUT: FaArrowRightFromBracket (Standar v6) */}
            <span className="h-5 w-5 flex-shrink-0 text-gray-600"><FaArrowRightFromBracket /></span>
            {/* --- FONT SIZE LABEL: Mobile 'text-sm', Desktop 'text-xs' --- */}
            {isSidebarOpen && <span className="ml-2 whitespace-nowrap font-medium text-xs md:text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* --- AREA KONTEN UTAMA --- */}
      <div className="flex-1 overflow-auto bg-gray-50 w-full relative">
        
        {/* --- MOBILE HEADER (HAMBURGER) --- */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* --- FONT SIZE HEADER: Mobile 'text-lg', Desktop 'text-base' --- */}
          <h1 className="text-lg md:text-base font-bold text-gray-800 capitalize leading-tight">
            {activeView.replace(/([A-Z])/g, ' $1').trim()}
          </h1>
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-200">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
        </div>
          
        {isClient ? renderActiveView() : <MainDashboardView user={user} />}
      </div>
    </div>
  );
};

export default DashboardLayout;