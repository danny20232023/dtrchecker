
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from './types';
import { mockUsers } from './mockData';

const BASE_API_URL = '/api';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('dtr_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (userId: string, badgeNumber: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}?path=/api/users`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const users: User[] = await response.json();
      const foundUser = users.find(
        (u) => u.USERID === parseInt(userId) && u.BADGENUMBER === badgeNumber
      );

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('dtr_user', JSON.stringify(foundUser));
        return { success: true, user: foundUser };
      } else {
        return { success: false, message: 'Invalid User ID or Badge Number' };
      }
    } catch (error) {
      console.error("Login API call failed, falling back to mock data:", error);
      const foundUser = mockUsers.find(
        (u) => u.USERID === parseInt(userId) && u.BADGENUMBER === badgeNumber
      );
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('dtr_user', JSON.stringify(foundUser));
        return { success: true, user: foundUser, fallback: true };
      } else {
        return { success: false, message: 'Invalid User ID or Badge Number (mock data fallback failed)' };
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dtr_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
