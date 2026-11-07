import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('inkloom_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('inkloom_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
          localStorage.setItem('inkloom_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.warn('[Auth Session Expired]');
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: jwtToken, user: userData } = res.data;
    localStorage.setItem('inkloom_token', jwtToken);
    localStorage.setItem('inkloom_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { token: jwtToken, user: newUser } = res.data;
    localStorage.setItem('inkloom_token', jwtToken);
    localStorage.setItem('inkloom_user', JSON.stringify(newUser));
    setToken(jwtToken);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('inkloom_token');
    localStorage.removeItem('inkloom_user');
    setToken(null);
    setUser(null);
  };

  const switchDemoRole = async (targetRole) => {
    const creds = {
      creator: { email: 'creator@freshplus.io', password: 'Creator123!' },
      reviewer: { email: 'reviewer@freshplus.io', password: 'Reviewer123!' },
      manager: { email: 'manager@freshplus.io', password: 'Manager123!' }
    }[targetRole];

    if (creds) {
      return await login(creds.email, creds.password);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
