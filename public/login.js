// public/js/Login.js
import React from 'https://unpkg.com/react@18/umd/react.development.js';
import { useAuth } from './AuthContext.js';
import { mockUsers } from './mockData.js'; // Import mockUsers for test accounts display

export const Login = () => {
  const [userId, setUserId] = React.useState('');
  const [badgeNumber, setBadgeNumber] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(userId, badgeNumber);
    if (!result.success) {
      setError(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-4xl font-extrabold text-center text-indigo-800 mb-8">
          DTR Checker Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
              User ID
            </label>
            <input
              id="userId"
              name="userId"
              type="number"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g., 101"
            />
          </div>
          <div>
            <label htmlFor="badgeNumber" className="block text-sm font-medium text-gray-700">
              Badge Number
            </label>
            <input
              id="badgeNumber"
              name="badgeNumber"
              type="text"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={badgeNumber}
              onChange={(e) => setBadgeNumber(e.target.value)}
              placeholder="e.g., EMP001"
            />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600">
          <span className="font-bold text-gray-800">Test Accounts:</span>
          <br />
          <span className="font-mono text-xs">User ID: 101, Badge: EMP001 (Engineering)</span>
          <br />
          <span className="font-mono text-xs">User ID: 102, Badge: EMP002 (Engineering)</span>
          <br />
          <span className="font-mono text-xs">User ID: 103, Badge: EMP003 (Sales)</span>
          <br />
          <span className="font-mono text-xs">User ID: 104, Badge: EMP004 (Human Resources)</span>
        </p>
      </div>
    </div>
  );
};
