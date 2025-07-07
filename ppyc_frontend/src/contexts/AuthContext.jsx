import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setHasCheckedAuth(true);
  }, []);

  const checkAuth = async () => {
    if (hasCheckedAuth && !user) {
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.me();
      if (response.data.success) {
        const userData = response.data.data.user;
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
      }
    } catch {
      console.log('Auth check: User not authenticated (normal for public pages)');
      setUser(null);
      localStorage.removeItem('currentUser');
    } finally {
      setLoading(false);
      setHasCheckedAuth(true);
    }
  };

  const ensureAuthChecked = async () => {
    if (!hasCheckedAuth) {
      await checkAuth();
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authAPI.login({ email, password });
      
      if (response.data.success) {
        const userData = response.data.data.user;
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setHasCheckedAuth(true);
        return { success: true };
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setError(null);
      setHasCheckedAuth(true);
      localStorage.removeItem('currentUser');
    }
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const canViewAdmin = () => {
    return user && ['superuser', 'admin', 'editor', 'member'].includes(user.role);
  };

  const canEditContent = () => {
    return user && ['superuser', 'admin', 'editor', 'member'].includes(user.role);
  };

  const canManageUsers = () => {
    return user && ['superuser', 'admin'].includes(user.role);
  };

  const canManageMedia = () => {
    return user && ['superuser', 'admin', 'editor', 'member'].includes(user.role);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
    ensureAuthChecked,
    isAuthenticated: !!user,
    hasRole,
    canViewAdmin,
    canEditContent,
    canManageUsers,
    canManageMedia,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider }; 