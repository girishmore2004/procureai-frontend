import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('procureai_user');
    const token = localStorage.getItem('procureai_token');
    if (stored && token) {
      setUser(JSON.parse(stored));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = (userData, accessToken, refreshToken) => {
    localStorage.setItem('procureai_token', accessToken);
    localStorage.setItem('procureai_refresh', refreshToken);
    localStorage.setItem('procureai_user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('procureai_token');
    localStorage.removeItem('procureai_refresh');
    localStorage.removeItem('procureai_user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const can = (permission) => user?.permissions?.includes(permission);
  const canAny = (...permissions) => permissions.some((p) => user?.permissions?.includes(p));

  return (
    <AuthContext.Provider value={{ user, login, logout, can, canAny, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
