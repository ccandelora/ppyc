import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for navigation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Navigation items
  const navItems = [
    { path: '/', label: 'Home', icon: 'fas fa-home' },
    { path: '/about', label: 'About', icon: 'fas fa-anchor' },
    { path: '/heritage', label: 'Heritage', icon: 'fas fa-scroll' },
    { path: '/events', label: 'Events', icon: 'fas fa-calendar-alt' },
    { path: '/news', label: 'News', icon: 'fas fa-newspaper' },
    { path: '/marina', label: 'Marina', icon: 'fas fa-ship' },
  ];

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/50' 
          : 'bg-white/90 backdrop-blur-sm shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
              <div className="relative">
                <img 
                  src="/assets/images/file.svg" 
                  alt="PPYC Burgee" 
                  className="w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 rounded-full bg-blue-600/20 scale-0 group-hover:scale-125 transition-transform duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <div className="text-lg md:text-xl font-bold text-slate-800 leading-tight">
                  Pleasant Park
                </div>
                <div className="text-xs md:text-sm font-semibold text-blue-600 tracking-wider">
                  YACHT CLUB
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105 ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <i className={`${item.icon} text-sm`}></i>
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
              
              <Link
                to="/membership"
                className="ml-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <i className="fas fa-users text-sm"></i>
                <span className="text-sm">Membership</span>
              </Link>
              
              <Link
                to="/tv-display"
                className="ml-2 px-4 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-all duration-200 flex items-center gap-2 hover:scale-105"
                title="TV Display"
              >
                <i className="fas fa-tv text-sm"></i>
                <span className="text-sm">TV</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                className="w-6 h-6 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 z-50 lg:hidden ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/images/file.svg" 
                alt="PPYC" 
                className="w-8 h-8"
              />
              <div>
                <div className="text-lg font-bold text-slate-800">Pleasant Park</div>
                <div className="text-xs font-semibold text-blue-600 tracking-wider">YACHT CLUB</div>
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              aria-label="Close menu"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex-1 overflow-y-auto py-6">
            <div className="px-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className={`${item.icon} text-lg w-5 text-center`}></i>
                  <span className="text-base">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile CTA Buttons */}
            <div className="px-6 mt-8 space-y-3">
              <Link
                to="/membership"
                className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-users text-lg"></i>
                <span>Join Our Community</span>
              </Link>
              
              <Link
                to="/tv-display"
                className="flex items-center justify-center gap-3 w-full px-6 py-4 border border-slate-300 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-tv text-lg"></i>
                <span>TV Display</span>
              </Link>
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="border-t border-slate-200 p-6">
            <div className="text-center text-slate-600">
              <p className="text-sm font-medium">Pleasant Park Yacht Club</p>
              <p className="text-xs text-slate-500 mt-1">Excellence since 1910</p>
              <div className="flex justify-center gap-4 mt-4">
                <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                  <i className="fab fa-facebook-f text-lg"></i>
                </a>
                <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                  <i className="fab fa-instagram text-lg"></i>
                </a>
                <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                  <i className="fab fa-twitter text-lg"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed navigation */}
      <div className="h-16 md:h-20"></div>
    </>
  );
}

export default Navigation; 