// app/dashboard/components/mainDashboardView.tsx

import { User } from '@/lib/dummyDb';

interface MainDashboardViewProps {
  user: User;
}

const MainDashboardView = ({ user }: MainDashboardViewProps) => {
  const stats = {
    totalMembers: 152,
    newThisMonth: 28,
    pendingApprovals: 5,
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {user.fullName}! Here's what's happening in the community today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl><dt className="text-sm font-medium text-gray-500 truncate">Total Members</dt><dd className="text-lg font-semibold text-gray-900">{stats.totalMembers}</dd></dl>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl><dt className="text-sm font-medium text-gray-500 truncate">New This Month</dt><dd className="text-lg font-semibold text-gray-900">{stats.newThisMonth}</dd></dl>
            </div>
          </div>
        </div>
        {user.role === 'admin' && (
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl><dt className="text-sm font-medium text-gray-500 truncate">Pending Approvals</dt><dd className="text-lg font-semibold text-gray-900">{stats.pendingApprovals}</dd></dl>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Community Announcements</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0"><div className="h-2 w-2 bg-green-400 rounded-full mt-2"></div></div>
              <div className="ml-3"><p className="text-sm text-gray-900">New sales incentive program has been launched!</p><p className="text-xs text-gray-500">2 days ago</p></div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0"><div className="h-2 w-2 bg-blue-400 rounded-full mt-2"></div></div>
              <div className="ml-3"><p className="text-sm text-gray-900">Welcome to our 30 new members this week.</p><p className="text-xs text-gray-500">5 days ago</p></div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"><span className="text-sm font-medium text-gray-900">Update Profile Information</span></button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"><span className="text-sm font-medium text-gray-900">View Training Materials</span></button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"><span className="text-sm font-medium text-gray-900">Contact Support</span></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboardView;