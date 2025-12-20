// context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { findUser, saveUser, seedAdminUser } from '@/lib/dummyDb';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Tipe untuk data registrasi
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
  // Menggunakan useLocalStorage untuk state user
  const [user, setUser] = useLocalStorage<User | null>('loggedInUser', null);
  const [loading, setLoading] = useState(false);

  // Pastikan admin user ada saat provider dimuat
  useEffect(() => {
    seedAdminUser();
  }, []);

  const login = async (emailOrPhone: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const foundUser = findUser(emailOrPhone, password);
      if (foundUser) {
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
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    router.push('/');
  };

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