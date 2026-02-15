
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'mvs_aqua_auth_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
    } catch (e) {
      console.error("Auth persistence failed", e);
      if (typeof window !== 'undefined') localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Demo Credentials
    // Username: admin
    // Password: mvs_aqua_pass
    if (username === 'admin' && password === 'mvs_aqua_pass') {
      const newUser: User = {
        id: 'admin_1',
        name: 'Aqua Admin',
        role: Role.ADMIN,
      };
      setUser(newUser);
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
        }
      } catch (e) {
        console.error("Failed to save auth to storage", e);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to clear auth storage", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
