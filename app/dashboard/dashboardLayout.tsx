// components/dashboard/DashboardLayout.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types/user';
import { Button } from '@/components/ui/Button';
import { MainDashboardView } from './MainDashboardView';
import { ProfileView } from './ProfileView';
import { SettingsView } from './SettingsView';
import { ApprovalView } from './ApprovalView';

type ActiveView = 'dashboard' | 'profile' | 'settings' | 'approval';

interface DashboardLayoutProps {
  user: User;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user }) => {
  const router = useRouter();
  const { logout } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    logout();
    router.push('/');
  };

  const renderActiveView = () => {
    const views = {
      dashboard: <MainDashboardView />,
      profile: <ProfileView />,
      settings: <SettingsView />,
      approval: user.role === 'admin' ? <ApprovalView /> : <AccessDeniedView />,
    };
    
    return views[activeView] || views.dashboard;
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  if (user.role === 'admin') {
    navigationItems.push({ id: 'approval', label: 'Approval', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' });
  }

  return (
    <div className="flex w-screen h-screen bg-gray-100">
      <Sidebar
        ref={sidebarRef}
        isOpen={isSidebarOpen}
        navigationItems={navigationItems}
        activeView={activeView}
        setActiveView={setActiveView}
        user={user}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 overflow-auto bg-gray-50">
        {isClient ? renderActiveView() : <LoadingView />}
      </div>
    </div>
  );
};

// Separate Sidebar component for better organization
const Sidebar = React.forwardRef<HTMLDivElement, {
  isOpen: boolean;
  navigationItems: Array<{ id: string; label: string; icon: string }>;
  activeView: string;
  setActiveView: (view: string) => void;
  user: User;
  onLogout: () => void;
}>(({ isOpen, navigationItems, activeView, setActiveView, user, onLogout }, ref) => {
  return (
    <div
      ref={ref}
      className={`${isOpen ? 'w-[10%] min-w-[192px]' : 'w-16 min-w-[64px]'} bg-gradient-to-b from-gray-200/90 to-gray-200/70 backdrop-blur-sm transition-all duration-300 flex flex-col relative shadow-lg`}
    >
      <div className="flex justify-center p-4">
        <Image
          src="/images/logo_trapo.png"
          alt="TRAPO Logo"
          width={isOpen ? 60 : 40}
          height={isOpen ? 60 : 40}
          className="object-contain"
        />
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center ${isOpen ? 'justify-start' : 'justify-center'} p-3 rounded-md transition-all duration-200 ${
              activeView === item.id
                ? 'bg-white/60 text-gray-800 shadow-sm'
                : 'text-gray-700 hover:bg-white/40 hover:text-gray-900'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {isOpen && <span className="ml-3 whitespace-nowrap font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-300/50">
        <div className={`text-gray-700 text-sm ${isOpen ? 'text-center' : 'text-center'}`}>
          {isOpen ? (
            <p className="truncate font-medium">{user.fullName}</p>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gray-400/50 rounded-full flex items-center justify-center text-gray-700 font-semibold">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
        <Button
          onClick={onLogout}
          variant="secondary"
          size="sm"
          className="w-full mt-3"
        >
          {isOpen ? 'Logout' : ''}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </Button>
      </div>
    </div>
  );
});

const AccessDeniedView = () => (
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

const LoadingView = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
  </div>
);

export default DashboardLayout;