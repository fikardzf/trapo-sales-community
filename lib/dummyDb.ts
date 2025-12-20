// lib/dummyDb.ts
import { User } from '@/types';

const STORAGE_KEY = 'trapo_dummy_users';

/**
 * Fungsi pembantu untuk membuat ID unik.
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Mengambil semua user dari localStorage.
 * @returns Array dari objek User.
 */
export const getUsers = (): User[] => {
  try {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting users from localStorage:', error);
    return [];
  }
};

/**
 * Menyimpan user baru ke localStorage.
 * @param userData - Data user baru tanpa id, role, status, dan createdAt.
 * @returns Objek User yang baru dibuat.
 * @throws Error jika email atau nomor telepon sudah terdaftar.
 */
export const saveUser = (userData: Omit<User, 'id' | 'role' | 'status' | 'createdAt'>): User => {
  try {
    if (typeof window === 'undefined') {
      throw new Error("localStorage is not available on the server.");
    }
    
    const users = getUsers();
    const existingUser = users.find(u => 
      u.email === userData.email || 
      `${u.countryCode}${u.phoneNumber}` === `${userData.countryCode}${userData.phoneNumber}`
    );
    
    if (existingUser) {
      throw new Error("Email or Phone Number already registered.");
    }

    const newUser: User = {
      ...userData,
      id: generateId(),
      role: 'user',
      status: 'pending',
      createdAt: new Date(),
    };
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    
    return newUser;
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
    throw error;
  }
};

/**
 * Mencari user berdasarkan email/nomor telepon dan password.
 * @param emailOrPhone - Email atau nomor telepon lengkap.
 * @param password - Password user.
 * @returns Objek User jika ditemukan, null jika tidak.
 */
export const findUser = (emailOrPhone: string, password: string): User | null => {
  try {
    if (typeof window === 'undefined') return null;
    const users = getUsers();
    return users.find(u => 
      (u.email === emailOrPhone || `${u.countryCode}${u.phoneNumber}` === emailOrPhone) && 
      u.password === password
    ) || null;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

/**
 * Memperbarui status user.
 * @param email - Email user yang akan diperbarui.
 * @param newStatus - Status baru.
 */
export const updateUserStatus = (email: string, newStatus: User['status']): void => {
  try {
    if (typeof window !== 'undefined') {
      const users = getUsers();
      const userIndex = users.findIndex(u => u.email === email);
      if (userIndex !== -1) {
        users[userIndex].status = newStatus;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      }
    }
  } catch (error) {
    console.error('Error updating user status:', error);
  }
};

/**
 * Membuat user admin default jika belum ada.
 */
export const seedAdminUser = (): void => {
  try {
    if (typeof window !== 'undefined') {
      const users = getUsers();
      const adminEmail = 'admin@trapo.com';
      const existingAdmin = users.find(u => u.email === adminEmail);

      if (!existingAdmin) {
        const adminUser: User = {
          id: generateId(),
          fullName: 'Default Admin',
          email: adminEmail,
          countryCode: '+62',
          phoneNumber: '8112233445',
          password: 'Admin123',
          role: 'admin',
          status: 'approved',
          createdAt: new Date(),
        };
        users.push(adminUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        console.log('Admin user created! Email: admin@trapo.com, Password: Admin123');
      } else {
        if (existingAdmin.status !== 'approved' || existingAdmin.role !== 'admin') {
          const userIndex = users.findIndex(u => u.email === adminEmail);
          users[userIndex].status = 'approved';
          users[userIndex].role = 'admin';
          localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
          console.log('Existing admin user updated to approved status.');
        } else {
          console.log('Admin user already exists and is approved.');
        }
      }
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};