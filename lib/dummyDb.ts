// Tipe data untuk user kita
export interface User {
  fullName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  idCardImage?: string;
  // --- TAMBAHKAN 2 PROPERTI BARU INI ---
  role: 'user' | 'admin'; // Peran user
  status: 'pending' | 'approved' | 'rejected'; // Status pendaftaran
}

const STORAGE_KEY = 'trapo_dummy_users';

// Fungsi untuk mendapatkan semua user dari localStorage (tetap sama)
export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Fungsi untuk menyimpan user baru (PERBARUI BAGIAN INI)
export const saveUser = (user: Omit<User, 'role' | 'status'>): void => { // Menggunakan Omit untuk role & status
  if (typeof window === 'undefined') return;
  const users = getUsers();
  const existingUser = users.find(u => u.email === user.email || `${u.countryCode}${u.phoneNumber}` === `${user.countryCode}${user.phoneNumber}`);
  if (existingUser) {
    throw new Error("Email or Phone Number already registered.");
  }
  // --- TAMBAHKAN DEFAULT VALUE SAAT MENYIMPAN ---
  const newUser: User = {
    ...user,
    role: 'user', // Default role adalah 'user'
    status: 'pending' // Default status adalah 'pending', menunggu persetujuan
  };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// Fungsi untuk mencari user saat login (tetap sama)
export const findUser = (emailOrPhone: string, password: string): User | null => {
  if (typeof window === 'undefined') return null;
  const users = getUsers();
  return users.find(u => (u.email === emailOrPhone || `${u.countryCode}${u.phoneNumber}` === emailOrPhone) && u.password === password) || null;
};

// --- TAMBAHKAN FUNGSI BARU UNTUK UPDATE STATUS USER ---
export const updateUserStatus = (email: string, newStatus: User['status']): void => {
    if (typeof window === 'undefined') return;
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex !== -1) {
        users[userIndex].status = newStatus;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
};

// lib/dummyDb.ts

// ... semua kode yang sebelumnya ...

// --- TAMBAHKAN FUNGSI INI ---
export const seedAdminUser = () => {
  if (typeof window === 'undefined') return;

  const users = getUsers();
  const adminEmail = 'admin@trapo.com';
  const existingAdmin = users.find(u => u.email === adminEmail);

  if (!existingAdmin) {
    const adminUser: User = {
      fullName: 'Default Admin',
      email: adminEmail,
      countryCode: '+62',
      phoneNumber: '8112233445',
      password: 'Admin123', // Password sederhana untuk development
      role: 'admin',
      status: 'approved',
    };
    users.push(adminUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    alert('Admin user created! Email: admin@trapo.com, Password: admin123');
  } else {
    // Jika sudah ada, pastikan statusnya approved dan role-nya admin
    if (existingAdmin.status !== 'approved' || existingAdmin.role !== 'admin') {
      const userIndex = users.findIndex(u => u.email === adminEmail);
      users[userIndex].status = 'approved';
      users[userIndex].role = 'admin';
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      alert('Existing admin user updated to approved status.');
    } else {
      alert('Admin user already exists and is approved.');
    }
  }
};