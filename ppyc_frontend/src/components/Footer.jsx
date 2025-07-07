import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICON_NAMES } from '../config/fontawesome';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="container-professional py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <img 
                src="/assets/images/file.svg"
                alt="Pleasant Park Yacht Club"
                className="h-16 w-auto mb-2 brightness-0 invert"
              />
              <div className="text-slate-400 text-sm">
                Excellence in Sailing Since 1910
              </div>
            </div>
            <p className="text-slate-300 mb-6 max-w-md">
              Join our prestigious yacht club and experience the finest in sailing, 
              marina services, and maritime community on the beautiful waters of Pleasant Park.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Follow us on Facebook"
              >
                <FontAwesomeIcon icon={ICON_NAMES.HOME} className="text-xl" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Follow us on Instagram"
              >
                <FontAwesomeIcon icon={ICON_NAMES.USER} className="text-xl" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Follow us on Twitter"
              >
                <FontAwesomeIcon icon={ICON_NAMES.CALENDAR} className="text-xl" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Connect on LinkedIn"
              >
                <FontAwesomeIcon icon={ICON_NAMES.EMAIL} className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-slate-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/membership" className="text-slate-300 hover:text-white transition-colors">
                  Membership
                </Link>
              </li>
              <li>
                <Link to="/marina" className="text-slate-300 hover:text-white transition-colors">
                  Marina Services
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-slate-300 hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-slate-300 hover:text-white transition-colors">
                  News
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FontAwesomeIcon icon={ICON_NAMES.HOME} className="text-amber-500 mt-1" />
                <span className="text-slate-300">
                  123 Harbor Drive<br />
                  Pleasant Park, NY 12345
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FontAwesomeIcon icon={ICON_NAMES.PHONE} className="text-amber-500" />
                <span className="text-slate-300">
                  (555) 123-4567
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FontAwesomeIcon icon={ICON_NAMES.EMAIL} className="text-amber-500" />
                <span className="text-slate-300">
                  info@ppyc.com
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            © {currentYear} Pleasant Park Yacht Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 