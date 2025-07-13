import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const HeritageSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Over a Century of Excellence
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Since 1910, Pleasant Park Yacht Club has been a beacon for those who share our passion for 
            the water, fine seamanship, and lifelong friendships.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon icon="compass" className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Navigation Excellence</h3>
            <p className="text-gray-600 leading-relaxed">
              Promoting the highest standards of seamanship and navigation in the Boston area.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon icon="anchor" className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Maritime Community</h3>
            <p className="text-gray-600 leading-relaxed">
              Building lasting friendships through shared adventures on the water.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon icon="trophy" className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Proud Tradition</h3>
            <p className="text-gray-600 leading-relaxed">
              Honoring our maritime heritage while embracing the future of yachting.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeritageSection; 