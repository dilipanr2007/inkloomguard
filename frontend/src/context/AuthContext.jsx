import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { PUBLIC_DEMO_MODE } from '../services/api';
import { DEMO_USERS } from '../services/demoData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // If Public Demo Mode is active, initialize immediately with demo manager profile
  const [user, setUser] = useState(() => {
    if (PUBLIC_DEMO_MODE) {
      const savedRole = localStorage.getItem('inkloom_demo_role') || 'manager';
      return DEMO_USERS[savedRole] || DEMO_USERS.manager;
    }
    const saved = localStorage.getItem('inkloom_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    if (PUBLIC_DEMO_MODE) return 'public-demo-token';
    return localStorage.getItem('inkloom_token') || null;
  });

  const [loading, setLoading] = useState(() => !PUBLIC_DEMO_MODE);

  useEffect(() => {
    if (PUBLIC_DEMO_MODE) {
      setLoading(false);
      return;
    }

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
    if (PUBLIC_DEMO_MODE) {
      localStorage.setItem('inkloom_demo_role', 'manager');
      setUser(DEMO_USERS.manager);
      return;
    }
    localStorage.removeItem('inkloom_token');
    localStorage.removeItem('inkloom_user');
    setToken(null);
    setUser(null);
  };

  const switchDemoRole = async (targetRole) => {
    if (PUBLIC_DEMO_MODE) {
      const selected = DEMO_USERS[targetRole] || DEMO_USERS.manager;
      localStorage.setItem('inkloom_demo_role', targetRole);
      setUser(selected);
      return selected;
    }

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
        isAuthenticated: PUBLIC_DEMO_MODE ? true : (!!user && !!token),
        isDemoMode: PUBLIC_DEMO_MODE,
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
