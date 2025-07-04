import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/assets/images/file.svg" 
              alt="PPYC Burgee" 
              className="w-16 h-16 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden md:block">
              <div className="text-xl font-bold text-slate-800 leading-tight">
                Pleasant Park
              </div>
              <div className="text-sm font-medium text-blue-600 tracking-wide">
                YACHT CLUB
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-slate-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-2"
            >
              <i className="fas fa-home"></i>
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-slate-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-2"
            >
              <i className="fas fa-anchor"></i>
              About
            </Link>
            <Link 
              to="/heritage" 
              className="text-slate-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-2"
            >
              <i className="fas fa-scroll"></i>
              Heritage
            </Link>
            <Link 
              to="/events" 
              className="text-slate-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-2"
            >
              <i className="fas fa-calendar-alt"></i>
              Events
            </Link>
            <Link 
              to="/news" 
              className="text-slate-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-2"
            >
              <i className="fas fa-newspaper"></i>
              News
            </Link>
            <Link 
              to="/marina" 
              className="text-slate-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-2"
            >
              <i className="fas fa-ship"></i>
              Marina
            </Link>
            <Link 
              to="/membership" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <i className="fas fa-users"></i>
              Membership
            </Link>
            
            <Link
              to="/tv-display"
              className="ml-2 px-4 py-2 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
              title="TV Display"
            >
              <i className="fas fa-tv"></i>
              TV
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-home mr-2"></i>
                Home
              </Link>

              <Link
                to="/about"
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/about') 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-anchor mr-2"></i>
                About
              </Link>

              <Link
                to="/heritage"
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/heritage') 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-scroll mr-2"></i>
                Heritage
              </Link>

              <Link
                to="/events"
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/events') 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-calendar-alt mr-2"></i>
                Events
              </Link>

              <Link
                to="/news"
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/news') 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-newspaper mr-2"></i>
                News
              </Link>

              <Link
                to="/marina"
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/marina') 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-ship mr-2"></i>
                Marina
              </Link>

              <Link
                to="/membership"
                className="mx-4 mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-users mr-2"></i>
                Membership
              </Link>

              <Link
                to="/tv-display"
                className="mx-4 px-4 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-tv mr-2"></i>
                TV Display
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation; 