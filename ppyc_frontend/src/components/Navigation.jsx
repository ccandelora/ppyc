import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICON_NAMES } from '../config/fontawesome';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for navigation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Add keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Navigation items with FontAwesome icons
  const navItems = [
    { name: 'Home', path: '/', icon: ICON_NAMES.HOME },
    { name: 'About', path: '/about', icon: ICON_NAMES.INFO },
    { name: 'News', path: '/news', icon: ICON_NAMES.NEWS },
    { name: 'Events', path: '/events', icon: ICON_NAMES.CALENDAR },
    { name: 'Marina', path: '/marina', icon: ICON_NAMES.ANCHOR },
    { name: 'Membership', path: '/membership', icon: ICON_NAMES.USERS },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`nav-professional ${isScrolled ? 'nav-scrolled' : 'nav-transparent'}`}>
      <div className="container-professional">
        <div className="flex items-center justify-between h-20">
          {/* Professional Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="/assets/images/file.svg"
              alt="Pleasant Park Yacht Club"
              className="h-12 w-auto"
              loading="eager"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link ${
                  isActive(item.path)
                    ? 'nav-link-active'
                    : 'nav-link-default'
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="mr-2" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Professional Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* TV Display Button */}
            <Link
              to="/tv-display"
              className="hidden md:inline-flex btn-tertiary"
            >
              <FontAwesomeIcon icon={ICON_NAMES.HOME} className="mr-2" />
              TV Display
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <FontAwesomeIcon 
                icon={isMenuOpen ? ICON_NAMES.CLOSE : ICON_NAMES.MENU} 
                className="text-xl text-slate-700"
              />
            </button>
          </div>
        </div>

        {/* Professional Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-6 border-t border-gray-200">
            <div className="pt-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`mobile-nav-link ${
                    isActive(item.path)
                      ? 'mobile-nav-link-active'
                      : 'mobile-nav-link-default'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={item.icon} className="mr-3" />
                  {item.name}
                </Link>
              ))}
              
              <hr className="my-4 border-gray-200" />
              
              {/* TV Display for Mobile */}
              <Link
                to="/tv-display"
                className="mobile-nav-link mobile-nav-link-default"
                onClick={() => setIsMenuOpen(false)}
              >
                <FontAwesomeIcon icon={ICON_NAMES.HOME} className="mr-3" />
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