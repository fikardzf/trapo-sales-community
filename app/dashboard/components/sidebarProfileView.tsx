import Image from 'next/image';
import { useNavigation } from '@/lib/useNavigation';
import { User } from '@/lib/dummyDb';

interface SidebarProfileViewProps {
  user: User;
  // Tambahkan props untuk menutup sidebar di mobile
  onClose?: () => void;
}

const SidebarProfileView = ({ user, onClose }: SidebarProfileViewProps) => {
  const nav = useNavigation();

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    nav.push('/');
  };

  return (
    <div className="h-full bg-white shadow-xl p-6 flex flex-col">
      {/* User Info */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-3">
          {user.idCardImage ? (
            <Image src={user.idCardImage} alt="User Avatar" width={80} height={80} className="rounded-full object-cover" />
          ) : (
            <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 truncate w-full">{user.fullName}</h3>
        <p className="text-sm text-gray-500 truncate w-full">{user.email}</p>
      </div>

      {/* --- NAVIGATION LINKS (HANYA DI MOBILE) --- */}
      <nav className="md:hidden flex-grow mt-6 space-y-2">
        <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
          <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
          <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
          <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </a>
        {user.role === 'admin' && (
          <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
            <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Approvals
          </a>
        )}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-4 border-t">
        <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100">
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default SidebarProfileView;