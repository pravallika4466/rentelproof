import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('rentalproof_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('rentalproof_token') || null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('rentalproof_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('rentalproof_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.error('Session check failed:', error);
          logout(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: newToken, user: newUser } = res.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('rentalproof_token', newToken);
        localStorage.setItem('rentalproof_user', JSON.stringify(newUser));
        showToast(`Welcome back, ${newUser.name}!`, 'success');
        return { success: true, user: newUser };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  // 1-Click Demo Login (Auto-provisions demo accounts if database is fresh)
  const demoLogin = async (role) => {
    try {
      const res = await api.post('/auth/demo', { role });
      if (res.data.success) {
        const { token: newToken, user: newUser } = res.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('rentalproof_token', newToken);
        localStorage.setItem('rentalproof_user', JSON.stringify(newUser));
        showToast(`Signed in as ${newUser.name}`, 'success');
        return { success: true, user: newUser };
      }
    } catch (error) {
      // Fallback to standard login attempt
      const fallbackCreds = {
        landlord: { email: 'landlord@rentalproof.com', password: 'Password123!' },
        tenant: { email: 'tenant@rentalproof.com', password: 'Password123!' },
        service_provider: { email: 'service@rentalproof.com', password: 'Password123!' },
        admin: { email: 'admin@rentalproof.com', password: 'Password123!' },
      };
      const targetCreds = fallbackCreds[role];
      if (targetCreds) {
        return await login(targetCreds.email, targetCreds.password);
      }
      const message = error.response?.data?.message || 'Demo login failed.';
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        const { token: newToken, user: newUser } = res.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('rentalproof_token', newToken);
        localStorage.setItem('rentalproof_user', JSON.stringify(newUser));
        showToast('Registration successful! Welcome.', 'success');
        return { success: true, user: newUser };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  const logout = (notify = true) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('rentalproof_token');
    localStorage.removeItem('rentalproof_user');
    if (notify) {
      showToast('You have been signed out.', 'info');
    }
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
    localStorage.setItem('rentalproof_user', JSON.stringify({ ...user, ...updatedUser }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        demoLogin,
        register,
        logout,
        updateUser,
        isAuthenticated: !!token && !!user,
        isLandlord: user?.role === 'landlord',
        isTenant: user?.role === 'tenant',
        isServiceProvider: user?.role === 'service_provider',
        isAdmin: user?.role === 'admin',
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
