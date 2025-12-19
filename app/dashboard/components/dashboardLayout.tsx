import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/dummyDb';
import SidebarProfileView from './sidebarProfileView';
import MainDashboardView from './mainDashboardView';
import ProfileView from './profileView';
import SettingsView from './settingsView';
import ApprovalView from './approvalView';

interface DashboardLayoutProps {
  user: User;
}

const DashboardLayout = ({ user }: DashboardLayoutProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'settings' | 'approval'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-gray-100 relative overflow-hidden">
      {/* --- SIDEBAR AREA (DESKTOP & MOBILE) --- */}
      <div
        className="relative z-20"
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        {/* --- DESKTOP SIDEBAR (HANYA DI LAYAR BESAR) --- */}
        <div
          className={`hidden md:flex md:flex-col absolute top-0 left-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarProfileView user={user} />
        </div>

        {/* --- MOBILE SIDEBAR OVERLAY (HANYA DI LAYAR KECIL) --- */}
        <div
          className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ease-linear ${
            isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          />
          {/* Sidebar Panel */}
          <div
            className="absolute top-0 left-0 h-full w-80 max-w-full bg-white transform transition-transform duration-300 ease-in-out"
            style={{ transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}
          >
            <SidebarProfileView user={user} />
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* --- NAVIGATION BAR --- */}
        <nav className="bg-white shadow-md">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                {/* --- HAMBURGER MENU (HANYA DI LAYAR KECIL) --- */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* --- NAVIGATION LINKS (DISEMBUNYIKAN DI LAYAR KECIL) --- */}
                <div className="hidden md:flex space-x-8 ml-4">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`relative py-5 px-1 text-sm font-medium transition-all duration-300 ease-out group ${
                      activeTab === 'dashboard' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600 transform transition-transform duration-300 ease-out ${activeTab === 'dashboard' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`} />
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`relative py-5 px-1 text-sm font-medium transition-all duration-300 ease-out group ${
                      activeTab === 'profile' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600 transform transition-transform duration-300 ease-out ${activeTab === 'profile' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`} />
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`relative py-5 px-1 text-sm font-medium transition-all duration-300 ease-out group ${
                      activeTab === 'settings' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600 transform transition-transform duration-300 ease-out ${activeTab === 'settings' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`} />
                    Settings
                  </button>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => setActiveTab('approval')}
                      className={`relative py-5 px-1 text-sm font-medium transition-all duration-300 ease-out group ${
                        activeTab === 'approval' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600 transform transition-transform duration-300 ease-out ${activeTab === 'approval' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`} />
                      Approval
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200 transform hover:scale-105 active:scale-95">Logout</button>
              </div>
            </div>
          </div>
        </nav>

        {/* --- CONTENT AREA --- */}
        <main className="flex-grow flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-7xl transition-all duration-500 ease-out transform">
            <div className="bg-white rounded-lg shadow-md p-8 transition-all duration-700 ease-out transform" style={{ opacity: 1, transform: 'translateY(0px)' }}>
              {activeTab === 'dashboard' && <MainDashboardView user={user} />}
              {activeTab === 'profile' && <ProfileView user={user} />}
              {activeTab === 'settings' && <SettingsView />}
              {activeTab === 'approval' && user.role === 'admin' && <ApprovalView />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;