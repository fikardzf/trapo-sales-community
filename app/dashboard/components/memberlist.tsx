'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { User, getUsers } from '@/lib/dummyDb'; 
import Image from 'next/image';
import Swal from 'sweetalert2';

// --- PERBAIKAN: Import key dari dummyDb atau gunakan string yang sama ---
const STORAGE_KEY = 'trapo_dummy_users'; 

interface MemberListViewProps {
  user: User;
}

const MemberListView: React.FC<MemberListViewProps> = ({ user }) => {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  
  // --- PERBAIKAN: Default state diubah menjadi 'member' agar lebih aman ---
  const [tempStatus, setTempStatus] = useState<User['status']>('pending');
  const [tempRole, setTempRole] = useState<User['role']>('member');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'active' | 'deactive' | 'rejected'>('all');

  useEffect(() => {
    const fetchData = () => {
      try {
        const allUsers = getUsers();
        setMembers(allUsers);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const refreshData = () => {
    const allUsers = getUsers(); 
    setMembers(allUsers);
  };

  const filteredMembers = useMemo(() => {
    let membersToFilter = members;

    if (statusFilter !== 'all') {
      membersToFilter = membersToFilter.filter(member => member.status === statusFilter);
    }

    if (searchQuery) {
      membersToFilter = membersToFilter.filter(member =>
        member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return membersToFilter;
  }, [members, statusFilter, searchQuery]);

  const openModal = (member: User) => {
    setSelectedMember(member);
    setTempStatus(member.status);
    setTempRole(member.role);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
    refreshData();
  };

  const updateLocalStorage = (updatedUsers: User[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
    setMembers(updatedUsers);
    
    console.log(`Data disimpan ke ${STORAGE_KEY}:`, updatedUsers);
  };

  const handleDelete = async () => {
    if (!selectedMember) return;
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You won't be able to revert this! Delete ${selectedMember.fullName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      const newMembers = members.filter(m => m.id !== selectedMember.id);
      updateLocalStorage(newMembers);
      
      // --- PERBAIKAN: Tambahkan await agar SweetAlert muncul sepenuhnya ---
      await Swal.fire('Deleted!', 'Member has been deleted.', 'success');
      closeModal();
    }
  };

  const handleSaveStatus = async () => {
    if (!selectedMember || tempStatus === selectedMember.status) return;

    const statusText = tempStatus.charAt(0).toUpperCase() + tempStatus.slice(1);

    const result = await Swal.fire({
      title: 'Confirm Status Change?',
      text: `Change status for ${selectedMember.fullName} to "${statusText}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, Change to ${statusText}`
    });

    if (result.isConfirmed) {
      const updatedMembers = members.map(m => 
        m.id === selectedMember.id ? { ...m, status: tempStatus } : m
      );
      updateLocalStorage(updatedMembers);
      setSelectedMember({ ...selectedMember, status: tempStatus });
      
      // --- PERBAIKAN: Tambahkan await ---
      await Swal.fire('Updated!', `Member status changed to ${statusText}.`, 'success');
      closeModal();
    }
  };

  const handleSaveRole = async () => {
    if (!selectedMember || tempRole === selectedMember.role) return;

    const roleText = tempRole.charAt(0).toUpperCase() + tempRole.slice(1);

    const result = await Swal.fire({
      title: 'Confirm Role Change?',
      text: `Change role for ${selectedMember.fullName} to "${roleText}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, Change to ${roleText}`
    });

    if (result.isConfirmed) {
      const updatedMembers = members.map(m => 
        m.id === selectedMember.id ? { ...m, role: tempRole } : m
      );
      
      updateLocalStorage(updatedMembers);
      setSelectedMember({ ...selectedMember, role: tempRole });
      
      // --- PERBAIKAN: Tambahkan await ---
      await Swal.fire('Updated!', `Member role changed to ${roleText}.`, 'success');
      closeModal();
    }
  };

  // Component Role Badge
  const RoleBadge = ({ role }: { role: User['role'] }) => {
    const styles: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-800 border-purple-200',
      manager: 'bg-blue-100 text-blue-800 border-blue-200',
      supervisor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      staff: 'bg-teal-100 text-teal-800 border-teal-200',
      user: 'bg-gray-100 text-gray-800 border-gray-200',
      member: 'bg-gray-100 text-gray-800 border-gray-200', // Fallback
    };
    const styleClass = styles[role] || styles.member;

    return (
      <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wide rounded-md border ${styleClass}`}>
        {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Unknown'}
      </span>
    );
  };
  
  // Component Status Badge
  const StatusBadge = ({ status }: { status: User['status'] }) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      deactive: 'bg-gray-100 text-gray-800',
      rejected: 'bg-red-100 text-red-800',
    };
    const styleClass = styles[status] || 'bg-gray-100 text-gray-600';

    return (
      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${styleClass}`}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
      </span>
    );
  };

  if (loading) {
    return <div className="p-8 flex items-center justify-center h-full"><p className="text-gray-900">Loading Members...</p></div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 hidden md:block">Member List</h1>
      
      {/* Filters */}
      <div className="mb-4">
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'active', 'deactive', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as typeof statusFilter)}
              className={`px-3 py-2 rounded-md font-medium text-sm transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          // Mobile: text-xs (12px), Desktop: text-sm (14px)
          className="pl-10 pr-4 py-1.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Card & Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
           {/* --- UPDATE 2: Header Title (Mobile text-xs, Desktop text-sm) --- */}
          <h2 className="text-base md:text-sm font-semibold text-gray-800">
            {statusFilter === 'all' ? 'All Members' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Members`} ({filteredMembers.length})
          </h2>
        </div>

        {/* --- UPDATE 3: TABEL (Desktop text-xs) --- */}
        <div className="overflow-x-auto hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    {/* Tabel Data: Desktop text-xs */}
                    <td className="px-6 py-3 whitespace-nowrap text-sm md:text-xs font-medium text-gray-900">{member.fullName}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm md:text-xs text-gray-500">{member.email}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm md:text-xs text-gray-500">{member.countryCode} {member.phoneNumber}</td>
                    <td className="px-6 py-3 whitespace-nowrap"><RoleBadge role={member.role} /></td>
                    <td className="px-6 py-3 whitespace-nowrap"><StatusBadge status={member.status} /></td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm md:text-xs font-medium">
                      <button onClick={() => openModal(member)} className="text-blue-600 hover:text-blue-800 font-bold transition-colors">
                        View Actions
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm md:text-xs text-gray-500">No members found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- MOBILE: CARD DESIGN --- */}
        <div className="p-4 md:hidden">
          {/* Container membatasi lebar agar tidak melebar di layar HP besar */}
          <div className="max-w-md mx-auto space-y-4">
             {filteredMembers.length > 0 ? (
               filteredMembers.map((member) => (
                 <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
                   
                   {/* Header Card */}
                   <div className="flex justify-between items-start">
                     <div className="flex-1">
                       <h3 className="text-base font-bold text-gray-900 leading-tight mb-1">{member.fullName}</h3>
                       <RoleBadge role={member.role} />
                     </div>
                     <StatusBadge status={member.status} />
                   </div>

                   {/* Body Card */}
                   <div className="space-y-2">
                     <div className="flex items-center text-sm text-gray-600">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                       </svg>
                       <span className="truncate">{member.email}</span>
                     </div>
                     <div className="flex items-center text-sm text-gray-600">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                       </svg>
                       <span>{member.countryCode} {member.phoneNumber}</span>
                     </div>
                   </div>

                   {/* Footer Card */}
                   <button
                     onClick={() => openModal(member)}
                     className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-sm rounded-md transition-colors border border-blue-100"
                   >
                     View Actions & Details
                   </button>
                 </div>
               ))
             ) : (
               <div className="text-center py-8 text-gray-500 text-sm">No members found.</div>
             )}
          </div>
        </div>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && selectedMember && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden transform transition-all duration-300 scale-100 flex flex-col md:flex-row">
            
            {/* DIV 1: ID CARD IMAGE (KIRI) */}
            <div className="w-full md:w-1/2 bg-gray-50 p-6 md:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
              <h3 className="text-gray-500 font-semibold uppercase tracking-wider text-sm mb-4">ID Card Image</h3>
              <div className="relative w-full max-w-[500px] aspect-[3/2] bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                {selectedMember.idCardImage ? (
                  <Image 
                    src={selectedMember.idCardImage} 
                    alt="ID Card" 
                    fill
                    className="object-contain p-4"
                  />
                ) : (
                  <span className="text-gray-400">No Image Available</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-4">Max resolution 600x400px</p>
            </div>

            {/* DIV 2: PROFILE INFORMATION (KANAN) */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col relative">
              <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedMember.fullName}</h2>
                
                {/* Role & Status Badges */}
                <div className="flex items-center gap-2 mb-6">
                  <RoleBadge role={selectedMember.role} />
                  <StatusBadge status={selectedMember.status} />
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-bold">Email Address</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedMember.email}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-bold">Phone Number</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedMember.countryCode} {selectedMember.phoneNumber}</p>
                  </div>
                </div>

                {/* --- CHANGE MEMBER ROLE (Admin Only) --- */}
                {user.role === 'admin' && (
                  <div className="mt-6 bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <p className="text-xs text-purple-800 uppercase font-bold mb-3">Change Member Role</p>
                    <select
                      value={tempRole}
                      onChange={(e) => setTempRole(e.target.value as User['role'])}
                      className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm rounded-md"
                    >
                      {/* --- PERBAIKAN: Opsi role dilengkapi --- */}
                      <option value="member">Member</option>
                      <option value="user">User</option>
                      <option value="staff">Staff</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={handleSaveRole}
                      disabled={tempRole === selectedMember.role}
                      className={`
                        w-full mt-3 py-2 rounded-md font-medium text-sm shadow-sm transition-all active:scale-95
                        ${tempRole === selectedMember.role 
                          ? 'bg-purple-200 text-purple-400 cursor-not-allowed' 
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                        }
                      `}
                    >
                      {tempRole === selectedMember.role ? 'Role matches current' : 'Update Member Role'}
                    </button>
                  </div>
                )}

                {/* --- CHANGE MEMBER STATUS --- */}
                <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-800 uppercase font-bold mb-3">Change Member Status</p>
                  <select
                    value={tempStatus}
                    onChange={(e) => setTempStatus(e.target.value as User['status'])}
                    className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="deactive">Deactive</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button
                    onClick={handleSaveStatus}
                    disabled={tempStatus === selectedMember.status}
                    className={`
                      w-full mt-3 py-2.5 rounded-md font-medium text-sm shadow-sm transition-all active:scale-95
                      ${tempStatus === selectedMember.status 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      }
                    `}
                  >
                    {tempStatus === selectedMember.status ? 'Change status to update' : 'Update Member Status'}
                  </button>
                </div>
              </div>

              {/* Delete Button */}
              <div className="pt-6 border-t border-gray-100 mt-6">
                <button onClick={handleDelete} className="w-full py-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50 font-medium text-sm transition-colors">
                  Delete Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberListView;