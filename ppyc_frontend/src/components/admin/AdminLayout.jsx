import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAuthenticated, loading, canViewAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication
  useEffect(() => {
    if (!loading && (!isAuthenticated || !canViewAdmin())) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, canViewAdmin, loading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <FontAwesomeIcon icon="anchor" className="fa-spin text-4xl text-blue-500 mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated || !canViewAdmin()) {
    return null;
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: 'tachometer-alt',
      current: location.pathname === '/admin'
    },
    {
      name: 'News',
      href: '/admin/news',
      icon: 'newspaper',
      current: location.pathname.startsWith('/admin/news')
    },
    {
      name: 'Events',
      href: '/admin/events',
      icon: 'calendar-alt',
      current: location.pathname.startsWith('/admin/events')
    },
    {
      name: 'Slides',
      href: '/admin/slides',
      icon: 'desktop',
      current: location.pathname.startsWith('/admin/slides')
    },
    {
      name: 'Media Library',
      href: '/admin/media',
      icon: 'images',
      current: location.pathname.startsWith('/admin/media')
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: 'cog',
      current: location.pathname.startsWith('/admin/settings')
    }
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 ${sidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity ease-linear duration-300`} 
             onClick={() => setSidebarOpen(false)}></div>
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white ${sidebarOpen ? 'transform-none' : '-translate-x-full'} transition transform ease-in-out duration-300`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <FontAwesomeIcon icon="times" className="text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <img className="h-8 w-auto" src="/assets/images/ppyclogo.png" alt="PPYC" />
              <span className="ml-2 text-lg font-bold text-gray-900">PPYC Admin</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`${
                    item.current
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-3 text-base font-medium rounded-md touch-manipulation`}
                >
                  <FontAwesomeIcon icon={item.icon} className={`${item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'} mr-4 text-lg`} />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white shadow">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <img className="h-8 w-auto" src="/assets/images/ppyclogo.png" alt="PPYC" />
                <span className="ml-2 text-xl font-bold text-gray-900">PPYC Admin</span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      item.current
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <FontAwesomeIcon icon={item.icon} className={`${item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'} mr-3 text-lg`} />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* User section */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white uppercase">
                      {user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex-shrink-0 ml-2 p-1 text-gray-400 hover:text-gray-500"
                  title="Sign out"
                >
                  <FontAwesomeIcon icon="sign-out-alt" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden touch-manipulation"
            onClick={() => setSidebarOpen(true)}
          >
            <FontAwesomeIcon icon="bars" className="text-lg" />
          </button>
          
          <div className="flex-1 px-3 sm:px-4 flex justify-between items-center">
            <div className="flex-1 flex min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
                {navigation.find(item => item.current)?.name || 'Admin'}
              </h1>
            </div>
            
            {/* Mobile user menu */}
            <div className="flex md:hidden items-center">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-xs font-medium text-white uppercase">
                  {user?.email?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            
            {/* Desktop user menu */}
            <div className="hidden md:ml-4 md:flex md:items-center md:space-x-4">
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white uppercase">
                    {user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg"
                  title="Sign out"
                >
                  <FontAwesomeIcon icon="sign-out-alt" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 