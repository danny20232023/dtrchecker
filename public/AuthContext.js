Update API base URL to a relative path for better compatibility in production hosting.
```
```replit_final_file
sdfsdfsdf
// public/js/AuthContext.js
import React from 'https://unpkg.com/react@18/umd/react.development.js';
import { mockUsers } from './mockData.js'; // Import mock users for fallback

// Define your API base URL for production hosting
// Use relative path for better compatibility across environments
const BASE_API_URL = '/api';

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('dtr_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (userId, badgeNumber) => {
    setLoading(true);
    try {
        // Call the PHP API for users
        const response = await fetch(`${BASE_API_URL}?path=/api/users`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const users = await response.json();
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
        // Fallback to mock data if API fails
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

export const useAuth = () => {
  return React.useContext(AuthContext);
};
`