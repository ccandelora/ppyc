import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requirePermission = null }) => {
  const { isAuthenticated, loading, user, canViewAdmin, canEditContent, canManageUsers, canManageMedia } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <i className="fas fa-anchor fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check specific permissions if required
  if (requirePermission) {
    let hasPermission = false;

    switch (requirePermission) {
      case 'admin':
        hasPermission = canViewAdmin();
        break;
      case 'edit_content':
        hasPermission = canEditContent();
        break;
      case 'manage_users':
        hasPermission = canManageUsers();
        break;
      case 'manage_media':
        hasPermission = canManageMedia();
        break;
      default:
        hasPermission = true;
    }

    if (!hasPermission) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <i className="fas fa-lock text-red-500 text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Required permission: {requirePermission.replace('_', ' ')}
            </p>
            <p className="text-sm text-gray-500">
              Your role: {user?.role}
            </p>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute; 