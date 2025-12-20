// context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import { findUser, saveUser, seedAdminUser } from '@/lib/dummyDb'; // Menggunakan fungsi yang sudah ada

// Mendefinisikan tipe data registrasi, diambil dari User interface
type RegisterData = Omit<User, 'id' | 'role' | 'status' | 'createdAt'>;

interface AuthContextType {
  user: User | null;
  login: (emailOrPhone: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Pastikan admin user selalu ada saat provider dimuat
  useEffect(() => {
    seedAdminUser();
  }, []);

  // Fungsi login yang memanggil findUser dari dummyDb
  const login = async (emailOrPhone: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const foundUser = findUser(emailOrPhone, password);
      if (foundUser) {
        // Menyimpan ke localStorage dan state React
        localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
        setUser(foundUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fungsi register yang memanggil saveUser dari dummyDb
  const register = async (userData: RegisterData): Promise<boolean> => {
    setLoading(true);
    try {
      const newUser = saveUser(userData);
      if (newUser) {
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      // Melempar error agar bisa ditangani di UI
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
    router.push('/');
  };

  // Mengecek status login saat komponen dimuat
  useEffect(() => {
    const loggedInUserData = localStorage.getItem('loggedInUser');
    if (loggedInUserData) {
      try {
        const parsedUser = JSON.parse(loggedInUserData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('loggedInUser');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};