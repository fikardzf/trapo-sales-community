'use client';

import { useNavigation } from '@/lib/useNavigation';
import { useEffect, useState } from 'react';
import { User } from '@/lib/dummyDb';
import DashboardLayout from './components/dashboardLayout';

const DashboardPage = () => {
  const nav = useNavigation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedInUserData = localStorage.getItem('loggedInUser');
    if (loggedInUserData) {
      const parsedUser = JSON.parse(loggedInUserData);
      setUser(parsedUser);
    } else {
      nav.replace('/');
    }
    setLoading(false);
  }, [nav]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100"><p>Loading...</p></div>;
  }

  if (!user) {
    return null;
  }

  return <DashboardLayout user={user} />;
};

export default DashboardPage;