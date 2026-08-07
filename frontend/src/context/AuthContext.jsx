import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('cartrescue_user');
    const token = localStorage.getItem('cartrescue_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await apiClient.post('/auth/login', { username, password });
      if (response.data.success) {
        const authData = response.data.data;
        localStorage.setItem('cartrescue_token', authData.token);
        localStorage.setItem('cartrescue_user', JSON.stringify(authData));
        setUser(authData);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Authentication failed. Please check credentials.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('cartrescue_token');
    localStorage.removeItem('cartrescue_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
