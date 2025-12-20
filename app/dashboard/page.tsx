// app/dashboard/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { user } from '@/types/user';

const DashboardPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Akan di-redirect oleh useEffect
  }

  return <DashboardLayout user={user} />;
};

export default DashboardPage;