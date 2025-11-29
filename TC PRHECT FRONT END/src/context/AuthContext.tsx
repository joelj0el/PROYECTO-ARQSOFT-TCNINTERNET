import React, { useState } from 'react';
import type { User } from '../types';
import api from '../config/api';
import { AuthContext, type RegisterData } from './auth-context';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
        return null;
      }
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user');
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken || storedToken === 'undefined' || storedToken === 'null') {
      return null;
    }
    return storedToken;
  });

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: newToken, usuario } = response.data.data;
    
    setToken(newToken);
    setUser(usuario);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(usuario));
  };

  const register = async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    const { token: newToken, usuario } = response.data.data;
    
    setToken(newToken);
    setUser(usuario);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(usuario));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const isAdmin = user?.rol === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
