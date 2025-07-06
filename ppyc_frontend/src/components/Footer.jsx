import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
      </div>
      
      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Club Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <img 
                  src="/assets/images/file.svg" 
                  alt="PPYC" 
                  className="w-10 h-10 opacity-90"
                />
                <div className="absolute inset-0 rounded-full bg-blue-400/20 scale-150 blur-sm"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Pleasant Park</h3>
                <p className="text-xs font-semibold text-blue-300 tracking-wider">YACHT CLUB</p>
              </div>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed text-sm lg:text-base">
              Promoting navigation excellence and maritime fellowship since 1910.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f text-lg"></i>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram text-lg"></i>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter text-lg"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <i className="fas fa-compass text-blue-400"></i>
              Navigation
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/about" 
                  className="text-slate-300 hover:text-blue-300 transition-colors duration-200 flex items-center gap-3 group text-sm lg:text-base"
                >
                  <i className="fas fa-anchor text-blue-400 w-4 text-center group-hover:scale-110 transition-transform"></i>
                  About PPYC
                </Link>
              </li>
              <li>
                <Link 
                  to="/heritage" 
                  className="text-slate-300 hover:text-blue-300 transition-colors duration-200 flex items-center gap-3 group text-sm lg:text-base"
                >
                  <i className="fas fa-scroll text-blue-400 w-4 text-center group-hover:scale-110 transition-transform"></i>
                  Our Heritage
                </Link>
              </li>
              <li>
                <Link 
                  to="/membership" 
                  className="text-slate-300 hover:text-blue-300 transition-colors duration-200 flex items-center gap-3 group text-sm lg:text-base"
                >
                  <i className="fas fa-users text-blue-400 w-4 text-center group-hover:scale-110 transition-transform"></i>
                  Membership
                </Link>
              </li>
              <li>
                <Link 
                  to="/marina" 
                  className="text-slate-300 hover:text-blue-300 transition-colors duration-200 flex items-center gap-3 group text-sm lg:text-base"
                >
                  <i className="fas fa-ship text-blue-400 w-4 text-center group-hover:scale-110 transition-transform"></i>
                  Marina Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Activities */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <i className="fas fa-calendar text-blue-400"></i>
              Activities
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/events" 
                  className="text-slate-300 hover:text-blue-300 transition-colors duration-200 flex items-center gap-3 group text-sm lg:text-base"
                >
                  <i className="fas fa-calendar-alt text-blue-400 w-4 text-center group-hover:scale-110 transition-transform"></i>
                  Events & Racing
                </Link>
              </li>
              <li>
                <Link 
                  to="/news" 
                  className="text-slate-300 hover:text-blue-300 transition-colors duration-200 flex items-center gap-3 group text-sm lg:text-base"
                >
                  <i className="fas fa-newspaper text-blue-400 w-4 text-center group-hover:scale-110 transition-transform"></i>
                  Club News
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-slate-300 hover:text-blue-300 transition-colors duration-200 flex items-center gap-3 group text-sm lg:text-base"
                >
                  <i className="fas fa-graduation-cap text-blue-400 w-4 text-center group-hover:scale-110 transition-transform"></i>
                  Training Programs
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-slate-300 hover:text-blue-300 transition-colors duration-200 flex items-center gap-3 group text-sm lg:text-base"
                >
                  <i className="fas fa-trophy text-blue-400 w-4 text-center group-hover:scale-110 transition-transform"></i>
                  Competitions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <i className="fas fa-map-marker-alt text-blue-400"></i>
              Contact Info
            </h3>
            <ul className="space-y-4 text-slate-300">
              <li className="flex items-start gap-3 text-sm lg:text-base">
                <i className="fas fa-map-marker-alt text-blue-400 mt-1 flex-shrink-0"></i>
                <div>
                  <span className="block font-medium text-white">123 Marina Drive</span>
                  <span className="text-slate-400">Pleasant Park, MI 48000</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm lg:text-base">
                <i className="fas fa-phone text-blue-400 flex-shrink-0"></i>
                <a 
                  href="tel:248-555-7245" 
                  className="hover:text-blue-300 transition-colors font-medium"
                >
                  (248) 555-SAIL
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm lg:text-base">
                <i className="fas fa-envelope text-blue-400 flex-shrink-0"></i>
                <a 
                  href="mailto:info@ppyc.org" 
                  className="hover:text-blue-300 transition-colors font-medium"
                >
                  info@ppyc.org
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm lg:text-base">
                <i className="fas fa-radio text-blue-400 flex-shrink-0"></i>
                <span className="font-medium">VHF Channel 68</span>
              </li>
            </ul>
            
            {/* Newsletter Signup */}
            <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <h4 className="text-white font-medium mb-2 text-sm">Stay Updated</h4>
              <p className="text-slate-400 text-xs mb-3">Get club news and events</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 mt-12 lg:mt-16 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            
            {/* Copyright */}
            <div className="text-slate-400 text-sm text-center lg:text-left">
              <p className="flex items-center gap-2 justify-center lg:justify-start">
                <i className="fas fa-copyright text-blue-400"></i>
                <span>{currentYear} Pleasant Park Yacht Club. All rights reserved.</span>
              </p>
              <p className="mt-1 flex items-center gap-2 justify-center lg:justify-start">
                <i className="fas fa-calendar text-blue-400"></i>
                <span>Established 1910 • Serving the Great Lakes Community</span>
              </p>
            </div>

            {/* Footer Navigation */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-6 text-sm text-slate-400">
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
              <Link 
                to="/sitemap" 
                className="hover:text-blue-300 transition-colors duration-200"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Attribution Bar */}
      <div className="bg-slate-950/80 backdrop-blur-sm py-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-slate-500 text-xs space-y-2">
            <p className="flex items-center justify-center gap-2">
              <i className="fas fa-anchor text-blue-400"></i>
              <span>Pleasant Park Yacht Club • Excellence in Navigation & Seamanship since 1910</span>
            </p>
            <p className="max-w-4xl mx-auto">
              Video content courtesy of{' '}
              <a href="https://www.pexels.com/@sururi-ballida-director/" className="text-blue-400 hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">
                Sururi Ballıdağ
              </a>
              {' '}from Pexels and{' '}
              <a href="https://www.vecteezy.com/" className="text-blue-400 hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">
                Vecteezy
              </a>
              {' '}contributors
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 