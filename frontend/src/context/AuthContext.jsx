import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const DEMO_CREDENTIALS = [
  { role: 'CITIZEN', label: 'Citizen', email: 'citizen@bhumisetu.in', name: 'Ramesh Patil', badge: 'bg-emerald-100 text-emerald-800' },
  { role: 'PLANNING_OFFICER', label: 'Planning Officer', email: 'planning@bhumisetu.in', name: 'Neha Kulkarni', badge: 'bg-blue-100 text-blue-800' },
  { role: 'REVENUE_OFFICER', label: 'Revenue Officer', email: 'revenue@bhumisetu.in', name: 'Santosh Jadhav', badge: 'bg-amber-100 text-amber-800' },
  { role: 'UTILITY_OFFICER', label: 'Utility Officer', email: 'utility@bhumisetu.in', name: 'Sunita Deshpande', badge: 'bg-cyan-100 text-cyan-800' },
  { role: 'ADMIN', label: 'System Admin', email: 'admin@bhumisetu.in', name: 'Amit Sharma', badge: 'bg-purple-100 text-purple-800' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bhumisetu_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('bhumisetu_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      authApi.getCurrentUser()
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('bhumisetu_user', JSON.stringify(res.data));
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const { token: jwtToken, user: userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('bhumisetu_token', jwtToken);
      localStorage.setItem('bhumisetu_user', JSON.stringify(userData));
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authApi.register(userData);
      const { token: jwtToken, user: userProfile } = res.data;
      setToken(jwtToken);
      setUser(userProfile);
      localStorage.setItem('bhumisetu_token', jwtToken);
      localStorage.setItem('bhumisetu_user', JSON.stringify(userProfile));
      return userProfile;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('bhumisetu_token');
    localStorage.removeItem('bhumisetu_user');
  };

  const quickLogin = async (email) => {
    return login(email, 'Demo@123');
  };

  const isCitizen = user?.role === 'CITIZEN';
  const isOfficer = ['REVENUE_OFFICER', 'PLANNING_OFFICER', 'TREE_OFFICER', 'UTILITY_OFFICER'].includes(user?.role);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isCitizen,
        isOfficer,
        isAdmin,
        login,
        register,
        logout,
        quickLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
