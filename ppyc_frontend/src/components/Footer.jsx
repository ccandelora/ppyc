import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Club Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/assets/images/file.svg" 
                alt="PPYC" 
                className="w-8 h-8"
              />
              <h3 className="text-xl font-bold text-white">PPYC</h3>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Promoting navigation excellence and maritime fellowship since 1910.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-anchor text-sm"></i>
                  About PPYC
                </Link>
              </li>
              <li>
                <Link to="/membership" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-users text-sm"></i>
                  Membership
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-calendar-alt text-sm"></i>
                  Events
                </Link>
              </li>
              <li>
                <Link to="/marina" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-ship text-sm"></i>
                  Marina
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-3">
                <i className="fas fa-map-marker-alt text-blue-400"></i>
                <span>123 Marina Dr<br />Pleasant Park, MI 48000</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-phone text-blue-400"></i>
                <a href="tel:248-555-7245" className="hover:text-white transition-colors">
                  (248) 555-SAIL
                </a>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-envelope text-blue-400"></i>
                <a href="mailto:info@ppyc.org" className="hover:text-white transition-colors">
                  info@ppyc.org
                </a>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-broadcast-tower text-blue-400"></i>
                <span>VHF Channel 68</span>
              </li>
            </ul>
          </div>

          {/* Mission */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-gray-300 leading-relaxed text-sm">
              Encouraging proficiency in navigation, seamanship, and yacht management while promoting the social welfare of our maritime community.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <i className="fas fa-calendar text-blue-400"></i>
                Established 1910
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              <p>
                © {currentYear} Pleasant Park Yacht Club. All rights reserved.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link 
                to="/privacy" 
                className="hover:text-blue-300 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="hover:text-blue-300 transition-colors duration-200"
              >
                Terms of Use
              </Link>
              <Link 
                to="/contact" 
                className="hover:text-blue-300 transition-colors duration-200"
              >
                Contact
              </Link>
            </div>

            {/* Social Links (Placeholder) */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-300 transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-300 transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297L6.989 14.125c.613.613 1.407.918 2.448.918 1.297 0 2.345-.613 2.345-1.531 0-.918-.918-1.224-1.836-1.531-1.224-.408-2.55-.918-2.55-2.448 0-1.326 1.123-2.345 2.652-2.345 1.224 0 2.244.408 3.061 1.123l-1.469 1.469c-.51-.51-1.224-.816-1.898-.816-.918 0-1.531.408-1.531 1.123 0 .714.714.918 1.531 1.224 1.326.408 2.856.918 2.856 2.754.001 1.632-1.225 2.723-2.754 2.723zm8.163-8.878h-1.938v7.347h-1.938v-7.347h-1.938V6.172h5.814v1.938z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-950 py-4">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center text-gray-500 text-xs space-y-1">
            <p>
              Pleasant Park Yacht Club • Promoting excellence in navigation and seamanship since 1910
            </p>
            <p>
              Videos by <a href="https://www.pexels.com/@sururi-ballida-director/" className="text-blue-400 hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">Sururi Ballıdağ</a> from Pexels, <a href="https://www.vecteezy.com/members/daruna-tha" className="text-blue-400 hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">daruna.tha</a> from Vecteezy, <a href="https://www.vecteezy.com/members/embarafootage" className="text-blue-400 hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">Febian Nurrahman Saktinegara</a> from Vecteezy, <a href="https://www.vecteezy.com/members/kraynovkin556701" className="text-blue-400 hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">Yuriy Kraynov</a> from Vecteezy, and <a href="https://www.vecteezy.com/members/igor229346" className="text-blue-400 hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">Igor Zhorov</a> from Vecteezy
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 