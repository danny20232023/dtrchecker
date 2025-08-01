// public/main.js
import React from 'https://unpkg.com/react@18/umd/react.development.js';
import ReactDOM from 'https://unpkg.com/react-dom@18/umd/react-dom.development.js';
import { AuthProvider, useAuth } from './AuthContext.js';
import { Login } from './login.js';
import { Dashboard } from './Dashboard.js';

// Main AppContent component to handle routing based on authentication
const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <svg className="animate-spin h-12 w-12 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-4 text-xl text-gray-700">Loading application...</span>
      </div>
    );
  }

  let content;
  if (user !== null) {
    content = <Dashboard />;
  } else {
    content = <Login />;
  }

  return content;
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// Render the application
ReactDOM.createRoot(document.getElementById('root')).render(<App />);