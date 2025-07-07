import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MembershipCTASection = () => {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Join Our Maritime Community
        </h2>
        <div className="w-24 h-1 bg-blue-400 mx-auto mb-8"></div>
        <p className="text-xl font-light leading-relaxed mb-12 opacity-90">
          Experience the camaraderie, tradition, and adventure that has defined Pleasant Park Yacht Club 
          for over a century. From seasoned mariners to those new to the water, all are welcome.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/membership" 
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3 justify-center"
          >
            <FontAwesomeIcon icon="users" />
            <span>Learn About Membership</span>
          </Link>
          <Link 
            to="/contact" 
            className="px-8 py-4 border-2 border-blue-400 text-blue-400 font-semibold rounded-lg hover:bg-blue-400 hover:text-white transition-all duration-300 inline-flex items-center gap-3 justify-center"
          >
            <FontAwesomeIcon icon="envelope" />
            <span>Contact Us</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MembershipCTASection; 