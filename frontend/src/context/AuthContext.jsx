import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { PUBLIC_DEMO_MODE } from '../services/api';
import { DEMO_USERS } from '../services/demoData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // If Public Demo Mode is active, initialize with demo profile unless explicitly logged out
  const [user, setUser] = useState(() => {
    if (PUBLIC_DEMO_MODE) {
      const isLoggedOut = localStorage.getItem('inkloom_demo_logged_out') === 'true';
      if (isLoggedOut) return null;
      const savedRole = localStorage.getItem('inkloom_demo_role') || 'manager';
      return DEMO_USERS[savedRole] || DEMO_USERS.manager;
    }
    const saved = localStorage.getItem('inkloom_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    if (PUBLIC_DEMO_MODE) {
      const isLoggedOut = localStorage.getItem('inkloom_demo_logged_out') === 'true';
      if (isLoggedOut) return null;
      return 'public-demo-token';
    }
    return localStorage.getItem('inkloom_token') || null;
  });

  const [loading, setLoading] = useState(() => !PUBLIC_DEMO_MODE);
  const [tourOpen, setTourOpen] = useState(false);

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
    if (PUBLIC_DEMO_MODE) {
      let matchedRole = 'manager';
      const em = (email || '').toLowerCase();
      if (em.includes('creator')) matchedRole = 'creator';
      else if (em.includes('reviewer')) matchedRole = 'reviewer';
      else if (em.includes('manager')) matchedRole = 'manager';

      const userData = DEMO_USERS[matchedRole] || DEMO_USERS.manager;
      localStorage.removeItem('inkloom_demo_logged_out');
      localStorage.setItem('inkloom_demo_role', matchedRole);
      localStorage.setItem('inkloom_token', 'public-demo-token');
      localStorage.setItem('inkloom_user', JSON.stringify(userData));
      setToken('public-demo-token');
      setUser(userData);
      return userData;
    }

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
      localStorage.setItem('inkloom_demo_logged_out', 'true');
      localStorage.removeItem('inkloom_token');
      localStorage.removeItem('inkloom_user');
      localStorage.removeItem('inkloom_onboarding_status');
      setToken(null);
      setUser(null);
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
      localStorage.removeItem('inkloom_demo_logged_out');
      localStorage.setItem('inkloom_demo_role', targetRole);
      localStorage.setItem('inkloom_token', 'public-demo-token');
      localStorage.setItem('inkloom_user', JSON.stringify(selected));
      setToken('public-demo-token');
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

  const updateOnboarding = async ({ completed, skipped, version = 1 }) => {
    const payload = { completed, skipped, version };

    // Persist locally for immediate offline/demo resilience
    localStorage.setItem('inkloom_onboarding_status', JSON.stringify(payload));

    if (PUBLIC_DEMO_MODE) {
      const currentRole = user?.role || 'manager';
      if (DEMO_USERS[currentRole]) {
        DEMO_USERS[currentRole].onboarding = {
          completed: completed !== undefined ? completed : DEMO_USERS[currentRole].onboarding?.completed || false,
          skipped: skipped !== undefined ? skipped : DEMO_USERS[currentRole].onboarding?.skipped || false,
          version: version || 1
        };
      }
      setUser((prev) => ({
        ...prev,
        onboarding: {
          completed: completed !== undefined ? completed : prev?.onboarding?.completed || false,
          skipped: skipped !== undefined ? skipped : prev?.onboarding?.skipped || false,
          version: version || 1
        }
      }));
      return payload;
    }

    try {
      const res = await api.patch('/auth/onboarding', payload);
      if (res.data?.user || res.data?.onboarding) {
        setUser((prev) => ({
          ...prev,
          onboarding: res.data.onboarding || res.data.user.onboarding
        }));
      }
      return res.data;
    } catch (err) {
      console.warn('[Onboarding Update Warning]', err.message);
      return payload;
    }
  };

  const startTour = () => setTourOpen(true);
  const closeTour = () => setTourOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user && token),
        isDemoMode: PUBLIC_DEMO_MODE,
        login,
        register,
        logout,
        switchDemoRole,
        tourOpen,
        startTour,
        closeTour,
        updateOnboarding
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
