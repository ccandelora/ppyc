import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICON_NAMES } from '../config/fontawesome';
import { useSettings } from '../hooks/useSettings';

function Footer() {
  const currentYear = new Date().getFullYear();
  const { 
    contactEmail, 
    contactPhone, 
    address, 
    facebookUrl, 
    twitterUrl, 
    instagramUrl, 
    linkedinUrl 
  } = useSettings();

  // Helper function to render social link if URL exists
  const renderSocialLink = (url, iconName, label) => {
    if (!url) return null;
    
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate-400 hover:text-white transition-colors"
        aria-label={label}
      >
        <FontAwesomeIcon icon={iconName} className="text-xl" />
      </a>
    );
  };

  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="container-professional py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <img 
                src="/assets/images/ppyclogo.png"
                alt="Pleasant Park Yacht Club"
                className="h-16 w-auto mb-2 bg-white rounded-lg p-2"
              />
              <div className="text-slate-400 text-sm">
                Excellence in Boating Since 1910
              </div>
            </div>
            <p className="text-slate-300 mb-6 max-w-md">
              Join our prestigious yacht club and experience the finest in boating, 
              marina services, and maritime community on the beautiful waters of Pleasant Park.
            </p>
            
            {/* Social Links - Only show if URLs are configured */}
            <div className="flex space-x-4">
              {renderSocialLink(facebookUrl, ICON_NAMES.FACEBOOK, 'Follow us on Facebook')}
              {renderSocialLink(instagramUrl, ICON_NAMES.INSTAGRAM, 'Follow us on Instagram')}
              {renderSocialLink(twitterUrl, ICON_NAMES.TWITTER, 'Follow us on Twitter')}
              {renderSocialLink(linkedinUrl, ICON_NAMES.LINKEDIN, 'Connect on LinkedIn')}
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
                <Link to="/heritage" className="text-slate-300 hover:text-white transition-colors">
                  Club Heritage
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
                  {address}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FontAwesomeIcon icon={ICON_NAMES.PHONE} className="text-amber-500" />
                <a 
                  href={`tel:${contactPhone.replace(/[^0-9]/g, '')}`}
                  className="text-slate-300 hover:text-white hover:underline transition-colors duration-200"
                >
                  {contactPhone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FontAwesomeIcon icon={ICON_NAMES.ENVELOPE} className="text-amber-500" />
                <a 
                  href={`mailto:${contactEmail}`}
                  className="text-slate-300 hover:text-white hover:underline transition-colors duration-200"
                >
                  {contactEmail}
                </a>
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