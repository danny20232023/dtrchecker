import React, { useState, useEffect, createContext, useContext } from 'react';
// import { mockUsers } from './mockData'; // No longer needed, fetching from API

// Define your API base URL. This will be a Laravel route.
// Assuming your Laravel app runs on http://localhost and you'll define /api/dtr/users route
const BASE_API_URL = 'http://localhost/api/dtr'; // IMPORTANT: Adjust if your Laravel URL is different

// AuthContext provides a way to share user authentication state across the component tree
// without having to pass props down manually at every level.
const AuthContext = createContext(null);

// AuthProvider is a component that wraps your application and provides the authentication context.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate checking for a logged-in user (e.g., from session storage) on initial load.
  useEffect(() => {
    const storedUser = localStorage.getItem('dtr_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function: now fetches user data from the Laravel backend.
  const login = async (userId, badgeNumber) => {
    setLoading(true);
    try {
      // Fetch all users from the Laravel API
      const response = await fetch(`${BASE_API_URL}/users`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const users = await response.json();
      const foundUser = users.find(
        (u) => u.USERID === parseInt(userId) && u.BADGENUMBER === badgeNumber
      );

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('dtr_user', JSON.stringify(foundUser)); // Store user in local storage
        return { success: true, user: foundUser };
      } else {
        return { success: false, message: 'Invalid User ID or Badge Number' };
      }
    } catch (error) {
      console.error("Login API call failed:", error);
      return { success: false, message: 'Could not connect to authentication server. Please check backend.' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function: clears user state and removes from local storage.
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

// Custom hook to easily consume the AuthContext in any component.
export const useAuth = () => {
  return useContext(AuthContext);
};
