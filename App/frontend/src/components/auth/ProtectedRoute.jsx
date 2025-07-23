// components/auth/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from '../common/Sidebar';

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);
  const { theme } = useTheme();

  if (loading) return (
    <div className={`flex justify-center items-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
  
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar />
      <div className="flex-1 md:ml-64 pt-20 md:pt-0">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;