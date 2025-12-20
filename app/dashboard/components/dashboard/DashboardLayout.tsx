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

  // ... (Sisanya kode yang ada di file ini, tidak perlu diubah)
  
  return (
    <div className="flex w-screen h-screen bg-gray-100">
      {/* ... (Sisanya kode yang ada di file ini, tidak perlu diubah) */}
    </div>
  );
};

export default DashboardLayout;