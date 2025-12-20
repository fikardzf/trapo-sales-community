// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// API methods
export const authAPI = {
  login: (credentials: LoginCredentials) => 
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    
  register: (userData: RegisterData) => 
    apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    
  logout: () => 
    apiRequest('/api/auth/logout', {
      method: 'POST',
    }),
};

export const usersAPI = {
  getAll: () => apiRequest('/api/users'),
  getById: (id: string) => apiRequest(`/api/users/${id}`),
  updateStatus: (id: string, status: string) => 
    apiRequest(`/api/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

export const dashboardAPI = {
  getStats: () => apiRequest('/api/dashboard/stats'),
  getAnnouncements: () => apiRequest('/api/dashboard/announcements'),
};