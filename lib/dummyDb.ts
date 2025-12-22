// lib/dummyDb.ts

// Tipe data untuk user kita
export interface User {
  id: string;
  fullName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  idCardImage?: string;
  role: 'user' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const STORAGE_KEY = 'trapo_dummy_users';

/**
 * Fungsi pembantu untuk membuat ID unik sederhana.
 * @returns {string} ID unik.
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Mengambil semua data user dari localStorage dengan penanganan SSR yang lebih baik.
 * @returns {User[]} Array dari objek User.
 */
export const getUsers = (): User[] => {
  // Gunakan try-catch untuk menangani error di server
  try {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    }
    return [];
  } catch (error) {
    console.error('Error getting users from localStorage:', error);
    return [];
  }
};

/**
 * Menyimpan user baru ke localStorage dengan penanganan SSR yang lebih baik.
 * @param {Omit<User, 'id' | 'role' | 'status' | 'createdAt'>} userData - Data user tanpa field yang akan di-generate otomatis.
 * @returns {User} Objek User yang baru saja dibuat.
 * @throws {Error} Jika email atau nomor telepon sudah terdaftar.
 */
export const saveUser = (userData: Omit<User, 'id' | 'role' | 'status' | 'createdAt'>): User => {
  try {
    if (typeof window !== 'undefined') {
      const users = getUsers();
      const existingUser = users.find(u => u.email === userData.email || `${u.countryCode}${u.phoneNumber}` === `${userData.countryCode}${userData.phoneNumber}`);
      
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
    }
    throw new Error("localStorage is not available on the server.");
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
    throw error;
  }
};

/**
 * Mencari user berdasarkan email/nomor telepon dan password dengan penanganan SSR yang lebih baik.
 * @param {string} emailOrPhone - Email atau nomor telepon lengkap (dengan kode negara).
 * @param {string} password - Password user.
 * @returns {User | null} Objek User jika ditemukan, null jika tidak.
 */
export const findUser = (emailOrPhone: string, password: string): User | null => {
  try {
    if (typeof window !== 'undefined') {
      const users = getUsers();
      const id = (emailOrPhone || '').trim();
      const idLower = id.toLowerCase();
      const normalizedId = id.replace(/\s/g, '');

      return (
        users.find((u) => {
          const emailMatch = (u.email || '').toLowerCase() === idLower;
          const phoneMatch = `${u.countryCode || ''}${u.phoneNumber || ''}`.replace(/\s/g, '') === normalizedId;
          const passMatch = (u.password || '') === password;
          return (emailMatch || phoneMatch) && passMatch;
        }) || null
      );
    }
    return null;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};


/**
 * Mencari user berdasarkan identifier (email atau nomor telepon lengkap) tanpa password.
 * Berguna untuk fitur reset password di environment development.
 */
export const findUserByIdentifier = (emailOrPhone: string): User | null => {
  try {
    if (typeof window !== 'undefined') {
      const users = getUsers();
      const id = (emailOrPhone || '').trim();
      const idLower = id.toLowerCase();
      const normalizedId = id.replace(/\s/g, '');

      return (
        users.find((u) => {
          const emailMatch = (u.email || '').toLowerCase() === idLower;
          const phoneMatch = `${u.countryCode || ''}${u.phoneNumber || ''}`.replace(/\s/g, '') === normalizedId;
          return emailMatch || phoneMatch;
        }) || null
      );
    }
    return null;
  } catch (error) {
    console.error('Error finding user by identifier:', error);
    return null;
  }
};

/**
 * Update password berdasarkan identifier (email / phone lengkap).
 * Untuk dev: tidak mengirim email/link; langsung update ke localStorage.
 * @throws Error jika user tidak ditemukan.
 */
export const updateUserPasswordByIdentifier = (emailOrPhone: string, newPassword: string): void => {
  try {
    if (typeof window !== 'undefined') {
      const users = getUsers();
      const id = (emailOrPhone || '').trim();
      const idLower = id.toLowerCase();
      const normalizedId = id.replace(/\s/g, '');

      const userIndex = users.findIndex((u) => {
        const emailMatch = (u.email || '').toLowerCase() === idLower;
        const phoneMatch = `${u.countryCode || ''}${u.phoneNumber || ''}`.replace(/\s/g, '') === normalizedId;
        return emailMatch || phoneMatch;
      });

      if (userIndex === -1) {
        throw new Error('User not found.');
      }

      users[userIndex].password = newPassword;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

/**
 * Memperbarui status user (misalnya, dari 'pending' menjadi 'approved') dengan penanganan SSR yang lebih baik.
 * @param {string} email - Email user yang akan diperbarui.
 * @param {User['status']} newStatus - Status baru.
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
 * Membuat user admin default jika belum ada dengan penanganan SSR yang lebih baik.
 * Fungsi ini bisa dipanggil sekali saat aplikasi dimulai untuk memastikan selalu ada akun admin.
 */
export const seedAdminUser = () => {
  try {
    if (typeof window !== 'undefined') {
      const users = getUsers();
      const adminEmail = 'admin@trapo.com';
      const adminPassword = 'Admin123!';

      const adminIndex = users.findIndex((u) => (u.email || '').toLowerCase() === adminEmail);
      const existingAdmin = adminIndex !== -1 ? users[adminIndex] : null;

      if (!existingAdmin) {
        const adminUser: User = {
          id: generateId(),
          fullName: 'Default Admin',
          email: adminEmail,
          countryCode: '+62',
          phoneNumber: '8112233445',
          password: adminPassword,
          role: 'admin',
          status: 'approved',
          createdAt: new Date(),
        };

        users.push(adminUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        console.log(`Admin user created! Email: ${adminEmail}, Password: ${adminPassword}`);
        return;
      }

      // Ensure admin has correct role/status and latest password (dev-only seed & migration)
      let changed = false;

      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        changed = true;
      }
      if (existingAdmin.status !== 'approved') {
        existingAdmin.status = 'approved';
        changed = true;
      }
      if ((existingAdmin.password || '') !== adminPassword) {
        existingAdmin.password = adminPassword;
        changed = true;
      }

      if (changed) {
        users[adminIndex] = existingAdmin;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        console.log('Existing admin user migrated (role/status/password).');
      } else {
        console.log('Admin user already exists and is up to date.');
      }
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};