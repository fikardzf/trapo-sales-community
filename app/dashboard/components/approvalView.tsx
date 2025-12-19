import { useState, useEffect } from 'react';
import { User, getUsers, updateUserStatus } from '@/lib/dummyDb';

const ApprovalView = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);

  useEffect(() => {
    setPendingUsers(getUsers().filter(user => user.status === 'pending'));
  }, []); // Kosong agar hanya dijalankan sekali

  const handleApprove = (email: string) => {
    updateUserStatus(email, 'approved');
    // Update state untuk refresh UI
    setPendingUsers(prevUsers => prevUsers.filter(user => user.email !== email));
    alert('User approved!');
  };

  const handleReject = (email: string) => {
    updateUserStatus(email, 'rejected');
    setPendingUsers(prevUsers => prevUsers.filter(user => user.email !== email));
    alert('User rejected.');
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Pending User Approvals</h2>
      {pendingUsers.length === 0 ? (
        <p className="text-gray-500">No pending users at the moment.</p>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map((user) => (
            <div key={user.email} className="border p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-medium">{user.fullName}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600">{user.countryCode} {user.phoneNumber}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleApprove(user.email)} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Approve</button>
                <button onClick={() => handleReject(user.email)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalView;