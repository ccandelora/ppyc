import React from 'react';

const HistoricalPhotosSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            A Rich Heritage
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From our founding in 1910 to today, Pleasant Park Yacht Club has been a cornerstone 
            of maritime excellence and community fellowship.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img 
                src="/assets/images/ppyc-images/ppyc-1919a-768x603.jpg" 
                alt="PPYC 1919" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Early Days - 1919</h3>
                <p className="text-gray-600">Our club in its formative years, establishing traditions that continue today.</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img 
                src="/assets/images/ppyc-images/ppyc1951.jpg" 
                alt="PPYC 1920" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Growing Community - 1920</h3>
                <p className="text-gray-600">The spirit of fellowship and maritime excellence taking root.</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img 
                src="/assets/images/ppyc-images/ppyc1951_men_at_bar-768x563.jpg" 
                alt="PPYC 1951 Social Life" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Social Traditions - 1951</h3>
                <p className="text-gray-600">The clubhouse has always been the heart of our community.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistoricalPhotosSection; 