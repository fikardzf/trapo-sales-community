// app/dashboard/components/approvalView.tsx

import React, { useState, useEffect } from 'react';
import { User, getUsers, updateUserStatus } from '@/lib/dummyDb';
import Swal from 'sweetalert2';

interface ApprovalViewProps {
  user: User;
}

const ApprovalView: React.FC<ApprovalViewProps> = ({ user }) => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all users with pending status
    const fetchPendingUsers = () => {
      try {
        const allUsers = getUsers();
        const pending = allUsers.filter(u => u.status === 'pending');
        setPendingUsers(pending);
      } catch (error) {
        console.error('Error fetching pending users:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch pending users. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const handleApprove = async (email: string) => {
    const result = await Swal.fire({
      title: 'Approve User',
      text: "Are you sure you want to approve this user?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve!'
    });

    if (result.isConfirmed) {
      try {
        updateUserStatus(email, 'approved');
        
        // Update the local state
        setPendingUsers(pendingUsers.filter(u => u.email !== email));
        
        await Swal.fire(
          'Approved!',
          'The user has been approved.',
          'success'
        );
      } catch (error) {
        console.error('Error approving user:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to approve user. Please try again.',
        });
      }
    }
  };

  const handleReject = async (email: string) => {
    const result = await Swal.fire({
      title: 'Reject User',
      text: "Are you sure you want to reject this user?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject!'
    });

    if (result.isConfirmed) {
      try {
        updateUserStatus(email, 'rejected');
        
        // Update the local state
        setPendingUsers(pendingUsers.filter(u => u.email !== email));
        
        await Swal.fire(
          'Rejected!',
          'The user has been rejected.',
          'success'
        );
      } catch (error) {
        console.error('Error rejecting user:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to reject user. Please try again.',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <p className="text-gray-900">Loading pending users...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Approval</h1>
      
      {pendingUsers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-900">No pending users to approve.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Pending Users ({pendingUsers.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingUsers.map((pendingUser) => (
                  <tr key={pendingUser.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">
                              {pendingUser.fullName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {pendingUser.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {pendingUser.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pendingUser.email}</div>
                      <div className="text-sm text-gray-500">{pendingUser.countryCode} {pendingUser.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(pendingUser.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleApprove(pendingUser.email)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(pendingUser.email)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalView;