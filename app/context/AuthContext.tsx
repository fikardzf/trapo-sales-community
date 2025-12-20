// context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (emailOrPhone: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useLocalStorage<User | null>('loggedInUser', null);
  const [loading, setLoading] = useState(false);

  const login = async (emailOrPhone: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Untuk testing, gunakan data dummy
      if (emailOrPhone === 'admin@trapo.com' && password === 'Admin123') {
        const adminUser: User = {
          id: 'admin-1',
          fullName: 'Default Admin',
          email: 'admin@trapo.com',
          countryCode: '+62',
          phoneNumber: '8112233445',
          role: 'admin',
          status: 'approved',
          createdAt: new Date(),
        };
        setUser(adminUser);
        return true;
      }
      
      // Cari user di localStorage
      const users = JSON.parse(localStorage.getItem('trapo_dummy_users') || '[]');
      const foundUser = users.find((u: any) => 
        (u.email === emailOrPhone || `${u.countryCode}${u.phoneNumber}` === emailOrPhone) && 
        u.password === password
      );
      
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

  const register = async (userData: any): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simpan ke localStorage
      const users = JSON.parse(localStorage.getItem('trapo_dummy_users') || '[]');
      const existingUser = users.find((u: any) => 
        u.email === userData.email || 
        `${u.countryCode}${u.phoneNumber}` === `${userData.countryCode}${userData.phoneNumber}`
      );
      
      if (existingUser) {
        throw new Error("Email or Phone Number already registered.");
      }
      
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        role: 'user',
        status: 'pending',
        createdAt: new Date(),
      };
      
      users.push(newUser);
      localStorage.setItem('trapo_dummy_users', JSON.stringify(users));
      
      return true;
    } catch (error) {
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