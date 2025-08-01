    import React, { useState, useEffect, createContext, useContext } from 'react';
    import { mockUsers } from './mockData'; // Import mockUsers from mockData.js

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

      // Login function: simulates authenticating a user against mock data.
      const login = async (userId, badgeNumber) => { // Removed 'export' here as it's not needed for internal AuthProvider function
        setLoading(true);
        // Simulate API call to backend for authentication
        return new Promise((resolve) => {
          setTimeout(() => { // Simulate network delay
            const foundUser = mockUsers.find(
              (u) => u.USERID === parseInt(userId) && u.BADGENUMBER === badgeNumber
            );
            if (foundUser) {
              setUser(foundUser);
              localStorage.setItem('dtr_user', JSON.stringify(foundUser)); // Store user in local storage
              resolve({ success: true, user: foundUser });
            } else {
              resolve({ success: false, message: 'Invalid User ID or Badge Number' });
            }
            setLoading(false);
          }, 500);
        });
      };

      // Logout function: clears user state and removes from local storage.
      const logout = () => { // Removed 'export' here as it's not needed for internal AuthProvider function
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
    