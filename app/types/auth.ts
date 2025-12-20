// types/auth.ts
export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  idCardImage?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// types/user.ts
export interface User {
  id: string;
  fullName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  role: 'user' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
}

// types/dashboard.ts
export interface DashboardStats {
  totalMembers: number;
  newThisMonth: number;
}